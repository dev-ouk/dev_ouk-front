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
            
            {/* 현재 포지션 & 핵심 키워드 */}
            <div className="relative">
              <p className="text-2xl md:text-3xl text-white mb-6 max-w-4xl mx-auto leading-relaxed font-light">
                <span className="inline-block animate-fade-in-up delay-700 text-cyan-200">Frontend Developer</span>{' '}
                <span className="inline-block animate-fade-in-up delay-900 text-purple-200">지망생</span>
              </p>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
                사용자 경험을 중시하며, 지속적인 학습을 통해 성장하는 개발자
              </p>
              
              {/* 핵심 키워드 */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Problem Solving'].map((keyword, index) => (
                  <span 
                    key={keyword}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium animate-fade-in-up"
                    style={{ animationDelay: `${1.3 + index * 0.1}s` }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link 
              href="/projects" 
              className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500/90 to-blue-600/90 backdrop-blur-sm text-white rounded-xl font-semibold text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 border border-cyan-400/30"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                포트폴리오 보기
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            </Link>
            <Link 
              href="/portfolio" 
              className="group relative px-10 py-5 bg-transparent border-2 border-cyan-400/60 text-cyan-200 backdrop-blur-sm rounded-xl font-semibold text-xl transition-all duration-500 hover:bg-cyan-400/20 hover:text-white hover:scale-110 hover:shadow-2xl hover:shadow-cyan-400/50"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                이력서 다운로드
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

      {/* 짧은 소개 Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">안녕하세요!</h2>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              <strong className="text-gray-900 dark:text-white">Frontend Developer 지망생</strong>으로서, 
              사용자 경험을 최우선으로 생각하며 지속적으로 성장하고 있습니다.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              새로운 기술을 배우고 적용하는 것을 즐기며, 
              문제 해결 과정에서의 학습과 성장을 중요하게 생각합니다.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link 
              href="/about" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              더 자세히 알아보기
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 최근 프로젝트 하이라이트 Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">최근 프로젝트 하이라이트</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              팀 프로젝트와 개인 프로젝트에서의 성과와 경험을 소개합니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 메인 프로젝트 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">E-Commerce Platform</h3>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  완료
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Next.js와 Stripe를 활용한 풀스택 쇼핑몰 개발. 사용자 인증, 상품 관리, 결제 시스템 구현
              </p>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">주요 역할</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">프론트엔드 개발, UI/UX 설계, API 연동</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">사용 기술</h4>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "Stripe", "Tailwind CSS"].map((tech) => (
                    <span key={tech} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <strong>성과:</strong> 월 평균 1,000+ 사용자, 95% 사용자 만족도
              </div>
            </div>

            {/* 두 번째 프로젝트 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-purple-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Task Management App</h3>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  진행중
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                실시간 협업을 위한 프로젝트 관리 도구. 팀원들과 작업 공유 및 진행 상황 추적 기능
              </p>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">주요 역할</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">프론트엔드 개발, 실시간 통신 구현, 반응형 디자인</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">사용 기술</h4>
                <div className="flex flex-wrap gap-2">
                  {["React", "Socket.io", "Node.js", "MongoDB"].map((tech) => (
                    <span key={tech} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <strong>성과:</strong> 실시간 업데이트 지연시간 100ms 이하 달성
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/projects" 
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              전체 포트폴리오 보기
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 연락처 & 이력서 CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">함께 성장해요</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            새로운 기회와 도전을 통해 함께 성장할 수 있는 기회를 기다립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/portfolio" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors text-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              이력서 다운로드
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-colors text-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              연락하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
