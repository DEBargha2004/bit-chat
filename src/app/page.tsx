'use client'

import ChatBox from '@/components/custom/Chatbox'
import Navbar from '@/components/custom/Navbar'
import useGlobalAppState from '@/hooks/use-global-app-state'
import { useEffect } from 'react'

export default function Home () {
  const { setId } = useGlobalAppState()
  useEffect(() => {
    let id = sessionStorage.getItem('_id')
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem('_id', id)
      setId(id)
    } else {
      setId(id)
    }
  }, [])
  return (
    <main className='h-full'>
      <Navbar className='h-[10%]' />
      <ChatBox className='h-[90%]' />
    </main>
  )
}
