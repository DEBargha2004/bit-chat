'use client'

import ChatBox from '@/components/custom/Chatbox'
import Navbar from '@/components/custom/Navbar'
import useGlobalAppState from '@/hooks/use-global-app-state'
import {
  goOffline,
  goOnline,
  onDisconnect,
  onValue,
  ref,
  set
} from 'firebase/database'
import { useEffect } from 'react'
import { realtimeDB } from '../../firebase.config'

export default function Home () {
  const { setId, setOnlineCount, online_count } = useGlobalAppState()
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
    const connectionsRef = ref(realtimeDB, 'active_users')
    onValue(connectionsRef, snapshot => {
      const active_users = snapshot.val()
      const keys = Object.keys(active_users)
      setOnlineCount(keys.length)
    })
    set(connectionRef, 'online')
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
