'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'

export default function LoginButton() {
  const { data: session, status } = useSession()
  const { user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          로그인
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <img
          src={user?.image || '/default-avatar.png'}
          alt={user?.name || 'User'}
          className="w-8 h-8 rounded-full"
        />
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || '사용자'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role === 'admin' ? '관리자' : '일반 사용자'}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {user?.role === 'admin' ? '관리자' : '일반 사용자'}
            </div>
          </div>
          <button
            onClick={() => {
              signOut()
              setIsDropdownOpen(false)
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
