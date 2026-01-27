import { useEffect } from "react"
import { useBrandSettings } from "@/hooks/useSiteSettings"

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { data: brand } = useBrandSettings()

  useEffect(() => {
    const fonts: Record<string, string> = {
      inter: "'Inter', sans-serif",
      poppins: "'Poppins', sans-serif",
      cairo: "'Cairo', sans-serif",
      tajawal: "'Tajawal', sans-serif",
    }

    const font = fonts[brand?.fontFamily || "inter"]

    document.documentElement.style.setProperty("--font-main", font)
  }, [brand?.fontFamily])

  return <>{children}</>
}
