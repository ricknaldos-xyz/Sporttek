'use client'

import { cn } from '@/lib/utils'

interface MuscleDiagramProps {
  muscleGroups: string[]
  className?: string
}

// Mapping of muscle group names (Spanish) to SVG region IDs
const MUSCLE_MAP: Record<string, string[]> = {
  // Exact matches
  deltoides: ['deltoid-l', 'deltoid-r'],
  hombros: ['deltoid-l', 'deltoid-r'],
  pectorales: ['pec-l', 'pec-r'],
  pecho: ['pec-l', 'pec-r'],
  bíceps: ['bicep-l', 'bicep-r'],
  biceps: ['bicep-l', 'bicep-r'],
  tríceps: ['tricep-l', 'tricep-r'],
  triceps: ['tricep-l', 'tricep-r'],
  antebrazos: ['forearm-l', 'forearm-r'],
  muñecas: ['forearm-l', 'forearm-r'],
  abdominales: ['abs'],
  core: ['abs', 'oblique-l', 'oblique-r'],
  oblicuos: ['oblique-l', 'oblique-r'],
  espalda: ['upper-back', 'lower-back', 'lat-l', 'lat-r'],
  'espalda alta': ['upper-back'],
  trapecios: ['upper-back'],
  trapecio: ['upper-back'],
  dorsales: ['lat-l', 'lat-r'],
  'espalda baja': ['lower-back'],
  lumbar: ['lower-back'],
  lumbares: ['lower-back'],
  glúteos: ['glute-l', 'glute-r'],
  gluteos: ['glute-l', 'glute-r'],
  cuádriceps: ['quad-l', 'quad-r'],
  cuadriceps: ['quad-l', 'quad-r'],
  piernas: ['quad-l', 'quad-r', 'hamstring-l', 'hamstring-r', 'calf-l', 'calf-r'],
  isquiotibiales: ['hamstring-l', 'hamstring-r'],
  pantorrillas: ['calf-l', 'calf-r'],
  gemelos: ['calf-l', 'calf-r'],
  rotadores: ['deltoid-l', 'deltoid-r', 'upper-back'],
  'manguito rotador': ['deltoid-l', 'deltoid-r', 'upper-back'],
  caderas: ['glute-l', 'glute-r', 'oblique-l', 'oblique-r'],
  tronco: ['abs', 'oblique-l', 'oblique-r', 'lower-back'],
}

function getActiveRegions(muscleGroups: string[]): Set<string> {
  const active = new Set<string>()
  for (const group of muscleGroups) {
    const normalized = group.toLowerCase().trim()
    // Try exact match first
    if (MUSCLE_MAP[normalized]) {
      MUSCLE_MAP[normalized].forEach((r) => active.add(r))
      continue
    }
    // Try partial match
    for (const [key, regions] of Object.entries(MUSCLE_MAP)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        regions.forEach((r) => active.add(r))
      }
    }
  }
  return active
}

export function MuscleDiagram({ muscleGroups, className }: MuscleDiagramProps) {
  const active = getActiveRegions(muscleGroups)

  const fill = (id: string) =>
    active.has(id) ? 'fill-primary/70' : 'fill-muted-foreground/10'

  const stroke = (id: string) =>
    active.has(id) ? 'stroke-primary/40' : 'stroke-muted-foreground/15'

  return (
    <svg
      viewBox="0 0 120 200"
      className={cn('w-[100px] h-[166px] flex-shrink-0', className)}
      aria-label={`Músculos: ${muscleGroups.join(', ')}`}
    >
      {/* Head */}
      <ellipse cx="60" cy="18" rx="12" ry="14" className="fill-muted-foreground/15 stroke-muted-foreground/20" strokeWidth="0.5" />

      {/* Neck */}
      <rect x="55" y="31" width="10" height="6" rx="2" className="fill-muted-foreground/15" />

      {/* Upper back / Traps */}
      <path
        d="M42 37 L78 37 L76 52 L44 52 Z"
        className={cn(fill('upper-back'), stroke('upper-back'))}
        strokeWidth="0.5"
      />

      {/* Deltoids */}
      <ellipse cx="36" cy="44" rx="8" ry="10"
        className={cn(fill('deltoid-l'), stroke('deltoid-l'))} strokeWidth="0.5" />
      <ellipse cx="84" cy="44" rx="8" ry="10"
        className={cn(fill('deltoid-r'), stroke('deltoid-r'))} strokeWidth="0.5" />

      {/* Pectorals */}
      <path
        d="M44 40 L58 40 L56 56 L44 54 Z"
        className={cn(fill('pec-l'), stroke('pec-l'))} strokeWidth="0.5" />
      <path
        d="M62 40 L76 40 L76 54 L64 56 Z"
        className={cn(fill('pec-r'), stroke('pec-r'))} strokeWidth="0.5" />

      {/* Abs */}
      <path
        d="M50 56 L70 56 L68 90 L52 90 Z"
        className={cn(fill('abs'), stroke('abs'))} strokeWidth="0.5" />

      {/* Obliques */}
      <path
        d="M44 54 L50 56 L52 90 L46 88 Z"
        className={cn(fill('oblique-l'), stroke('oblique-l'))} strokeWidth="0.5" />
      <path
        d="M76 54 L70 56 L68 90 L74 88 Z"
        className={cn(fill('oblique-r'), stroke('oblique-r'))} strokeWidth="0.5" />

      {/* Lats */}
      <path
        d="M42 52 L44 54 L46 72 L40 64 Z"
        className={cn(fill('lat-l'), stroke('lat-l'))} strokeWidth="0.5" />
      <path
        d="M78 52 L76 54 L74 72 L80 64 Z"
        className={cn(fill('lat-r'), stroke('lat-r'))} strokeWidth="0.5" />

      {/* Lower back */}
      <path
        d="M50 78 L70 78 L68 92 L52 92 Z"
        className={cn(fill('lower-back'), stroke('lower-back'))} strokeWidth="0.5"
        opacity={active.has('lower-back') ? 0.5 : 0.1}
      />

      {/* Biceps */}
      <ellipse cx="32" cy="62" rx="5" ry="12"
        className={cn(fill('bicep-l'), stroke('bicep-l'))} strokeWidth="0.5" />
      <ellipse cx="88" cy="62" rx="5" ry="12"
        className={cn(fill('bicep-r'), stroke('bicep-r'))} strokeWidth="0.5" />

      {/* Triceps */}
      <ellipse cx="30" cy="64" rx="4" ry="10"
        className={cn(fill('tricep-l'), stroke('tricep-l'))} strokeWidth="0.5" />
      <ellipse cx="90" cy="64" rx="4" ry="10"
        className={cn(fill('tricep-r'), stroke('tricep-r'))} strokeWidth="0.5" />

      {/* Forearms */}
      <ellipse cx="28" cy="82" rx="4" ry="12"
        className={cn(fill('forearm-l'), stroke('forearm-l'))} strokeWidth="0.5" />
      <ellipse cx="92" cy="82" rx="4" ry="12"
        className={cn(fill('forearm-r'), stroke('forearm-r'))} strokeWidth="0.5" />

      {/* Glutes */}
      <ellipse cx="52" cy="96" rx="9" ry="8"
        className={cn(fill('glute-l'), stroke('glute-l'))} strokeWidth="0.5" />
      <ellipse cx="68" cy="96" rx="9" ry="8"
        className={cn(fill('glute-r'), stroke('glute-r'))} strokeWidth="0.5" />

      {/* Quads */}
      <path
        d="M44 102 L56 102 L54 140 L42 140 Z"
        className={cn(fill('quad-l'), stroke('quad-l'))} strokeWidth="0.5" />
      <path
        d="M64 102 L76 102 L78 140 L66 140 Z"
        className={cn(fill('quad-r'), stroke('quad-r'))} strokeWidth="0.5" />

      {/* Hamstrings (shown slightly behind quads) */}
      <path
        d="M44 104 L42 140 L48 140 L50 104 Z"
        className={cn(fill('hamstring-l'), stroke('hamstring-l'))} strokeWidth="0.5"
        opacity={active.has('hamstring-l') ? 0.5 : 0.1}
      />
      <path
        d="M70 104 L78 140 L72 140 L76 104 Z"
        className={cn(fill('hamstring-r'), stroke('hamstring-r'))} strokeWidth="0.5"
        opacity={active.has('hamstring-r') ? 0.5 : 0.1}
      />

      {/* Calves */}
      <ellipse cx="48" cy="158" rx="5" ry="16"
        className={cn(fill('calf-l'), stroke('calf-l'))} strokeWidth="0.5" />
      <ellipse cx="72" cy="158" rx="5" ry="16"
        className={cn(fill('calf-r'), stroke('calf-r'))} strokeWidth="0.5" />

      {/* Feet */}
      <ellipse cx="48" cy="180" rx="6" ry="4" className="fill-muted-foreground/15" />
      <ellipse cx="72" cy="180" rx="6" ry="4" className="fill-muted-foreground/15" />

      {/* Hands */}
      <circle cx="28" cy="97" r="4" className="fill-muted-foreground/15" />
      <circle cx="92" cy="97" r="4" className="fill-muted-foreground/15" />
    </svg>
  )
}
