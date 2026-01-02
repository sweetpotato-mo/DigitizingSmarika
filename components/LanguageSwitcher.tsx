'use client'

import { useRouter, usePathname } from 'next/navigation'
import styles from './LanguageSwitcher.module.css'

type Language = 'en' | 'ne' | 'new'

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ne', label: 'ने' },
  { code: 'new', label: 'न्ये' },
]

interface LanguageSwitcherProps {
  currentLang?: string
}

export default function LanguageSwitcher({ currentLang = 'en' }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (lang: Language) => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', lang)
    router.push(url.pathname + url.search)
  }

  return (
    <div className={styles.container}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`${styles.pill} ${currentLang === lang.code ? styles.active : ''}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}

