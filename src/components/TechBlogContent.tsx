'use client'

import { AdminOnly, UserOnly } from '@/components/ProtectedComponent'
import { useAuth } from '@/contexts/AuthContext'
import { signIn } from 'next-auth/react'

export default function TechBlogContent() {
  const { user, canWrite, canComment } = useAuth()
  
  const posts = [
    {
      title: "Next.js 15의 새로운 기능들",
      excerpt: "Next.js 15에서 추가된 새로운 기능들과 개선사항에 대해 알아보겠습니다.",
      date: "2024-01-15",
      category: "Next.js",
      readTime: "5분",
      tags: ["Next.js", "React", "JavaScript"]
    },
    {
      title: "TypeScript를 활용한 타입 안전한 개발",
      excerpt: "TypeScript를 사용하여 더 안전하고 유지보수하기 쉬운 코드를 작성하는 방법을 소개합니다.",
      date: "2024-01-10",
      category: "TypeScript",
      readTime: "8분",
      tags: ["TypeScript", "JavaScript", "개발"]
    },
    {
      title: "Tailwind CSS로 반응형 디자인 구현하기",
      excerpt: "Tailwind CSS의 유틸리티 클래스를 활용하여 효율적인 반응형 디자인을 구현하는 방법을 알아봅니다.",
      date: "2024-01-05",
      category: "CSS",
      readTime: "6분",
      tags: ["Tailwind CSS", "CSS", "디자인"]
    },
    {
      title: "React에서 성능 최적화 기법",
      excerpt: "React 애플리케이션의 성능을 향상시키는 다양한 최적화 기법들을 실습 예제와 함께 소개합니다.",
      date: "2024-01-01",
      category: "React",
      readTime: "10분",
      tags: ["React", "성능", "최적화"]
    },
    {
      title: "웹 접근성(Accessibility) 가이드",
      excerpt: "모든 사용자가 웹사이트를 쉽게 사용할 수 있도록 하는 접근성 구현 방법을 알아봅니다.",
      date: "2023-12-25",
      category: "웹접근성",
      readTime: "7분",
      tags: ["접근성", "a11y", "웹표준"]
    },
    {
      title: "Git 브랜치 전략과 협업 워크플로우",
      excerpt: "효율적인 Git 브랜치 전략과 팀 협업을 위한 워크플로우에 대해 설명합니다.",
      date: "2023-12-20",
      category: "Git",
      readTime: "9분",
      tags: ["Git", "협업", "버전관리"]
    }
  ]

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <article key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            {post.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded">
                  #{tag}
                </span>
              ))}
            </div>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.date).toLocaleDateString('ko-KR')}
            </time>
          </div>
          
          {/* 권한 기반 액션 버튼들 */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                자세히 보기
              </button>
              
              <AdminOnly>
                <button className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline ml-2">
                  수정
                </button>
                <button className="text-sm text-red-600 dark:text-red-400 hover:underline ml-2">
                  삭제
                </button>
              </AdminOnly>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">댓글 0</span>
              <UserOnly
                fallback={
                  !user ? (
                    <button
                      onClick={() => signIn()}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      댓글 작성하려면 로그인하세요
                    </button>
                  ) : null
                }
              >
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  댓글 작성
                </button>
              </UserOnly>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
