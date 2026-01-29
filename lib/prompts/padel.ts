import { JSON_OUTPUT_SCHEMA, type PromptBuilder } from './base'

const PADEL_BASE_PROMPT = `Eres un entrenador experto de padel de nivel World Padel Tour con mas de 20 anos de experiencia analizando tecnicas de jugadores.

Tu tarea es analizar las imagenes/video proporcionado y evaluar la tecnica del jugador, identificando errores especificos y proporcionando recomendaciones de mejora.

IMPORTANTE: Responde EXCLUSIVAMENTE en formato JSON valido con la estructura especificada al final.`

const PADEL_TECHNIQUES: Record<string, string> = {
  derecha: `
## BIOMECANICA CORRECTA DE LA DERECHA DE PADEL

### Posicion y Preparacion:
- Posicion semi-abierta, rodillas flexionadas
- Agarre Continental o ligeramente Eastern
- Giro de hombros con la pala hacia atras temprano
- Codo cerca del cuerpo, pala a la altura de la cintura

### Backswing:
- Compacto — el espacio en la pista es limitado
- La pala no pasa mas alla de la linea del cuerpo
- Peso en el pie trasero

### Punto de Contacto:
- Adelante del cuerpo, a la altura de la cintura
- Cara de la pala perpendicular al objetivo
- Muneca firme, no romperse

### Follow-through:
- Hacia el objetivo, controlado
- No exagerar el swing — control sobre potencia
- Recuperacion rapida al centro de la pista`,

  reves: `
## BIOMECANICA CORRECTA DEL REVES DE PADEL

### Posicion y Preparacion:
- Giro de hombros completo
- Mano no dominante en la garganta de la pala
- Posicion cerrada o semi-abierta

### Para Reves a Una Mano:
- Agarre Continental
- Brazo extendido en el contacto
- Mayor uso en pelotas bajas y defensivas

### Para Reves a Dos Manos:
- Ambas manos en la pala
- Mayor control y potencia de rotacion
- Mas utilizado en padel moderno

### Punto de Contacto:
- Adelante del cuerpo
- Pala firme sin romper muneca
- Dirigir con precision al espacio abierto

### Follow-through:
- Hacia el objetivo, controlado
- Recuperacion inmediata`,

  bandeja: `
## BIOMECANICA CORRECTA DE LA BANDEJA

### Posicion y Preparacion:
- Moverse debajo de la pelota con pasos laterales
- Brazo no dominante apunta a la pelota (referencia visual)
- Pala arriba detras de la cabeza, codo alto
- Posicion lateral al cuerpo

### Movimiento:
- Impacto de arriba hacia abajo con efecto cortado
- NO es un remate — es un golpe de control y posicion
- Cuerpo lateral, no de frente a la red

### Punto de Contacto:
- A la altura de la cabeza o ligeramente arriba
- Adelante del cuerpo, no detras
- Efecto cortado (slice) para que la pelota no bote alto
- Dirigir hacia la reja lateral para dificultar la devolucion

### Follow-through:
- Corto y controlado hacia abajo
- Mantener posicion en la red
- Recuperar rapidamente para el siguiente golpe`,

  vibora: `
## BIOMECANICA CORRECTA DE LA VIBORA

### Preparacion:
- Similar a la bandeja pero con intencion mas agresiva
- Posicion lateral, brazo no dominante apuntando a la pelota
- Pala alta detras de la cabeza, codo flexionado

### Ejecucion:
- Impacto de arriba hacia abajo con efecto lateral (side-spin)
- La pala corta la pelota de adentro hacia afuera
- Mayor velocidad que la bandeja
- Genera efecto que dificulta la lectura del bote en la pared

### Punto de Contacto:
- A la altura de la cabeza, ligeramente adelante
- Pronacion del antebrazo para generar el efecto lateral
- Dirigir hacia la pared lateral (cristal)

### Follow-through:
- La pala termina del lado contrario del cuerpo
- Agresivo pero controlado
- Mantener posicion de red`,

  saque: `
## BIOMECANICA CORRECTA DEL SAQUE DE PADEL

### Posicion Inicial:
- Pies detras de la linea de saque, posicion de perfil
- Peso distribuido en ambos pies
- Agarre Continental

### Lanzamiento:
- Pelota lanzada a la altura de la cintura (por debajo del punto mas alto de la pala)
- NO se lanza arriba como en tenis — regla de padel: contacto bajo la cintura
- Lanzamiento controlado, sin rotacion excesiva

### Contacto:
- POR DEBAJO de la cintura (regla obligatoria en padel)
- Pala de abajo hacia arriba o plano
- Efecto cortado o plano segun la intencion
- Dirigir hacia el cristal lateral para complicar la devolucion

### Follow-through:
- Hacia adelante y arriba
- Transicion inmediata hacia la red
- El objetivo del saque en padel es ganar la red, no el punto directamente`,

  volea: `
## BIOMECANICA CORRECTA DE LA VOLEA DE PADEL

### Posicion Lista:
- Rodillas flexionadas, peso en las puntas de los pies
- Pala al frente, a la altura del pecho
- Agarre Continental obligatorio
- Posicion activa en la red

### Movimiento:
- NO hay backswing grande — movimiento de "punch" corto
- Paso hacia la pelota con el pie contrario
- La pala sale del cuerpo hacia adelante, no desde atras

### Punto de Contacto:
- Adelante del cuerpo, brazos extendidos
- Pala firme, muneca bloqueada
- Cara de la pala ligeramente abierta para control
- Dirigir hacia los pies del oponente o la reja lateral

### Follow-through:
- Minimo y controlado
- Recuperacion rapida a posicion lista
- Mantener la posicion en la red`,

  globo: `
## BIOMECANICA CORRECTA DEL GLOBO DE PADEL

### Importancia:
- Golpe FUNDAMENTAL en padel — mas que en tenis
- Es la principal herramienta defensiva para sacar a los oponentes de la red
- Bien ejecutado, recupera la posicion y gana la red

### Preparacion:
- Identica a un golpe normal para disfrazar
- Rodillas flexionadas, pala preparada
- No levantar la cabeza prematuramente

### Contacto:
- Cara de la pala abierta, swing de abajo hacia arriba
- Golpear por debajo de la pelota para generar altura
- Control preciso de la fuerza: debe pasar por encima de los oponentes y caer cerca del cristal del fondo

### Trayectoria Ideal:
- Lo suficientemente alto para que no lleguen con bandeja/vibora
- Lo suficientemente profundo para que toque el cristal del fondo
- Considerar el efecto del cristal: la pelota no debe rebotar hacia el centro

### Follow-through:
- Hacia arriba siguiendo la trayectoria
- Transicion hacia la red inmediatamente despues del globo
- El globo DEBE ir seguido de avance a la red`,

  chiquita: `
## BIOMECANICA CORRECTA DE LA CHIQUITA

### Concepto:
- Golpe suave y bajo por encima de la red
- Objetivo: que la pelota caiga a los pies de los oponentes en la red
- Equivalente funcional del drop shot en tenis pero adaptado al padel

### Preparacion:
- Identica a un golpe normal (disfrazar)
- Agarre firme pero suave al impacto
- No telegraph el golpe con preparacion diferente

### Contacto:
- Toque suave, casi sin swing
- La pala "acompaña" la pelota en vez de golpearla
- Trayectoria baja, justo por encima de la red
- Efecto cortado leve para que la pelota no bote alto

### Direccion:
- Hacia los pies del jugador en la red
- Ideal: al centro entre los dos oponentes (genera confusion)
- O hacia el jugador que esta mas atras

### Follow-through:
- Minimo, la pala casi se detiene
- Prepararse para la respuesta (volea baja del oponente)`,

  'bajada-de-pared': `
## BIOMECANICA CORRECTA DE LA BAJADA DE PARED

### Lectura del Rebote:
- Anticipar la trayectoria de la pelota al rebotar en la pared
- Posicionarse dejando espacio entre el cuerpo y la pared
- Jamas pegarse a la pared — necesitas espacio para swingear

### Posicionamiento:
- Lateral a la pared, hombro apuntando a la red
- Rodillas flexionadas para golpes bajos
- Pala preparada antes de que la pelota llegue

### Contacto:
- Esperar a que la pelota baje del rebote
- Impacto a la altura de la cintura o mas bajo
- Direccion: globo profundo o golpe bajo cruzado
- NO intentar golpes agresivos desde posicion defensiva

### Errores Comunes:
- Pegarse demasiado a la pared (no hay espacio para golpear)
- No esperar a que la pelota baje
- Intentar devolver la pelota antes de que rebote en la pared
- No girar los hombros para preparar el golpe`,

  remate: `
## BIOMECANICA CORRECTA DEL REMATE DE PADEL

### Posicionamiento:
- Moverse debajo de la pelota con pasos laterales
- Brazo no dominante apunta a la pelota
- Posicion lateral, pala alta detras de la cabeza

### Preparacion:
- Similar al saque de tenis: pala atras detras de la cabeza
- Codo alto, muneca relajada
- Rodillas flexionadas para impulso vertical

### Tipos de Remate:
- **Por 3**: remate potente que sale por la pared lateral (cristal) — busca winner
- **Por 4**: remate que sale por encima del cristal trasero — busca winner definitivo
- **Remate de control**: potencia media, mantener posicion en la red

### Punto de Contacto:
- Brazo completamente extendido arriba
- Contacto en el punto mas alto
- Pronacion para generar potencia y efecto

### Follow-through:
- Natural hacia abajo
- Mantener posicion de red
- Prepararse para la devolucion si la pelota vuelve del cristal`,
}

const PADEL_VARIANTS: Record<string, Record<string, string>> = {
  bandeja: {
    'bandeja-plana': `
VARIANTE: BANDEJA PLANA
- Impacto mas directo, menos efecto cortado
- Mayor velocidad de pelota
- Util cuando la pelota viene baja y rapida
- Menos margen de seguridad`,

    'bandeja-cortada': `
VARIANTE: BANDEJA CORTADA
- Efecto slice pronunciado
- La pelota se mantiene baja despues del bote
- Mayor control y seguridad
- Ideal para mantener posicion en la red`,
  },
  vibora: {
    'vibora-cruzada': `
VARIANTE: VIBORA CRUZADA
- Dirigida hacia el cristal lateral del lado opuesto
- El efecto lateral hace que la pelota se abra al rebotar
- Mas angulo disponible
- Dificil de defender`,

    'vibora-paralela': `
VARIANTE: VIBORA PARALELA
- Dirigida por la linea lateral
- El efecto lateral lleva la pelota hacia el cristal
- Mas sorpresiva
- Requiere mejor timing`,
  },
  saque: {
    'saque-cortado': `
VARIANTE: SAQUE CORTADO
- Efecto slice que abre la pelota hacia el cristal lateral
- La pelota se pega al cristal despues del bote
- Dificulta la devolucion agresiva
- Ideal para primer saque`,

    'saque-plano': `
VARIANTE: SAQUE PLANO
- Sin efecto, trayectoria directa
- Mayor velocidad
- Menos margen de error
- Efectivo contra jugadores lentos en reaccion`,

    'saque-liftado': `
VARIANTE: SAQUE CON EFECTO LIFTADO
- Efecto de arriba hacia abajo
- La pelota bota alto tras el cristal
- Dificulta la bajada de pared
- Mas margen sobre la red`,
  },
  globo: {
    'globo-topspin': `
VARIANTE: GLOBO CON TOPSPIN
- Efecto liftado que hace caer la pelota rapido
- Mayor profundidad y control
- Dificil de responder con bandeja
- Ideal para salir de situaciones defensivas`,

    'globo-defensivo': `
VARIANTE: GLOBO DEFENSIVO
- Muy alto para ganar maximo tiempo
- Profundo hacia el cristal del fondo
- Permite reposicionarse y avanzar a la red
- Prioridad: sobrevivir y cambiar la dinamica del punto`,
  },
  remate: {
    'remate-por-3': `
VARIANTE: REMATE POR 3 (LATERAL)
- Potencia media-alta dirigida hacia el cristal lateral
- La pelota sale por encima de la pared lateral
- Busca winner directo
- Requiere precision en la direccion`,

    'remate-por-4': `
VARIANTE: REMATE POR 4 (FONDO)
- Potencia maxima dirigida hacia el cristal del fondo
- La pelota sale por encima del cristal trasero
- Winner definitivo si se ejecuta bien
- Requiere condiciones especificas (pelota alta y centrada)`,

    'remate-controlado': `
VARIANTE: REMATE DE CONTROL
- Potencia moderada, busca profundidad y posicion
- Mantener la presion sin arriesgar
- Rebote en el cristal del fondo que dificulte la devolucion
- Mejor opcion cuando no hay condiciones para remate agresivo`,
  },
}

export const buildPadelPrompt: PromptBuilder = (
  techniqueSlug: string,
  variantSlug: string | null,
  correctForm: unknown,
  commonErrors: unknown,
  ragContext?: string
): string => {
  const technique = PADEL_TECHNIQUES[techniqueSlug] || ''
  const variant = variantSlug
    ? PADEL_VARIANTS[techniqueSlug]?.[variantSlug] || ''
    : ''

  const additionalContext = correctForm
    ? `\n\n### Contexto Adicional de la Tecnica:\n${JSON.stringify(correctForm, null, 2)}`
    : ''

  const errorsContext = commonErrors
    ? `\n\n### Errores Comunes a Buscar:\n${JSON.stringify(commonErrors, null, 2)}`
    : ''

  return `${PADEL_BASE_PROMPT}

${technique}
${variant}
${additionalContext}
${errorsContext}
${ragContext || ''}
${JSON_OUTPUT_SCHEMA}`
}
