import { describe, expect, it } from 'vitest';

import { createAssessmentEngine } from './engine';
import type { EngineState } from './types';

/**
 * Parity fixture derived by running the original (pre-port, observer-free)
 * JavaScript engine against a real demo profile from the original artifact.
 * These expected values are ground truth — if the port disagrees, the port
 * has a bug. Do not adjust the expected values to make this pass.
 */
const FIXTURE: EngineState = {
  answers: {
    'B1-Q1': 0,
    'B1-Q2': 2,
    'B1-Q3': 0,
    'B1-Q4': 1,
    'B1-Q5': 2,
    'B1-Q6': 2,
    'B1-Q7': 3,
    'B1-Q8': 1,
    'B1-Q9': 2,
    'B1-Q10': [0, 3, 4],
    'B1-Q12': 2,
    'B1-Q13': 0,
    'B1-Q14': 0,
    'B1-Q15': 4,
    'B1-Q16': 1,
    'B1-Q17': 2,
    'B1-Q18': 2,
    'B1-Q19': 1,
    'B1-Q20': 1,
    'B1-Q21': 1,
    'B1-Q22': 5,
    'B2-Q1': 1,
    'B2-Q2': 1,
    'B2-Q3': 1,
    'B2-Q5': 0,
    'B2-Q6': 0,
    'B2-Q7': 1,
    'B2-Q9': 0,
    'B2-Q10': 0,
    'B2-Q11': 1,
    'B2-Q13': 2,
    'B2-Q14': 0,
    'B2-Q15': 3,
    'ATT-1': 2,
    'B2-Q17': 0,
    'B2-Q18': 0,
    'B2-Q19': 1,
    'B2-Q21': 1,
    'B2-Q22': 0,
    'B2-Q23': 1,
    'B2-Q25': 1,
    'B2-Q26': 1,
    'B2-Q27': 2,
    'B2-Q29': 1,
    'B2-Q30': 1,
    'B2-Q31': 3,
    'DS-1': 1,
    'DS-2': 4,
    'DS-3': 2,
    'DS-4': 4,
    'DS-5': 4,
    'B2-Q4':
      'Tuve que registrar mi actividad como self-employed en HMRC en marzo. Lo primero que hice fue buscar la guía oficial, anotar los pasos y pedirle ayuda a una compañera del trabajo que ya lo había hecho el año pasado.',
    'B2-Q8':
      'En abril lancé una preventa de comidas para 12 personas y solo compraron 3. Después hablé con cinco de las que no compraron y descubrí que el problema era el día de entrega, no el precio.',
    'B2-Q12':
      'Muchas familias migrantes en Croydon no encuentran comida de su país a precio razonable y terminan pagando envíos caros. Lo veo cada semana en el grupo de WhatsApp del barrio.',
    'B2-Q16':
      'Que haya roles escritos, un plazo corto para probar y que las dos partes pongan algo de trabajo antes de hablar de dinero.',
    'B2-Q20':
      'La semana pasada escribí a dos tiendas latinas de Croydon para preguntar si comprarían al mayor. Una respondió y agendamos una llamada.',
    'B2-Q24':
      'Cuando entendí que necesitaba food hygiene certificate para vender comida, hice el curso online de nivel 2 en dos tardes y ajusté mi plan de cocina.',
    'B2-Q28':
      'Normalmente organizo: reparto tareas y hago seguimiento, aunque no me gusta dar instrucciones si nadie me lo pidió.',
    'B2-Q32': 'Alguien que ya venda comida en UK y me diga qué permisos son obligatorios y cuáles no.',
    'EV-1': 'Una asesora de Croydon Works, en junio.',
    'EV-2': 'Escribí a dos tiendas para proponerles venta al mayor.',
    'EV-3': 'Croydon Works y un taller de Prince’s Trust al que asistí una vez.',
    'EV-4': 'Cambié el día de entrega de domingo a sábado después de hablar con clientas.',
  },
  openOv: {},
  res: {
    r1: 'Croydon Works',
    r2: "Prince's Trust",
    r3: '',
    use: 'Fui una vez a un taller de Prince’s Trust. Croydon Works me ayudó con el CV, pero no he vuelto a contactarlos desde marzo.',
  },
  scn: {
    C1: { most: 'A', least: 'D' },
    C2: { most: 'B', least: 'D' },
    T1: { most: 'C', least: 'D' },
    T2: { most: 'A', least: 'D' },
    T3: { most: 'A', least: 'D' },
  },
};

describe('createAssessmentEngine — parity with the original JS engine', () => {
  it('reproduces the exact scores computed by the original (observer-free) engine for the demo profile', () => {
    const engine = createAssessmentEngine();
    engine.loadState(FIXTURE);
    const result = engine.compute();

    expect(result.stage).toBe('idea');

    expect(result.capScore).toEqual({
      SE: 57,
      RE: 92,
      OM: 91,
      CT: 80,
      EA: 67,
      SA: 82,
      LI: 40,
      EIR: 56,
    });

    expect(result.readiness).toBe(77);

    expect(result.sigPct).toEqual({
      IMP: 45,
      SC: 24,
      AV: 19,
      LCT: 0,
      ECO: 13,
      POST: 13,
      EXT: 0,
    });

    expect(result.archs.map(a => `${a.k}:${a.score}`)).toEqual([
      'Visionary:81',
      'Builder:69',
      'Strategist:65',
      'Connector:58',
      'Community Catalyst:57',
      'Operator:39',
    ]);

    expect(result.conf.total).toBe(80);
    expect(result.conf.level).toBe('Alto');
  });
});
