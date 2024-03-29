'use client'

import { cn } from '@/lib/utils'
import MessageInput from './MessageInput'
import { useEffect, useRef } from 'react'
import useGlobalAppState from '@/hooks/use-global-app-state'
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore'
import { db } from '../../../firebase.config'
import { MessageType } from '@/providers/global-app-state-provider'
import MessageWrapper from './MessageWrapper'
import { UserCircle2 } from 'lucide-react'
import MessageComponent from './MessageComponent'
import MessageContainer from './MessageContainer'

export default function ChatBox ({ className }: { className?: string }) {
  const { _id, messages, setMessages } = useGlobalAppState()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!_id) return

    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(30)
    )
    const unsubscribe = onSnapshot(q, q_snapshot => {
      const messages_arr: MessageType[] = []
      q_snapshot.forEach(doc => {
        messages_arr.push({ ...doc.data(), id: doc.id } as MessageType)
      })

      setMessages(messages_arr.reverse())
    })

    return () => unsubscribe()
  }, [_id])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollBy({
        behavior: 'smooth',
        top: scrollAreaRef.current.scrollHeight
      })
    }
  }, [messages])
  return (
    <>
      <section className={cn('h-full', className)}>
        <div
          ref={scrollAreaRef}
          className='h-[90%] flex flex-col w-full p-3 scroller overflow-y-auto'
        >
          {messages.map((message, message_idx) => (
            <MessageWrapper
              className={`flex my-2 ${
                message.user_id === _id ? 'justify-end' : 'justify-start'
              }`}
              key={message.id}
            >
              <div
                className={cn(
                  'flex gap-2',
                  message.user_id === _id && 'flex-row-reverse'
                )}
              >
                <UserCircle2
                  className={cn(
                    'text-slate-300 shrink-0',
                    messages[message_idx - 1]?.user_id === message.user_id &&
                      'opacity-0'
                  )}
                />
                <div className={`p-2 rounded-lg bg-muted space-y-2 `}>
                  {message.messages.map((m, m_idx) => (
                    <MessageComponent data={m.data} type={m.type} key={m_idx} />
                  ))}
                </div>
              </div>
            </MessageWrapper>
          ))}

          {/* <div className='w-full flex justify-center items-center text-sm dark:text-slate-300 text-slate-600'>
            <span>Messages will automatically deleted after 12:00 AM</span>
          </div> */}
        </div>
        {/* <div className='h-[10%] w-full bg-red-400'></div> */}
        <MessageInput className='h-[10%]' />
      </section>
    </>
  )
}
