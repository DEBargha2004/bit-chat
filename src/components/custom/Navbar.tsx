'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

const Switch = dynamic(() => import('./Switch'), { ssr: false })

export default function Navbar ({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'w-full px-4 py-2 navbar flex justify-between items-center shadow-lg shadow-muted',
        className
      )}
    >
      <Image
        src='https://cdn-icons-png.flaticon.com/512/3686/3686975.png'
        height={30}
        width={30}
        alt='app-icon'
      />
      <Switch />
    </section>
  )
}
