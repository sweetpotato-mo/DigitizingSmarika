'use client'

import { Suspense } from 'react'
import Link from 'next/link'

function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2] p-8 text-center">
      <h1 className="font-playfair text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="font-lora text-stone-500 mb-8 italic text-lg">The heritage you are looking for has moved in time.</p>
      <Link href="/" className="bg-[#2D2D2D] text-white px-6 py-2 rounded text-xs font-bold tracking-widest uppercase hover:bg-black transition-all shadow-md">
        Return Home
      </Link>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense>
      <NotFoundContent />
    </Suspense>
  )
}