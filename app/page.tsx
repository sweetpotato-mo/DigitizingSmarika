'use client'

import { useEffect, useState, Suspense } from 'react'
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

function HomeContent() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [editorial, setEditorial] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const libResponse = await fetch('/library.json')
        const libData = await libResponse.json()
        setArticles(libData)

        const editorialFile = `/content/editorial/editorial-${language}.md`
        const editorialResponse = await fetch(editorialFile)
        if (editorialResponse.ok) {
          const editorialText = await editorialResponse.text()
          setEditorial(editorialText)
        }
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [language])

  const getTitle = (article: Article) => (language === 'ne' ? article.titleNe || article.titleEn : article.titleEn)
  const getAltTitle = (article: Article) => (language === 'ne' ? article.titleEn : article.titleNe || article.titleNew)

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      Poem: 'bg-pink-100 text-pink-800',
      'Nepal Bhasa': 'bg-purple-100 text-purple-800',
      History: 'bg-blue-100 text-blue-800',
      Heritage: 'bg-green-100 text-green-800',
      Culture: 'bg-rose-100 text-rose-800',
    }
    return colors[tag] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400 font-lora italic">Loading Smarika...</div>

  return (
    <main className="min-h-screen pt-24 bg-[#F9F7F2]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Editorial Section with Headings */}
        {editorial && (
          <section className="mb-20">
            <article className="prose prose-stone max-w-none 
              prose-h1:font-playfair prose-h1:text-4xl prose-h1:text-[#2D2D2D] prose-h1:mb-4
              prose-h2:font-playfair prose-h2:text-2xl prose-h2:text-stone-500 prose-h2:mb-8 prose-h2:mt-0
              prose-p:font-lora prose-p:text-lg prose-p:leading-relaxed prose-p:text-stone-800">
              <ReactMarkdown>{editorial}</ReactMarkdown>
            </article>
            <div className="flex items-center justify-center my-16">
              <div className="flex-1 border-t border-stone-200" />
              <div className="mx-6 text-stone-300 text-xl">◆</div>
              <div className="flex-1 border-t border-stone-200" />
            </div>
          </section>
        )}

        <section id="toc">
          <h2 className={`font-playfair text-3xl font-bold mb-12 text-center text-[#2D2D2D] ${language === 'ne' ? 'font-noto' : ''}`}>
            {language === 'ne' ? 'लेख सूची' : 'Contents Overview'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link key={article.slug} href={`/archive/${article.slug}`} 
                className="bg-white rounded-lg p-8 border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                {getAltTitle(article) && <div className="text-blue-600 text-[10px] mb-2 font-lora uppercase tracking-[0.2em] opacity-30">{getAltTitle(article)}</div>}
                <h3 className="font-playfair text-2xl font-bold mb-4 text-[#2D2D2D] group-hover:text-stone-600 transition-colors leading-tight">{getTitle(article)}</h3>
                <div className="mb-6 font-lora">
                  <div className="font-bold text-stone-800">{article.author}</div>
                  <div className="text-sm text-stone-400 italic">{article.designation}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => <span key={tag} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTagColor(tag)}`}>{tag}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}