import { createContext, useContext, useEffect, useState } from 'react'
import { copy } from './content.js'

const LangCtx = createContext(null)

function initial() {
  try {
    const saved = localStorage.getItem('ttc-lang')
    if (saved === 'pt' || saved === 'en') return saved
  } catch {}
  const nav = (navigator.language || 'pt').toLowerCase()
  return nav.startsWith('pt') ? 'pt' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initial)
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-AO' : 'en'
    document.title = copy[lang].meta.title
    try {
      localStorage.setItem('ttc-lang', lang)
    } catch {}
  }, [lang])
  return <LangCtx.Provider value={{ lang, setLang, t: copy[lang] }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
