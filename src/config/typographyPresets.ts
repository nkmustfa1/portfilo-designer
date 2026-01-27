// src/config/typographyPresets.ts

import type { TypographySettings } from "@/hooks/useSiteSettings"

export const TYPOGRAPHY_PRESETS: Record<
  'modern' | 'creative' | 'luxury' | 'minimal',
  Omit<TypographySettings, 'preset'>
> = {
  modern: {
    fontLatin: 'inter',
    fontArabic: 'ibm',
    baseFontSize: 16,
    headingWeight: 600,
    bodyWeight: 400,
  },

  creative: {
    fontLatin: 'poppins',
    fontArabic: 'changa',
    baseFontSize: 17,
    headingWeight: 700,
    bodyWeight: 400,
  },

  luxury: {
    fontLatin: 'playfair',
    fontArabic: 'almarai',
    baseFontSize: 18,
    headingWeight: 600,
    bodyWeight: 400,
  },

  minimal: {
    fontLatin: 'dmsans',
    fontArabic: 'rubik',
    baseFontSize: 16,
    headingWeight: 500,
    bodyWeight: 400,
  },
}
