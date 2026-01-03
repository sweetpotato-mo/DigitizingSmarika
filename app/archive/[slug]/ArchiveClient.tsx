'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ArchiveClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([]) // For the TOC at the bottom
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [loadedLang, setLoadedLang] = useState('')

  const urlLang = searchParams.get('lang')
  const articleLang = urlLang || language

  useEffect(() => {
    const fetchData = async () => {
      try {
        const libRes = await fetch('/library.json')
        const libData = await libRes.json()
        
        // 1. Setup current article metadata
        const meta = libData.find((a: any) => a.slug === slug)
        setMetadata(meta)
        setArticles(libData) // 2. Store all articles for the TOC

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

  const getTitle = (article: any) => (language === 'ne' ? article.titleNe || article.titleEn : article.titleEn)
  const getAltTitle = (article: any) => (language === 'ne' ? article.titleEn : article.titleNe || article.titleNew)

  if (loading) return <div className="p-20 text-center font-lora">Gathering content...</div>

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-24">
      <article className="max-w-[780px] mx-auto px-6 py-12">
        {/* Article Header */}
        <header className="mb-14 border-b border-stone-200 pb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-8 leading-tight">
            {loadedLang === 'ne' ? metadata?.titleNe : metadata?.titleEn}
          </h1>
          <p className="font-lora italic text-stone-600 text-lg">By {metadata?.author}</p>
          <p className="text-stone-400 text-sm mt-1 uppercase tracking-wide">{metadata?.designation}</p>

          {/* Newari Invitation */}
          {availableLanguages.includes('new') && loadedLang !== 'new' && (
            <div className="mt-10 p-6 bg-stone-50 border border-stone-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="text-stone-700 text-sm font-lora">
                <p className="italic mb-1 opacity-60">यो लेख मूलतः नेपाल भाषामा लेखिएको हो ।</p>
                <p className="font-bold text-stone-900">Nepal Bhasa version is available.</p>
              </div>
              <button onClick={() => handleLanguageChange('new')} className="bg-[#2D2D2D] text-white px-5 py-2.5 rounded text-[10px] font-black tracking-widest uppercase hover:bg-black transition-all">
                (READ ORIGINAL)
              </button>
            </div>
          )}
        </header>
        
        {/* Article Body */}
        <div className={`markdown-content prose prose-stone max-w-none text-[1.2rem] leading-[2] ${loadedLang === 'new' || loadedLang === 'ne' ? 'font-noto' : 'font-lora'} prose-p:mb-10`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {/* --- Table of Contents Footer --- */}
        <div className="mt-32 pt-20 border-t-2 border-stone-200">
          <div className="flex items-center justify-center mb-16">
            <div className="h-[1px] w-12 bg-stone-300" />
            <span className="mx-6 text-stone-500 text-2xl font-black font-playfair tracking-[0.2em] uppercase">
              {language === 'ne' ? 'लेख सूची' : 'Contents'}
            </span>
            <div className="h-[1px] w-12 bg-stone-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.filter(a => a.slug !== slug).map((article) => (
              <Link key={article.slug} href={`/archive/${article.slug}`} 
                className="group bg-white rounded-xl p-8 border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-blue-600 text-[10px] mb-3 font-lora uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100">
                  {getAltTitle(article)}
                </div>
                <h3 className="font-playfair text-xl font-bold mb-4 text-[#2D2D2D] group-hover:text-stone-600 leading-tight">
                  {getTitle(article)}
                </h3>
                <div className="font-lora text-xs font-bold text-stone-800">{article.author}</div>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/" className="inline-block font-lora text-stone-400 hover:text-stone-900 transition-colors border-b border-stone-200 pb-1">
              ← {language === 'ne' ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Return to Home'}
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}