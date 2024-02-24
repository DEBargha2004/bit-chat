import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const MessageContainer = forwardRef<
  HTMLDivElement,
  {
    children?: React.ReactNode
    className?: string
  }
>(({ children, className }, ref) => {
  return (
    <div className={cn('w-full overflow-y-auto', className)} ref={ref}>
      {children}
    </div>
  )
})

export default MessageContainer
