import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding padel data...')

  // 1. Create or update padel sport
  const padel = await prisma.sport.upsert({
    where: { slug: 'padel' },
    update: {
      isActive: true,
      name: 'Padel',
      description: 'Analisis de tecnica de padel con IA',
      order: 1,
      configSchema: {
        fields: [
          {
            key: 'playStyle',
            type: 'select',
            label: 'Estilo de juego',
            options: ['Ofensivo', 'Defensivo', 'Equilibrado'],
          },
          {
            key: 'dominantHand',
            type: 'toggle',
            label: 'Mano dominante',
            options: [
              { value: 'right', label: 'Derecha' },
              { value: 'left', label: 'Izquierda' },
            ],
          },
          {
            key: 'position',
            type: 'toggle',
            label: 'Lado preferido',
            options: [
              { value: 'drive', label: 'Drive' },
              { value: 'reves', label: 'Reves' },
            ],
          },
        ],
      },
    },
    create: {
      slug: 'padel',
      name: 'Padel',
      icon: 'padel',
      description: 'Analisis de tecnica de padel con IA',
      isActive: true,
      order: 1,
      configSchema: {
        fields: [
          {
            key: 'playStyle',
            type: 'select',
            label: 'Estilo de juego',
            options: ['Ofensivo', 'Defensivo', 'Equilibrado'],
          },
          {
            key: 'dominantHand',
            type: 'toggle',
            label: 'Mano dominante',
            options: [
              { value: 'right', label: 'Derecha' },
              { value: 'left', label: 'Izquierda' },
            ],
          },
          {
            key: 'position',
            type: 'toggle',
            label: 'Lado preferido',
            options: [
              { value: 'drive', label: 'Drive' },
              { value: 'reves', label: 'Reves' },
            ],
          },
        ],
      },
    },
  })

  console.log('Created/updated padel sport:', padel.id)

  // 2. Also update tennis with configSchema
  await prisma.sport.update({
    where: { slug: 'tennis' },
    data: {
      configSchema: {
        fields: [
          {
            key: 'playStyle',
            type: 'select',
            label: 'Estilo de juego',
            options: [
              'Baseliner agresivo',
              'Baseliner defensivo',
              'Saque y red',
              'All-court',
              'Contraatacante',
            ],
          },
          {
            key: 'dominantHand',
            type: 'toggle',
            label: 'Mano dominante',
            options: [
              { value: 'right', label: 'Derecha' },
              { value: 'left', label: 'Izquierda' },
            ],
          },
          {
            key: 'backhandType',
            type: 'toggle',
            label: 'Tipo de reves',
            options: [
              { value: 'one-handed', label: '1 mano' },
              { value: 'two-handed', label: '2 manos' },
            ],
          },
        ],
      },
    },
  })

  console.log('Updated tennis configSchema')

  // 3. Padel techniques
  const techniques = [
    {
      slug: 'derecha',
      name: 'Derecha',
      description: 'Golpe fundamental desde el lado dominante',
      difficulty: 2,
      weight: 1.0,
      correctForm: {
        phases: ['Preparacion', 'Backswing', 'Contacto', 'Follow-through'],
        keyPoints: [
          'Posicion semi-abierta',
          'Swing compacto',
          'Muneca firme',
          'Recuperacion rapida',
        ],
      },
      commonErrors: [
        'Swing demasiado largo',
        'Contacto atrasado',
        'No girar hombros',
        'Pie mal posicionado',
      ],
      variants: [] as { slug: string; name: string; description: string }[],
    },
    {
      slug: 'reves',
      name: 'Reves',
      description: 'Golpe desde el lado no dominante',
      difficulty: 3,
      weight: 1.0,
      correctForm: {
        phases: ['Preparacion', 'Backswing', 'Contacto', 'Follow-through'],
        keyPoints: [
          'Giro de hombros completo',
          'Pala firme',
          'Control sobre potencia',
        ],
      },
      commonErrors: [
        'Falta de giro de hombros',
        'Muneca blanda',
        'Contacto muy cerca del cuerpo',
      ],
      variants: [],
    },
    {
      slug: 'bandeja',
      name: 'Bandeja',
      description: 'Golpe aereo de control para mantener posicion en la red',
      difficulty: 4,
      weight: 0.9,
      correctForm: {
        phases: ['Posicionamiento', 'Preparacion', 'Contacto', 'Follow-through'],
        keyPoints: [
          'Movimiento lateral bajo la pelota',
          'Cuerpo lateral',
          'Efecto cortado',
          'Mantener posicion red',
        ],
      },
      commonErrors: [
        'Golpear de frente',
        'No generar efecto cortado',
        'Contacto detras del cuerpo',
        'Perder posicion en la red',
      ],
      variants: [
        { slug: 'bandeja-plana', name: 'Bandeja Plana', description: 'Menos efecto, mas velocidad' },
        { slug: 'bandeja-cortada', name: 'Bandeja Cortada', description: 'Mayor slice, mas control' },
      ],
    },
    {
      slug: 'vibora',
      name: 'Vibora',
      description: 'Golpe aereo agresivo con efecto lateral',
      difficulty: 5,
      weight: 0.9,
      correctForm: {
        phases: ['Preparacion', 'Ejecucion', 'Contacto', 'Follow-through'],
        keyPoints: [
          'Efecto lateral (side-spin)',
          'Pronacion del antebrazo',
          'Mayor velocidad que bandeja',
          'Dirigir hacia cristal lateral',
        ],
      },
      commonErrors: [
        'No generar side-spin',
        'Falta de pronacion',
        'Golpear como remate',
        'Perder posicion',
      ],
      variants: [
        { slug: 'vibora-cruzada', name: 'Vibora Cruzada', description: 'Dirigida al cristal opuesto' },
        { slug: 'vibora-paralela', name: 'Vibora Paralela', description: 'Por la linea lateral' },
      ],
    },
    {
      slug: 'saque',
      name: 'Saque',
      description: 'Golpe que inicia el punto, debe ser bajo la cintura',
      difficulty: 2,
      weight: 0.8,
      correctForm: {
        phases: ['Posicion', 'Lanzamiento', 'Contacto', 'Follow-through'],
        keyPoints: [
          'Contacto bajo la cintura (regla)',
          'Agarre Continental',
          'Dirigir hacia cristal lateral',
          'Transicion a la red',
        ],
      },
      commonErrors: [
        'Contacto sobre la cintura (falta)',
        'No transicionar a la red',
        'Saque predecible',
        'Falta de efecto',
      ],
      variants: [
        { slug: 'saque-cortado', name: 'Saque Cortado', description: 'Con slice hacia el cristal' },
        { slug: 'saque-plano', name: 'Saque Plano', description: 'Directo, mayor velocidad' },
        { slug: 'saque-liftado', name: 'Saque Liftado', description: 'Con efecto para bote alto' },
      ],
    },
    {
      slug: 'volea',
      name: 'Volea',
      description: 'Golpe en la red antes del bote',
      difficulty: 3,
      weight: 0.8,
      correctForm: {
        phases: ['Posicion Lista', 'Movimiento', 'Contacto', 'Follow-through'],
        keyPoints: [
          'Agarre Continental',
          'Movimiento de punch corto',
          'Pala firme',
          'Dirigir a pies o reja',
        ],
      },
      commonErrors: [
        'Backswing demasiado grande',
        'Muneca blanda',
        'Contacto atrasado',
        'No recuperar posicion',
      ],
      variants: [],
    },
    {
      slug: 'globo',
      name: 'Globo',
      description: 'Golpe alto para sacar oponentes de la red',
      difficulty: 3,
      weight: 0.7,
      correctForm: {
        phases: ['Preparacion', 'Contacto', 'Trayectoria', 'Transicion'],
        keyPoints: [
          'Disfrazado como golpe normal',
          'Pase sobre oponentes',
          'Profundo hacia cristal fondo',
          'Avanzar a la red despues',
        ],
      },
      commonErrors: [
        'Globo corto (facil de rematar)',
        'No disfrazado',
        'No avanzar a la red despues',
        'Rebote al centro',
      ],
      variants: [
        { slug: 'globo-topspin', name: 'Globo con Topspin', description: 'Efecto liftado para profundidad' },
        { slug: 'globo-defensivo', name: 'Globo Defensivo', description: 'Alto para ganar tiempo' },
      ],
    },
    {
      slug: 'chiquita',
      name: 'Chiquita',
      description: 'Golpe suave a los pies de los oponentes en la red',
      difficulty: 4,
      weight: 0.7,
      correctForm: {
        phases: ['Preparacion', 'Contacto', 'Direccion', 'Follow-through'],
        keyPoints: [
          'Toque suave',
          'Trayectoria baja',
          'Disfrazado',
          'Al centro o pies del rival',
        ],
      },
      commonErrors: [
        'Pelota demasiado alta',
        'Telegrafiar el golpe',
        'Falta de control',
      ],
      variants: [],
    },
    {
      slug: 'bajada-de-pared',
      name: 'Bajada de Pared',
      description: 'Devolucion de la pelota despues de rebotar en la pared',
      difficulty: 4,
      weight: 0.8,
      correctForm: {
        phases: ['Lectura', 'Posicionamiento', 'Contacto', 'Direccion'],
        keyPoints: [
          'Espacio entre cuerpo y pared',
          'Esperar a que baje la pelota',
          'Girar hombros',
          'Globo o cruzado bajo',
        ],
      },
      commonErrors: [
        'Pegarse a la pared',
        'Golpear antes del rebote',
        'No esperar a que baje',
        'Golpe agresivo desde defensa',
      ],
      variants: [],
    },
    {
      slug: 'remate',
      name: 'Remate',
      description: 'Golpe aereo de potencia para buscar winner',
      difficulty: 5,
      weight: 0.7,
      correctForm: {
        phases: ['Posicionamiento', 'Preparacion', 'Contacto', 'Follow-through'],
        keyPoints: [
          'Debajo de la pelota',
          'Brazo extendido arriba',
          'Pronacion',
          'Elegir tipo (por 3 o por 4)',
        ],
      },
      commonErrors: [
        'Mal posicionamiento',
        'Falta de pronacion',
        'Golpear sin direccion',
        'No mantener posicion red',
      ],
      variants: [
        { slug: 'remate-por-3', name: 'Remate por 3', description: 'Sale por la pared lateral' },
        { slug: 'remate-por-4', name: 'Remate por 4', description: 'Sale por encima del cristal trasero' },
        { slug: 'remate-controlado', name: 'Remate Controlado', description: 'Potencia moderada, mantener presion' },
      ],
    },
  ]

  for (const tech of techniques) {
    const technique = await prisma.technique.upsert({
      where: {
        sportId_slug: {
          sportId: padel.id,
          slug: tech.slug,
        },
      },
      update: {
        name: tech.name,
        description: tech.description,
        difficulty: tech.difficulty,
        weight: tech.weight,
        correctForm: tech.correctForm,
        commonErrors: tech.commonErrors,
      },
      create: {
        sportId: padel.id,
        slug: tech.slug,
        name: tech.name,
        description: tech.description,
        difficulty: tech.difficulty,
        weight: tech.weight,
        correctForm: tech.correctForm,
        commonErrors: tech.commonErrors,
      },
    })

    console.log('Created technique:', technique.name)

    // Create variants
    for (const v of tech.variants) {
      await prisma.variant.upsert({
        where: {
          techniqueId_slug: {
            techniqueId: technique.id,
            slug: v.slug,
          },
        },
        update: {
          name: v.name,
          description: v.description,
        },
        create: {
          techniqueId: technique.id,
          slug: v.slug,
          name: v.name,
          description: v.description,
        },
      })
    }
  }

  console.log('Padel seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
