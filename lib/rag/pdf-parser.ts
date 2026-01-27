import { PDFParse } from 'pdf-parse'

export interface ParsedPage {
  pageNumber: number
  text: string
}

export interface ParsedPdf {
  pages: ParsedPage[]
  totalPages: number
  fullText: string
}

export async function parsePdf(buffer: Buffer): Promise<ParsedPdf> {
  const parser = new PDFParse({ data: new Uint8Array(buffer), verbosity: 0 })
  const result = await parser.getText()

  const pages: ParsedPage[] = result.pages
    .map((page: { num: number; text: string }) => ({
      pageNumber: page.num,
      text: page.text.trim(),
    }))
    .filter((p: ParsedPage) => p.text.length > 0)

  const fullText = pages.map((p) => p.text).join('\n\n')

  await parser.destroy()

  return {
    pages,
    totalPages: result.total,
    fullText,
  }
}
