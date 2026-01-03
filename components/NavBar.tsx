'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NavBar() {
  // Ensure setLanguage is imported from your context
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const branding = language === 'ne' ? 'श्री कृष्ण टोखा चाकु' : 'Shree Krishna Tokha Chaku'
  const homeText = language === 'ne' ? 'स्मारिका गृहपृष्ठ' : 'SMARIKA HOME'
  const tocText = language === 'ne' ? 'लेख सूची' : 'Contents Overview'
  
  // FIX: Cast newLang to 'en' | 'ne' to match your Context type
  const handleNavLanguageChange = (newLang: string) => {
    setLanguage(newLang as 'en' | 'ne') 
    
    if (pathname.startsWith('/archive/')) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('lang', newLang)
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault()
      const tocElement = document.getElementById('toc')
      if (tocElement) {
        tocElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-lora text-[#2D2D2D] font-bold">
          <span>←</span>
          <span className={language === 'ne' ? 'font-noto' : ''}>{branding}</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className={`text-sm hover:text-stone-500 transition-colors ${language === 'ne' ? 'font-noto' : 'font-lora'}`}>
            {homeText}
          </Link>
          <Link href="/#toc" onClick={handleTocClick} className={`text-sm hover:text-stone-500 transition-colors ${language === 'ne' ? 'font-noto' : 'font-lora'}`}>
            {tocText}
          </Link>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button onClick={() => handleNavLanguageChange('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${language === 'en' ? 'bg-white shadow-sm text-black' : 'text-stone-500'}`}>EN</button>
            <button onClick={() => handleNavLanguageChange('ne')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${language === 'ne' ? 'bg-white shadow-sm text-black' : 'text-stone-500'}`}>ने</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
