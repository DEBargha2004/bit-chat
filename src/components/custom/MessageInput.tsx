'use client'

import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Paperclip, Send, X } from 'lucide-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { bucket, db } from '../../../firebase.config'
import useGlobalAppState from '@/hooks/use-global-app-state'
import { useToast } from '@/components/ui/use-toast'
import { ref, uploadBytes } from 'firebase/storage'

export default function MessageInput ({ className }: { className?: string }) {
  const [message, setMessage] = useState('')
  const [image, setImage] = useState('')
  const { _id } = useGlobalAppState()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  function handleImageChange (e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file[0])
      reader.onload = () => {
        if (file[0].size > 1024 * 1024) {
          toast({
            title: 'Image too large',
            description: 'Image must be less than 1MB in size'
          })
          imageInputRef.current!.value = ''
        } else {
          setImage(reader.result as string)
        }
      }
    }
  }

  async function handleSubmit (e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!_id || !(message || image)) return

    const message_container = []
    if (image) {
      const image_id = crypto.randomUUID()
      message_container.push({
        type: 'image',
        data: image_id
      })
      await uploadBytes(
        ref(bucket, `images/${image_id}`),
        Buffer.from(image.split(',')[1] as string, 'base64')
      )
    }

    if (message) {
      message_container.push({
        type: 'text',
        data: message
      })
    }

    await addDoc(collection(db, 'messages'), {
      messages: message_container,
      createdAt: serverTimestamp(),
      user_id: _id
    })

    setMessage('')
    setImage('')
  }
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex justify-between items-center gap-1 relative',
        className
      )}
    >
      {image ? (
        <div className='absolute bottom-full left-0 w-full p-2 hover:bg-accent rounded transition-all mb-2 flex justify-between items-start'>
          <img src={image} className='h-16 rounded' />
          <span>
            <X className='h-4 cursor-pointer' onClick={() => setImage('')} />
          </span>
        </div>
      ) : null}
      <input
        type='file'
        className='hidden'
        accept='image/*'
        id='image'
        ref={imageInputRef}
        onChange={handleImageChange}
      />
      <label
        htmlFor='image'
        className='p-4 cursor-pointer hover:bg-muted rounded'
      >
        <Paperclip />
      </label>
      <Input
        value={message}
        onChange={e => setMessage(e.target.value)}
        className='h-full'
      />
      <Button className='h-full' disabled={!(message || image) || !_id}>
        <Send />
      </Button>
    </form>
  )
}
