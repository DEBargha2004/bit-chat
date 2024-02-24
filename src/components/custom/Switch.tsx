import { Moon, SunMedium } from 'lucide-react'
import { Button } from '../ui/button'
import { useTheme } from 'next-themes'

export default function Switch () {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant='ghost'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <SunMedium /> : <Moon />}
    </Button>
  )
}
