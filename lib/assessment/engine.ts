/**
 * Behavioural-assessment scoring engine.
 *
 * Faithful TypeScript port of the plain-JavaScript engine
 * (ported-engine.js), numerically verified against the original artifact
 * (with the "external observers" scoring block removed — see the header
 * comment that used to live on ported-engine.js for the exact diff).
 *
 * The ONE structural change from the JS source: the JS used a module-level
 * mutable `S` object closed over by every helper, which would leak state
 * between concurrent users/sessions in a Next.js app. Here, `S` and every
 * function that reads/writes it live inside `createAssessmentEngine()`, so
 * each call returns an independent, isolated engine instance.
 *
 * Everything else — scoring math, constants, rounding, order of
 * operations — is a verbatim logical port. Do not "clean up" the scoring
 * math; it is calibrated, not code style.
 */

import type {
  AnswerValue,
  CapabilityKey,
  CapDelta,
  CapLevel,
  ComputeResult,
  ConfidenceLevel,
  ConfidencePart,
  ConfidenceResult,
  ConsistencyCheck,
  EngineAccumulator,
  EngineState,
  IntensityKey,
  NarrativeCriterion,
  NarrativeKey,
  PathItem,
  PenaltyEntry,
  Question,
  RestrictionEntry,
  Scenario,
  ScenarioAnswer,
  ScoredArchetype,
  SigDelta,
  SignalKey,
  SignalNarrative,
  SignalResult,
  SlotAccumulator,
  SourceKey,
  StageKey,
  TagDelta,
  TagKey,
  TraceEntry,
} from './types';

import {
  CAPK,
  CAPN,
  LEVELS,
  OPEN_LABELS,
  SIGNALS,
  STAGES,
  STAGE_ROUTE,
  TAGS,
  WEIGHTS,
} from './data/capabilities';
import { Q } from './data/questions';
import { SCENARIOS } from './data/scenarios';
import { ARCHETYPES } from './data/archetypes';
import { CATALOG } from './data/catalog';

/* ---------------------------------------------------------------------- */
/* Module-level lookups and pure helpers (no session state — safe to share
 * across every engine instance). */

const QBY: Record<string, Question> = {};
Q.forEach(q => {
  QBY[q.id] = q;
});

const SCNBY: Record<string, Scenario> = {};
SCENARIOS.forEach(s => {
  SCNBY[s.id] = s;
});

const SLOT_LO = -2;
const SLOT_HI = 3;
const AMP_MIN = 2;

function clamp(v: number, a = 0, b = 100): number {
  return Math.max(a, Math.min(b, v));
}

function levelOf(v: number | null | undefined): CapLevel {
  if (v === null || v === undefined) {
    return { k: 'sindato', n: 'Sin datos', d: 'No hay evidencia suficiente' };
  }
  return LEVELS.find(l => v <= (l.max as number))!;
}

function intensityOf(pct: number): IntensityKey {
  if (pct < 15) return 'ninguna';
  if (pct < 35) return 'leve';
  if (pct < 60) return 'moderada';
  return 'alta';
}

const CONCRETE =
  /\d|£|lunes|martes|miércoles|jueves|viernes|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|semana|mes|ayer|hoy|contact|llam|escrib|envi|vend|habl[éa]|reun|apliqu|registr|publiqu|pregunt|visit|cotiz|entrevist/i;

function classifyOpen(txt: string | null | undefined): 'fuerte' | 'media' | 'vaga' | 'nula' {
  const t = (txt || '').trim();
  if (!t) return 'nula';
  const w = t.split(/\s+/).filter(Boolean).length;
  const conc = CONCRETE.test(t);
  if (w >= 25 && conc) return 'fuerte';
  if (w >= 25 || (w >= 12 && conc)) return 'media';
  if (w >= 5) return 'vaga';
  return 'nula';
}

function newAcc(): EngineAccumulator {
  const a = {} as EngineAccumulator;
  (['capability', 'scenarios', 'context'] as SourceKey[]).forEach(s => {
    a[s] = {} as Record<CapabilityKey, SlotAccumulator>;
    CAPK.forEach(c => {
      a[s][c] = { raw: 0, n: 0, ids: [] };
    });
  });
  return a;
}

function addSlot(
  bucket: Record<CapabilityKey, SlotAccumulator>,
  cap: CapabilityKey,
  val: number,
  id?: string
): void {
  const b = bucket[cap];
  b.raw += clamp(val, SLOT_LO, SLOT_HI);
  b.n++;
  if (id) b.ids.push(id);
}

function normSlots(b: SlotAccumulator | undefined): number | null {
  if (!b || b.n === 0) return null;
  return clamp(((b.raw - SLOT_LO * b.n) / ((SLOT_HI - SLOT_LO) * b.n)) * 100);
}

function bump<K extends string>(o: Partial<Record<K, number>>, k: K, v: number | undefined): void {
  if (!v) return;
  o[k] = ((o[k] as number) || 0) + v;
}

/* ---------------------------------------------------------------------- */

export function createAssessmentEngine() {
  const S: EngineState = {
    answers: {},
    openOv: {},
    res: { r1: '', r2: '', r3: '', use: '' },
    scn: {},
  };

  const ans = (id: string): AnswerValue => S.answers[id];
  const has = (id: string): boolean => {
    const v = S.answers[id];
    return v !== undefined && v !== null && v !== '';
  };
  const optOf = (id: string) => {
    if (!has(id)) return null;
    const q = QBY[id];
    if (!q.options) return null;
    return q.options[S.answers[id] as number];
  };
  const keyOf = (id: string): string | null => {
    const o = optOf(id);
    return o ? o.k || null : null;
  };

  function stageOf(): StageKey {
    if (has('B1-Q12')) {
      const idx = ans('B1-Q12') as number;
      const opt = QBY['B1-Q12'].options![idx];
      return opt.stage as StageKey;
    }
    if (has('B1-Q5') && ans('B1-Q5') === 5) return 'founder';
    return 'explorador';
  }

  function activeScenarios(): Scenario[] {
    const r = STAGE_ROUTE[stageOf()];
    return SCENARIOS.filter(s => s.route === r || s.route === 'T');
  }

  function openBucket(id: string): string {
    const ov = S.openOv[id];
    if (ov && ov !== 'auto') return ov;
    return classifyOpen(ans(id) as string | null | undefined);
  }

  function resourceBucket(): string {
    const filled = [S.res.r1, S.res.r2, S.res.r3].filter(x => (x || '').trim().length > 2).length;
    const useW = (S.res.use || '').trim().split(/\s+/).filter(Boolean).length;
    const ov = S.openOv['B1-Q11'];
    if (ov && ov !== 'auto') return ov;
    if (filled === 0) return 'r0';
    if (filled === 1) return useW >= 15 ? 'r2' : 'r1';
    return useW >= 15 ? 'r3' : 'r2';
  }

  function isAnswered(q: Question): boolean {
    const raw = S.answers[q.id];
    if (q.type === 'multi') return Array.isArray(raw) && raw.length > 0;
    if (q.type === 'resources') return !!(S.res.r1 || S.res.r2 || S.res.r3 || S.res.use);
    if (q.type === 'open') return !!((raw as string | null | undefined) || '').trim();
    return raw !== undefined && raw !== null;
  }

  function compute(): ComputeResult {
    const acc = newAcc();
    const sigRaw: Partial<Record<SignalKey, number>> = {};
    const sigMax: Partial<Record<SignalKey, number>> = {};
    const tagRaw: Partial<Record<TagKey, number>> = {};
    const tagMax: Partial<Record<TagKey, number>> = {};
    const trace: TraceEntry[] = [];
    const restr: RestrictionEntry[] = [];

    const noteTrace = (
      id: string,
      src: SourceKey,
      label: string,
      c?: CapDelta,
      s?: SigDelta,
      g?: TagDelta
    ) => {
      trace.push({ id, src, label, c: c || {}, s: s || {}, g: g || {} });
    };

    Q.forEach(q => {
      if (q.score === false || q.attention || q.ds || q.evidence) return;
      const src: SourceKey | null = q.source === 'witness' ? null : (q.source as SourceKey);
      if (!src) return;

      if (q.type === 'single') {
        if (!has(q.id)) return;
        const options = q.options!;
        const chosen = options[ans(q.id) as number];
        if (chosen.score === false) {
          noteTrace(q.id, src, chosen.t, {}, {}, {});
          return;
        }
        CAPK.forEach(cap => {
          const vals = options.filter(o => o.score !== false).map(o => o.c?.[cap] || 0);
          const mx = Math.max(...vals);
          const mn = Math.min(...vals);
          if (mx - mn < AMP_MIN) return;
          addSlot(acc[src], cap, chosen.c?.[cap] || 0, q.id);
        });
        (Object.keys(SIGNALS) as SignalKey[]).forEach(k => {
          const mx = Math.max(...options.map(o => o.s?.[k] || 0));
          if (mx > 0) {
            sigMax[k] = (sigMax[k] || 0) + mx;
            bump(sigRaw, k, chosen.s?.[k] || 0);
          }
        });
        (Object.keys(TAGS) as TagKey[]).forEach(k => {
          const mx = Math.max(...options.map(o => o.g?.[k] || 0));
          if (mx > 0) {
            tagMax[k] = (tagMax[k] || 0) + mx;
            bump(tagRaw, k, chosen.g?.[k] || 0);
          }
        });
        if (chosen.r) restr.push({ id: q.id, kind: chosen.r, label: chosen.t, note: chosen.note || '' });
        noteTrace(q.id, src, chosen.t, chosen.c, chosen.s, chosen.g);
      } else if (q.type === 'multi') {
        const arr = ans(q.id);
        if (!Array.isArray(arr) || !arr.length) return;
        const options = q.options!;
        const picked = arr.map(i => options[i]);
        CAPK.forEach(cap => {
          const all = options.map(o => o.c?.[cap] || 0);
          const mx = all.filter(v => v > 0).reduce((a, b) => a + b, 0);
          const mn = all.filter(v => v < 0).reduce((a, b) => a + b, 0);
          if (mx - mn < AMP_MIN) return;
          addSlot(
            acc[src],
            cap,
            picked.reduce((a, o) => a + (o.c?.[cap] || 0), 0),
            q.id
          );
        });
        (Object.keys(SIGNALS) as SignalKey[]).forEach(k => {
          const mx = options.reduce((a, o) => a + (o.s?.[k] || 0), 0);
          if (mx > 0) {
            sigMax[k] = (sigMax[k] || 0) + mx;
            bump(
              sigRaw,
              k,
              picked.reduce((a, o) => a + (o.s?.[k] || 0), 0)
            );
          }
        });
        (Object.keys(TAGS) as TagKey[]).forEach(k => {
          const mx = options.reduce((a, o) => a + (o.g?.[k] || 0), 0);
          if (mx > 0) {
            tagMax[k] = (tagMax[k] || 0) + mx;
            bump(
              tagRaw,
              k,
              picked.reduce((a, o) => a + (o.g?.[k] || 0), 0)
            );
          }
        });
        const cAcc = picked.reduce<Record<string, number>>((a, o) => {
          Object.entries(o.c || {}).forEach(([k, v]) => bump(a, k, v));
          return a;
        }, {});
        const sAcc = picked.reduce<Record<string, number>>((a, o) => {
          Object.entries(o.s || {}).forEach(([k, v]) => bump(a, k, v));
          return a;
        }, {});
        noteTrace(q.id, src, picked.map(o => o.t).join(' · '), cAcc as CapDelta, sAcc as SigDelta, {});
      } else if (q.type === 'open' || q.type === 'resources') {
        const isRes = q.type === 'resources';
        const bucket = isRes ? resourceBucket() : openBucket(q.id);
        const table: Record<string, { label?: string; c?: CapDelta; s?: SigDelta }> = (isRes ? q.buckets : q.openScore) || {};
        if (!isRes && !has(q.id) && bucket === 'nula' && !S.openOv[q.id]) return;
        if (isRes && bucket === 'r0' && !S.openOv[q.id] && !(S.res.r1 || S.res.r2 || S.res.r3 || S.res.use)) return;
        const def = table[bucket] || {};
        CAPK.forEach(cap => {
          const vals = Object.values(table).map(b => b.c?.[cap] || 0);
          const mx = Math.max(...vals);
          const mn = Math.min(...vals);
          if (mx - mn < AMP_MIN) return;
          addSlot(acc[src], cap, def.c?.[cap] || 0, q.id);
        });
        (Object.keys(SIGNALS) as SignalKey[]).forEach(k => {
          const mx = Math.max(...Object.values(table).map(b => b.s?.[k] || 0));
          if (mx > 0) {
            sigMax[k] = (sigMax[k] || 0) + mx;
            bump(sigRaw, k, def.s?.[k] || 0);
          }
        });
        noteTrace(
          q.id,
          src,
          (isRes ? 'Recursos: ' : '') + (def.label || OPEN_LABELS[bucket] || bucket),
          def.c,
          def.s,
          {}
        );
      }
    });

    activeScenarios().forEach(sc => {
      const a = S.scn[sc.id];
      if (!a || !a.most) return;
      const most = sc.options.find(o => o.k === a.most)!;
      const least = a.least ? sc.options.find(o => o.k === a.least) : null;
      CAPK.forEach(cap => {
        const vals = sc.options.map(o => o.c?.[cap] || 0);
        const mx = Math.max(...vals);
        const mn = Math.min(...vals);
        if (mx - mn < AMP_MIN) return;
        addSlot(acc.scenarios, cap, (most.c?.[cap] || 0) - 0.5 * (least?.c?.[cap] || 0), sc.id);
      });
      (Object.keys(SIGNALS) as SignalKey[]).forEach(k => {
        const mx = Math.max(...sc.options.map(o => o.s?.[k] || 0));
        if (mx > 0) {
          sigMax[k] = (sigMax[k] || 0) + mx;
          bump(sigRaw, k, most.s?.[k] || 0);
        }
      });
      (Object.keys(TAGS) as TagKey[]).forEach(k => {
        const mx = Math.max(...sc.options.map(o => o.g?.[k] || 0));
        if (mx > 0) {
          tagMax[k] = (tagMax[k] || 0) + mx;
          bump(tagRaw, k, most.g?.[k] || 0);
        }
      });
      trace.push({
        id: sc.id,
        src: 'scenarios',
        label: 'Más probable: ' + most.t + (least ? ' / Menos probable: ' + least.t : ''),
        c: most.c || {},
        s: most.s || {},
        g: most.g || {},
      });
    });

    const perSource = {} as Record<SourceKey, Record<CapabilityKey, number | null>>;
    const capScore = {} as Record<CapabilityKey, number | null>;
    const capLevel = {} as Record<CapabilityKey, CapLevel>;

    (['capability', 'scenarios', 'context'] as SourceKey[]).forEach(src => {
      perSource[src] = {} as Record<CapabilityKey, number | null>;
      CAPK.forEach(cap => {
        perSource[src][cap] = normSlots(acc[src][cap]);
      });
    });

    const contrib = {} as Record<CapabilityKey, Partial<Record<SourceKey, { w: number; v: number }>>>;
    CAPK.forEach(cap => {
      let tot = 0;
      let sum = 0;
      contrib[cap] = {};
      (Object.keys(WEIGHTS) as SourceKey[]).forEach(src => {
        const v = perSource[src] ? perSource[src][cap] : null;
        if (v === null || v === undefined) return;
        tot += WEIGHTS[src];
        sum += WEIGHTS[src] * v;
      });
      if (tot === 0) {
        capScore[cap] = null;
        return;
      }
      capScore[cap] = Math.round(sum / tot);
      (Object.keys(WEIGHTS) as SourceKey[]).forEach(src => {
        const v = perSource[src] ? perSource[src][cap] : null;
        if (v === null || v === undefined) return;
        contrib[cap][src] = { w: Math.round((WEIGHTS[src] / tot) * 100), v: Math.round(v) };
      });
    });
    CAPK.forEach(cap => {
      capLevel[cap] = levelOf(capScore[cap]);
    });

    const stage = stageOf();
    const sw = STAGES[stage].w;
    let rt = 0;
    let rs = 0;
    CAPK.forEach(cap => {
      const cs = capScore[cap];
      const w = sw[cap];
      if (cs === null || !w) return;
      rt += w;
      rs += w * cs;
    });
    const readiness = rt > 0 ? Math.round(rs / rt) : null;

    const signals: SignalResult[] = [];
    (Object.keys(SIGNALS) as SignalKey[]).forEach(k => {
      const raw = sigRaw[k] || 0;
      const mx = sigMax[k] || 0;
      const pct = mx > 0 ? Math.round((raw / mx) * 100) : 0;
      signals.push({ k, n: SIGNALS[k].n, raw, max: mx, pct, level: intensityOf(pct) });
    });
    const sigPct = {} as Record<SignalKey, number>;
    signals.forEach(s => {
      sigPct[s.k] = s.pct;
    });

    const tagPct = {} as Record<TagKey, number>;
    (Object.keys(TAGS) as TagKey[]).forEach(k => {
      tagPct[k] = (tagMax[k] || 0) > 0 ? ((tagRaw[k] || 0) / (tagMax[k] as number)) * 100 : 0;
    });

    const archs: ScoredArchetype[] = ARCHETYPES.map(a => {
      let v = 0;
      let wsum = 0;
      Object.entries(a.caps).forEach(([cKey, w]) => {
        const cap = cKey as CapabilityKey;
        const cs = capScore[cap];
        if (cs !== null) {
          v += (w as number) * cs;
          wsum += w as number;
        }
      });
      if (a.tag) {
        v += a.tw * tagPct[a.tag];
        wsum += a.tw;
      }
      return { ...a, score: wsum > 0 ? Math.round(v / wsum) : 0 };
    }).sort((x, y) => y.score - x.score);

    const checks = consistencyChecks();
    const dsExtremes = [1, 2, 3, 4, 5].filter(i => ans('DS-' + i) === 4).length;
    const attFail = has('ATT-1') && ans('ATT-1') !== QBY['ATT-1'].expect;
    const conf = confidence({ checks, dsExtremes, attFail });

    const scored = CAPK.filter(c => capScore[c] !== null).sort(
      (a, b) => (capScore[b] as number) - (capScore[a] as number)
    );
    const strengths = scored.slice(0, 3);
    const gapsTop = [...scored].reverse().slice(0, 3);
    const critical = scored.filter(c => (capScore[c] as number) < 40);
    const strategic = scored.filter(c => (sw[c] as number) >= 15 && (capScore[c] as number) < 60);

    const narratives = signalNarratives({ capScore, sigPct, stage });
    const path = buildPath({ capScore, sigPct, stage, narratives, critical, strategic, restr });

    return {
      stage,
      capScore,
      capLevel,
      perSource,
      contrib,
      readiness,
      signals,
      sigPct,
      archs,
      checks,
      conf,
      strengths,
      gapsTop,
      critical,
      strategic,
      narratives,
      path,
      trace,
      restr,
      acc,
      dsExtremes,
      attFail,
      tagPct,
      weights: WEIGHTS,
    };
  }

  function consistencyChecks(): ConsistencyCheck[] {
    const t1 = S.scn['T1'] || {};
    const t2 = S.scn['T2'] || {};
    const t3 = S.scn['T3'] || {};
    const out: ConsistencyCheck[] = [];
    const mk = (id: string, n: string, refs: string, evaluable: boolean, alert: boolean, detail: string) => {
      out.push({ id, n, refs, status: !evaluable ? 'na' : alert ? 'alert' : 'ok', detail });
    };

    {
      const ev = has('B1-Q4');
      const claim = ev && (ans('B1-Q4') as number) >= 3;
      const avoid = [0, 3].includes(ans('B1-Q13') as number) || ['B', 'D'].includes(t1.most || '');
      mk(
        'A',
        'Inglés y exposición profesional',
        'B1-Q4 + B1-Q13 + T1',
        ev,
        claim && avoid,
        !ev
          ? 'Falta B1-Q4.'
          : claim && avoid
            ? 'Declara alta comodidad en inglés profesional, pero el patrón conductual evita exposición.'
            : claim
              ? 'Declara comodidad alta y el patrón conductual es coherente.'
              : 'No declara comodidad alta: sin contradicción que revisar.'
      );
    }
    {
      const ev = has('B1-Q18') || has('B2-Q29');
      const claim = (ans('B1-Q18') as number) <= 1 || keyOf('B2-Q29') === 'A' || keyOf('B2-Q30') === 'A';
      const rb = resourceBucket();
      const low = ['r0', 'r1'].includes(rb) && ['C', 'D', 'E'].includes(keyOf('B2-Q31') || '');
      mk(
        'B',
        'Conocimiento del ecosistema UK',
        'B1-Q11 + B2-Q29 + B2-Q31',
        ev,
        claim && low,
        !ev
          ? 'Faltan B1-Q18 / B2-Q29.'
          : claim && low
            ? 'Afirma conocer o navegar el ecosistema, pero no nombra recursos concretos ni ha participado recientemente.'
            : 'Coherente entre autopercepción y evidencia de uso del ecosistema.'
      );
    }
    {
      const ev = has('B2-Q17') || has('B2-Q19');
      const claim = keyOf('B2-Q17') === 'A' || keyOf('B2-Q18') === 'A';
      const low = ['C', 'D'].includes(keyOf('B2-Q19') || '') || ['vaga', 'nula'].includes(openBucket('B2-Q20'));
      mk(
        'C',
        'Agencia emprendedora',
        'B2-Q17 + B2-Q19 + B2-Q20',
        ev,
        claim && low,
        !ev
          ? 'Faltan B2-Q17 / B2-Q19.'
          : claim && low
            ? 'Alta intención declarada de convertir ideas en acción, con baja evidencia reciente concreta.'
            : 'Intención y evidencia reciente alineadas.'
      );
    }
    {
      const ev = has('B2-Q13') || has('B2-Q15');
      const claim = keyOf('B2-Q13') === 'C' || keyOf('B2-Q14') === 'A' || ans('B1-Q15') === 5;
      const low = ['D', 'E'].includes(keyOf('B2-Q15') || '') || ['C', 'D'].includes(t2.most || '');
      mk(
        'D',
        'Confianza colaborativa',
        'B2-Q13 + B2-Q15 + T2',
        ev,
        claim && low,
        !ev
          ? 'Faltan B2-Q13 / B2-Q15.'
          : claim && low
            ? 'Se describe como colaborativo/a, pero no pide ni ofrece ayuda fuera de su círculo.'
            : 'Discurso y conducta colaborativa consistentes.'
      );
    }
    {
      const ev = has('B2-Q5') || has('B2-Q7');
      const claim = keyOf('B2-Q5') === 'A' || keyOf('B2-Q6') === 'A' || ans('B1-Q19') === 4;
      const low = keyOf('B2-Q7') === 'D' || t3.most === 'D';
      mk(
        'E',
        'Resiliencia',
        'B2-Q5 + B2-Q7 + T3',
        ev,
        claim && low,
        !ev
          ? 'Faltan B2-Q5 / B2-Q7.'
          : claim && low
            ? 'Afirma aprender del rechazo, pero en escenarios tiende a defenderse o abandonar.'
            : 'Manejo declarado del rechazo consistente con escenarios y observación.'
      );
    }
    {
      const ev = has('B1-Q7') && has('B1-Q16') && has('B1-Q21');
      const alert =
        ev &&
        (ans('B1-Q7') as number) >= 3 &&
        [0, 2].includes(ans('B1-Q16') as number) &&
        [0, 2].includes(ans('B1-Q21') as number);
      mk(
        'F',
        'Presión económica dominante',
        'B1-Q7 + B1-Q16 + B1-Q21 + escenarios de precio',
        ev,
        alert,
        !ev
          ? 'Faltan B1-Q7 / B1-Q16 / B1-Q21.'
          : alert
            ? 'La urgencia económica domina las decisiones. No es una contradicción: es una restricción real que debe condicionar la ruta.'
            : 'La presión económica no domina el patrón de decisión.'
      );
    }
    return out;
  }

  /* Rebased to 100 without the observer component (was 45/20/15/20 = 100
   * with observers; without them the remaining 45/15/20 = 80, scaled by
   * 100/80 and rounded: 55/20/25). Level thresholds (<50 Bajo / <75 Medio /
   * else Alto) are unchanged — same three-tier reading, just against a
   * fully-achievable 100 instead of an observer-less-capped 80. */
  function confidence({
    checks,
    dsExtremes,
    attFail,
  }: {
    checks: ConsistencyCheck[];
    dsExtremes: number;
    attFail: boolean;
  }): ConfidenceResult {
    const parts: ConfidencePart[] = [];
    const grp = (list: Question[]) => {
      const t = list.filter(q => !q.attention);
      return { a: t.filter(q => isAnswered(q)).length, t: t.length };
    };
    const b1 = grp(Q.filter(q => q.step === 'b1a' || q.step === 'b1b'));
    const b2 = grp(Q.filter(q => q.step === 'b2a' || q.step === 'b2b'));
    const b3a = activeScenarios().filter(s => (S.scn[s.id] || {}).most).length;
    const b3t = activeScenarios().length;
    const witQ = Q.filter(q => q.ds || q.evidence);
    const wa = witQ.filter(q => isAnswered(q)).length;
    const compRaw =
      0.25 * (b1.t ? b1.a / b1.t : 0) +
      0.35 * (b2.t ? b2.a / b2.t : 0) +
      0.25 * (b3t ? b3a / b3t : 0) +
      0.15 * (witQ.length ? wa / witQ.length : 0);
    const comp = Math.round(compRaw * 55);
    parts.push({
      n: 'Completitud del instrumento',
      v: comp,
      max: 55,
      d: `Bloque 1 ${b1.a}/${b1.t} · Bloque 2 ${b2.a}/${b2.t} · Escenarios ${b3a}/${b3t} · Testigos ${wa}/${witQ.length}`,
    });

    const opens = Q.filter(q => q.type === 'open' && !q.evidence)
      .map(q => openBucket(q.id))
      .concat(Q.filter(q => q.evidence).map(q => openBucket(q.id)))
      .concat([
        resourceBucket() === 'r0'
          ? 'nula'
          : resourceBucket() === 'r1'
            ? 'vaga'
            : resourceBucket() === 'r2'
              ? 'media'
              : 'fuerte',
      ]);
    const oval: Record<string, number> = { fuerte: 1, media: 0.7, vaga: 0.35, nula: 0 };
    const oq = opens.length ? opens.reduce((a, b) => a + oval[b], 0) / opens.length : 0;
    parts.push({
      n: 'Calidad de respuestas abiertas',
      v: Math.round(oq * 20),
      max: 20,
      d: `${opens.filter(b => b === 'fuerte').length} concretas · ${opens.filter(b => b === 'media').length} parciales · ${opens.filter(b => b === 'vaga').length} vagas · ${opens.filter(b => b === 'nula').length} sin evidencia`,
    });

    const evc = checks.filter(c => c.status !== 'na');
    const okc = evc.filter(c => c.status === 'ok').length;
    const cons = evc.length ? Math.round((okc / evc.length) * 25) : 13;
    parts.push({
      n: 'Consistencia interna',
      v: cons,
      max: 25,
      d: evc.length ? `${okc} de ${evc.length} testigos sin contradicción.` : 'Aún no hay datos suficientes para cruzar testigos.',
    });

    let pen = 0;
    const pens: PenaltyEntry[] = [];
    const dsPen = [0, 0, -5, -10, -14, -18][dsExtremes] || 0;
    if (dsPen) {
      pen += dsPen;
      pens.push({ n: `Deseabilidad social (${dsExtremes} ítems en el extremo)`, v: dsPen });
    }
    if (attFail) {
      pen -= 10;
      pens.push({ n: 'Falla en la pregunta de atención', v: -10 });
    }
    if (has('B1-Q3') && ans('B1-Q3') === 3) {
      pen -= 5;
      pens.push({ n: 'Prefiere no responder situación legal', v: -5 });
    }

    const total = clamp(parts.reduce((a, p) => a + p.v, 0) + pen);
    const level: ConfidenceLevel = total < 50 ? 'Bajo' : total < 75 ? 'Medio' : 'Alto';
    const msg = {
      Bajo: 'Diagnóstico inicial con confianza baja. Se recomienda completar el instrumento con más detalle antes de tomar decisiones de ruta.',
      Medio: 'Diagnóstico funcional con confianza media. Útil para iniciar la ruta, y mejorará según avances con acciones concretas.',
      Alto: 'Diagnóstico robusto, con alta consistencia entre autopercepción, escenarios y conducta reciente.',
    }[level];
    return { total, level, msg, parts, pens, penTotal: pen };
  }

  function signalNarratives({
    capScore,
    sigPct,
  }: {
    capScore: Record<CapabilityKey, number | null>;
    sigPct: Record<SignalKey, number>;
    stage: StageKey;
  }): SignalNarrative[] {
    const sc = (c: CapabilityKey): number | null => capScore[c];
    const out: SignalNarrative[] = [];
    const push = (k: NarrativeKey, name: string, crit: NarrativeCriterion[], msg: string) => {
      const hits = crit.filter(c => c.hit);
      if (hits.length < 2) return;
      const pct = Math.round((hits.length / crit.length) * 100);
      out.push({ k, name, msg, hits: hits.map(h => h.t), n: hits.length, tot: crit.length, pct, level: intensityOf(pct) });
    };

    const seScore = sc('SE');
    const omScore = sc('OM');
    const ctScore = sc('CT');
    const eirScore = sc('EIR');
    const eaScore = sc('EA');

    push(
      'LOWSE',
      'Baja autoconfianza funcional',
      [
        { hit: seScore !== null && seScore < 50, t: `Self-Efficacy en ${seScore} (por debajo de 50).` },
        { hit: sigPct.AV >= 35, t: `Señal de evitación de exposición al ${sigPct.AV}% de su rango.` },
        { hit: [0, 1, 4].includes(ans('B1-Q14') as number), t: 'Prefiere alta preparación o evita hablar de sus capacidades.' },
        { hit: [2, 3].includes(ans('B1-Q20') as number), t: 'No ha contactado a nadie nuevo en los últimos 60 días.' },
      ],
      'Tu perfil muestra que puedes tener capacidades valiosas, pero tiendes a esperar altos niveles de preparación antes de exponerte. Esto puede limitar tu avance emprendedor en etapas tempranas.'
    );

    push(
      'IMP',
      'Patrón de legitimidad percibida (impostor)',
      [
        { hit: sigPct.IMP >= 30, t: `Señal de impostor al ${sigPct.IMP}% de su rango.` },
        { hit: seScore !== null && seScore < 60, t: `Self-Efficacy en ${seScore}.` },
        { hit: [0, 1].includes(ans('B1-Q14') as number), t: 'Requiere alta preparación antes de hablar de sus capacidades.' },
        { hit: ans('B1-Q18') === 3, t: 'Percibe que los espacios profesionales UK no están pensados para personas como ella/él.' },
        { hit: ans('B1-Q15') === 4, t: 'Lo que más le frena es sentir que “todavía no está listo/a”.' },
      ],
      'Se observan señales de autopercepción limitada frente a espacios profesionales nuevos. Tu ruta debería trabajar visibilidad, comunicación de valor y exposición gradual.'
    );

    push(
      'SC',
      'Mentalidad de escasez funcional',
      [
        { hit: sigPct.SC >= 35, t: `Señal de escasez al ${sigPct.SC}% de su rango.` },
        { hit: has('B1-Q7') && (ans('B1-Q7') as number) >= 3, t: 'Urgencia de ingresos alta o indispensable en los próximos 3 meses.' },
        { hit: omScore !== null && omScore < 50, t: `Opportunity Mindset en ${omScore}.` },
        { hit: [0, 2].includes(ans('B1-Q16') as number), t: 'Ante pocos recursos, prioriza ingresos inmediatos o espera más capital.' },
        { hit: [0, 2].includes(ans('B1-Q21') as number), t: 'Bajo presión económica prioriza el corto plazo o pausa lo estratégico.' },
      ],
      'Tu contexto actual parece estar muy condicionado por urgencias económicas. Esto puede reducir tu capacidad de identificar oportunidades de mediano plazo. Tu ruta debe equilibrar generación de ingresos con exploración de oportunidades de bajo riesgo.'
    );

    push(
      'LCT',
      'Baja confianza colaborativa',
      [
        { hit: ctScore !== null && ctScore < 50, t: `Collaborative Trust en ${ctScore}.` },
        { hit: sigPct.LCT >= 30, t: `Señal de baja confianza colaborativa al ${sigPct.LCT}% de su rango.` },
        { hit: ['D', 'E'].includes(keyOf('B2-Q15') || ''), t: 'No pidió ni ofreció ayuda fuera de su círculo en 60 días.' },
        { hit: ans('B1-Q17') === 4, t: 'Ante una colaboración, su primer foco es proteger la idea.' },
      ],
      'Tu perfil muestra cautela frente a la colaboración. Esto puede protegerte de malas alianzas, pero también puede limitar tu acceso a oportunidades, recursos y redes.'
    );

    push(
      'ECO',
      'Aislamiento ecosistémico',
      [
        { hit: eirScore !== null && eirScore < 50, t: `Economic Integration Readiness en ${eirScore}.` },
        { hit: sigPct.ECO >= 30, t: `Señal de aislamiento ecosistémico al ${sigPct.ECO}% de su rango.` },
        { hit: ['r0', 'r1'].includes(resourceBucket()), t: 'No puede nombrar recursos concretos del ecosistema británico.' },
        { hit: ['C', 'D', 'E'].includes(keyOf('B2-Q31') || ''), t: 'No participó en espacios fuera de su círculo en 90 días.' },
        { hit: has('B1-Q4') && (ans('B1-Q4') as number) <= 1, t: 'Baja comodidad usando inglés en contextos profesionales.' },
        { hit: keyOf('B2-Q29') === 'B', t: 'Su primer movimiento de búsqueda de apoyo es su comunidad cercana.' },
      ],
      'Actualmente tu red parece estar concentrada en círculos cercanos. Para avanzar, será clave aumentar tu exposición a espacios, organizaciones y oportunidades del ecosistema británico.'
    );

    push(
      'AV',
      'Evitación de exposición',
      [
        { hit: sigPct.AV >= 35, t: `Señal de evitación al ${sigPct.AV}% de su rango.` },
        { hit: [0, 3].includes(ans('B1-Q13') as number), t: 'En espacios nuevos observa o espera ser presentado antes de participar.' },
        { hit: ans('B1-Q14') === 4, t: 'Evita hablar de sus capacidades si no es necesario.' },
        { hit: ['B', 'D'].includes((S.scn['T1'] || {}).most || ''), t: 'En el escenario de networking elige observar o retirarse.' },
      ],
      'Aparece un patrón de exposición baja: tiendes a evitar situaciones donde tendrías que presentarte o pedir algo. La ruta debería usar exposición progresiva con objetivos pequeños y concretos.'
    );

    push(
      'POST',
      'Postergación / baja activación',
      [
        { hit: sigPct.POST >= 30, t: `Señal de postergación al ${sigPct.POST}% de su rango.` },
        { hit: keyOf('B2-Q17') === 'D', t: 'Espera el momento adecuado antes de mover una idea.' },
        { hit: ['C', 'D'].includes(keyOf('B2-Q19') || ''), t: 'Sin acción concreta ejecutada en los últimos 14 días.' },
        { hit: ['vaga', 'nula'].includes(openBucket('B2-Q20')), t: 'La última acción concreta descrita es vaga o inexistente.' },
        { hit: eaScore !== null && eaScore < 50, t: `Entrepreneurial Agency en ${eaScore}.` },
      ],
      'Hay intención, pero el paso de intención a acción se está demorando. La ruta debería reducir el tamaño del primer paso hasta que sea imposible postergarlo.'
    );

    push(
      'EXT',
      'Externalización / dependencia del contexto',
      [
        { hit: sigPct.EXT >= 25, t: `Señal de externalización al ${sigPct.EXT}% de su rango.` },
        { hit: keyOf('B2-Q9') === 'B', t: 'Ante una necesidad, asume que alguien con más recursos lo resolvería mejor.' },
        { hit: keyOf('B2-Q25') === 'D', t: 'Ante desorden en un grupo, espera que alguien con autoridad tome dirección.' },
        { hit: keyOf('B2-Q29') === 'D', t: 'Espera una recomendación externa antes de buscar apoyo.' },
      ],
      'Varias respuestas ubican la iniciativa fuera de ti. No es falta de capacidad: es un hábito de espera que conviene romper con decisiones pequeñas y propias.'
    );

    return out.sort((a, b) => b.pct - a.pct || b.n - a.n);
  }

  function buildPath({
    capScore,
    sigPct,
    stage,
    narratives,
    critical,
    strategic,
  }: {
    capScore: Record<CapabilityKey, number | null>;
    sigPct: Record<SignalKey, number>;
    stage: StageKey;
    narratives: SignalNarrative[];
    critical: CapabilityKey[];
    strategic: CapabilityKey[];
    restr: RestrictionEntry[];
  }): PathItem[] {
    const sw = STAGES[stage].w;
    const activeBars = new Set<SignalKey>(narratives.map(n => (n.k === 'LOWSE' ? 'AV' : n.k) as SignalKey));
    (Object.keys(SIGNALS) as SignalKey[]).forEach(k => {
      if ((sigPct[k] || 0) >= 35) activeBars.add(k);
    });
    const shortPref = ans('B1-Q6') === 0 || ans('B1-Q5') === 0 || ans('B1-Q22') === 2;
    const legalNeed = has('B1-Q3') && (ans('B1-Q3') === 1 || ans('B1-Q3') === 2);
    const langNeed = has('B1-Q4') && (ans('B1-Q4') as number) <= 1;

    const items = CATALOG.map((r): PathItem => {
      let p = 0;
      const why: string[] = [];
      if (r.legal) {
        if (!legalNeed) return { ...r, p: -1, why };
        p += 220;
        why.push('Tu situación legal debe aclararse antes de cualquier ejecución formal.');
      }
      if (r.lang) {
        if (!langNeed) return { ...r, p: -1, why };
        p += 140;
        why.push('El idioma aparece hoy como restricción activa para tu integración económica.');
      }
      if (!r.legal && !r.lang && !r.stages.includes(stage)) return { ...r, p: -1, why };

      const cs = capScore[r.cap];
      if (critical.includes(r.cap)) {
        p += 100;
        why.push(`${CAPN[r.cap]} está en ${cs}: brecha crítica.`);
      } else if (strategic.includes(r.cap)) {
        p += 60;
        why.push(`${CAPN[r.cap]} pesa ${sw[r.cap]}% en tu etapa y está en ${cs}.`);
      }
      if (cs !== null && cs !== undefined) p += Math.max(0, 75 - cs);
      p += (sw[r.cap] || 0) * 0.4;
      if (r.cap2 && critical.includes(r.cap2)) {
        p += 30;
        why.push(`Refuerza también ${CAPN[r.cap2]} (${capScore[r.cap2]}).`);
      }
      const bars = r.bar.filter(b => activeBars.has(b));
      if (bars.length) {
        p += 40 + 15 * (bars.length - 1);
        why.push('Trabaja directamente: ' + bars.map(b => SIGNALS[b].n.toLowerCase()).join(', ') + '.');
      }
      if (shortPref) {
        if (/min/.test(r.dur)) {
          p += 12;
          why.push('Formato corto, compatible con tu disponibilidad real de tiempo.');
        }
        if (/semana/.test(r.dur)) p -= 12;
      }
      if (cs !== null && cs >= 80 && !bars.length) p -= 60;
      if (!why.length) why.push(`Refuerzo general de ${CAPN[r.cap]} (${cs}).`);
      return { ...r, p, why };
    })
      .filter(r => r.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, 6);

    return items;
  }

  return {
    setAnswer(id: string, value: AnswerValue) {
      S.answers[id] = value;
    },
    setOpenOverride(id: string, value: string) {
      S.openOv[id] = value;
    },
    setResource(field: 'r1' | 'r2' | 'r3' | 'use', value: string) {
      S.res[field] = value;
    },
    setScenario(id: string, patch: Partial<ScenarioAnswer>) {
      S.scn[id] = { ...S.scn[id], ...patch };
    },
    getState(): Readonly<EngineState> {
      return S;
    },
    loadState(state: EngineState) {
      Object.assign(S, state);
    },
    compute,
  };
}

export { levelOf, intensityOf };
export { QBY, SCNBY };
