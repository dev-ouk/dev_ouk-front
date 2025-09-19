'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

interface ProtectedComponentProps {
  children: ReactNode
  requiredRole?: 'admin' | 'user' | 'guest'
  fallback?: ReactNode
}

export default function ProtectedComponent({ 
  children, 
  requiredRole = 'guest', 
  fallback = null 
}: ProtectedComponentProps) {
  const { user, canWrite, canEdit, canDelete, canComment } = useAuth()

  const hasPermission = () => {
    if (requiredRole === 'guest') return true
    
    if (!user) return false
    
    if (requiredRole === 'user') {
      return user.role === 'user' || user.role === 'admin'
    }
    
    if (requiredRole === 'admin') {
      return user.role === 'admin'
    }
    
    return false
  }

  if (!hasPermission()) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// 편의 컴포넌트들
export function AdminOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <ProtectedComponent requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedComponent>
  )
}

export function UserOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <ProtectedComponent requiredRole="user" fallback={fallback}>
      {children}
    </ProtectedComponent>
  )
}

export function GuestOnly({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <ProtectedComponent requiredRole="guest" fallback={fallback}>
      {children}
    </ProtectedComponent>
  )
}
