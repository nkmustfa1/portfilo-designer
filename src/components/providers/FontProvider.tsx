import { useEffect } from "react"
import { useBrandSettings } from "@/hooks/useSiteSettings"
import { useLanguage } from "@/context/LanguageContext"

const FONT_MAP: Record<string, string> = {
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  dmsans: "'DM Sans', sans-serif",
  playfair: "'Playfair Display', serif",

  ibm: "'IBM Plex Arabic', sans-serif",
  almarai: "'Almarai', sans-serif",
  changa: "'Changa', sans-serif",
  rubik: "'Rubik', sans-serif",
}

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { data: brand } = useBrandSettings()
  const { lang } = useLanguage()

  useEffect(() => {
    const t = brand?.typography
    if (!t) return

    document.documentElement.style.setProperty(
      '--font-latin',
      FONT_MAP[t.fontLatin]
    )

    document.documentElement.style.setProperty(
      '--font-arabic',
      FONT_MAP[t.fontArabic]
    )

    document.documentElement.style.setProperty(
      '--font-size-base',
      `${t.baseFontSize}px`
    )

    document.documentElement.style.setProperty(
      '--font-weight-body',
      String(t.bodyWeight)
    )

    document.documentElement.style.setProperty(
      '--font-weight-heading',
      String(t.headingWeight)
    )
  }, [brand?.typography, lang])

  return <>{children}</>
}
