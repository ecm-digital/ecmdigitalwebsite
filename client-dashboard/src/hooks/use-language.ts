'use client'

import { useState, useEffect } from 'react'
import { Language, getTranslation } from '@/lib/i18n'

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('pl')

  useEffect(() => {
    // Get language from localStorage or browser
    const savedLang = localStorage.getItem('language') as Language
    const browserLang = navigator.language.startsWith('pl') ? 'pl' : 'en'
    
    setLanguage(savedLang || browserLang)
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return getTranslation(language, key)
  }

  return {
    language,
    changeLanguage,
    t
  }
}