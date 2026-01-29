// Re-export everything from the original tennis prompts file
// so existing imports keep working, and add the registry-compatible builder.
export {
  TENNIS_BASE_PROMPT,
  TENNIS_TECHNIQUES,
  TENNIS_VARIANTS,
  buildTennisPrompt,
} from '@/lib/openai/prompts/tennis'
