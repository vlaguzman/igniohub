/* Verbatim port of the Q array from the original artifact. */
import type { Question } from '../types';

export const Q: Question[] = [
{id:'B1-Q1', step:'b1a', source:'context', type:'single', score:false,
 text:'¿En qué idioma prefieres completar este diagnóstico?',
 hint:'No puntúa. Define el idioma de la experiencia y la ruta multilingüe.',
 options:[{t:'Español'},{t:'Inglés'},{t:'Portugués'},{t:'Árabe'},{t:'Otro'}]},

{id:'B1-Q2', step:'b1a', source:'context', type:'single',
 text:'¿Cuánto tiempo llevas viviendo en el Reino Unido?',
 options:[
  {t:'Menos de 6 meses', c:{EIR:-1}, s:{ECO:1}},
  {t:'6 meses a 1 año',  c:{EIR:0}},
  {t:'1 a 3 años',       c:{EIR:1}},
  {t:'3 a 5 años',       c:{EIR:2}},
  {t:'Más de 5 años',    c:{EIR:2}}]},

{id:'B1-Q3', step:'b1a', source:'context', type:'single',
 text:'¿Actualmente tienes permiso legal para trabajar o desarrollar actividad económica en el Reino Unido?',
 options:[
  {t:'Sí', c:{EIR:2}},
  {t:'No', r:'critico', note:'Restricción crítica: no recomendar ejecución empresarial formal.'},
  {t:'No estoy seguro/a', c:{EIR:-1}, s:{ECO:1}, r:'legal', note:'Recomendar orientación legal/institucional.'},
  {t:'Prefiero no responder', r:'confianza', note:'No puntúa. Baja confianza contextual.'}]},

{id:'B1-Q4', step:'b1a', source:'context', type:'single', idx:'ingles',
 text:'¿Qué tan cómodo/a te sientes usando inglés en una conversación profesional o comercial?',
 options:[
  {t:'Puedo entender, pero prefiero no hablar',   c:{EIR:-2,SE:-1}, s:{AV:1}},
  {t:'Puedo hablar si la conversación es simple', c:{EIR:-1}},
  {t:'Puedo explicar una idea con preparación previa', c:{EIR:1,SE:1}},
  {t:'Puedo sostener una conversación profesional',    c:{EIR:2,SE:1}},
  {t:'Puedo negociar, presentar o vender en inglés',   c:{EIR:3,SE:2}}]},

{id:'B1-Q5', step:'b1a', source:'context', type:'single',
 text:'¿Cuál describe mejor tu situación laboral actual?',
 options:[
  {t:'Trabajo tiempo completo', note:'Restricción de tiempo probable.', r:'tiempo'},
  {t:'Trabajo medio tiempo',    note:'Disponibilidad media.'},
  {t:'Trabajo por horas / gig economy', s:{SC:1}, note:'Disponibilidad variable.'},
  {t:'Estoy buscando trabajo',  s:{SC:1}, note:'Urgencia posible.'},
  {t:'Soy independiente',       c:{EA:1}},
  {t:'Tengo un negocio',        note:'Etapa posible: Active Founder.'},
  {t:'Otro'}]},

{id:'B1-Q6', step:'b1a', source:'context', type:'single',
 text:'En una semana normal, ¿cuánto tiempo real podrías dedicar a desarrollar una idea, proyecto o negocio?',
 options:[
  {t:'Menos de 2 horas', c:{EA:-1}, r:'tiempo', note:'Restricción alta.'},
  {t:'2 a 5 horas',   c:{EA:0}},
  {t:'5 a 10 horas',  c:{EA:1}},
  {t:'10 a 20 horas', c:{EA:2}},
  {t:'Más de 20 horas',c:{EA:2}}]},

{id:'B1-Q7', step:'b1a', source:'context', type:'single', idx:'urgencia',
 text:'En los próximos 3 meses, generar ingresos adicionales para ti es:',
 options:[
  {t:'No urgente', s:{SC:0}},
  {t:'Deseable, pero no crítico', s:{SC:0}},
  {t:'Importante',  s:{SC:1}},
  {t:'Muy urgente', s:{SC:2}},
  {t:'Indispensable', s:{SC:3}, note:'Riesgo de decisiones de supervivencia.'}]},

{id:'B1-Q8', step:'b1a', source:'context', type:'single',
 text:'Si tuvieras una oportunidad de negocio pequeña pero prometedora, ¿cuánto podrías invertir sin poner en riesgo tu estabilidad básica?',
 options:[
  {t:'Nada en este momento', s:{SC:2}},
  {t:'Menos de £100', s:{SC:1}},
  {t:'£100–£500',  note:'Restricción moderada.'},
  {t:'£500–£1,500',note:'Capacidad inicial.'},
  {t:'Más de £1,500', note:'Capacidad financiera relativa.'}]},

{id:'B1-Q9', step:'b1a', source:'context', type:'single',
 text:'¿A cuántas personas podrías pedir ayuda concreta para avanzar una idea de negocio?',
 options:[
  {t:'A ninguna', c:{CT:-2}, s:{ECO:2}},
  {t:'1 persona', c:{CT:-1}},
  {t:'2 a 3 personas', c:{CT:1}},
  {t:'4 a 6 personas', c:{CT:2}},
  {t:'Más de 6 personas', c:{CT:3,EIR:1}}]},

{id:'B1-Q10', step:'b1a', source:'context', type:'multi', exclusive:'Ninguno de los anteriores',
 text:'¿Qué tipo de apoyo podrías conseguir hoy con relativa facilidad?',
 hint:'Selecciona todas las que apliquen.',
 options:[
  {t:'Consejos generales', c:{CT:1}},
  {t:'Contactos', c:{EIR:1,CT:1}, g:{CON:1}},
  {t:'Ayuda técnica', note:'Recurso funcional.'},
  {t:'Apoyo emocional', note:'Red de contención.'},
  {t:'Primeros clientes', c:{OM:1,EIR:1}},
  {t:'Dinero / inversión', note:'Recurso financiero.'},
  {t:'Mentoría', c:{EIR:2}},
  {t:'Ninguno de los anteriores', c:{CT:-1}, s:{ECO:2}}]},

{id:'B1-Q11', step:'b1a', source:'context', type:'resources', idx:'recursos',
 text:'Menciona hasta tres organizaciones, programas, espacios o personas en Reino Unido que podrían ayudarte a emprender.',
 hint:'Puntúa por concreción, no por cantidad de texto.',
 buckets:{
   r0:{label:'0 recursos concretos',        c:{EIR:-2}, s:{ECO:2}},
   r1:{label:'1 recurso general',           c:{EIR:0}},
   r2:{label:'2–3 recursos concretos',      c:{EIR:2}},
   r3:{label:'Recursos + explicación de uso',c:{EIR:3}}}},

{id:'B1-Q12', step:'b1a', source:'context', type:'single', score:false, stageQ:true,
 text:'¿Cuál frase describe mejor tu momento actual frente al emprendimiento?',
 hint:'Esta pregunta define tu etapa y activa rutas diferentes en el Bloque 3.',
 options:[
  {t:'No sé si emprender es para mí', stage:'explorador'},
  {t:'Quiero emprender, pero no tengo una idea clara', stage:'buscador'},
  {t:'Tengo una idea, pero no la he validado', stage:'idea'},
  {t:'Ya vendo algo de manera informal o inicial', stage:'earlyseller'},
  {t:'Tengo un negocio activo y quiero fortalecerlo', stage:'founder'}]},

{id:'B1-Q13', step:'b1b', source:'context', type:'single', idx:'entrada',
 text:'Cuando entras a un espacio profesional donde no conoces a nadie, normalmente tú:',
 options:[
  {t:'Observo primero antes de acercarme a alguien', c:{SE:0}, s:{AV:1}},
  {t:'Busco a alguien con quien tenga algo en común', c:{CT:1,EIR:1}, g:{CON:1}},
  {t:'Intento iniciar una conversación aunque me incomode', c:{SE:2,EIR:2}},
  {t:'Prefiero participar solo si alguien me presenta', c:{EIR:-1}, s:{AV:1}},
  {t:'Depende mucho del idioma y del tipo de evento', note:'Señal contextual. Cruzar con B1-Q4.'}]},

{id:'B1-Q14', step:'b1b', source:'context', type:'single',
 text:'Cuando tienes que hablar de tus capacidades frente a personas que no conoces, normalmente:',
 options:[
  {t:'Prefiero estar muy preparado/a antes de hacerlo', s:{IMP:1,AV:1}},
  {t:'Lo hago, pero suelo cuestionar si estoy al nivel', c:{SE:-1}, s:{IMP:2}},
  {t:'Lo hago mejor si tengo una estructura clara', c:{SE:1,SA:1}, g:{STR:1}},
  {t:'Lo hago con naturalidad y ajusto según la reacción', c:{SE:3,SA:1}},
  {t:'Evito hacerlo si no es necesario', s:{AV:2,IMP:1}}]},

{id:'B1-Q15', step:'b1b', source:'context', type:'single',
 text:'Si necesitaras pedir ayuda a alguien fuera de tu círculo cercano, lo que más te frenaría sería:',
 options:[
  {t:'No saber a quién acudir', s:{ECO:2}},
  {t:'No querer incomodar', s:{IMP:1,AV:1}},
  {t:'Miedo a no expresarme bien', c:{SE:-1}, s:{AV:2}},
  {t:'Desconfianza sobre las intenciones de otros', c:{CT:-1}, s:{LCT:2}},
  {t:'Sentir que todavía no estoy listo/a', s:{IMP:2}},
  {t:'Nada en particular', c:{CT:2,SE:1}}]},

{id:'B1-Q16', step:'b1b', source:'context', type:'single', idx:'recursos_mind',
 text:'Cuando piensas en emprender con pocos recursos, la frase que más se acerca a tu reacción inicial es:',
 options:[
  {t:'“Primero necesito resolver ingresos inmediatos”', s:{SC:3}},
  {t:'“Podría probar algo pequeño con lo que tengo”', c:{OM:2,EA:1}, g:{BLD:1}},
  {t:'“Necesito más capital antes de intentarlo”', c:{EA:-1}, s:{SC:2}},
  {t:'“Podría buscar aliados o recursos antes de invertir”', c:{CT:1,OM:1}, g:{CON:1}},
  {t:'“No sé por dónde empezar”', c:{SE:-1}, s:{ECO:1}}]},

{id:'B1-Q17', step:'b1b', source:'context', type:'single',
 text:'Si alguien te propone colaborar en una idea, tu primer foco sería:',
 options:[
  {t:'Entender bien los roles y responsabilidades', c:{CT:1,LI:1}, g:{OPR:1}},
  {t:'Ver si esa persona cumple lo que promete', c:{CT:0}, s:{LCT:1}},
  {t:'Probar una colaboración pequeña antes de avanzar', c:{CT:2,SA:1}},
  {t:'Sentir conexión personal y confianza inicial', c:{CT:1}, g:{CON:1}},
  {t:'Proteger mi idea hasta estar más seguro/a', c:{CT:-1}, s:{LCT:2}}]},

{id:'B1-Q18', step:'b1b', source:'context', type:'single', idx:'pertenencia',
 text:'En espacios profesionales o de emprendimiento en Reino Unido, normalmente sientes que:',
 options:[
  {t:'Perteneces y puedes aportar', c:{EIR:3,SE:2}},
  {t:'Puedes participar, pero necesitas más confianza', c:{EIR:1,SE:0}},
  {t:'Todavía estás aprendiendo cómo moverte', c:{EIR:0}},
  {t:'Esos espacios no suelen estar pensados para personas como tú', s:{IMP:2,ECO:2}},
  {t:'No tienes suficiente información para saberlo', s:{ECO:2}}]},

{id:'B1-Q19', step:'b1b', source:'context', type:'single',
 text:'Cuando recibes feedback crítico sobre una idea o proyecto, normalmente:',
 options:[
  {t:'Lo procesas en privado antes de responder', c:{RE:1}},
  {t:'Pides ejemplos concretos para entenderlo mejor', c:{RE:2,SA:2}},
  {t:'Lo contrastas con alguien de confianza', c:{CT:1,RE:1}},
  {t:'Te cuesta no tomarlo personal', c:{RE:-1}, s:{IMP:1}},
  {t:'Lo usas rápidamente para ajustar', c:{RE:3,SA:2}}]},

{id:'B1-Q20', step:'b1b', source:'context', recent:true, type:'single',
 text:'En los últimos 60 días, ¿has contactado a alguien nuevo para pedir información, consejo, colaboración o feedback?',
 options:[
  {t:'Sí, más de una vez', c:{EIR:3,CT:2}},
  {t:'Sí, una vez', c:{EIR:1}},
  {t:'Lo pensé, pero no lo hice', c:{EA:-1}, s:{AV:1}},
  {t:'No, no sabía a quién contactar', s:{ECO:2}},
  {t:'No lo he necesitado', note:'Neutro; cruzar con etapa.'}]},

{id:'B1-Q21', step:'b1b', source:'context', type:'single', idx:'presion',
 text:'Cuando tienes presión económica, normalmente tus decisiones tienden a:',
 options:[
  {t:'Priorizar ingresos inmediatos', s:{SC:3}},
  {t:'Buscar equilibrio entre ingreso inmediato y construcción futura', c:{OM:2,SA:1}},
  {t:'Pausar decisiones de largo plazo', s:{SC:2,POST:1}},
  {t:'Buscar oportunidades pequeñas de bajo riesgo', c:{OM:2,EA:1}},
  {t:'Pedir consejo antes de decidir', c:{CT:1}}]},

{id:'B1-Q22', step:'b1b', source:'context', type:'single',
 text:'¿Qué te genera más fricción hoy para avanzar hacia un proyecto propio?',
 hint:'Elige la principal.',
 options:[
  {t:'Falta de claridad', c:{SA:-1}},
  {t:'Falta de dinero', s:{SC:2}},
  {t:'Falta de tiempo', r:'tiempo', note:'Restricción operativa.'},
  {t:'Falta de confianza', c:{SE:-2}, s:{IMP:1}},
  {t:'Falta de contactos', c:{CT:-1}, s:{ECO:2}},
  {t:'Idioma', c:{EIR:-1}, s:{AV:1}},
  {t:'No conocer el sistema británico', c:{EIR:-2}, s:{ECO:2}},
  {t:'Miedo a fallar', c:{RE:-1}, s:{IMP:1}},
  {t:'Otro', note:'Clasificación manual.'}]},

{id:'B2-Q1', step:'b2a', source:'capability', cap:'SE', capHead:'Capacidad 1 · Self-Efficacy', capDesc:'Confianza funcional para actuar bajo incertidumbre.', type:'single',
 text:'Cuando tienes que hacer algo nuevo y no dominas todos los pasos, sueles:',
 options:[
  {k:'A', t:'Empezar con una acción pequeña y aprender en el camino', c:{SE:3,EA:1}, g:{BLD:1}},
  {k:'B', t:'Prepararte bastante antes de exponerte', c:{SE:1}, s:{IMP:1}, g:{STR:1}},
  {k:'C', t:'Buscar a alguien que ya lo haya hecho', c:{SE:2,CT:1}, g:{CON:1}},
  {k:'D', t:'Esperar más claridad para evitar errores innecesarios', c:{SE:-1}, s:{AV:2}}]},
{id:'B2-Q2', step:'b2a', source:'capability', cap:'SE', type:'single',
 text:'¿Cuál frase se parece más a ti?',
 options:[
  {k:'A', t:'Me siento cómodo/a aprendiendo mientras hago', c:{SE:2,EA:1}, g:{BLD:1}},
  {k:'B', t:'Me siento más seguro/a cuando primero entiendo bien lo que se espera', c:{SE:1,SA:1}, s:{IMP:1}, g:{STR:1}}]},
{id:'B2-Q3', step:'b2a', source:'context', recent:true, cap:'SE', type:'single',
 text:'En los últimos 30 días, frente a algo importante que no sabías hacer, tú:',
 options:[
  {k:'A', t:'Lo intentaste y avanzaste aunque no estuviera perfecto', c:{SE:3,EA:1}},
  {k:'B', t:'Pediste ayuda para poder avanzar', c:{SE:2,CT:1}},
  {k:'C', t:'Investigaste, pero aún no empezaste', c:{SE:0}, s:{POST:1}},
  {k:'D', t:'Lo aplazaste hasta sentirte más preparado/a', c:{SE:-1}, s:{AV:2}}]},
{id:'B2-Q4', step:'b2a', source:'capability', cap:'SE', type:'open',
 text:'Describe una situación reciente en Reino Unido donde tuviste que hacer algo que no dominabas. ¿Qué hiciste primero?',
 openScore:{fuerte:{c:{SE:3}}, media:{c:{SE:2}}, vaga:{c:{SE:0}, s:{AV:1}}, nula:{c:{SE:-1}, s:{AV:1}}}},

{id:'B2-Q5', step:'b2a', source:'capability', cap:'RE', capHead:'Capacidad 2 · Resilience', capDesc:'Capacidad de sostener acción frente a rechazo, error o dificultad.', type:'single', idx:'re_fallo',
 text:'Cuando algo que intentaste no funciona, en las siguientes 48 horas sueles:',
 options:[
  {k:'A', t:'Revisar qué puedes aprender antes de decidir si sigues', c:{RE:3,SA:1}},
  {k:'B', t:'Tomar distancia para recuperar energía y pensar', c:{RE:1}},
  {k:'C', t:'Intentarlo de nuevo con pocos cambios', c:{RE:1,SA:-1}},
  {k:'D', t:'Hablar con alguien de confianza para ordenar lo ocurrido', c:{RE:2,CT:1}}]},
{id:'B2-Q6', step:'b2a', source:'capability', cap:'RE', type:'single', idx:'re_frase',
 text:'¿Cuál frase se parece más a ti?',
 options:[
  {k:'A', t:'Cuando algo falla, prefiero analizarlo rápido y volver a intentar', c:{RE:2,EA:1}, g:{BLD:1}},
  {k:'B', t:'Cuando algo falla, prefiero tomar distancia antes de decidir el siguiente paso', c:{RE:1}, note:'Autorregulación.'}]},
{id:'B2-Q7', step:'b2a', source:'context', recent:true, cap:'RE', type:'single', idx:'re_no',
 text:'En los últimos 3 meses, cuando recibiste un “no” o una respuesta negativa, tú:',
 options:[
  {k:'A', t:'Pediste más información para entender la razón', c:{RE:2,SA:1}},
  {k:'B', t:'Seguiste buscando otras opciones', c:{RE:2,EA:1}},
  {k:'C', t:'Te tomaste tiempo antes de volver a intentarlo', c:{RE:0}},
  {k:'D', t:'Cambiaste de dirección o dejaste el tema', c:{RE:-1}, s:{POST:1}}]},
{id:'B2-Q8', step:'b2a', source:'capability', cap:'RE', type:'open',
 text:'Cuéntanos sobre una situación reciente en la que algo no salió como esperabas. ¿Qué hiciste después?',
 openScore:{fuerte:{c:{RE:3}}, media:{c:{RE:2}}, vaga:{c:{RE:-1}}, nula:{c:{RE:-2}}}},

{id:'B2-Q9', step:'b2a', source:'capability', cap:'OM', capHead:'Capacidad 3 · Opportunity Mindset', capDesc:'Capacidad de identificar oportunidades más allá de la supervivencia inmediata.', type:'single',
 text:'Cuando notas una necesidad repetida en tu comunidad, trabajo o entorno, normalmente piensas primero:',
 options:[
  {k:'A', t:'“Esto podría ser una oportunidad si entiendo mejor el problema”', c:{OM:3}},
  {k:'B', t:'“Alguien con más recursos podría resolverlo mejor”', c:{OM:-1}, s:{EXT:1}},
  {k:'C', t:'“Tal vez se puede probar algo pequeño sin invertir mucho”', c:{OM:2,EA:1}, g:{BLD:1}},
  {k:'D', t:'“Es importante, pero ahora tengo otras prioridades”', c:{OM:0}, s:{SC:1}}]},
{id:'B2-Q10', step:'b2a', source:'capability', cap:'OM', type:'single',
 text:'¿Cuál frase se parece más a ti?',
 options:[
  {k:'A', t:'Suelo ver posibilidades de generar valor en problemas cotidianos', c:{OM:2}},
  {k:'B', t:'Suelo enfocarme primero en resolver lo urgente antes de pensar en oportunidades', s:{SC:2}}]},
{id:'B2-Q11', step:'b2a', source:'context', recent:true, cap:'OM', type:'single',
 text:'En los últimos 30 días, ¿identificaste algún problema que podría convertirse en producto, servicio o solución?',
 options:[
  {k:'A', t:'Sí, y hablé con alguien sobre eso', c:{OM:3,EA:1}},
  {k:'B', t:'Sí, pero no hice nada todavía', c:{OM:1}, s:{POST:1}},
  {k:'C', t:'No estoy seguro/a', c:{OM:0}},
  {k:'D', t:'No, no he estado pensando en eso', c:{OM:-1}}]},
{id:'B2-Q12', step:'b2a', source:'capability', cap:'OM', type:'open',
 text:'Menciona una necesidad que hayas observado en migrantes, trabajadores, familias o comunidades en Reino Unido.',
 openScore:{fuerte:{c:{OM:3}}, media:{c:{OM:2}}, vaga:{c:{OM:0}}, nula:{c:{OM:-1}}}},

{id:'B2-Q13', step:'b2a', source:'capability', cap:'CT', capHead:'Capacidad 4 · Collaborative Trust', capDesc:'Capacidad de construir relaciones productivas sin ingenuidad ni aislamiento defensivo.', type:'single', idx:'ct_cond',
 text:'Si alguien te propone colaborar en una idea, ¿qué necesitarías ver primero?',
 options:[
  {k:'A', t:'Claridad en roles, tiempos y responsabilidades', c:{CT:1,LI:1}, g:{OPR:1}},
  {k:'B', t:'Evidencia de que la persona cumple lo que promete', c:{CT:0}, s:{LCT:1}},
  {k:'C', t:'Una prueba pequeña antes de comprometerte más', c:{CT:3,SA:1}},
  {k:'D', t:'Buena conexión personal y confianza inicial', c:{CT:1}, g:{CON:1}}]},
{id:'B2-Q14', step:'b2a', source:'capability', cap:'CT', type:'single', idx:'ct_frase',
 text:'¿Cuál frase se parece más a ti?',
 options:[
  {k:'A', t:'Me gusta construir confianza probando colaboraciones pequeñas', c:{CT:2,SA:1}},
  {k:'B', t:'Prefiero colaborar cuando las responsabilidades están claras desde el inicio', c:{CT:1,LI:1}, g:{OPR:1}}]},
{id:'B2-Q15', step:'b2a', source:'context', recent:true, cap:'CT', type:'single', idx:'ct_ayuda',
 text:'En los últimos 60 días, ¿pediste u ofreciste ayuda concreta a alguien fuera de tu círculo cercano?',
 options:[
  {k:'A', t:'Sí, pedí ayuda', c:{CT:2,EIR:1}},
  {k:'B', t:'Sí, ofrecí ayuda', c:{CT:2}},
  {k:'C', t:'Sí, ambas', c:{CT:3,EIR:1}, g:{CON:1}},
  {k:'D', t:'No, pero podría hacerlo', c:{CT:0}},
  {k:'E', t:'No, prefiero mantenerme en mi círculo cercano', c:{CT:-1}, s:{ECO:1}}]},
{id:'B2-Q16', step:'b2a', source:'capability', cap:'CT', type:'open',
 text:'¿Qué condiciones tendrían que existir para que tú colabores con alguien en un proyecto?',
 openScore:{fuerte:{c:{CT:2}}, media:{c:{CT:1}}, vaga:{c:{CT:0}}, nula:{c:{CT:-1}, s:{LCT:2}}}},

{id:'ATT-1', step:'b2a', source:'witness', type:'single', attention:true, expect:2,
 text:'Para confirmar que estás leyendo con atención, selecciona la opción “Bastante cómodo/a”.',
 hint:'Control de lectura. No afecta el puntaje de tus capacidades.',
 options:[{t:'Muy incómodo/a'},{t:'Poco cómodo/a'},{t:'Bastante cómodo/a'},{t:'Totalmente cómodo/a'},{t:'Prefiero no responder'}]},

{id:'B2-Q17', step:'b2b', source:'capability', cap:'EA', capHead:'Capacidad 5 · Entrepreneurial Agency', capDesc:'Capacidad de convertir intención en acción.', type:'single', idx:'ea_idea',
 text:'Cuando tienes una idea que te interesa, normalmente:',
 options:[
  {k:'A', t:'La conviertes en una primera acción pequeña', c:{EA:3}, g:{BLD:1}, note:'Bajo riesgo de postergación.'},
  {k:'B', t:'La escribes y desarrollas hasta entenderla mejor', c:{EA:1}, g:{STR:1}, note:'Posible sobreanálisis.'},
  {k:'C', t:'La conversas con alguien para ver si tiene sentido', c:{EA:1,CT:1}, g:{CON:1}, note:'Dependencia moderada de validación externa.'},
  {k:'D', t:'Esperas el momento adecuado para dedicarle atención real', c:{EA:-1}, s:{POST:2}}]},
{id:'B2-Q18', step:'b2b', source:'capability', cap:'EA', type:'single',
 text:'¿Cuál frase se parece más a ti?',
 options:[
  {k:'A', t:'Cuando tengo una idea, busco una acción pequeña para probarla', c:{EA:2}, g:{BLD:1}},
  {k:'B', t:'Cuando tengo una idea, busco estructurarla bien antes de moverme', c:{EA:1}, g:{STR:1}}]},
{id:'B2-Q19', step:'b2b', source:'context', recent:true, cap:'EA', type:'single', idx:'ea_accion',
 text:'En los últimos 14 días, ¿hiciste alguna acción concreta relacionada con un objetivo profesional, económico o emprendedor?',
 options:[
  {k:'A', t:'Sí, y tuvo un resultado claro', c:{EA:3}},
  {k:'B', t:'Sí, aunque todavía no veo resultado', c:{EA:2}},
  {k:'C', t:'Lo planifiqué, pero no lo ejecuté', c:{EA:0}, s:{POST:1}},
  {k:'D', t:'No, he tenido otras prioridades', c:{EA:-1}}]},
{id:'B2-Q20', step:'b2b', source:'capability', cap:'EA', type:'open', idx:'ea_open',
 text:'¿Cuál fue la última acción concreta que hiciste para avanzar una meta importante?',
 openScore:{fuerte:{c:{EA:3}}, media:{c:{EA:2}}, vaga:{c:{EA:0}}, nula:{c:{EA:-1}, s:{POST:1}}}},

{id:'B2-Q21', step:'b2b', source:'capability', cap:'SA', capHead:'Capacidad 6 · Strategic Adaptability', capDesc:'Capacidad de ajustar dirección sin perder avance.', type:'single',
 text:'Si descubres que una idea que te gusta no encaja bien con lo que el mercado necesita, primero:',
 options:[
  {k:'A', t:'Identificarías qué parte de la idea todavía puede servir', c:{SA:2}},
  {k:'B', t:'Hablarías con potenciales usuarios para entender mejor el problema', c:{SA:3,OM:1}},
  {k:'C', t:'Cambiarías el público objetivo antes de abandonar la idea', c:{SA:1}},
  {k:'D', t:'Revisarías si el problema es la idea o la forma de explicarla', c:{SA:2}}]},
{id:'B2-Q22', step:'b2b', source:'capability', cap:'SA', type:'single',
 text:'¿Cuál frase se parece más a ti?',
 options:[
  {k:'A', t:'Cambio de estrategia rápido si encuentro nueva evidencia', c:{SA:2}},
  {k:'B', t:'Me tomo tiempo para entender si el cambio realmente vale la pena', c:{SA:1}, g:{STR:1}}]},
{id:'B2-Q23', step:'b2b', source:'context', recent:true, cap:'SA', type:'single',
 text:'En los últimos 3 meses, ¿cambiaste una decisión, plan o enfoque después de recibir nueva información?',
 options:[
  {k:'A', t:'Sí, y el cambio mejoró el resultado', c:{SA:3}},
  {k:'B', t:'Sí, pero todavía no sé si funcionó', c:{SA:2}},
  {k:'C', t:'Lo pensé, pero mantuve el plan original', c:{SA:0}},
  {k:'D', t:'No recuerdo una situación así', c:{SA:-1}}]},
{id:'B2-Q24', step:'b2b', source:'capability', cap:'SA', type:'open',
 text:'Describe una vez en que tuviste que adaptarte a una regla, sistema o expectativa nueva en Reino Unido.',
 openScore:{fuerte:{c:{SA:2,EIR:1}}, media:{c:{SA:1,EIR:1}}, vaga:{c:{SA:0}}, nula:{c:{SA:-1}, s:{ECO:1}}}},

{id:'B2-Q25', step:'b2b', source:'capability', cap:'LI', capHead:'Capacidad 7 · Leadership Initiative', capDesc:'Capacidad de movilizar, coordinar o influir sin depender de autoridad formal.', type:'single',
 text:'Cuando un grupo está desordenado o sin claridad, normalmente tú:',
 options:[
  {k:'A', t:'Propones ordenar tareas y próximos pasos', c:{LI:3}, g:{OPR:1}},
  {k:'B', t:'Haces bien tu parte para no aumentar el desorden', c:{LI:0,EA:1}},
  {k:'C', t:'Preguntas qué necesita cada persona para avanzar', c:{LI:2,CT:1}, g:{CON:1}},
  {k:'D', t:'Esperas a que alguien con más autoridad tome dirección', c:{LI:-1}, s:{EXT:1}}]},
{id:'B2-Q26', step:'b2b', source:'capability', cap:'LI', type:'single',
 text:'¿Cuál frase se parece más a ti?',
 options:[
  {k:'A', t:'Cuando hay confusión, suelo proponer estructura', c:{LI:2}, g:{OPR:1}},
  {k:'B', t:'Cuando hay confusión, suelo escuchar primero antes de intervenir', c:{LI:1,CT:1}}]},
{id:'B2-Q27', step:'b2b', source:'context', recent:true, cap:'LI', type:'single',
 text:'En los últimos 3 meses, ¿has ayudado a coordinar, organizar o movilizar a otras personas para lograr algo?',
 options:[
  {k:'A', t:'Sí, lideré o coordiné claramente', c:{LI:3}},
  {k:'B', t:'Sí, apoyé la organización', c:{LI:2}},
  {k:'C', t:'Participé, pero no coordiné', c:{LI:0}},
  {k:'D', t:'No he estado en una situación así', score:false, note:'No puntúa; baja evidencia.'}]},
{id:'B2-Q28', step:'b2b', source:'capability', cap:'LI', type:'open',
 text:'¿Qué rol sueles tomar cuando trabajas con otras personas?',
 openScore:{fuerte:{c:{LI:3}}, media:{c:{LI:2}}, vaga:{c:{LI:0}}, nula:{c:{LI:-1}}}},

{id:'B2-Q29', step:'b2b', source:'capability', cap:'EIR', capHead:'Capacidad 8 · Economic Integration Readiness', capDesc:'Capacidad de navegar ecosistemas económicos locales.', type:'single', idx:'eir_mov',
 text:'Si necesitaras apoyo para avanzar una idea en Reino Unido, tu primer movimiento sería:',
 options:[
  {k:'A', t:'Buscar organizaciones, programas o eventos locales', c:{EIR:3,CT:1}, note:'Alta apertura ecosistémica.'},
  {k:'B', t:'Preguntar primero dentro de tu comunidad cercana', c:{EIR:0,CT:1}, s:{ECO:1}, note:'Dependencia de red cercana.'},
  {k:'C', t:'Buscar información online y filtrar opciones confiables', c:{EIR:2}, note:'Autonomía informacional.'},
  {k:'D', t:'Esperar una recomendación de alguien que conozca el sistema', c:{EIR:-1,CT:1}, s:{EXT:1}, note:'Baja navegación autónoma.'}]},
{id:'B2-Q30', step:'b2b', source:'capability', cap:'EIR', type:'single',
 text:'¿Cuál frase se parece más a ti?',
 options:[
  {k:'A', t:'Suelo buscar oportunidades fuera de mi círculo cercano', c:{EIR:2}},
  {k:'B', t:'Suelo validar primero las oportunidades con personas de confianza', c:{EIR:0,CT:1}}]},
{id:'B2-Q31', step:'b2b', source:'context', recent:true, cap:'EIR', type:'single', idx:'eir_part',
 text:'En los últimos 90 días, ¿participaste en algún evento, programa, comunidad o espacio profesional fuera de tu círculo habitual?',
 options:[
  {k:'A', t:'Sí, más de una vez', c:{EIR:3}},
  {k:'B', t:'Sí, una vez', c:{EIR:1}},
  {k:'C', t:'Lo consideré, pero no participé', c:{EIR:0}, s:{AV:1}},
  {k:'D', t:'No sabía dónde buscar', c:{EIR:-1}, s:{ECO:2}},
  {k:'E', t:'No me interesa por ahora', c:{EIR:-2}}]},
{id:'B2-Q32', step:'b2b', source:'capability', cap:'EIR', type:'open',
 text:'¿Qué tipo de apoyo externo crees que más te ayudaría a avanzar ahora?',
 openScore:{fuerte:{c:{EIR:1}}, media:{c:{EIR:1}}, vaga:{c:{EIR:-1}, s:{ECO:1}}, nula:{c:{EIR:-1}, s:{ECO:1}}}},

{id:'DS-1', step:'wit', source:'witness', type:'likert5', ds:true, text:'Cuando recibo feedback crítico, nunca me afecta emocionalmente.'},
{id:'DS-2', step:'wit', source:'witness', type:'likert5', ds:true, text:'Siempre cumplo todo lo que me propongo, incluso cuando estoy bajo presión.'},
{id:'DS-3', step:'wit', source:'witness', type:'likert5', ds:true, text:'Nunca me incomoda pedir ayuda a personas que no conozco.'},
{id:'DS-4', step:'wit', source:'witness', type:'likert5', ds:true, text:'Siempre sé exactamente qué hacer cuando enfrento una situación nueva.'},
{id:'DS-5', step:'wit', source:'witness', type:'likert5', ds:true, text:'Nunca he postergado una decisión importante por miedo a equivocarme.'},

{id:'EV-1', step:'wit', source:'witness', type:'open', evidence:true,
 text:'¿Cuál fue la última persona fuera de tu círculo cercano a quien pediste consejo o feedback?'},
{id:'EV-2', step:'wit', source:'witness', type:'open', evidence:true,
 text:'¿Cuál fue la última acción concreta que hiciste para avanzar una idea, proyecto o meta?'},
{id:'EV-3', step:'wit', source:'witness', type:'open', evidence:true,
 text:'¿Qué recurso, programa o institución de Reino Unido has usado o contactado realmente?'},
{id:'EV-4', step:'wit', source:'witness', type:'open', evidence:true,
 text:'¿Qué fue lo último que cambiaste en una idea o proyecto después de recibir nueva información?'}
];
