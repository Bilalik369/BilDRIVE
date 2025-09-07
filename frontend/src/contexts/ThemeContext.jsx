import React, { createContext, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTheme } from '../redux/slices/uiSlice'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.ui.theme)

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    
    // Store theme in localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      dispatch(setTheme(savedTheme))
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      dispatch(setTheme(prefersDark ? 'dark' : 'light'))
    }
  }, [dispatch])

  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
