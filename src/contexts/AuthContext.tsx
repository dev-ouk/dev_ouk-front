'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export type UserRole = 'admin' | 'user' | 'guest'

interface AuthContextType {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: UserRole
  } | null
  isLoading: boolean
  canWrite: boolean
  canEdit: boolean
  canDelete: boolean
  canComment: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (status !== 'loading') {
      setIsLoading(false)
    }
  }, [status])

  // 서버 사이드 렌더링 중에는 기본값으로 Provider 제공
  if (!mounted) {
    const defaultValue = {
      user: null,
      isLoading: true,
      canWrite: false,
      canEdit: false,
      canDelete: false,
      canComment: false,
    }
    return (
      <AuthContext.Provider value={defaultValue}>
        {children}
      </AuthContext.Provider>
    )
  }

  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: (session.user.role as UserRole) || 'user'
  } : null

  // 권한 체크 함수들
  const canWrite = user?.role === 'admin'
  const canEdit = user?.role === 'admin'
  const canDelete = user?.role === 'admin'
  const canComment = user?.role === 'admin' || user?.role === 'user'

  const value = {
    user,
    isLoading,
    canWrite,
    canEdit,
    canDelete,
    canComment,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
