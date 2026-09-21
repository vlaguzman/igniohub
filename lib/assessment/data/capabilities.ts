/* Verbatim port of the capability/signal/tag/source/stage/level constants
 * from the top of the original ported-engine.js (lines 17-71). */
import type {
  CapabilityDef,
  CapabilityKey,
  CapLevel,
  RouteKey,
  SignalDef,
  SignalKey,
  SourceDef,
  SourceKey,
  StageDef,
  StageKey,
  TagKey,
} from '../types';

export const CAPS: CapabilityDef[] = [
  {k:'SE',  n:'Self-Efficacy',                 d:'Confianza funcional para actuar bajo incertidumbre'},
  {k:'RE',  n:'Resilience',                    d:'Sostener acción frente a rechazo, error o dificultad'},
  {k:'OM',  n:'Opportunity Mindset',           d:'Identificar oportunidades más allá de la supervivencia'},
  {k:'CT',  n:'Collaborative Trust',           d:'Relaciones productivas sin ingenuidad ni aislamiento'},
  {k:'EA',  n:'Entrepreneurial Agency',        d:'Convertir intención en acción'},
  {k:'SA',  n:'Strategic Adaptability',        d:'Ajustar dirección sin perder avance'},
  {k:'LI',  n:'Leadership Initiative',         d:'Movilizar o coordinar sin autoridad formal'},
  {k:'EIR', n:'Economic Integration Readiness',d:'Navegar el ecosistema económico británico'}
];
export const CAPK: CapabilityKey[] = CAPS.map(c=>c.k);
export const CAPN = {} as Record<CapabilityKey, string>;
CAPS.forEach(c=>{ CAPN[c.k]=c.n; });

export const SIGNALS: Record<SignalKey, SignalDef> = {
  IMP: {n:'Patrón impostor / baja legitimidad percibida'},
  SC:  {n:'Pensamiento de escasez (scarcity-driven)'},
  AV:  {n:'Evitación de exposición'},
  LCT: {n:'Baja confianza colaborativa'},
  ECO: {n:'Aislamiento ecosistémico'},
  POST:{n:'Postergación / baja activación'},
  EXT: {n:'Externalización / dependencia del contexto'}
};
export const TAGS: Record<TagKey, string> = {BLD:'Builder', STR:'Strategist', CON:'Connector', OPR:'Operator'};

export const SOURCES: Record<SourceKey, SourceDef> = {
  capability:{n:'Capability Assessment', d:'Autopercepción conductual (Bloque 2)'},
  scenarios: {n:'Escenarios situacionales', d:'Juicio ante situaciones reales (Bloque 3)'},
  context:   {n:'Contexto y conducta reciente', d:'Restricciones reales + evidencia de los últimos 90 días (Bloque 1)'}
};
export const WEIGHTS: Record<SourceKey, number> = {capability:40, scenarios:35, context:25};

export const STAGES: Record<StageKey, StageDef> = {
  explorador:  {n:'Explorador',          d:'No sabe si emprender es para él/ella',  w:{SE:20,OM:20,EA:20,EIR:15,RE:10,CT:10,SA:5,LI:0}},
  buscador:    {n:'Buscador de idea',    d:'Quiere emprender, sin idea clara',      w:{OM:25,EA:20,SE:15,SA:15,EIR:10,CT:10,RE:5,LI:0}},
  idea:        {n:'Idea-stage founder',  d:'Tiene una idea, no la ha validado',     w:{EA:20,SA:20,OM:20,SE:15,RE:10,CT:10,EIR:5,LI:0}},
  earlyseller: {n:'Early seller',        d:'Ya vende de forma inicial o informal',  w:{SA:20,EIR:20,EA:15,CT:15,RE:10,LI:10,OM:5,SE:5}},
  founder:     {n:'Active founder',      d:'Tiene un negocio activo',               w:{LI:20,SA:20,CT:15,EA:15,EIR:15,RE:10,OM:5,SE:0}}
};
export const STAGE_ROUTE: Record<StageKey, RouteKey> = {explorador:'A', buscador:'B', idea:'C', earlyseller:'D', founder:'E'};

export const LEVELS: CapLevel[] = [
  {max:39,  k:'bajo',       n:'Bajo',          d:'Capacidad limitada o poco evidente'},
  {max:59,  k:'desarrollo', n:'En desarrollo', d:'Capacidad presente, pero inconsistente'},
  {max:79,  k:'funcional',  n:'Funcional',     d:'Capacidad activa y utilizable'},
  {max:100, k:'fortaleza',  n:'Fortaleza',     d:'Capacidad sólida y observable'}
];

export const OPEN_LABELS: Record<string, string> = {
  auto:  'Automática',
  fuerte:'Evidencia concreta',
  media: 'Evidencia parcial',
  vaga:  'Respuesta vaga',
  nula:  'Sin evidencia'
};
export const DS_SCALE: string[] = ['Nunca / casi nunca','Pocas veces','A veces','Frecuentemente','Siempre / casi siempre'];
