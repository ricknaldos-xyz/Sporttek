import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Tennis sport
  const tennis = await prisma.sport.upsert({
    where: { slug: 'tennis' },
    update: {},
    create: {
      slug: 'tennis',
      name: 'Tenis',
      description: 'Deporte de raqueta que se juega individualmente o en parejas',
      icon: 'tennis',
      isActive: true,
      order: 1,
    },
  })

  console.log('Created sport:', tennis.name)

  // Tennis techniques
  const techniques = [
    {
      slug: 'serve',
      name: 'Saque',
      description: 'Golpe inicial que pone la pelota en juego',
      difficulty: 4,
      correctForm: {
        preparation: 'Pies separados al ancho de hombros, peso equilibrado',
        grip: 'Agarre Continental (martillo)',
        toss: 'Brazo extendido, pelota lanzada ligeramente adelante y a la derecha',
        backswing: 'Codo alto, raqueta cae detras de la espalda',
        contact: 'Brazo completamente extendido, contacto frente al cuerpo',
        followThrough: 'Raqueta cruza hacia el lado opuesto del cuerpo',
      },
      commonErrors: [
        'Lanzamiento de pelota inconsistente',
        'Codo caido durante el backswing',
        'Contacto demasiado bajo',
        'Falta de pronacion',
        'No usar las piernas para impulso',
      ],
      keyPoints: [
        'Lanzamiento consistente',
        'Rotacion de caderas antes que hombros',
        'Codo alto en el backswing',
        'Contacto con brazo extendido',
        'Pronacion en el impacto',
      ],
      variants: [
        {
          slug: 'flat-serve',
          name: 'Saque Plano',
          description: 'Saque de maxima velocidad con trayectoria recta',
          correctForm: {
            toss: 'Directamente arriba, ligeramente adelante',
            contact: 'Impacto en el centro de la pelota',
            trajectory: 'Trayectoria recta hacia el objetivo',
          },
          keyDifferences: [
            'Lanzamiento mas adelante',
            'Impacto directo en el centro',
            'Maxima velocidad, menos spin',
          ],
        },
        {
          slug: 'kick-serve',
          name: 'Saque con Kick',
          description: 'Saque con efecto que produce un bote alto',
          correctForm: {
            toss: 'Ligeramente detras de la cabeza',
            contact: 'Cepillado de abajo hacia arriba',
            trajectory: 'Mayor arco sobre la red',
          },
          keyDifferences: [
            'Lanzamiento mas atras',
            'Movimiento de cepillado ascendente',
            'Bote alto hacia el lado contrario',
          ],
        },
        {
          slug: 'slice-serve',
          name: 'Saque Cortado',
          description: 'Saque con efecto lateral que se abre',
          correctForm: {
            toss: 'Ligeramente a la derecha',
            contact: 'Cepillado lateral de izquierda a derecha',
            trajectory: 'Curva hacia afuera',
          },
          keyDifferences: [
            'Lanzamiento mas a la derecha',
            'Movimiento de corte lateral',
            'Bote bajo que se abre',
          ],
        },
      ],
    },
    {
      slug: 'forehand',
      name: 'Derecha',
      description: 'Golpe fundamental ejecutado del lado dominante',
      difficulty: 2,
      correctForm: {
        stance: 'Posicion semi-abierta o abierta',
        grip: 'Eastern o Semi-Western',
        backswing: 'Unidad de giro con hombros',
        contact: 'Adelante del cuerpo, altura de cintura',
        followThrough: 'Hacia el hombro opuesto',
      },
      commonErrors: [
        'Golpear muy tarde',
        'No girar los hombros',
        'Muñeca suelta en el impacto',
        'No transferir el peso',
      ],
      keyPoints: [
        'Preparacion temprana',
        'Unidad de giro',
        'Punto de contacto adelante',
        'Follow-through completo',
      ],
      variants: [
        {
          slug: 'topspin-forehand',
          name: 'Derecha con Topspin',
          description: 'Derecha con efecto liftado',
          correctForm: {
            swing: 'Movimiento de abajo hacia arriba',
            contact: 'Cepillado ascendente',
          },
          keyDifferences: ['Swing mas vertical', 'Mayor margen sobre la red'],
        },
        {
          slug: 'flat-forehand',
          name: 'Derecha Plana',
          description: 'Derecha con poco efecto para maxima velocidad',
          correctForm: {
            swing: 'Movimiento mas horizontal',
            contact: 'Impacto directo',
          },
          keyDifferences: ['Swing mas horizontal', 'Mayor velocidad'],
        },
      ],
    },
    {
      slug: 'backhand',
      name: 'Reves',
      description: 'Golpe ejecutado del lado no dominante',
      difficulty: 3,
      correctForm: {
        stance: 'Posicion cerrada o semi-abierta',
        grip: 'Eastern de reves (una mano) o Continental + Eastern (dos manos)',
        backswing: 'Giro de hombros completo',
        contact: 'Adelante del cuerpo',
        followThrough: 'Extension hacia el objetivo',
      },
      commonErrors: [
        'Preparacion tardia',
        'No girar suficiente los hombros',
        'Codo volador',
        'Contacto muy cerca del cuerpo',
      ],
      keyPoints: [
        'Giro de hombros completo',
        'Punto de contacto adelante',
        'Brazo/brazos extendidos',
      ],
      variants: [
        {
          slug: 'one-handed-backhand',
          name: 'Reves a Una Mano',
          description: 'Reves clasico ejecutado con una sola mano',
          correctForm: {
            grip: 'Eastern de reves',
            nonDominantHand: 'En la garganta de la raqueta durante preparacion',
          },
          keyDifferences: ['Mayor alcance', 'Requiere mas fuerza de muñeca'],
        },
        {
          slug: 'two-handed-backhand',
          name: 'Reves a Dos Manos',
          description: 'Reves moderno con ambas manos en la raqueta',
          correctForm: {
            grip: 'Continental (dominante) + Eastern (no dominante)',
            contact: 'Ambas manos trabajan juntas',
          },
          keyDifferences: ['Mayor control', 'Mas potencia de rotacion'],
        },
      ],
    },
    {
      slug: 'volley',
      name: 'Volea',
      description: 'Golpe en el aire antes de que la pelota bote',
      difficulty: 3,
      correctForm: {
        stance: 'Posicion lista, rodillas flexionadas',
        grip: 'Continental',
        swing: 'Movimiento corto, punch',
        contact: 'Adelante del cuerpo, raqueta firme',
      },
      commonErrors: [
        'Swing muy largo',
        'Muñeca floja',
        'No moverse hacia la pelota',
        'Contacto muy bajo',
      ],
      keyPoints: [
        'Grip Continental',
        'Movimiento de punch corto',
        'Raqueta firme en el impacto',
        'Moverse hacia adelante',
      ],
      variants: [
        {
          slug: 'forehand-volley',
          name: 'Volea de Derecha',
          description: 'Volea ejecutada del lado dominante',
          correctForm: {},
          keyDifferences: [],
        },
        {
          slug: 'backhand-volley',
          name: 'Volea de Reves',
          description: 'Volea ejecutada del lado no dominante',
          correctForm: {},
          keyDifferences: [],
        },
      ],
    },
    {
      slug: 'return',
      name: 'Resto de Saque',
      description: 'Devolucion del saque del oponente, requiere reaccion rapida y backswing corto',
      difficulty: 3,
      correctForm: {
        readyPosition: 'Posicion baja, peso en puntas de los pies, raqueta al frente',
        splitStep: 'Salto pequeno justo cuando el oponente impacta la pelota',
        backswing: 'Backswing reducido (50% del groundstroke normal)',
        contact: 'Adelante del cuerpo, usar el ritmo del saque entrante',
        recovery: 'Recuperacion inmediata al centro de la linea de fondo',
      },
      commonErrors: [
        'Preparacion tardia por no leer el lanzamiento del sacador',
        'Backswing demasiado largo para primer saque rapido',
        'No hacer split step antes del golpe',
        'Posicion demasiado erguida, sin flexion de rodillas',
        'No ajustar la posicion segun el tipo de saque',
      ],
      keyPoints: [
        'Split step sincronizado con el impacto del sacador',
        'Backswing compacto y rapido',
        'Usar el ritmo del saque a tu favor',
        'Leer la direccion del saque temprano',
        'Recuperacion explosiva al centro',
      ],
      variants: [
        {
          slug: 'first-serve-return',
          name: 'Resto de Primer Saque',
          description: 'Devolucion defensiva contra saques rapidos',
          correctForm: {
            stance: 'Mas atras de la linea de fondo',
            backswing: 'Minimo, casi bloqueo',
            objective: 'Devolver profundo y seguro',
          },
          keyDifferences: [
            'Posicion mas retrasada',
            'Prioridad: devolver en juego',
            'Backswing casi inexistente',
          ],
        },
        {
          slug: 'second-serve-return',
          name: 'Resto de Segundo Saque',
          description: 'Devolucion agresiva contra segundos saques',
          correctForm: {
            stance: 'Mas adelante, dentro de la cancha',
            backswing: 'Mas completo, similar a groundstroke',
            objective: 'Golpe agresivo para tomar control',
          },
          keyDifferences: [
            'Posicion adelantada para atacar',
            'Swing mas completo y agresivo',
            'Buscar winners o forzar errores',
          ],
        },
        {
          slug: 'block-return',
          name: 'Resto Bloqueado',
          description: 'Devolucion con minimo movimiento usando el ritmo del saque',
          correctForm: {
            swing: 'Sin backswing, solo raqueta firme al frente',
            contact: 'Bloqueo solido con cara abierta',
          },
          keyDifferences: [
            'Cero backswing',
            'Raqueta como pared',
            'Ideal contra saques muy rapidos',
          ],
        },
      ],
    },
    {
      slug: 'approach',
      name: 'Golpe de Aproximacion',
      description: 'Golpe de transicion para subir a la red, con trayectoria baja y profunda',
      difficulty: 3,
      correctForm: {
        positioning: 'Pelota corta detectada temprano, movimiento hacia adelante',
        backswing: 'Compacto, preparacion mientras se avanza',
        contact: 'Adelante del cuerpo con peso transferido hacia la red',
        trajectory: 'Trayectoria baja y profunda, preferiblemente al reves del oponente',
        transition: 'Continuar movimiento hacia la red despues del golpe',
      },
      commonErrors: [
        'Detenerse para golpear en vez de golpear en movimiento',
        'Trayectoria alta que permite passing facil',
        'No continuar hacia la red despues del golpe',
        'Golpe sin direccion, al centro de la cancha',
        'Preparacion tardia al no leer la pelota corta',
      ],
      keyPoints: [
        'Golpear en movimiento hacia adelante',
        'Trayectoria baja y profunda',
        'Dirigir al lado debil del oponente',
        'Split step al llegar a la red',
        'Transicion fluida del golpe a la posicion de volea',
      ],
      variants: [
        {
          slug: 'forehand-approach',
          name: 'Aproximacion de Derecha',
          description: 'Golpe de aproximacion con la derecha',
          correctForm: {
            grip: 'Semi-Western o Eastern',
            swing: 'Movimiento ascendente con topspin controlado',
          },
          keyDifferences: ['Mas opciones de angulo', 'Puede ir con topspin o plana'],
        },
        {
          slug: 'backhand-approach',
          name: 'Aproximacion de Reves',
          description: 'Golpe de aproximacion con el reves',
          correctForm: {
            grip: 'Continental o Eastern de reves',
            swing: 'Swing compacto y dirigido',
          },
          keyDifferences: ['Requiere mas preparacion', 'Generalmente cruzada o por el centro'],
        },
        {
          slug: 'slice-approach',
          name: 'Aproximacion Cortada',
          description: 'Golpe de aproximacion con efecto cortado que mantiene la pelota baja',
          correctForm: {
            swing: 'De arriba hacia abajo con cara abierta',
            trajectory: 'Baja y deslizante',
          },
          keyDifferences: [
            'Pelota se mantiene muy baja',
            'Dificil de atacar con passing',
            'Mas tiempo para llegar a la red',
          ],
        },
      ],
    },
    {
      slug: 'smash',
      name: 'Remate',
      description: 'Golpe aereo agresivo similar al saque, ejecutado cerca de la red',
      difficulty: 4,
      correctForm: {
        positioning: 'Moverse debajo de la pelota con pasos laterales/cruzados',
        preparation: 'Brazo no dominante apunta a la pelota, raqueta atras como en saque',
        contact: 'Brazo completamente extendido, contacto en el punto mas alto',
        followThrough: 'Seguimiento natural hacia abajo y al frente',
        footwork: 'Peso transferido hacia adelante en el impacto',
      },
      commonErrors: [
        'No moverse debajo de la pelota a tiempo',
        'Dejar caer el brazo de guia demasiado pronto',
        'Contacto con brazo no extendido completamente',
        'Intentar golpear demasiado fuerte sacrificando control',
        'No ajustar la posicion con pasos pequenos',
        'Girar de espaldas a la red en vez de hacer pasos laterales',
      ],
      keyPoints: [
        'Brazo libre apunta a la pelota como guia',
        'Moverse con pasos laterales, nunca de espaldas',
        'Contacto en el punto mas alto posible',
        'Pronacion similar al saque',
        'Dirigir al espacio abierto, no solo fuerza',
      ],
      variants: [
        {
          slug: 'standard-smash',
          name: 'Remate Estandar',
          description: 'Remate clasico con los pies en el suelo',
          correctForm: {
            base: 'Pies plantados, peso equilibrado',
            contact: 'Punto mas alto con brazo extendido',
          },
          keyDifferences: ['Mayor control', 'Base solida en el suelo'],
        },
        {
          slug: 'jump-smash',
          name: 'Remate con Salto',
          description: 'Remate con impulso vertical para mayor alcance',
          correctForm: {
            jump: 'Impulso vertical con ambas piernas',
            timing: 'Contacto en el punto mas alto del salto',
          },
          keyDifferences: ['Mayor alcance', 'Mas potencia', 'Requiere mejor timing'],
        },
        {
          slug: 'backhand-smash',
          name: 'Remate de Reves',
          description: 'Remate ejecutado del lado no dominante',
          correctForm: {
            rotation: 'Giro de hombros rapido',
            contact: 'Sobre el hombro no dominante',
          },
          keyDifferences: ['Muy dificil', 'Usado como emergencia', 'Menos potencia'],
        },
      ],
    },
    {
      slug: 'dropshot',
      name: 'Dejada',
      description: 'Golpe suave con backspin que cae cerca de la red, requiere toque fino',
      difficulty: 4,
      correctForm: {
        disguise: 'Preparacion identica al groundstroke normal',
        grip: 'Continental para mejor control del slice',
        contact: 'Cara de raqueta abierta, toque suave debajo de la pelota',
        followThrough: 'Minimo, la raqueta "acaricia" la pelota',
        timing: 'Ejecutar cuando el oponente esta atras de la linea de fondo',
      },
      commonErrors: [
        'Preparacion diferente que delata la intencion',
        'Golpear con demasiada fuerza, la pelota pasa la linea de servicio',
        'No abrir suficiente la cara de la raqueta',
        'Intentar la dejada desde una posicion defensiva',
        'Follow-through excesivo que elimina el efecto de backspin',
      ],
      keyPoints: [
        'Disfrazar la preparacion como groundstroke',
        'Cara de raqueta abierta en el contacto',
        'Toque suave, dejar que la raqueta absorba',
        'Usar cuando el oponente esta lejos de la red',
        'Agregar backspin para que la pelota no avance tras botar',
      ],
      variants: [
        {
          slug: 'forehand-dropshot',
          name: 'Dejada de Derecha',
          description: 'Dejada ejecutada del lado dominante',
          correctForm: {
            grip: 'Continental o Eastern',
            disguise: 'Preparacion de derecha normal',
          },
          keyDifferences: ['Mas natural de disfrazar', 'Mayor variedad de angulos'],
        },
        {
          slug: 'backhand-dropshot',
          name: 'Dejada de Reves',
          description: 'Dejada ejecutada del lado no dominante, ideal con slice',
          correctForm: {
            grip: 'Continental',
            disguise: 'Preparacion de slice de reves',
          },
          keyDifferences: ['Se integra bien con slice', 'Mas dificil de leer para el oponente'],
        },
      ],
    },
    {
      slug: 'lob',
      name: 'Globo',
      description: 'Golpe alto por encima del oponente en la red, defensivo u ofensivo',
      difficulty: 3,
      correctForm: {
        preparation: 'Preparacion similar al groundstroke para disfrazar',
        contact: 'Debajo de la pelota con cara abierta',
        trajectory: 'Arco alto que pase sobre el alcance del oponente',
        depth: 'Caer cerca de la linea de fondo para dificultar el remate',
        followThrough: 'Hacia arriba y adelante siguiendo la trayectoria',
      },
      commonErrors: [
        'Globo demasiado corto que permite remate facil',
        'No abrir suficiente la cara de la raqueta',
        'Preparacion diferente que delata la intencion',
        'Golpe demasiado fuerte que sale largo',
        'No considerar el viento o las condiciones',
      ],
      keyPoints: [
        'Profundidad es clave — cerca de la linea de fondo',
        'Disfrazar la preparacion',
        'Abrir la cara de la raqueta para elevar',
        'Usar cuando el oponente esta pegado a la red',
        'Altura suficiente para que no alcance con smash',
      ],
      variants: [
        {
          slug: 'topspin-lob',
          name: 'Globo con Topspin',
          description: 'Globo ofensivo con efecto liftado que cae rapido',
          correctForm: {
            swing: 'De abajo hacia arriba con cepillado',
            spin: 'Topspin pronunciado para caida rapida',
          },
          keyDifferences: ['Cae mas rapido en la cancha', 'Mas agresivo', 'Requiere mas tecnica'],
        },
        {
          slug: 'defensive-lob',
          name: 'Globo Defensivo',
          description: 'Globo alto para ganar tiempo y reposicionarse',
          correctForm: {
            height: 'Muy alto para maximo tiempo',
            depth: 'Profundo para empujar al oponente atras',
          },
          keyDifferences: ['Prioridad: ganar tiempo', 'Muy alto', 'Desde posicion de emergencia'],
        },
        {
          slug: 'offensive-lob',
          name: 'Globo Ofensivo',
          description: 'Globo como arma para ganar el punto directamente',
          correctForm: {
            disguise: 'Identico a un passing shot hasta el ultimo momento',
            placement: 'Justo sobre el alcance del oponente',
          },
          keyDifferences: ['Disfrazado como passing', 'Menos alto, mas rapido', 'Busca winner'],
        },
      ],
    },
    {
      slug: 'halfvolley',
      name: 'Media Volea',
      description: 'Golpe inmediatamente despues del bote, a ras del suelo, requiere timing excepcional',
      difficulty: 5,
      correctForm: {
        positioning: 'Rodillas muy flexionadas, centro de gravedad bajo',
        grip: 'Continental para versatilidad',
        contact: 'Justo despues del bote, raqueta casi toca el suelo',
        racketFace: 'Cara ligeramente abierta para elevar sobre la red',
        followThrough: 'Corto y controlado hacia el objetivo',
      },
      commonErrors: [
        'No bajar suficiente las rodillas',
        'Intentar hacer un swing completo en vez de bloquear',
        'Timing incorrecto — golpear en el bote o demasiado tarde',
        'Muñeca floja que no controla la direccion',
        'No mantener la cabeza de la raqueta firme',
      ],
      keyPoints: [
        'Rodillas muy flexionadas, bajar al nivel de la pelota',
        'Movimiento de bloqueo, no swing completo',
        'Timing preciso: justo despues del bote',
        'Cara de raqueta ligeramente abierta',
        'Mantener raqueta firme con grip Continental',
      ],
      variants: [
        {
          slug: 'forehand-halfvolley',
          name: 'Media Volea de Derecha',
          description: 'Media volea del lado dominante',
          correctForm: {
            grip: 'Continental o Eastern',
            stance: 'Paso adelante con pie contrario',
          },
          keyDifferences: ['Mas natural', 'Mejor control de angulo'],
        },
        {
          slug: 'backhand-halfvolley',
          name: 'Media Volea de Reves',
          description: 'Media volea del lado no dominante',
          correctForm: {
            grip: 'Continental',
            stance: 'Paso adelante con pie del lado dominante',
          },
          keyDifferences: ['Mas dificil', 'Requiere mas fuerza de muñeca'],
        },
      ],
    },
    {
      slug: 'passing',
      name: 'Passing Shot',
      description: 'Golpe que pasa al oponente en la red, requiere precision bajo presion',
      difficulty: 4,
      correctForm: {
        reading: 'Leer la posicion del oponente en la red',
        preparation: 'Preparacion rapida y compacta',
        contact: 'Firme y dirigido al espacio abierto',
        trajectory: 'Baja sobre la red para dificultar la volea',
        variety: 'Alternar entre paralelo y cruzado',
      },
      commonErrors: [
        'Intentar golpear demasiado fuerte bajo presion',
        'Siempre ir al mismo lado (predecible)',
        'Trayectoria alta que facilita la volea',
        'No leer la posicion del oponente antes de golpear',
        'Preparacion tardia por presion del acercamiento',
      ],
      keyPoints: [
        'Leer la posicion del oponente antes de decidir direccion',
        'Trayectoria baja sobre la red',
        'Precision sobre potencia',
        'Variar entre paralelo y cruzado',
        'Considerar el globo como alternativa',
      ],
      variants: [
        {
          slug: 'down-the-line-passing',
          name: 'Passing Paralelo',
          description: 'Passing shot por la linea lateral',
          correctForm: {
            direction: 'Paralelo a la linea lateral',
            timing: 'Golpear cuando el oponente se mueve al centro',
          },
          keyDifferences: ['Menor margen de error', 'Mas sorpresivo', 'Requiere mejor timing'],
        },
        {
          slug: 'crosscourt-passing',
          name: 'Passing Cruzado',
          description: 'Passing shot en diagonal',
          correctForm: {
            direction: 'Cruzado con angulo',
            margin: 'Mayor margen sobre la red (parte mas baja)',
          },
          keyDifferences: ['Mayor margen', 'Mas distancia de cancha', 'Mas seguro'],
        },
        {
          slug: 'topspin-passing',
          name: 'Passing con Topspin',
          description: 'Passing con efecto liftado que baja rapido a los pies del oponente',
          correctForm: {
            spin: 'Topspin pronunciado',
            target: 'A los pies del oponente en la red',
          },
          keyDifferences: ['Cae a los pies', 'Dificil de volear', 'Mayor margen sobre la red'],
        },
      ],
    },
    {
      slug: 'footwork',
      name: 'Trabajo de Pies',
      description: 'Patrones de movimiento fundamentales para posicionarse correctamente',
      difficulty: 2,
      correctForm: {
        readyPosition: 'Rodillas flexionadas, peso en puntas de los pies, pies al ancho de hombros',
        splitStep: 'Pequeño salto de preparacion antes de cada golpe del oponente',
        lateralMovement: 'Pasos laterales rapidos manteniendo el equilibrio',
        recovery: 'Vuelta explosiva al centro despues de cada golpe',
        balance: 'Centro de gravedad bajo y estable durante todo el movimiento',
      },
      commonErrors: [
        'No hacer split step antes de cada golpe',
        'Cruzar los pies durante movimiento lateral',
        'No recuperar al centro despues del golpe',
        'Peso en los talones en vez de las puntas',
        'Posicion demasiado erguida sin flexion de rodillas',
        'Pasos demasiado grandes que desestabilizan',
      ],
      keyPoints: [
        'Split step en cada golpe del oponente',
        'Pasos pequenos y rapidos para ajustes finales',
        'Siempre recuperar al centro',
        'Centro de gravedad bajo',
        'Pies activos, nunca quietos',
        'Primer paso explosivo en la direccion correcta',
      ],
      variants: [
        {
          slug: 'split-step',
          name: 'Split Step',
          description: 'Salto de preparacion que permite reaccionar en cualquier direccion',
          correctForm: {
            timing: 'Justo cuando el oponente hace contacto',
            landing: 'Pies al ancho de hombros, rodillas flexionadas',
          },
          keyDifferences: ['Base de todo movimiento', 'Timing es clave'],
        },
        {
          slug: 'recovery-step',
          name: 'Paso de Recuperacion',
          description: 'Movimiento de vuelta al centro despues de cada golpe',
          correctForm: {
            direction: 'Hacia el centro de la linea de fondo',
            speed: 'Explosivo, no caminar',
          },
          keyDifferences: ['Velocidad de recuperacion define el nivel', 'Siempre al centro'],
        },
        {
          slug: 'crossover-step',
          name: 'Paso Cruzado',
          description: 'Paso donde un pie cruza sobre el otro para cubrir distancia',
          correctForm: {
            technique: 'Pie trasero cruza sobre el pie delantero',
            usage: 'Para cubrir distancias largas lateralmente',
          },
          keyDifferences: ['Cubre mas distancia', 'Mas rapido que shuffle lateral'],
        },
        {
          slug: 'lateral-shuffle',
          name: 'Desplazamiento Lateral',
          description: 'Movimiento lateral sin cruzar los pies',
          correctForm: {
            technique: 'Pasos laterales rapidos sin cruzar',
            usage: 'Para ajustes cortos y movimientos cercanos',
          },
          keyDifferences: ['Mayor equilibrio', 'Para distancias cortas', 'Mejor control'],
        },
      ],
    },
  ]

  for (const tech of techniques) {
    const technique = await prisma.technique.upsert({
      where: {
        sportId_slug: {
          sportId: tennis.id,
          slug: tech.slug,
        },
      },
      update: {
        name: tech.name,
        description: tech.description,
        difficulty: tech.difficulty,
        correctForm: tech.correctForm,
        commonErrors: tech.commonErrors,
        keyPoints: tech.keyPoints,
      },
      create: {
        sportId: tennis.id,
        slug: tech.slug,
        name: tech.name,
        description: tech.description,
        difficulty: tech.difficulty,
        correctForm: tech.correctForm,
        commonErrors: tech.commonErrors,
        keyPoints: tech.keyPoints,
      },
    })

    console.log('Created technique:', technique.name)

    // Create variants
    for (const variant of tech.variants) {
      await prisma.variant.upsert({
        where: {
          techniqueId_slug: {
            techniqueId: technique.id,
            slug: variant.slug,
          },
        },
        update: {
          name: variant.name,
          description: variant.description,
          correctForm: variant.correctForm,
          keyDifferences: variant.keyDifferences,
        },
        create: {
          techniqueId: technique.id,
          slug: variant.slug,
          name: variant.name,
          description: variant.description,
          correctForm: variant.correctForm,
          keyDifferences: variant.keyDifferences,
        },
      })
    }
  }

  // Create exercise templates
  const exercises = [
    {
      slug: 'shadow-swing',
      name: 'Shadow Swing',
      description: 'Practica el movimiento sin pelota frente a un espejo',
      instructions:
        'Realiza el movimiento completo de la tecnica frente a un espejo. Enfocate en la forma correcta y repite lentamente hasta dominar el patron de movimiento.',
      category: 'drill',
      targetAreas: ['swing', 'posture', 'balance'],
      sportSlugs: ['tennis'],
      defaultSets: 3,
      defaultReps: 20,
    },
    {
      slug: 'ball-toss-practice',
      name: 'Practica de Lanzamiento',
      description: 'Mejora la consistencia del lanzamiento de pelota',
      instructions:
        'Con una canasta de pelotas, practica solo el lanzamiento sin golpear. La pelota debe caer consistentemente en el mismo punto. Usa un objetivo en el suelo como referencia.',
      category: 'drill',
      targetAreas: ['toss', 'timing'],
      sportSlugs: ['tennis'],
      defaultSets: 3,
      defaultReps: 30,
    },
    {
      slug: 'wall-practice',
      name: 'Practica contra la Pared',
      description: 'Mejora la consistencia y timing golpeando contra una pared',
      instructions:
        'Golpea contra una pared a una distancia de 3-4 metros. Enfocate en mantener la tecnica correcta incluso cuando la pelota regresa rapido.',
      category: 'drill',
      targetAreas: ['timing', 'contact', 'consistency'],
      sportSlugs: ['tennis'],
      defaultSets: 3,
      defaultDurationMins: 10,
    },
    {
      slug: 'resistance-band-rotation',
      name: 'Rotacion con Banda Elastica',
      description: 'Fortalece los musculos de rotacion del core',
      instructions:
        'Sujeta una banda elastica a la altura del pecho. Rota el torso manteniendo las caderas estables. Controla el movimiento en ambas direcciones.',
      category: 'strength',
      targetAreas: ['core', 'rotation'],
      sportSlugs: [],
      defaultSets: 3,
      defaultReps: 15,
    },
    {
      slug: 'shoulder-stretch',
      name: 'Estiramiento de Hombro',
      description: 'Mejora la flexibilidad del hombro para el saque',
      instructions:
        'Lleva el brazo cruzado por delante del pecho y sostenlo con el otro brazo. Manten 30 segundos cada lado.',
      category: 'flexibility',
      targetAreas: ['shoulder', 'flexibility'],
      sportSlugs: [],
      defaultSets: 2,
      defaultDurationMins: 1,
    },
    {
      slug: 'footwork-ladder',
      name: 'Escalera de Agilidad',
      description: 'Mejora la velocidad y coordinacion de pies',
      instructions:
        'Realiza diferentes patrones de pies a traves de una escalera de agilidad. Mantén los pies rapidos y ligeros.',
      category: 'footwork',
      targetAreas: ['footwork', 'agility', 'balance'],
      sportSlugs: [],
      defaultSets: 3,
      defaultReps: 5,
    },
    {
      slug: 'split-step-drill',
      name: 'Ejercicio de Split Step',
      description: 'Practica el split step para mejorar la reaccion',
      instructions:
        'Practica el pequeño salto de preparacion (split step) antes de cada golpe. Aterriza con las rodillas flexionadas listo para moverte en cualquier direccion.',
      category: 'drill',
      targetAreas: ['footwork', 'timing', 'balance'],
      sportSlugs: ['tennis'],
      defaultSets: 3,
      defaultReps: 20,
    },
    {
      slug: 'wrist-strengthening',
      name: 'Fortalecimiento de Muñeca',
      description: 'Ejercicios para fortalecer la muñeca',
      instructions:
        'Con una pesa ligera o la raqueta, realiza flexiones y extensiones de muñeca controladas. Tambien rotaciones.',
      category: 'strength',
      targetAreas: ['wrist', 'grip'],
      sportSlugs: ['tennis'],
      defaultSets: 3,
      defaultReps: 15,
    },
  ]

  for (const exercise of exercises) {
    await prisma.exerciseTemplate.upsert({
      where: { slug: exercise.slug },
      update: {
        name: exercise.name,
        description: exercise.description,
        instructions: exercise.instructions,
        category: exercise.category,
        targetAreas: exercise.targetAreas,
        sportSlugs: exercise.sportSlugs,
        defaultSets: exercise.defaultSets,
        defaultReps: exercise.defaultReps,
        defaultDurationMins: exercise.defaultDurationMins,
      },
      create: exercise,
    })
  }

  console.log('Created exercise templates')

  // Create placeholder sports for future
  const futureSports = [
    { slug: 'golf', name: 'Golf', icon: 'golf', order: 2 },
    { slug: 'basketball', name: 'Basketball', icon: 'basketball', order: 3 },
    { slug: 'soccer', name: 'Futbol', icon: 'soccer', order: 4 },
  ]

  for (const sport of futureSports) {
    await prisma.sport.upsert({
      where: { slug: sport.slug },
      update: {},
      create: {
        ...sport,
        isActive: false,
        description: 'Proximamente',
      },
    })
  }

  console.log('Created placeholder sports')
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
