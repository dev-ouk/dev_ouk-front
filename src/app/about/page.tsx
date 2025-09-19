export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">About Me</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            프론트엔드 개발자로서의 여정과 경험을 공유합니다
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">소개</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            안녕하세요! 저는 사용자 경험을 중시하는 프론트엔드 개발자입니다. 
            현대적인 웹 기술을 활용하여 직관적이고 아름다운 인터페이스를 만드는 것을 목표로 하고 있습니다.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            지속적인 학습과 성장을 통해 더 나은 개발자가 되기 위해 노력하고 있으며, 
            개발 과정에서 얻은 지식과 경험을 공유하는 것을 좋아합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">기술 스택</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'Vue.js', 'Tailwind CSS', 'Styled Components'].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Firebase'].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code'].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">경험</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">프론트엔드 개발자</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">2023 - 현재</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  React와 Next.js를 활용한 웹 애플리케이션 개발
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">웹 개발 학습</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">2022 - 2023</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  다양한 프로젝트를 통한 실무 경험 축적
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">관심사</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">UI/UX 디자인</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                사용자 중심의 직관적인 인터페이스 설계
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">성능 최적화</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                빠르고 효율적인 웹 애플리케이션 구현
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">최신 기술</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                새로운 기술 트렌드 학습 및 적용
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
