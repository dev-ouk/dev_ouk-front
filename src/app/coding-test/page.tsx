export default function CodingTest() {
  const problems = [
    {
      title: "두 정수 사이의 합",
      platform: "프로그래머스",
      level: "Level 1",
      language: "JavaScript",
      date: "2024-01-15",
      status: "완료",
      category: "수학"
    },
    {
      title: "가장 긴 팰린드롬",
      platform: "프로그래머스",
      level: "Level 3",
      language: "JavaScript",
      date: "2024-01-12",
      status: "완료",
      category: "문자열"
    },
    {
      title: "네트워크",
      platform: "프로그래머스",
      level: "Level 3",
      language: "JavaScript",
      date: "2024-01-10",
      status: "완료",
      category: "DFS/BFS"
    },
    {
      title: "타겟 넘버",
      platform: "프로그래머스",
      level: "Level 2",
      language: "JavaScript",
      date: "2024-01-08",
      status: "완료",
      category: "DFS/BFS"
    },
    {
      title: "게임 맵 최단거리",
      platform: "프로그래머스",
      level: "Level 2",
      language: "JavaScript",
      date: "2024-01-05",
      status: "완료",
      category: "BFS"
    },
    {
      title: "다리를 지나는 트럭",
      platform: "프로그래머스",
      level: "Level 2",
      language: "JavaScript",
      date: "2024-01-03",
      status: "완료",
      category: "스택/큐"
    },
    {
      title: "기능개발",
      platform: "프로그래머스",
      level: "Level 2",
      language: "JavaScript",
      date: "2024-01-01",
      status: "완료",
      category: "스택/큐"
    },
    {
      title: "올바른 괄호",
      platform: "프로그래머스",
      level: "Level 2",
      language: "JavaScript",
      date: "2023-12-28",
      status: "완료",
      category: "스택/큐"
    }
  ]

  const stats = {
    total: problems.length,
    completed: problems.filter(p => p.status === '완료').length,
    inProgress: problems.filter(p => p.status === '진행중').length,
    platforms: ['프로그래머스', '백준', 'LeetCode']
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Coding Test Archive</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            알고리즘 문제 해결 과정과 풀이를 기록하는 공간입니다
          </p>
        </div>

        {/* 통계 */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.total}</div>
            <div className="text-gray-600 dark:text-gray-300">총 문제</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{stats.completed}</div>
            <div className="text-gray-600 dark:text-gray-300">완료</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{stats.inProgress}</div>
            <div className="text-gray-600 dark:text-gray-300">진행중</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stats.platforms.length}</div>
            <div className="text-gray-600 dark:text-gray-300">플랫폼</div>
          </div>
        </div>

        {/* 문제 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">문제 목록</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">문제</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">플랫폼</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">레벨</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">카테고리</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">언어</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">날짜</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {problems.map((problem, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{problem.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        {problem.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                        {problem.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {problem.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {problem.language}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                        {problem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(problem.date).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            더 많은 문제와 풀이를 계속 추가할 예정입니다.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
            GitHub에서 전체 코드 보기
          </button>
        </div>
      </div>
    </div>
  )
}
