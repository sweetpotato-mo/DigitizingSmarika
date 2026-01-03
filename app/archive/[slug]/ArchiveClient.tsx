'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ArticleMetadata {
  slug: string
  titleEn: string
  titleNe: string
  titleNew: string
  author: string
  designation: string
  tags: string[]
  languageAvailability: string[]
}

export default function ArchiveClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const [loadedLang, setLoadedLang] = useState<string>('')
  const [metadata, setMetadata] = useState<ArticleMetadata | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const articleLang = (searchParams.get('lang') || language) as string

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true)
      setError(null)

      try {
        const libResponse = await fetch('/library.json')
        const libData: ArticleMetadata[] = await libResponse.json()
        const articleMeta = libData.find((article) => article.slug === slug)
        
        if (!articleMeta) throw new Error('Article not found in library')
        setMetadata(articleMeta)

        const available = articleMeta.languageAvailability || ['en']
        setAvailableLanguages(available)

        let langToLoad = articleLang
        if (!available.includes(articleLang) && available.length > 0) {
          langToLoad = available[0]
        }
        setLoadedLang(langToLoad)

        const contentPath = `/content/${slug}/${langToLoad}.md`
        const response = await fetch(contentPath)
        
        if (!response.ok) throw new Error('Markdown file missing')

        const text = await response.text()
        setContent(text)
      } catch (err) {
        setError('Failed to load article.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) loadArticle()
  }, [slug, articleLang])

  // Get titles based on loaded language
  const getPrimaryTitle = () => {
    if (!metadata) return ''
    if (loadedLang === 'ne') return metadata.titleNe || metadata.titleEn
    if (loadedLang === 'new') return metadata.titleNew || metadata.titleNe || metadata.titleEn
    return metadata.titleEn
  }

  const getAltTitle = () => {
    if (!metadata) return ''
    if (loadedLang === 'en') return metadata.titleNe || metadata.titleNew
    if (loadedLang === 'ne') return metadata.titleEn
    return metadata.titleEn || metadata.titleNe
  }

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      Poem: 'bg-pink-100 text-pink-800 border-pink-200',
      'Nepal Bhasa': 'bg-purple-100 text-purple-800 border-purple-200',
      History: 'bg-blue-100 text-blue-800 border-blue-200',
      Craftsmanship: 'bg-amber-100 text-amber-800 border-amber-200',
      Heritage: 'bg-green-100 text-green-800 border-green-200',
      Culture: 'bg-rose-100 text-rose-800 border-rose-200',
    }
    return colors[tag] || 'bg-stone-100 text-stone-700 border-stone-200'
  }

  if (loading) return <div className="p-20 text-center">Loading Archive...</div>
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-20">
      <article className="max-w-[750px] mx-auto px-6 py-12">
        <header className="mb-10 border-b border-stone-200 pb-10">
          <div className="space-y-3">
            {getAltTitle() && (
              <div className="text-sm font-lora tracking-widest text-stone-400 uppercase">
                {getAltTitle()}
              </div>
            )}
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#2D2D2D]">
              {getPrimaryTitle()}
            </h1>
          </div>
          <div className="mt-8">
            <p className="text-stone-800 font-semibold">{metadata?.author}</p>
            <p className="text-stone-500 text-sm">{metadata?.designation}</p>
          </div>
        </header>
        <div className="markdown-content prose prose-stone max-w-none text-lg leading-[1.8]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}