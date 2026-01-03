'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NavBar() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const branding = language === 'ne' ? 'श्री कृष्ण टोखा चाकु' : 'Shree Krishna Tokha Chaku'
  const homeText = language === 'ne' ? 'स्मारिका गृहपृष्ठ' : 'SMARIKA HOME'
  const tocText = language === 'ne' ? 'लेख सूची' : 'Contents Overview'
  
  const handleNavLanguageChange = (newLang: 'en' | 'ne') => {
    setLanguage(newLang)
    if (pathname.startsWith('/archive/')) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('lang', newLang)
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Absolute URL to restore the link to tokhachaku.com */}
        <a 
          href="https://tokhachaku.com" 
          className="flex items-center gap-2 font-playfair font-black text-[#2D2D2D] hover:opacity-70 transition-opacity"
        >
          <span>←</span>
          <span className={language === 'ne' ? 'font-noto' : ''}>{branding}</span>
        </a>

        <div className="flex items-center gap-6">
          <Link href="/" className={`text-sm hover:text-stone-500 transition-colors font-bold ${language === 'ne' ? 'font-noto' : 'font-lora'}`}>
            {homeText}
          </Link>
          <Link href="/#toc" className={`text-sm hover:text-stone-500 transition-colors font-bold ${language === 'ne' ? 'font-noto' : 'font-lora'}`}>
            {tocText}
          </Link>
          <div className="flex items-center gap-2 bg-stone-100 rounded-full p-1 border border-stone-200">
            <button onClick={() => handleNavLanguageChange('en')} className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest ${language === 'en' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}>EN</button>
            <button onClick={() => handleNavLanguageChange('ne')} className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest ${language === 'ne' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}>ने</button>
          </div>
        </div>
      </div>
    </nav>
  )
}