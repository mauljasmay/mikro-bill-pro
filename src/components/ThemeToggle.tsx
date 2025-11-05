'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

function ThemeToggleButton({ size = 'default' }: { size?: 'default' | 'mobile' }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleToggle = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const isMobile = size === 'mobile'
  const padding = isMobile ? 'p-1.5' : 'p-2'
  const iconSize = isMobile ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center justify-center rounded-md ${padding} transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
      aria-label="Toggle theme"
    >
      <Sun className={`${iconSize} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
      <Moon className={`absolute ${iconSize} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export function ThemeToggle() {
  return <ThemeToggleButton size="default" />
}

export function ThemeToggleMobile() {
  return <ThemeToggleButton size="mobile" />
}
