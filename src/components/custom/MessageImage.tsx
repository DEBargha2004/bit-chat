import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { getDownloadURL, ref } from 'firebase/storage'
import { bucket } from '../../../firebase.config'
import Image from 'next/image'

export default function MessageImage ({ data }: { data: string }) {
  const [url, setUrl] = useState<string>('')
  useEffect(() => {
    getDownloadURL(ref(bucket, `images/${data}`)).then(url => setUrl(url))
  }, [data])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='w-[100px] h-[100px] overflow-hidden rounded'>
          <Image
            alt='image'
            src={url}
            width={100}
            height={100}
            className='w-full cursor-pointer object-cover h-full'
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <Image
          alt='image'
          src={url}
          width={300}
          height={300}
          className='w-full  rounded'
        />
      </DialogContent>
    </Dialog>
  )
}
