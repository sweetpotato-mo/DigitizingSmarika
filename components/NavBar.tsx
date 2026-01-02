'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NavBar() {
  const { language, setLanguage } = useLanguage()

  // Dynamic text based on language
  const branding = language === 'ne' ? 'श्री कृष्ण टोखा चाकु' : 'Shree Krishna Tokha Chaku'
  const homeText = language === 'ne' ? 'स्मारिका गृहपृष्ठ' : 'SMARIKA HOME'
  const tocText = language === 'ne' ? 'लेख सूची' : 'Contents Overview'
  
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const tocElement = document.getElementById('toc')
    if (tocElement) {
      tocElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Branding */}
          <div className="flex items-center">
            <Link
              href="https://tokhachaku.com"
              className="text-[#2D2D2D] hover:text-[#2D2D2D]/80 transition-colors font-medium flex items-center gap-2 font-lora"
            >
              <span>←</span>
              <span className={language === 'ne' ? 'font-noto' : ''}>{branding}</span>
            </Link>
          </div>

          {/* Right side: HOME, TOC, and Language toggle */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-[#2D2D2D] hover:text-[#2D2D2D]/80 transition-colors font-medium ${language === 'ne' ? 'font-noto' : 'font-lora'}`}
            >
              {homeText}
            </Link>
            <Link
              href="/#toc"
              onClick={handleTocClick}
              className={`text-[#2D2D2D] hover:text-[#2D2D2D]/80 transition-colors font-medium ${language === 'ne' ? 'font-noto' : 'font-lora'}`}
            >
              {tocText}
            </Link>
            <div className="flex items-center gap-2 bg-gray-100/80 rounded-full p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-lora ${
                  language === 'en'
                    ? 'bg-white text-[#2D2D2D] shadow-sm'
                    : 'text-[#2D2D2D]/70 hover:text-[#2D2D2D]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ne')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-lora ${
                  language === 'ne'
                    ? 'bg-white text-[#2D2D2D] shadow-sm'
                    : 'text-[#2D2D2D]/70 hover:text-[#2D2D2D]'
                }`}
              >
                ने
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
