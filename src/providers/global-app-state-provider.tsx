'use client'

import { Dispatch, SetStateAction, createContext, useState } from 'react'

export const GlobalAppContext = createContext({})

export type GlobalAppStateType = {
  _id: string
  setId: Dispatch<SetStateAction<string>>
  messages: MessageType[]
  setMessages: Dispatch<SetStateAction<MessageType[]>>
  online_count: number
  setOnlineCount: Dispatch<SetStateAction<number>>
}

export type MessageType = {
  id: string
  messages: MessageComponentType[]
  timestamp: any
  user_id: string
}

export type MessageComponentType = {
  type: 'text' | 'image'
  data: string
}

export default function GlobalAppStateProvider ({
  children
}: {
  children: React.ReactNode
}) {
  const [_id, setId] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])
  const [online_count, setOnlineCount] = useState(0)
  return (
    <GlobalAppContext.Provider
      value={{
        _id,
        setId,
        messages,
        setMessages,
        online_count,
        setOnlineCount
      }}
    >
      {children}
    </GlobalAppContext.Provider>
  )
}
