'use client'

import { useState } from 'react'

interface ExerciseStatsProps {
  exerciseRecords: Array<{
    id: number
    exercise: string
    category: string
    reps: number
    sets: number
    date: Date
    notes: string
  }>
}

export default function ExerciseStats({ exerciseRecords }: ExerciseStatsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  // 더미 통계 데이터 - 막대 그래프용
  const statsData = {
    week: {
      totalDays: 4,
      totalExercises: 12,
      totalSets: 36,
      totalReps: 420,
      mostFrequent: '푸시업',
      averagePerDay: 3,
      categories: {
        Push: 4,
        Pull: 3,
        Core: 3,
        Legs: 2
      },
      dailyData: [
        { day: '월', exercises: 2, reps: 60, color: 'bg-blue-500' },
        { day: '화', exercises: 0, reps: 0, color: 'bg-gray-300' },
        { day: '수', exercises: 3, reps: 90, color: 'bg-green-500' },
        { day: '목', exercises: 1, reps: 30, color: 'bg-yellow-500' },
        { day: '금', exercises: 2, reps: 70, color: 'bg-purple-500' },
        { day: '토', exercises: 3, reps: 110, color: 'bg-red-500' },
        { day: '일', exercises: 1, reps: 60, color: 'bg-indigo-500' }
      ],
      changes: {
        exercises: '+25%',
        reps: '+18%',
        sets: '+20%'
      }
    },
    month: {
      totalDays: 18,
      totalExercises: 52,
      totalSets: 156,
      totalReps: 1840,
      mostFrequent: '스쿼트',
      averagePerDay: 2.9,
      categories: {
        Push: 16,
        Pull: 12,
        Core: 14,
        Legs: 10
      },
      weeklyData: [
        { week: '1주차', exercises: 12, reps: 420, color: 'bg-blue-500' },
        { week: '2주차', exercises: 14, reps: 480, color: 'bg-green-500' },
        { week: '3주차', exercises: 13, reps: 460, color: 'bg-purple-500' },
        { week: '4주차', exercises: 13, reps: 480, color: 'bg-red-500' }
      ],
      changes: {
        exercises: '+8%',
        reps: '+12%',
        sets: '+15%'
      }
    }
  }

  const currentStats = statsData[timeRange]
  const maxValue = timeRange === 'week' ? 3 : 14

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          운동 통계 그래프
        </h3>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              timeRange === 'week'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              timeRange === 'month'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            월간
          </button>
        </div>
      </div>

      {/* 변화량 표시 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📈 이번 {timeRange === 'week' ? '주' : '월'} 변화량
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {currentStats.changes.exercises}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">운동 횟수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {currentStats.changes.reps}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">총 횟수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {currentStats.changes.sets}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">총 세트</div>
          </div>
        </div>
      </div>

      {/* 막대 그래프 */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {timeRange === 'week' ? '주간 운동 패턴' : '월간 운동 패턴'}
        </h4>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-end justify-between h-40 space-x-2">
            {(timeRange === 'week' ? currentStats.dailyData : currentStats.weeklyData).map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                {/* 막대 */}
                <div className="w-full flex flex-col items-center mb-2">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 hover:scale-105 ${
                      data.exercises > 0 ? data.color : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    style={{ 
                      height: `${Math.max((data.exercises / maxValue) * 120, data.exercises > 0 ? 8 : 4)}px`,
                      minHeight: data.exercises > 0 ? '8px' : '4px'
                    }}
                  >
                    {/* 막대 위에 값 표시 */}
                    {data.exercises > 0 && (
                      <div className="relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-1 rounded shadow-sm">
                          {data.exercises}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 라벨 */}
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {timeRange === 'week' ? data.day : data.week}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {data.reps}회
                </span>
              </div>
            ))}
          </div>
          
          {/* Y축 라벨 */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>0</span>
            <span>{Math.ceil(maxValue * 0.5)}</span>
            <span>{maxValue}</span>
          </div>
        </div>
      </div>

      {/* 카테고리별 막대 그래프 */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          카테고리별 운동 분포
        </h4>
        <div className="space-y-3">
          {Object.entries(currentStats.categories).map(([category, count]) => {
            const maxCount = Math.max(...Object.values(currentStats.categories))
            const percentage = (count / maxCount) * 100
            
            return (
              <div key={category} className="flex items-center space-x-3">
                <div className="w-16 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-700 ${
                        category === 'Push' ? 'bg-red-500' :
                        category === 'Pull' ? 'bg-blue-500' :
                        category === 'Core' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="h-full flex items-center justify-end pr-2">
                        <span className="text-xs font-bold text-white">
                          {count}회
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {currentStats.totalDays}일
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">운동 일수</div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {currentStats.totalExercises}회
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">총 운동</div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {currentStats.totalSets}세트
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">총 세트</div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {currentStats.totalReps.toLocaleString()}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400">총 횟수</div>
        </div>
      </div>
    </div>
  )
}
