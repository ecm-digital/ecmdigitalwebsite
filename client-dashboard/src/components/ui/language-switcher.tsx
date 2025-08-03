'use client'

import { useLanguage } from '@/hooks/use-language'
import { Button } from './button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-slate-400" />
      <div className="flex rounded-lg bg-slate-800/50 p-1">
        <Button
          variant={language === 'pl' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => changeLanguage('pl')}
          className={`px-3 py-1 text-xs ${
            language === 'pl' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          PL
        </Button>
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 text-xs ${
            language === 'en' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          EN
        </Button>
      </div>
    </div>
  )
}