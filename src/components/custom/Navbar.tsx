'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import useGlobalAppState from '@/hooks/use-global-app-state'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger
} from '../ui/drawer'
import { useWindowSize } from '@uidotdev/usehooks'

const Switch = dynamic(() => import('./Switch'), { ssr: false })

export default function Navbar ({ className }: { className?: string }) {
  const { onlineUsers } = useGlobalAppState()
  const { height: windowHeight } = useWindowSize()

  return (
    <section
      className={cn(
        'w-full p-3 navbar flex justify-between items-center shadow-lg shadow-muted gap-2',
        className
      )}
      style={{ height: Number(windowHeight) * 0.1 || '10%' }}
    >
      <Image
        src='https://cdn-icons-png.flaticon.com/512/3686/3686975.png'
        height={30}
        width={30}
        alt='app-icon'
        className=''
      />
      <Drawer>
        <DrawerTrigger asChild className='w-4/5'>
          <div className='font-medium flex justify-center items-center cursor-pointer h-full'>
            {Object.keys(onlineUsers ?? {}).length} online
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className='flex mb-4 justify-center items-center'>
            {Object.keys(onlineUsers ?? {}).length} online
          </DrawerHeader>
          <div className='min-h-[300px] flex flex-col items-center p-4 px-8'>
            {Object.keys(onlineUsers ?? {}).map((key, index) => (
              <div className='lg:w-1/2 grid grid-cols-2' key={key}>
                <p className='w-full truncate'>{key}</p>
                <p
                  className={cn(
                    'flex justify-center',
                    onlineUsers[key]!.typing ? 'text-green-500' : ''
                  )}
                >
                  {onlineUsers[key]!.typing ? 'typing...' : 'online'}
                </p>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
      <div className=' h-full'>
        <Switch />
      </div>
    </section>
  )
}
