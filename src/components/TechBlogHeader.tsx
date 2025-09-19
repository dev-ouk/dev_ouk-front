'use client'

import { AdminOnly } from '@/components/ProtectedComponent'
import { useAuth } from '@/contexts/AuthContext'
import { signIn } from 'next-auth/react'

export default function TechBlogHeader() {
  const { user } = useAuth()

  return (
    <div className="text-center mb-16">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Tech Blog</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
        개발 과정에서 배운 지식과 경험을 공유하는 기술 블로그입니다
      </p>
      
      {/* 권한 기반 액션 버튼들 */}
      <div className="flex justify-center gap-4">
        <AdminOnly
          fallback={
            !user ? (
              <button
                onClick={() => signIn()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                글 작성하려면 로그인하세요
              </button>
            ) : null
          }
        >
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
            새 글 작성
          </button>
        </AdminOnly>
      </div>
    </div>
  )
}
