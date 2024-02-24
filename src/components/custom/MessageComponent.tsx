import { MessageComponentType } from '@/providers/global-app-state-provider'
import { getDownloadURL, ref } from 'firebase/storage'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { bucket } from '../../../firebase.config'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import MessageImage from './MessageImage'

export default function MessageComponent ({ type, data }: MessageComponentType) {
  switch (type) {
    case 'text':
      return <p>{data}</p>
      break

    case 'image':
      return <MessageImage data={data} />
      break
  }
}
