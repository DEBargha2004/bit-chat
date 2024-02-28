'use client'

import ChatBox from '@/components/custom/Chatbox'
import Navbar from '@/components/custom/Navbar'
import useGlobalAppState from '@/hooks/use-global-app-state'
import { onDisconnect, onValue, ref, set } from 'firebase/database'
import { useEffect } from 'react'
import { realtimeDB } from '../../firebase.config'

export default function Home () {
  const { setId, setOnlineUsers } = useGlobalAppState()
  useEffect(() => {
    let id = sessionStorage.getItem('_id')
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem('_id', id)
      setId(id)
    } else {
      setId(id)
    }

    const connectionRef = ref(realtimeDB, 'active_users/' + id)
    const connections_Ref = ref(realtimeDB, 'active_users')
    onValue(connections_Ref, snapshot => {
      const active_users = snapshot.val()
      console.log(active_users)

      setOnlineUsers(active_users)
    })
    set(connectionRef, { status: 'online', typing: false })
    onDisconnect(connectionRef).remove()
    return () => {}
  }, [])

  return (
    <main className='h-full'>
      <Navbar className='h-[10%]' />
      <ChatBox className='h-[90%]' />
    </main>
  )
}
