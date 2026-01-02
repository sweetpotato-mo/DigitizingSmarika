'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import ReactMarkdown from 'react-markdown'

interface Article {
  slug: string
  titleEn: string
  titleNe: string
  titleNew: string
  author: string
  designation: string
  tags: string[]
  languageAvailability: string[]
}

export default function Home() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [editorial, setEditorial] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load library.json
        const libResponse = await fetch('/library.json')
        const libData = await libResponse.json()
        setArticles(libData)

        // Load editorial
        const editorialFile = `/content/editorial/editorial-${language}.md`
        try {
          const editorialResponse = await fetch(editorialFile)
          if (editorialResponse.ok) {
            const editorialText = await editorialResponse.text()
            setEditorial(editorialText)
          }
        } catch (err) {
          // Editorial file might not exist, that's okay
          console.log('Editorial file not found')
        }
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [language])

  const getTitle = (article: Article) => {
    if (language === 'ne') {
      return article.titleNe || article.titleEn
    }
    return article.titleEn
  }

  const getAltTitle = (article: Article) => {
    if (language === 'ne') {
      return article.titleEn
    }
    return article.titleNe || article.titleNew
  }

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      Poem: 'bg-pink-100 text-pink-800',
      'Nepal Bhasa': 'bg-purple-100 text-purple-800',
      History: 'bg-blue-100 text-blue-800',
      Craftsmanship: 'bg-amber-100 text-amber-800',
      Heritage: 'bg-green-100 text-green-800',
      Tradition: 'bg-teal-100 text-teal-800',
      Science: 'bg-indigo-100 text-indigo-800',
      Chemistry: 'bg-cyan-100 text-cyan-800',
      Culture: 'bg-rose-100 text-rose-800',
      Newar: 'bg-violet-100 text-violet-800',
      Essay: 'bg-orange-100 text-orange-800',
      Philosophy: 'bg-slate-100 text-slate-800',
    }
    return colors[tag] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Editorial Section */}
        {editorial && (
          <section className="mb-16">
            <article className="max-w-[850px] mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
                <div className="markdown-content editorial-content">
                  <ReactMarkdown>{editorial}</ReactMarkdown>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Decorative Separator */}
        {editorial && (
          <div className="flex items-center justify-center my-16">
            <div className="flex-1 border-t border-stone-300"></div>
            <div className="mx-4 text-stone-400 text-2xl">◆</div>
            <div className="flex-1 border-t border-stone-300"></div>
          </div>
        )}

        {/* Table of Contents & Article Cards */}
        <section id="toc">
          <h2 className={`font-playfair text-3xl font-bold mb-12 text-center ${language === 'ne' ? 'font-noto' : ''}`}>
            {language === 'ne' ? 'लेख सूची' : 'Contents Overview'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/archive/${article.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-[0_8px_16px_rgba(139,115,85,0.15)] hover:-translate-y-[4px] transition-all duration-200 p-6 border border-stone-200 group"
              >
                {/* Alternative Language Title (watermark style) */}
                {getAltTitle(article) && (
                  <div className="text-blue-600 text-xs mb-1 font-lora uppercase tracking-widest opacity-25">
                    {getAltTitle(article)}
                  </div>
                )}

                {/* Active Language Title (large Playfair Display, 2xl, bold) */}
                <h3 className="font-playfair text-2xl font-bold mb-4 group-hover:opacity-80 transition-opacity">
                  {getTitle(article)}
                </h3>

                {/* Author & Designation */}
                <div className="mb-4">
                  <div className="font-medium font-lora">{article.author}</div>
                  <div className="text-sm opacity-70 font-lora">{article.designation}</div>
                </div>

                {/* Tags as small rounded badges */}
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
