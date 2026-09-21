/* Verbatim port of the SCENARIOS array from the original artifact. */
import type { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
{id:'A1', route:'A', title:'Escenario A1',
 situation:'Tienes un trabajo parcial o inestable. A veces piensas que podrías construir algo propio, pero no sabes si emprender es para ti. ¿Qué harías primero?',
 options:[
  {k:'A', t:'Hablar con personas que han emprendido para entender el camino', c:{CT:2,EIR:1}, g:{CON:1}},
  {k:'B', t:'Hacer una lista de habilidades, intereses y problemas que podrías resolver', c:{OM:2,SE:1}, g:{STR:1}},
  {k:'C', t:'Esperar hasta tener una idea más clara', c:{EA:-1}, s:{POST:2}},
  {k:'D', t:'Buscar una opción rápida que pueda generar ingresos pronto', c:{OM:0}, s:{SC:2}}]},
{id:'A2', route:'A', title:'Escenario A2',
 situation:'Te invitan a un taller de emprendimiento, pero no tienes idea de negocio y sientes que quizá no encajas. ¿Qué harías?',
 options:[
  {k:'A', t:'Asistir para entender si emprender tiene sentido para ti', c:{SE:2,EIR:2}},
  {k:'B', t:'Preguntar antes si el taller sirve para personas sin idea', c:{EA:1,EIR:1}},
  {k:'C', t:'Esperar a tener una idea antes de participar', s:{POST:1,AV:1}},
  {k:'D', t:'Ir solo si conoces a alguien que también vaya', c:{CT:1}, s:{ECO:1}}]},
{id:'B1', route:'B', title:'Escenario B1',
 situation:'Quieres emprender, pero sientes que “todo ya existe”. ¿Qué harías?',
 options:[
  {k:'A', t:'Observar problemas reales en tu comunidad o trabajo', c:{OM:3}},
  {k:'B', t:'Buscar tendencias para detectar oportunidades', c:{OM:1,SA:1}, g:{STR:1}},
  {k:'C', t:'Hablar con personas sobre necesidades no resueltas', c:{OM:2,CT:1}, g:{CON:1}},
  {k:'D', t:'Esperar a que aparezca una idea más original', c:{OM:-1}, s:{POST:2}}]},
{id:'B2', route:'B', title:'Escenario B2',
 situation:'Tienes varias ideas sueltas, pero ninguna te convence completamente. ¿Qué harías?',
 options:[
  {k:'A', t:'Compararlas según problema, cliente y facilidad de prueba', c:{SA:3,OM:2}, g:{STR:1}},
  {k:'B', t:'Elegir la que más te motiva personalmente', c:{SE:1,OM:0}},
  {k:'C', t:'Conversarlas con posibles usuarios', c:{CT:1,OM:2,SA:1}, g:{CON:1}},
  {k:'D', t:'Guardarlas hasta tener más tiempo o recursos', c:{EA:-1}, s:{POST:2}}]},
{id:'C1', route:'C', title:'Escenario C1',
 situation:'Tienes una idea que te gusta, pero no sabes si alguien pagaría por ella. ¿Qué harías primero?',
 options:[
  {k:'A', t:'Hablar con potenciales clientes sobre el problema', c:{OM:3,SA:2}},
  {k:'B', t:'Crear una versión simple para mostrar', c:{EA:2,SA:1}, g:{BLD:1}},
  {k:'C', t:'Preguntar a conocidos si les parece buena idea', c:{CT:1}, s:{ECO:1}},
  {k:'D', t:'Diseñar nombre, logo o redes para verla más real', c:{EA:0}, note:'Riesgo de falsa ejecución.'}]},
{id:'C2', route:'C', title:'Escenario C2',
 situation:'Tres personas te dicen que tu idea no se entiende bien. ¿Qué harías?',
 options:[
  {k:'A', t:'Revisar si estás explicando bien el problema', c:{SA:2}},
  {k:'B', t:'Pedir ejemplos concretos de lo que no se entiende', c:{RE:2,SA:2}},
  {k:'C', t:'Buscar otro público que sí conecte con la idea', c:{SA:1}},
  {k:'D', t:'Seguir explicándola hasta que la entiendan', c:{SA:-1,RE:0}}]},
{id:'D1', route:'D', title:'Escenario D1',
 situation:'Tus ventas dependen casi totalmente de amigos, familia o comunidad cercana. ¿Qué harías para crecer?',
 options:[
  {k:'A', t:'Identificar qué tipo de cliente compra más y buscar canales similares', c:{SA:3,OM:2}, g:{STR:1}},
  {k:'B', t:'Pedir más recomendaciones dentro de tu red', c:{CT:1}, s:{ECO:1}},
  {k:'C', t:'Probar un canal fuera de tu comunidad cercana', c:{EIR:3,SE:1}},
  {k:'D', t:'Bajar precios para atraer más compradores', c:{SA:-1}, s:{SC:1}}]},
{id:'D2', route:'D', title:'Escenario D2',
 situation:'Varias personas te dicen que tu precio es alto, pero otras sí compran. ¿Qué harías?',
 options:[
  {k:'A', t:'Revisar qué tipo de cliente valora más tu oferta', c:{OM:2,SA:2}},
  {k:'B', t:'Bajar el precio para vender más rápido', c:{SA:-1}, s:{SC:2}},
  {k:'C', t:'Mejorar cómo explicas el valor', c:{SE:1,SA:2}},
  {k:'D', t:'Crear una versión más simple y otra más completa', c:{SA:3,OM:1}, g:{STR:1}}]},
{id:'E1', route:'E', title:'Escenario E1',
 situation:'Tu negocio funciona, pero depende demasiado de ti. ¿Qué harías primero?',
 options:[
  {k:'A', t:'Documentar procesos críticos', c:{LI:1,SA:2}, g:{OPR:1}},
  {k:'B', t:'Buscar a alguien de confianza para apoyar', c:{CT:2,LI:1}, g:{CON:1}},
  {k:'C', t:'Identificar qué tareas puedes delegar', c:{LI:2,SA:2}},
  {k:'D', t:'Trabajar más horas hasta tener más ventas', c:{LI:-1}, s:{SC:1}}]},
{id:'E2', route:'E', title:'Escenario E2',
 situation:'Quieres crecer, pero no sabes si el problema principal es ventas, operación, precio o equipo. ¿Qué harías?',
 options:[
  {k:'A', t:'Revisar datos básicos de ventas, costos y tiempo', c:{SA:3}, g:{OPR:1}},
  {k:'B', t:'Pedir feedback a clientes actuales', c:{CT:1,OM:2}},
  {k:'C', t:'Hablar con un mentor o asesor', c:{CT:2,EIR:1}, g:{CON:1}},
  {k:'D', t:'Probar una acción comercial rápida y medir resultado', c:{EA:2,SA:1}, g:{BLD:1}}]},
{id:'T1', route:'T', title:'Escenario T1 — Networking', idx:'t1',
 situation:'Vas a un evento donde no conoces a nadie y la mayoría habla inglés. ¿Qué harías?',
 options:[
  {k:'A', t:'Preparar una frase breve sobre quién eres y hablar con dos personas', c:{SE:2,EIR:3}},
  {k:'B', t:'Observar primero y acercarte si surge una oportunidad natural', c:{SE:0}, s:{AV:1}},
  {k:'C', t:'Buscar a alguien con quien tengas algo en común', c:{CT:1,EIR:1}, g:{CON:1}},
  {k:'D', t:'Irte temprano si sientes que no estás conectando', c:{EIR:-1}, s:{AV:2}}]},
{id:'T2', route:'T', title:'Escenario T2 — Colaboración', idx:'t2',
 situation:'Alguien que conociste te propone trabajar juntos en una idea. ¿Qué harías?',
 options:[
  {k:'A', t:'Proponer una prueba pequeña con responsabilidades claras', c:{CT:3,SA:1}},
  {k:'B', t:'Tener una conversación para entender valores, objetivos y expectativas', c:{CT:2,LI:1}},
  {k:'C', t:'Esperar a conocer mejor a la persona antes de avanzar', c:{CT:0}, s:{LCT:1}},
  {k:'D', t:'Compartir solo información limitada hasta sentir más confianza', c:{CT:-1}, s:{LCT:2}}]},
{id:'T3', route:'T', title:'Escenario T3 — Feedback difícil', idx:'t3',
 situation:'Un mentor te dice que tu enfoque no está claro y que necesitas replantearlo. ¿Qué harías?',
 options:[
  {k:'A', t:'Pedir ejemplos concretos y decidir qué ajustar', c:{RE:3,SA:2}},
  {k:'B', t:'Tomar distancia y revisarlo con calma', c:{RE:1}},
  {k:'C', t:'Contrastar esa opinión con otra persona', c:{CT:1,RE:1}},
  {k:'D', t:'Defender tu enfoque si crees que no entendió bien', c:{SA:-1}, s:{IMP:1}}]}
];
