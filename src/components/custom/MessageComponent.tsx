import { MessageComponentType } from '@/providers/global-app-state-provider'
import MessageImage from './MessageImage'
import MessageVideo from './MessageVideo'

export default function MessageComponent ({ type, data }: MessageComponentType) {
  switch (type) {
    case 'text':
      return <p>{data}</p>
      break

    case 'image':
      return <MessageImage data={data} />
      break
    case 'video':
      return <MessageVideo data={data} />
  }
}
