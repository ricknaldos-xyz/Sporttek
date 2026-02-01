export const BANNED_WORDS: string[] = [
  'mierda',
  'puta',
  'puto',
  'pendejo',
  'pendeja',
  'cabron',
  'cabrona',
  'chingar',
  'chingada',
  'chingado',
  'verga',
  'culero',
  'culera',
  'marica',
  'maricon',
  'joto',
  'jota',
  'huevon',
  'huevona',
  'cojudo',
  'cojuda',
  'conchatumadre',
  'concha',
  'imbecil',
  'estupido',
  'estupida',
  'idiota',
  'tarado',
  'tarada',
  'baboso',
  'babosa',
  'malparido',
  'malparida',
  'hijueputa',
  'gonorrea',
  'carepicha',
  'webon',
  'webona',
  'chucha',
  'carajo',
]

export function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase()
  return BANNED_WORDS.some((word) => lower.includes(word))
}

const BANNED_WORDS_COMPILED = BANNED_WORDS.map((word) => ({
  regex: new RegExp(word, 'gi'),
  replacement: '*'.repeat(word.length),
}))

export function sanitizeText(text: string): string {
  let result = text
  for (const { regex, replacement } of BANNED_WORDS_COMPILED) {
    regex.lastIndex = 0
    result = result.replace(regex, replacement)
  }
  return result
}
