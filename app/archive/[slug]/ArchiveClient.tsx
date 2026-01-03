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

  const hasNewari = availableLanguages.includes('new') // Fixed ReferenceError

  if (loading) return <div className="p-20 text-center font-lora">Gathering content...</div>

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-24">
      <article className="max-w-[750px] mx-auto px-6 py-12">
        <header className="mb-12 border-b border-stone-200 pb-10">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6 leading-tight">
            {loadedLang === 'ne' ? metadata?.titleNe : metadata?.titleEn}
          </h1>
          <p className="font-lora italic text-stone-500 text-lg">By {metadata?.author}</p>
          <p className="text-stone-400 text-sm mt-1">{metadata?.designation}</p>

          {/* Newari Invitation */}
          {hasNewari && loadedLang !== 'new' && (
            <div className="mt-10 p-6 bg-stone-50 border border-stone-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="text-stone-700 text-sm font-lora">
                <p className="italic mb-1 opacity-75 text-stone-500">यो लेख मूलतः नेपाल भाषामा लेखिएको हो ।</p>
                <p className="font-bold text-stone-800">Nepal Bhasa version is available for reading.</p>
              </div>
              <button onClick={() => handleLanguageChange('new')} className="bg-[#2D2D2D] text-white px-5 py-2.5 rounded text-[10px] font-black tracking-[0.2em] uppercase hover:bg-black transition-all">
                (READ ORIGINAL)
              </button>
            </div>
          )}

          {/* Newari Version Buttons */}
          {loadedLang === 'new' && (
            <div className="mt-8 flex gap-6">
              <button onClick={() => handleLanguageChange('en')} className="text-[10px] font-black tracking-widest text-stone-400 hover:text-stone-800 transition-colors uppercase underline underline-offset-8">English Version</button>
              <button onClick={() => handleLanguageChange('ne')} className="text-[10px] font-black tracking-widest text-stone-400 hover:text-stone-800 transition-colors uppercase underline underline-offset-8">नेपाली संस्करण</button>
            </div>
          )}
        </header>
        
        <div className={`
  markdown-content 
  prose prose-stone 
  max-w-none 
  text-[1.15rem] 
  leading-[1.9] 
  tracking-tight 
  ${loadedLang === 'new' || loadedLang === 'ne' ? 'font-noto' : 'font-lora'}
  prose-p:mb-8 
  prose-headings:mt-12 
  prose-headings:mb-6
`}>
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
</div>
      </article>
    </div>
  )
}