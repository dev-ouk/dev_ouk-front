import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url('/main.png')`
        }}></div>
        
        {/* 다크 오버레이 */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* 추가 빛나는 효과들 */}
        <div className="absolute inset-0">
          {/* 빛나는 퍼즐 조각들 - 이미지와 어울리게 */}
          <div className="absolute top-20 left-1/4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg transform rotate-12 animate-pulse opacity-70 blur-sm"></div>
          <div className="absolute top-40 right-1/4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg transform -rotate-12 animate-pulse opacity-60 blur-sm"></div>
          <div className="absolute top-60 left-1/2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-lg transform rotate-45 animate-pulse opacity-80 blur-sm"></div>
          <div className="absolute bottom-1/3 right-1/3 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg transform -rotate-45 animate-pulse opacity-50 blur-sm"></div>
          
          {/* 별빛 효과 */}
          <div className="absolute top-32 left-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping"></div>
          <div className="absolute top-48 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-2/3 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="mb-8">
            {/* 메인 로고 */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                {/* 외부 링 */}
                <div className="absolute inset-0 border-2 border-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-spin-slow"></div>
                {/* 내부 그라디언트 원 */}
                <div className="absolute inset-2 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-4xl">D</span>
                </div>
                {/* 빛나는 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              </div>
            </div>

            {/* 메인 타이틀 */}
            <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
              <span className="inline-block animate-fade-in-up delay-300">Dev</span>{' '}
              <span className="inline-block animate-fade-in-up delay-500">OUK</span>
            </h1>
            
            {/* 서브타이틀 */}
            <div className="relative">
              <p className="text-2xl md:text-3xl text-white mb-6 max-w-4xl mx-auto leading-relaxed font-light">
                <span className="inline-block animate-fade-in-up delay-700 text-cyan-200">코드로</span>{' '}
                <span className="inline-block animate-fade-in-up delay-900 text-purple-200">꿈을</span>{' '}
                <span className="inline-block animate-fade-in-up delay-1100 text-pink-200">현실로</span>
              </p>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
                프론트엔드 개발자로서의 여정을 기록하고, 지식을 공유하는 공간입니다
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <Link 
              href="/projects" 
              className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500/90 to-blue-600/90 backdrop-blur-sm text-white rounded-xl font-semibold text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 border border-cyan-400/30"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                프로젝트 보기
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            </Link>
            <Link 
              href="/tech-blog" 
              className="group relative px-10 py-5 bg-transparent border-2 border-cyan-400/60 text-cyan-200 backdrop-blur-sm rounded-xl font-semibold text-xl transition-all duration-500 hover:bg-cyan-400/20 hover:text-white hover:scale-110 hover:shadow-2xl hover:shadow-cyan-400/50"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                기술 블로그
              </span>
            </Link>
          </div>

          {/* 스크롤 인디케이터 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              열정적인 프론트엔드 개발자로, 사용자 경험을 중시하며 지속적으로 성장하고 있습니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">프론트엔드 개발</h3>
              <p className="text-gray-600 dark:text-gray-300">React, Next.js, TypeScript를 활용한 현대적인 웹 애플리케이션 개발</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">UI/UX 디자인</h3>
              <p className="text-gray-600 dark:text-gray-300">사용자 중심의 직관적이고 아름다운 인터페이스 설계</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">성능 최적화</h3>
              <p className="text-gray-600 dark:text-gray-300">빠르고 효율적인 웹 애플리케이션 구현</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/about" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
            >
              더 알아보기
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              다양한 기술 스택을 활용하여 구현한 프로젝트들을 소개합니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "E-Commerce Platform",
                description: "Next.js와 Stripe를 활용한 풀스택 쇼핑몰",
                tech: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
                status: "완료"
              },
              {
                title: "Task Management App",
                description: "실시간 협업을 위한 프로젝트 관리 도구",
                tech: ["React", "Node.js", "Socket.io", "MongoDB"],
                status: "진행중"
              },
              {
                title: "Weather Dashboard",
                description: "날씨 정보와 데이터 시각화 대시보드",
                tech: ["Vue.js", "Chart.js", "API Integration"],
                status: "완료"
              }
            ].map((project, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/projects" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
            >
              모든 프로젝트 보기
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">함께 소통해요</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            기술에 대한 이야기, 프로젝트 협업, 또는 단순한 인사까지 언제든 환영합니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              연락하기
            </Link>
            <Link 
              href="/portfolio" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              포트폴리오 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
