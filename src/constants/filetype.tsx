import { Image, Video } from 'lucide-react'

type FileType = {
  type: string
  label: string
  storagePath: string
  icon: ({ className }: { className: string }) => JSX.Element
  max_size?: number
}

export const FileType: FileType[] = [
  {
    type: 'image',
    label: 'Image',
    storagePath: 'images/',
    icon: ({ className }: { className: string }) => (
      <Image className={className} />
    ),
    max_size: 1024 * 1024
  },
  {
    type: 'video',
    label: 'Video',
    storagePath: 'videos/',
    icon: ({ className }: { className: string }) => (
      <Video className={className} />
    ),
    max_size: 1024 * 1024 * 5
  }
]
