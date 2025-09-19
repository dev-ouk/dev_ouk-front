export default function Portfolio() {
  const skills = [
    { name: "React", level: 90, category: "Frontend" },
    { name: "Next.js", level: 85, category: "Frontend" },
    { name: "TypeScript", level: 80, category: "Frontend" },
    { name: "JavaScript", level: 90, category: "Frontend" },
    { name: "Tailwind CSS", level: 85, category: "Frontend" },
    { name: "Node.js", level: 70, category: "Backend" },
    { name: "MongoDB", level: 65, category: "Backend" },
    { name: "Git", level: 80, category: "Tools" },
    { name: "AWS", level: 60, category: "Tools" }
  ]

  const experiences = [
    {
      title: "프론트엔드 개발자",
      company: "개인 프로젝트",
      period: "2023 - 현재",
      description: "React와 Next.js를 활용한 다양한 웹 애플리케이션 개발 및 개인 프로젝트 진행"
    },
    {
      title: "웹 개발 학습",
      company: "온라인 강의 및 독학",
      period: "2022 - 2023",
      description: "HTML, CSS, JavaScript부터 React, Node.js까지 전반적인 웹 개발 기술 학습"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Portfolio</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            프론트엔드 개발자로서의 경험과 기술을 한눈에 볼 수 있습니다
          </p>
        </div>

        {/* 다운로드 버튼 */}
        <div className="text-center mb-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF 이력서 다운로드
          </button>
        </div>

        {/* 개인 정보 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">개인 정보</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">이름</h3>
              <p className="text-gray-600 dark:text-gray-300">Dev OUK</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">직무</h3>
              <p className="text-gray-600 dark:text-gray-300">프론트엔드 개발자</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">경력</h3>
              <p className="text-gray-600 dark:text-gray-300">1년+</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">지역</h3>
              <p className="text-gray-600 dark:text-gray-300">서울, 대한민국</p>
            </div>
          </div>
        </div>

        {/* 기술 스택 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">기술 스택</h2>
          <div className="space-y-6">
            {['Frontend', 'Backend', 'Tools'].map(category => (
              <div key={category}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{category}</h3>
                <div className="space-y-3">
                  {skills.filter(skill => skill.category === category).map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 경험 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">경험</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{exp.company}</p>
                <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 연락처 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">연락처</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">이메일</p>
                <p className="text-gray-600 dark:text-gray-300">contact@dev-ouk.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">GitHub</p>
                <p className="text-gray-600 dark:text-gray-300">github.com/dev-ouk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
