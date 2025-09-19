export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Next.js와 Stripe를 활용한 풀스택 쇼핑몰 플랫폼입니다. 사용자 인증, 상품 관리, 결제 시스템이 포함되어 있습니다.",
      image: "/api/placeholder/400/300",
      tech: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS", "Prisma"],
      github: "https://github.com/username/ecommerce",
      demo: "https://ecommerce-demo.vercel.app",
      status: "완료",
      category: "Full-stack"
    },
    {
      title: "Task Management App",
      description: "실시간 협업을 위한 프로젝트 관리 도구입니다. 팀원들과 작업을 공유하고 진행 상황을 추적할 수 있습니다.",
      image: "/api/placeholder/400/300",
      tech: ["React", "Node.js", "Socket.io", "MongoDB", "Material-UI"],
      github: "https://github.com/username/taskmanager",
      demo: "https://taskmanager-demo.vercel.app",
      status: "진행중",
      category: "Full-stack"
    },
    {
      title: "Weather Dashboard",
      description: "날씨 정보와 데이터 시각화를 제공하는 대시보드입니다. 다양한 차트와 그래프로 날씨 데이터를 직관적으로 표현합니다.",
      image: "/api/placeholder/400/300",
      tech: ["Vue.js", "Chart.js", "API Integration", "Vuetify"],
      github: "https://github.com/username/weather-dashboard",
      demo: "https://weather-dashboard-demo.vercel.app",
      status: "완료",
      category: "Frontend"
    },
    {
      title: "Blog CMS",
      description: "마크다운 기반의 블로그 콘텐츠 관리 시스템입니다. 작성자가 쉽게 글을 작성하고 관리할 수 있습니다.",
      image: "/api/placeholder/400/300",
      tech: ["Next.js", "MDX", "Gray Matter", "Tailwind CSS"],
      github: "https://github.com/username/blog-cms",
      demo: "https://blog-cms-demo.vercel.app",
      status: "완료",
      category: "Frontend"
    },
    {
      title: "Social Media Analytics",
      description: "소셜 미디어 계정의 성과를 분석하는 도구입니다. 다양한 지표를 시각화하여 인사이트를 제공합니다.",
      image: "/api/placeholder/400/300",
      tech: ["React", "D3.js", "Express", "PostgreSQL", "Chart.js"],
      github: "https://github.com/username/social-analytics",
      demo: "https://social-analytics-demo.vercel.app",
      status: "계획중",
      category: "Full-stack"
    },
    {
      title: "Portfolio Website",
      description: "개인 포트폴리오 웹사이트입니다. 반응형 디자인과 다크 모드를 지원하며, 프로젝트를 체계적으로 소개합니다.",
      image: "/api/placeholder/400/300",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com/username/portfolio",
      demo: "https://portfolio-demo.vercel.app",
      status: "완료",
      category: "Frontend"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Projects</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            다양한 기술 스택을 활용하여 구현한 프로젝트들을 소개합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">이미지 준비중</span>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === '완료' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      project.status === '진행중' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {project.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors"
                  >
                    GitHub
                  </a>
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors"
                  >
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
