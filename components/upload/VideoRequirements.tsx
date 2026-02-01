'use client'

import { Clock, Camera, Sun, FileVideo } from 'lucide-react'

interface Requirement {
  icon: typeof Clock
  label: string
  value: string
}

const requirements: Requirement[] = [
  {
    icon: Clock,
    label: 'Duracion',
    value: '10-30 segundos',
  },
  {
    icon: Camera,
    label: 'Angulos',
    value: 'Frontal, lateral o 45',
  },
  {
    icon: Sun,
    label: 'Iluminacion',
    value: 'Natural o uniforme',
  },
  {
    icon: FileVideo,
    label: 'Formato',
    value: 'MP4, MOV, WebM (max 100MB)',
  },
]

export function VideoRequirements() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {requirements.map((req) => (
        <div
          key={req.label}
          className="glass-ultralight border-glass rounded-xl p-3 flex flex-col items-center text-center"
        >
          <div className="glass-light border-glass rounded-lg p-1.5 mb-2">
            <req.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">{req.label}</p>
          <p className="text-sm font-medium">{req.value}</p>
        </div>
      ))}
    </div>
  )
}
