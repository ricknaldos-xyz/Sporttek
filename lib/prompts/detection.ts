export function buildDetectionPrompt(
  sportSlug: string,
  techniques: Array<{
    slug: string
    name: string
    description: string | null
    variants: Array<{ slug: string; name: string }>
  }>
): string {
  const sportName = sportSlug === 'tennis' ? 'tenis' : sportSlug

  // For tennis, add visual cues to help distinguish techniques
  const tennisVisualCues: Record<string, string> = {
    serve: 'SAQUE: Jugador lanza la pelota al aire con una mano, golpea desde arriba de la cabeza. Posicion inicial estatica, sin pelota entrante.',
    forehand: 'DERECHA: Raqueta del MISMO LADO que la mano dominante. Para diestro: raqueta lado DERECHO, pecho hacia la red.',
    backhand: 'REVES: Raqueta del LADO OPUESTO a la mano dominante. Para diestro: raqueta lado IZQUIERDO, espalda/hombro hacia la red. UNA MANO: brazo extendido solo. DOS MANOS: ambas manos en raqueta.',
    volley: 'VOLEA: Golpe en la RED, SIN que la pelota bote. Movimiento corto tipo "punch". Jugador cerca de la red.',
    return: 'DEVOLUCION: Respuesta al saque del oponente. Similar a derecha/reves pero desde la linea de fondo recibiendo un saque.',
    smash: 'REMATE/SMASH: Golpe aereo sobre la cabeza, similar al saque pero respondiendo a un globo. La pelota viene alta del oponente.',
    dropshot: 'DEJADA: Golpe suave que apenas pasa la red. Movimiento corto con mucho corte.',
    lob: 'GLOBO: Golpe alto que pasa por encima del oponente en la red.',
    approach: 'APPROACH: Golpe mientras el jugador avanza hacia la red.',
    halfvolley: 'MEDIA VOLEA: Golpe justo despues del bote, casi al ras del suelo.',
    passing: 'PASSING SHOT: Golpe que pasa al lado del oponente que esta en la red.',
    footwork: 'FOOTWORK: Movimiento de pies sin golpear la pelota.',
  }

  const techniquesList = techniques
    .map((t) => {
      const visualCue = tennisVisualCues[t.slug] || ''
      const variantList =
        t.variants.length > 0
          ? `\n    Variantes: ${t.variants.map((v) => `${v.slug} (${v.name})`).join(', ')}`
          : ''
      return `  - ${t.slug} (${t.name}): ${visualCue || t.description || 'Sin descripcion'}${variantList}`
    })
    .join('\n')

  return `Eres un clasificador experto de tecnicas de ${sportName}.

ANTES DE RESPONDER, analiza el video siguiendo estos pasos EN ORDEN ESTRICTO:

PASO 0: POSICION DE LA CAMARA
- Determina si la camara esta DELANTE (se ve el pecho), DETRAS (se ve la espalda), o de LADO del jugador
- CRITICO: Si la camara esta DETRAS del jugador, la imagen esta INVERTIDA horizontalmente respecto a la perspectiva del jugador (izquierda en imagen = derecha del jugador)
- Si la camara esta de LADO, identifica de que lado (derecho o izquierdo del jugador)

PASO 1: MANO DOMINANTE
- Identifica que mano sostiene la raqueta como mano PRINCIPAL (la mas cercana al final del mango)
- La mayoria de jugadores son diestros (mano derecha dominante)
- Si hay dos manos en la raqueta, la mano dominante es la que esta mas abajo en el mango (mas lejos de la cabeza de la raqueta)

PASO 2: CUENTA LAS MANOS EN LA RAQUETA (HACER ESTO ANTES DE CLASIFICAR)
- Observa el momento del swing/golpe: cuantas manos tiene el jugador en la raqueta?
- UNA mano = solo la mano dominante sostiene la raqueta
- DOS manos = ambas manos en el mango de la raqueta durante el golpe
- NOTA: Dos manos en la raqueta NO significa automaticamente que es reves. Los jugadores pueden usar dos manos tanto en derecha como en reves (aunque es raro en derecha)

PASO 3: CLASIFICA LA TECNICA usando LADO DEL CUERPO + MANOS
- Observa de QUE LADO DEL CUERPO DEL JUGADOR se ejecuta el golpe (usa la perspectiva del jugador, NO de la camara)
- REGLA PRINCIPAL: El LADO del cuerpo donde se golpea determina si es derecha o reves:
  * Golpe del MISMO LADO que la mano dominante → DERECHA (forehand)
  * Golpe del LADO OPUESTO a la mano dominante → REVES (backhand)
- REGLA SECUNDARIA: El numero de manos determina la VARIANTE del reves:
  * Reves + una mano = one-handed-backhand
  * Reves + dos manos = two-handed-backhand
- REGLA DE SEGURIDAD: Dos manos en la raqueta + golpe del lado DOMINANTE = DERECHA (forehand). NO confundir con reves a dos manos.

CLAVES BIOMECANICAS PARA VERIFICAR TU CLASIFICACION:
- DERECHA (forehand):
  * La raqueta se prepara DETRAS del cuerpo por el lado de la mano dominante
  * El follow-through va desde el lado dominante CRUZANDO hacia el lado opuesto
  * El pecho del jugador se orienta hacia la red durante/despues del golpe
  * El brazo dominante se extiende naturalmente sin cruzar el cuerpo
- REVES (backhand):
  * La raqueta CRUZA el cuerpo durante la preparacion hacia el lado NO dominante
  * El follow-through va desde el lado no-dominante CRUZANDO hacia el lado dominante
  * La espalda o el hombro del brazo dominante apunta hacia la red durante la preparacion
  * El dorso de la mano dominante mira hacia la red al momento del impacto
- REVES A DOS MANOS especificamente:
  * La mano NO dominante esta mas ARRIBA en el mango (mas cerca de la cabeza de la raqueta)
  * Ambos brazos estan flexionados durante el swing
  * El swing se inicia desde el lado NO dominante del cuerpo
  * El jugador tiene una rotacion de hombros mas compacta que el reves a una mano

OTRAS TECNICAS:
- SAQUE (serve): El jugador LANZA la pelota al aire y golpea desde ARRIBA de la cabeza. Posicion inicial estatica.
- VOLEA (volley): Golpe en la RED, la pelota NO BOTA. Movimiento corto tipo "punch".
- REMATE (smash): Golpe sobre la cabeza respondiendo a un globo alto.

TECNICAS DISPONIBLES:
${techniquesList}

Responde EXCLUSIVAMENTE en formato JSON valido:

\`\`\`json
{
  "technique": "<slug de la tecnica>",
  "variant": "<slug de variante o null>",
  "confidence": <numero entre 0.0 y 1.0>,
  "reasoning": "PASO 0: Camara desde [delante/detras/lado]. PASO 1: Jugador [diestro/zurdo], mano [derecha/izquierda] principal en raqueta. PASO 2: [1/2] mano(s) en raqueta durante el golpe. PASO 3: Golpe ejecutado del lado [dominante/opuesto] del cuerpo, por lo tanto es [derecha/reves]. [Verificacion biomecanica].",
  "multipleDetected": false,
  "alternatives": []
}
\`\`\`

Si detectas MULTIPLES tecnicas diferentes en el video:
\`\`\`json
{
  "technique": "<slug de la tecnica PRINCIPAL>",
  "variant": "<slug o null>",
  "confidence": <0.0-1.0>,
  "reasoning": "<explicacion con los 4 pasos>",
  "multipleDetected": true,
  "alternatives": [
    { "technique": "<slug>", "variant": "<slug o null>", "confidence": <0.0-1.0> }
  ]
}
\`\`\`

REGLAS OBLIGATORIAS:
1. Responde SOLO con el JSON, sin texto adicional
2. Sigue los 4 PASOS de analisis (0,1,2,3) EN ORDEN antes de decidir
3. En "reasoning" DEBES documentar cada paso explicitamente
4. El LADO del cuerpo donde se golpea es el factor PRINCIPAL para distinguir derecha vs reves
5. El NUMERO de manos solo determina la variante del reves, NO si es derecha o reves
6. Si la camara esta detras del jugador y el golpe es ambiguo, baja la confianza y agrega la alternativa en "alternatives"
7. Si no estas seguro (confidence < 0.6), explicalo en reasoning`
}
