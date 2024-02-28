import { MessageComponentType } from '@/providers/global-app-state-provider'

export default function PreviewComponent ({
  url,
  type
}: {
  url: string
  type: 'image' | 'video' | 'audio'
}) {
  switch (type) {
    case 'image':
      return (
        <img
          alt='image'
          src={url}
          width={100}
          height={100}
          className='h-[100px] cursor-pointer object-contain w-auto rounded'
        />
      )

      break
    case 'video':
      return (
        <video
          src={url}
          width={100}
          height={100}
          className='h-[100px] cursor-pointer object-cover w-auto rounded'
          controls
        />
      )

      break

    default:
      break
  }
}
