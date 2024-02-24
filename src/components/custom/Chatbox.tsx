'use client'

import { cn } from '@/lib/utils'
import MessageInput from './MessageInput'
import { useEffect, useRef } from 'react'
import useGlobalAppState from '@/hooks/use-global-app-state'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../../firebase.config'
import { MessageType } from '@/providers/global-app-state-provider'
import MessageWrapper from './MessageWrapper'
import { UserCircle2 } from 'lucide-react'
import MessageComponent from './MessageComponent'
import { ScrollArea } from '../ui/scroll-area'
import MessageContainer from './MessageContainer'

export default function ChatBox ({ className }: { className?: string }) {
  const { _id, messages, setMessages } = useGlobalAppState()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!_id) return

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, q_snapshot => {
      const messages_arr: MessageType[] = []
      q_snapshot.forEach(doc => {
        messages_arr.push({ ...doc.data(), id: doc.id } as MessageType)
      })

      setMessages(messages_arr)
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
        <MessageContainer
          ref={scrollAreaRef}
          className='h-[90%] flex flex-col w-full p-3 scroller'
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
                    'text-slate-300',
                    messages[message_idx - 1]?.user_id === message.user_id &&
                      'opacity-0'
                  )}
                />
                <div className={`p-2 rounded-lg bg-muted space-y-2`}>
                  {message.messages.map(m => (
                    <MessageComponent data={m.data} type={m.type} />
                  ))}
                </div>
              </div>
            </MessageWrapper>
          ))}
          {/* <div className='w-full flex justify-center items-center text-sm dark:text-slate-300 text-slate-600'>
            <span>Messages will automatically deleted after 12:00 AM</span>
          </div> */}
        </MessageContainer>
        <MessageInput className='h-[10%]' />
      </section>
    </>
  )
}
