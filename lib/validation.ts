/**
 * Normalise an email address for storage/comparison.
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Validate a password meets minimum requirements.
 * Returns an error message or null when valid.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'La contrasena debe tener al menos 8 caracteres'
  }
  return null
}
