/* Verbatim port of ARCHETYPES from the original artifact. */
import type { Archetype } from '../types';

export const ARCHETYPES: Archetype[] = [
 {k:'Connector', d:'Avanza construyendo relaciones y accediendo a redes.',
  caps:{CT:.45,EIR:.35}, tag:'CON', tw:.20},
 {k:'Builder', d:'Avanza haciendo: prueba rápido y aprende en el camino.',
  caps:{EA:.40,RE:.30}, tag:'BLD', tw:.30},
 {k:'Strategist', d:'Avanza analizando y estructurando antes de moverse.',
  caps:{SA:.55,SE:.20}, tag:'STR', tw:.25},
 {k:'Visionary', d:'Avanza leyendo posibilidades donde otros ven problemas.',
  caps:{OM:.60,SE:.25,SA:.15}, tag:null, tw:0},
 {k:'Operator', d:'Avanza con orden, seguimiento y consistencia.',
  caps:{EA:.40,LI:.30}, tag:'OPR', tw:.30},
 {k:'Community Catalyst', d:'Avanza movilizando a otros alrededor de un propósito.',
  caps:{LI:.45,CT:.35,EIR:.20}, tag:null, tw:0}
];
