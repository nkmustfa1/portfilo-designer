import { LocalizedText } from '@/hooks/useSiteSettings';

export function getLocalizedText(
  value?: LocalizedText,
  lang: 'en' | 'ar' = 'en'
): string {
  if (!value) return '';
  return lang === 'ar' ? value.ar || '' : value.en || '';
}
