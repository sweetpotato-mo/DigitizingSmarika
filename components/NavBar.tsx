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
  const homeText = language === 'ne' ? 'गृहपृष्ठ' : 'HOME'
  const tocText = language === 'ne' ? 'सूची' : 'CONTENTS'
  
  // Detect if the user is currently reading an article
  const isArchivePage = pathname.startsWith('/archive/')

  const handleNavLanguageChange = (newLang: 'en' | 'ne') => {
    setLanguage(newLang)
    if (isArchivePage) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('lang', newLang)
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  // Logic to handle internal jumping vs homepage navigation
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isArchivePage) {
      // Prevent standard link navigation
      e.preventDefault()
      
      // Target the 'id="toc"' div at the bottom of ArchiveClient
      const tocElement = document.getElementById('toc')
      if (tocElement) {
        tocElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-2">
        
        <a 
          href="https://tokhachaku.com" 
          className="flex items-center gap-1 md:gap-2 font-playfair font-black text-[#2D2D2D] hover:opacity-70 transition-opacity shrink-0"
        >
          <span className="text-sm md:text-base">←</span>
          <span className={`text-xs sm:text-sm md:text-lg leading-tight ${language === 'ne' ? 'font-noto' : ''}`}>
            {branding}
          </span>
        </a>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-6 border-r border-stone-200 pr-3 md:pr-6">
            <Link 
              href="/" 
              className={`text-[10px] md:text-xs tracking-widest uppercase hover:text-stone-500 transition-colors font-black ${language === 'ne' ? 'font-noto' : 'font-lora'}`}
            >
              {homeText}
            </Link>
            
            {/* If on archive page, stay on page and scroll. If on home, jump to the section. */}
            <Link 
              href={isArchivePage ? "#toc" : "/#toc"}
              onClick={handleTocClick}
              className={`text-[10px] md:text-xs tracking-widest uppercase hover:text-stone-500 transition-colors font-black ${language === 'ne' ? 'font-noto' : 'font-lora'}`}
            >
              {tocText}
            </Link>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 rounded-full p-0.5 md:p-1 border border-stone-200">
            <button 
              onClick={() => handleNavLanguageChange('en')} 
              className={`px-2 md:px-4 py-1 rounded-full text-[9px] md:text-xs font-black tracking-tighter md:tracking-widest ${language === 'en' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}
            >
              EN
            </button>
            <button 
              onClick={() => handleNavLanguageChange('ne')} 
              className={`px-2 md:px-4 py-1 rounded-full text-[9px] md:text-xs font-black ${language === 'ne' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}
            >
              ने
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}