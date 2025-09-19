'use client'

import { useState, useMemo } from 'react'
import ExerciseSearchFilter from './ExerciseSearchFilter'

interface ExerciseRecord {
  id: number
  exercise: string
  category: string
  difficulty: string
  reps: number
  sets: number
  date: Date
  notes: string
}

interface ExerciseListWithFilterProps {
  exerciseRecords: ExerciseRecord[]
  categories: string[]
}

export default function ExerciseListWithFilter({ exerciseRecords, categories }: ExerciseListWithFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [difficultyFilter, setDifficultyFilter] = useState('전체')

  // 필터링된 운동 목록
  const filteredExercises = useMemo(() => {
    return exerciseRecords.filter((record) => {
      const matchesSearch = record.exercise.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === '전체' || record.category === categoryFilter
      const matchesDifficulty = difficultyFilter === '전체' || record.difficulty === difficultyFilter

      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [exerciseRecords, searchTerm, categoryFilter, difficultyFilter])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case '중급':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case '고급':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Push':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Pull':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Core':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Legs':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div>
      {/* 검색/필터 컴포넌트 */}
      <ExerciseSearchFilter
        onSearch={setSearchTerm}
        onCategoryFilter={setCategoryFilter}
        onDifficultyFilter={setDifficultyFilter}
        categories={categories}
      />

      {/* 결과 개수 표시 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          총 <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredExercises.length}</span>개의 운동이 있습니다
        </p>
      </div>

      {/* 운동 목록 */}
      {filteredExercises.length > 0 ? (
        <div className="space-y-4">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {exercise.exercise}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(exercise.category)}`}>
                      {exercise.category}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {exercise.date.toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{exercise.reps}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">횟수</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{exercise.sets}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">세트</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{exercise.reps * exercise.sets}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 횟수</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{exercise.difficulty}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">난이도</p>
                </div>
              </div>

              {exercise.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">메모:</span> {exercise.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600 dark:text-gray-400">
            다른 검색어나 필터를 시도해보세요.
          </p>
        </div>
      )}
    </div>
  )
}
