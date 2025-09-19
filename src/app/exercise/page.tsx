'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Exercise() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('Push')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [exerciseRecords, setExerciseRecords] = useState([
    {
      id: 1,
      exercise: '푸시업',
      category: 'Push',
      reps: 30,
      sets: 3,
      date: new Date('2024-01-15'),
      notes: '좋은 자세로 완료'
    },
    {
      id: 2,
      exercise: '풀업',
      category: 'Pull',
      reps: 10,
      sets: 3,
      date: new Date('2024-01-14'),
      notes: '점진적으로 개선 중'
    },
    {
      id: 3,
      exercise: '플랭크',
      category: 'Core',
      reps: 1,
      sets: 3,
      date: new Date('2024-01-13'),
      notes: '60초씩 유지'
    },
    {
      id: 4,
      exercise: '스쿼트',
      category: 'Legs',
      reps: 20,
      sets: 4,
      date: new Date('2024-01-12'),
      notes: '깊게 내려가기'
    }
  ])

  const exerciseCategories = ['Push', 'Pull', 'Core', 'Legs']
  
  const filteredExercises = exerciseRecords.filter(record => 
    record.category === selectedCategory
  )

  const recentExercises = exerciseRecords
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // 이번 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const hasExercise = exerciseRecords.some(record => 
        record.date.toDateString() === date.toDateString()
      )
      days.push({ day, date, hasExercise })
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(prevDate.getMonth() - 1)
      } else {
        newDate.setMonth(prevDate.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Exercise Tracker</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            운동 기록과 관리를 통해 건강한 라이프스타일을 만들어보세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 왼쪽: 운동 카테고리 및 운동 리스트 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 운동 카테고리 탭 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">운동 카테고리</h2>
              <div className="flex flex-wrap gap-2">
                {exerciseCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 선택된 카테고리의 운동 리스트 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {selectedCategory} 운동 기록
              </h3>
              {filteredExercises.length > 0 ? (
                <div className="space-y-4">
                  {filteredExercises.map((exercise) => (
                    <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {exercise.exercise}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(exercise.date)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">세트: </span>
                          <span className="font-medium text-gray-900 dark:text-white">{exercise.sets}세트</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">횟수: </span>
                          <span className="font-medium text-gray-900 dark:text-white">{exercise.reps}회</span>
                        </div>
                      </div>
                      {exercise.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "{exercise.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  {selectedCategory} 카테고리의 운동 기록이 없습니다.
                </p>
              )}
            </div>

            {/* 새 운동 기록 추가 버튼 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                새 운동 기록
              </h3>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                + 새 운동 기록 추가
              </button>
            </div>
          </div>

          {/* 오른쪽: 캘린더 및 최근 기록 */}
          <div className="space-y-6">
            {/* 캘린더 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">운동 캘린더</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                {currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
              </h4>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* 날짜 그리드 */}
              <div className="grid grid-cols-7 gap-1">
                {getCalendarDays().map((day, index) => (
                  <div key={index} className="aspect-square flex items-center justify-center">
                    {day ? (
                      <div
                        className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                          day.hasExercise
                            ? 'bg-green-500 text-white font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {day.day}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">운동 완료</span>
              </div>
            </div>

            {/* 최근 운동 기록 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                최근 운동 기록
              </h3>
              {recentExercises.length > 0 ? (
                <div className="space-y-3">
                  {recentExercises.map((exercise) => (
                    <div key={exercise.id} className="border-l-4 border-blue-500 pl-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {exercise.exercise}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(exercise.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets}세트 × {exercise.reps}회
                      </p>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        {exercise.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  최근 운동 기록이 없습니다.
                </p>
              )}
            </div>

            {/* 통계 요약 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                이번 주 통계
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">운동 일수</span>
                  <span className="font-medium text-gray-900 dark:text-white">4일</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">총 운동 횟수</span>
                  <span className="font-medium text-gray-900 dark:text-white">12회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">가장 많이 한 운동</span>
                  <span className="font-medium text-gray-900 dark:text-white">스쿼트</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
