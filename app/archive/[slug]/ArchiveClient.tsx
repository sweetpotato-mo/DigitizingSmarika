'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ArchiveClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<any>(null)
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [loadedLang, setLoadedLang] = useState('')

  const urlLang = searchParams.get('lang')
  const articleLang = urlLang || language

  useEffect(() => {
    const fetchData = async () => {
      try {
        const libRes = await fetch('/library.json')
        const libData = await libRes.json()
        const meta = libData.find((a: any) => a.slug === slug)
        setMetadata(meta)

        const available = meta?.languageAvailability || ['en']
        setAvailableLanguages(available)

        let finalLang = available.includes(articleLang) ? articleLang : 'en'
        setLoadedLang(finalLang)

        const res = await fetch(`/content/${slug}/${finalLang}.md`)
        const text = await res.text()
        setContent(text)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchData()
  }, [slug, articleLang])

  const handleLanguageChange = (newLang: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', newLang)
    router.push(`/archive/${slug}?${params.toString()}`)
  }

  const hasNewari = availableLanguages.includes('new')

  if (loading) return <div className="p-20 text-center font-lora">Gathering content...</div>

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-24">
      <article className="max-w-[780px] mx-auto px-6 py-12">
        <header className="mb-14 border-b border-stone-200 pb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-8 leading-[1.2]">
            {loadedLang === 'ne' ? metadata?.titleNe : metadata?.titleEn}
          </h1>
          <div className="flex flex-col gap-1 font-lora">
            <p className="text-stone-600 text-xl italic">By {metadata?.author}</p>
            <p className="text-stone-400 text-sm tracking-wide uppercase">{metadata?.designation}</p>
          </div>

          {/* Newari Invitation */}
          {hasNewari && loadedLang !== 'new' && (
            <div className="mt-12 p-8 bg-stone-50 border border-stone-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="text-stone-700 text-sm font-lora leading-relaxed">
                <p className="italic mb-1 opacity-60">यो लेख मूलतः नेपाल भाषामा लेखिएको हो ।</p>
                <p className="font-bold text-stone-900 text-base">Nepal Bhasa (Newari) version is available.</p>
              </div>
              <button 
                onClick={() => handleLanguageChange('new')} 
                className="bg-[#2D2D2D] text-white px-6 py-3 rounded text-[11px] font-black tracking-[0.2em] uppercase hover:bg-black transition-all shadow-md"
              >
                (READ ORIGINAL)
              </button>
            </div>
          )}

          {/* Newari Version Return Buttons */}
          {loadedLang === 'new' && (
            <div className="mt-10 flex gap-8">
              <button onClick={() => handleLanguageChange('en')} className="text-[11px] font-black tracking-widest text-stone-400 hover:text-stone-900 transition-colors uppercase underline underline-offset-[12px] decoration-stone-200 hover:decoration-stone-900">English Version</button>
              <button onClick={() => handleLanguageChange('ne')} className="text-[11px] font-black tracking-widest text-stone-400 hover:text-stone-900 transition-colors uppercase underline underline-offset-[12px] decoration-stone-200 hover:decoration-stone-900">नेपाली संस्करण</button>
            </div>
          )}
        </header>
        
        {/* ENHANCED READABILITY CLASSES */}
        <div className={`
          markdown-content 
          prose prose-stone 
          max-w-none 
          text-[1.2rem] 
          leading-[2] 
          tracking-normal
          text-stone-800
          ${loadedLang === 'new' || loadedLang === 'ne' ? 'font-noto' : 'font-lora'}
          prose-p:mb-10 
          prose-headings:mt-16 
          prose-headings:mb-8
          prose-strong:text-stone-900
          prose-blockquote:border-l-4
          prose-blockquote:border-stone-200
          prose-blockquote:italic
          prose-blockquote:text-stone-600
        `}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}