import { pdfBase64Prefix } from '@/lib/constants'

export const convertStringToPdf = (pdf: string): string => {
  return `${pdfBase64Prefix}${pdf}`;
};