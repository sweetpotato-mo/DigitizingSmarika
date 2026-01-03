'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

  // FIX: Added missing helper functions back into the component scope
  const getTitle = (article: Article) => (language === 'ne' ? article.titleNe || article.titleEn : article.titleEn)
  const getAltTitle = (article: Article) => (language === 'ne' ? article.titleEn : article.titleNe || article.titleNew)

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400 font-lora italic">Loading Smarika...</div>

  return (
    <main className="min-h-screen pt-24 bg-[#F9F7F2]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Editorial Section with Headings */}
        {editorial && (
          <section className="mb-20">
            <article className="
              bg-white p-10 md:p-16 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-stone-100
              markdown-content 
              prose prose-stone max-w-none
              prose-h1:text-center prose-h1:font-playfair prose-h1:text-5xl prose-h1:text-[#2D2D2D] prose-h1:mb-4
              prose-h2:text-center prose-h2:font-lora prose-h2:text-xl prose-h2:text-stone-400 prose-h2:italic prose-h2:font-normal prose-h2:mt-0 prose-h2:mb-12
              prose-p:font-lora prose-p:text-[1.15rem] prose-p:leading-[2] prose-p:text-stone-700 prose-p:mb-8
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{editorial}</ReactMarkdown>
            </article>
            
            <div className="flex items-center justify-center mt-28 mb-20 px-4">
  {/* Left Decorative Line */}
  <div className="hidden md:block h-[1px] flex-1 max-w-[150px] bg-stone-300 shadow-sm" />
  
  <div className="mx-0 md:mx-10 flex flex-col items-center">
    {/* Section Identifier Symbol */}
    <span className="text-stone-300 text-xs mb-3 tracking-[0.5em] font-serif">◈</span>
    
    {/* Main Visible Text - Increased Size and Weight */}
    <span className="text-stone-600 text-xl md:text-2xl tracking-[0.3em] uppercase font-black font-playfair text-center drop-shadow-sm">
      {language === 'ne' ? 'लेख सूची' : 'Archive Contents'}
    </span>
    
    {/* Subtle Subtitle/Indicator */}
    <div className="mt-4 h-1 w-12 bg-stone-800 rounded-full" />
  </div>

  {/* Right Decorative Line */}
  <div className="hidden md:block h-[1px] flex-1 max-w-[150px] bg-stone-300 shadow-sm" />
</div>
          </section>
        )}

        <section id="toc">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.slug} href={`/archive/${article.slug}`} 
                className="group bg-white rounded-xl p-8 border border-stone-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {getAltTitle(article) && (
                    <div className="text-blue-600 text-[10px] mb-3 font-lora uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                      {getAltTitle(article)}
                    </div>
                  )}
                  <h3 className="font-playfair text-2xl font-bold mb-6 text-[#2D2D2D] group-hover:text-stone-600 leading-tight">
                    {getTitle(article)}
                  </h3>
                </div>
                
                <div className="mt-auto pt-6 border-t border-stone-50">
                  <div className="mb-4">
                    <div className="font-lora font-bold text-stone-800 text-sm">{article.author}</div>
                    <div className="font-lora text-xs text-stone-400 italic mt-1">{article.designation}</div>
                  </div>
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