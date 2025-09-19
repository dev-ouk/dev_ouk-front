export default function TechBlog() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Tech Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            개발 과정에서 배운 지식과 경험을 공유하는 기술 블로그입니다
          </p>
        </div>

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
              
              <div className="flex justify-between items-center">
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
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            더 많은 글 보기
          </button>
        </div>
      </div>
    </div>
  )
}
