'use client'

import { Dispatch, SetStateAction, createContext, useState } from 'react'

export const GlobalAppContext = createContext({})

export type GlobalAppStateType = {
  _id: string
  setId: Dispatch<SetStateAction<string>>
  messages: MessageType[]
  setMessages: Dispatch<SetStateAction<MessageType[]>>
  onlineUsers: { [key: string]: { status: string; typing: boolean } }
  setOnlineUsers: Dispatch<
    SetStateAction<{ [key: string]: { status: string; typing: boolean } }>
  >
}

export type MessageType = {
  id: string
  messages: MessageComponentType[]
  timestamp: any
  user_id: string
}

export type MessageComponentType = {
  type: 'text' | 'image' | 'video'
  data: string
}

export default function GlobalAppStateProvider ({
  children
}: {
  children: React.ReactNode
}) {
  const [_id, setId] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])
  const [onlineUsers, setOnlineUsers] = useState<
    GlobalAppStateType['onlineUsers']
  >({})
  return (
    <GlobalAppContext.Provider
      value={{
        _id,
        setId,
        messages,
        setMessages,
        onlineUsers,
        setOnlineUsers
      }}
    >
      {children}
    </GlobalAppContext.Provider>
  )
}
