'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
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

export default function ArchivePage() {
  const params = useParams()
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

  const slug = params.slug as string
  const articleLang = (searchParams.get('lang') || language) as string

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true)
      setError(null)

      try {
        // Load article metadata from library.json
        const libResponse = await fetch('/library.json')
        const libData: ArticleMetadata[] = await libResponse.json()
        const articleMeta = libData.find((article) => article.slug === slug)
        setMetadata(articleMeta || null)

        // Check available languages
        const langCheck = ['en', 'ne', 'new']
        const available: string[] = []
        
        for (const lang of langCheck) {
          try {
            const response = await fetch(`/content/${slug}/${lang}.md`, { method: 'HEAD' })
            if (response.ok) {
              available.push(lang)
            }
          } catch (err) {
            // Language not available
          }
        }
        setAvailableLanguages(available)

        // Determine which language to load
        let langToLoad = articleLang
        if (!available.includes(articleLang) && available.length > 0) {
          // Fallback to first available language
          langToLoad = available[0]
        }

        setLoadedLang(langToLoad)

        // Load content
        const contentPath = `/content/${slug}/${langToLoad}.md`
        const response = await fetch(contentPath)
        
        if (!response.ok) {
          throw new Error('Article not found')
        }

        const text = await response.text()
        setContent(text)
      } catch (err) {
        setError('Failed to load article')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadArticle()
    }
  }, [slug, articleLang])

  // Preserve scroll position when language changes
  useEffect(() => {
    if (scrollPosition > 0 && !loading) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto', // Instant scroll to preserve position
        })
        setScrollPosition(0) // Reset after restoring
      })
    }
  }, [content, loading, scrollPosition])

  const handleLanguageChange = (newLang: string) => {
    // Save current scroll position
    setScrollPosition(window.scrollY)
    
    // Update URL with new language
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('lang', newLang)
    router.push(`/archive/${slug}?${newSearchParams.toString()}`)
  }

  const isDevanagari = loadedLang === 'ne' || loadedLang === 'new'
  const hasNewari = availableLanguages.includes('new')

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
      Tradition: 'bg-teal-100 text-teal-800 border-teal-200',
      Science: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Chemistry: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      Culture: 'bg-rose-100 text-rose-800 border-rose-200',
      Newar: 'bg-violet-100 text-violet-800 border-violet-200',
      Essay: 'bg-orange-100 text-orange-800 border-orange-200',
      Philosophy: 'bg-slate-100 text-slate-800 border-slate-200',
    }
    return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center pt-20">
        <div className="text-[#2D2D2D]">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center pt-20">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-20">
      <article className="max-w-[750px] mx-auto px-6 py-12">
        {/* Article Header */}
        <header className="mb-8">
          {/* Trilingual Language Toggle - Show if new.md exists */}
          {hasNewari && (
            <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm mb-6 w-fit">
              {availableLanguages.map((lang) => {
                const labels: Record<string, string> = {
                  en: 'EN',
                  ne: 'ने',
                  new: 'न्ये',
                }
                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-lora ${
                      loadedLang === lang
                        ? 'bg-[#2D2D2D] text-white'
                        : 'text-[#2D2D2D]/70 hover:bg-gray-100'
                    }`}
                  >
                    {labels[lang] || lang}
                  </button>
                )
              })}
            </div>
          )}

          {/* Dual-Language Titles */}
          <div className="mb-6">
            {/* Alternative Language Title (smaller, lighter, above) */}
            {getAltTitle() && (
              <div className="text-sm text-[#2D2D2D]/60 mb-2 font-lora">
                {getAltTitle()}
              </div>
            )}
            {/* Primary Language Title (large, bold) */}
            <h1 className={`font-playfair text-4xl font-bold text-[#2D2D2D] ${isDevanagari ? 'devanagari' : ''}`}>
              {getPrimaryTitle()}
            </h1>
          </div>

          {/* Byline */}
          {metadata && (
            <div className="mb-4">
              <p className="text-sm italic text-[#2D2D2D]/70 font-lora">
                By {metadata.author} — {metadata.designation}
              </p>
            </div>
          )}

          {/* Tag Row - Light gray badges */}
          {metadata && metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div
          ref={contentRef}
          className={`markdown-content ${isDevanagari ? 'devanagari' : ''}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
