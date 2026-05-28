'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeCtx {
  isDark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeCtx>({ isDark: false, toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(localStorage.getItem('snoops_theme') === 'dark')
  }, [])

  const toggle = () =>
    setIsDark((v) => {
      localStorage.setItem('snoops_theme', !v ? 'dark' : 'light')
      return !v
    })

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <div className={isDark ? 'dark' : ''} style={{ height: '100%' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
