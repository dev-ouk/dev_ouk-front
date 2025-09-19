'use client'

import { useState } from 'react'

interface ExerciseSearchFilterProps {
  onSearch: (searchTerm: string) => void
  onCategoryFilter: (category: string) => void
  onDifficultyFilter: (difficulty: string) => void
  categories: string[]
}

export default function ExerciseSearchFilter({
  onSearch,
  onCategoryFilter,
  onDifficultyFilter,
  categories
}: ExerciseSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedDifficulty, setSelectedDifficulty] = useState('전체')

  const difficulties = ['전체', '초급', '중급', '고급']

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedCategory(value)
    onCategoryFilter(value)
  }

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedDifficulty(value)
    onDifficultyFilter(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('전체')
    setSelectedDifficulty('전체')
    onSearch('')
    onCategoryFilter('전체')
    onDifficultyFilter('전체')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">운동 검색 & 필터</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 검색 입력 */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            운동 검색
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="운동 이름으로 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            카테고리
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          >
            <option value="전체">전체 카테고리</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 난이도 필터 */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            난이도
          </label>
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 필터 초기화 버튼 */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          필터 초기화
        </button>
      </div>

      {/* 현재 필터 상태 표시 */}
      {(searchTerm || selectedCategory !== '전체' || selectedDifficulty !== '전체') && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">현재 필터:</span>
            {searchTerm && ` 검색: "${searchTerm}"`}
            {selectedCategory !== '전체' && ` 카테고리: ${selectedCategory}`}
            {selectedDifficulty !== '전체' && ` 난이도: ${selectedDifficulty}`}
          </p>
        </div>
      )}
    </div>
  )
}
