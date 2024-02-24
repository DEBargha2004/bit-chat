'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import useGlobalAppState from '@/hooks/use-global-app-state'

const Switch = dynamic(() => import('./Switch'), { ssr: false })

export default function Navbar ({ className }: { className?: string }) {
  const { online_count } = useGlobalAppState()
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
      <span className='font-medium'>{online_count} online</span>
      <Switch />
    </section>
  )
}
