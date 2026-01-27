// src/config/typographyPresets.ts

import type { TypographySettings } from "@/hooks/useSiteSettings"

export const TYPOGRAPHY_PRESETS = {
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

  editorial: {
    fontLatin: 'libre',
    fontArabic: 'noto-naskh',
    baseFontSize: 18,
    headingWeight: 600,
    bodyWeight: 400,
  },

  tech: {
    fontLatin: 'space-grotesk',
    fontArabic: 'ibm',
    baseFontSize: 16,
    headingWeight: 600,
    bodyWeight: 400,
  },

  branding: {
    fontLatin: 'montserrat',
    fontArabic: 'cairo',
    baseFontSize: 16,
    headingWeight: 600,
    bodyWeight: 400,
  },

  elegant: {
    fontLatin: 'cormorant',
    fontArabic: 'noto-naskh',
    baseFontSize: 18,
    headingWeight: 600,
    bodyWeight: 400,
  },

  bold: {
    fontLatin: 'manrope',
    fontArabic: 'changa',
    baseFontSize: 17,
    headingWeight: 700,
    bodyWeight: 400,
  },

  corporate: {
    fontLatin: 'roboto',
    fontArabic: 'noto-kufi',
    baseFontSize: 16,
    headingWeight: 500,
    bodyWeight: 400,
  },
} as const

// ⭐ هذا السطر هو المفتاح
export type TypographyPresetKey = keyof typeof TYPOGRAPHY_PRESETS

