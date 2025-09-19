import TechBlogContent from '@/components/TechBlogContent'
import TechBlogHeader from '@/components/TechBlogHeader'

export default function TechBlog() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <TechBlogHeader />
        <TechBlogContent />
        
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            더 많은 글 보기
          </button>
        </div>
      </div>
    </div>
  )
}
