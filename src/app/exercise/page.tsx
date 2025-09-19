'use client'

import { useState } from 'react'
import CategoryTabs from '@/components/CategoryTabs'
import ExerciseList from '@/components/ExerciseList'
import CalendarSummary from '@/components/CalendarSummary'
import ExerciseStats from '@/components/ExerciseStats'

export default function Exercise() {
  const [selectedCategory, setSelectedCategory] = useState('Push')
  const [exerciseRecords] = useState([
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
            <CategoryTabs
              categories={exerciseCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* 선택된 카테고리의 운동 리스트 */}
            <ExerciseList
              exercises={exerciseRecords}
              selectedCategory={selectedCategory}
            />

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

          {/* 오른쪽: 캘린더 및 통계 */}
          <div className="space-y-6">
            <CalendarSummary exerciseRecords={exerciseRecords} />
            <ExerciseStats exerciseRecords={exerciseRecords} />
          </div>
        </div>
      </div>
    </div>
  )
}
