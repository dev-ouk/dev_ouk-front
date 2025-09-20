'use client'

import { useState, useMemo } from 'react'

interface MealRecord {
  id: number
  date: Date
  mealType: '아침' | '점심' | '저녁'
  food: string
  protein: number
  calories: number
  notes?: string
}

interface MealListProps {
  mealRecords: MealRecord[]
}

export default function MealList({ mealRecords }: MealListProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedMealType, setSelectedMealType] = useState<string>('전체')

  // 날짜별로 그룹화
  const groupedMeals = useMemo(() => {
    const grouped: { [key: string]: MealRecord[] } = {}
    
    mealRecords.forEach(meal => {
      const dateKey = meal.date.toDateString()
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(meal)
    })
    
    // 날짜순으로 정렬
    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .reduce((sorted, date) => {
        sorted[date] = grouped[date].sort((a, b) => {
          const mealOrder = { '아침': 0, '점심': 1, '저녁': 2 }
          return mealOrder[a.mealType] - mealOrder[b.mealType]
        })
        return sorted
      }, {} as { [key: string]: MealRecord[] })
  }, [mealRecords])

  // 고유한 날짜 목록
  const availableDates = useMemo(() => {
    return Object.keys(groupedMeals)
  }, [groupedMeals])

  // 필터링된 식단
  const filteredMeals = useMemo(() => {
    if (!selectedDate) return groupedMeals
    
    const dateMeals = groupedMeals[selectedDate] || []
    
    if (selectedMealType === '전체') {
      return { [selectedDate]: dateMeals }
    }
    
    return {
      [selectedDate]: dateMeals.filter(meal => meal.mealType === selectedMealType)
    }
  }, [groupedMeals, selectedDate, selectedMealType])

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case '아침': return '🌅'
      case '점심': return '☀️'
      case '저녁': return '🌙'
      default: return '🍽️'
    }
  }

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case '아침': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case '점심': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case '저녁': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // 선택된 날짜의 총 단백질과 칼로리 계산
  const dailyStats = useMemo(() => {
    if (!selectedDate) return { totalProtein: 0, totalCalories: 0 }
    
    const meals = groupedMeals[selectedDate] || []
    return meals.reduce((stats, meal) => ({
      totalProtein: stats.totalProtein + meal.protein,
      totalCalories: stats.totalCalories + meal.calories
    }), { totalProtein: 0, totalCalories: 0 })
  }, [selectedDate, groupedMeals])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">식단 기록 목록</h3>
      
      {/* 필터 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            날짜 선택
          </label>
          <select
            id="date-filter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          >
            <option value="">전체 날짜</option>
            {availableDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('ko-KR', { 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'short'
                })}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="meal-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            식사 시간
          </label>
          <select
            id="meal-filter"
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          >
            <option value="전체">전체</option>
            <option value="아침">아침</option>
            <option value="점심">점심</option>
            <option value="저녁">저녁</option>
          </select>
        </div>
      </div>

      {/* 선택된 날짜의 통계 */}
      {selectedDate && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            {new Date(selectedDate).toLocaleDateString('ko-KR', { 
              month: 'long', 
              day: 'numeric',
              weekday: 'short'
            })} 일일 섭취량
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {dailyStats.totalProtein.toFixed(1)}g
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">단백질</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {dailyStats.totalCalories.toFixed(0)}kcal
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">칼로리</div>
            </div>
          </div>
        </div>
      )}

      {/* 식단 목록 */}
      {Object.keys(filteredMeals).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(filteredMeals).map(([date, meals]) => (
            <div key={date}>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {new Date(date).toLocaleDateString('ko-KR', { 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'short'
                })}
              </h4>
              <div className="space-y-3">
                {meals.map((meal) => (
                  <div key={meal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getMealTypeColor(meal.mealType)}`}>
                          {getMealTypeIcon(meal.mealType)} {meal.mealType}
                        </span>
                        <h5 className="text-lg font-medium text-gray-900 dark:text-white">
                          {meal.food}
                        </h5>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {meal.date.toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {meal.protein}g
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">단백질</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          {meal.calories}kcal
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">칼로리</div>
                      </div>
                    </div>
                    
                    {meal.notes && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">메모:</span> {meal.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">식단 기록이 없습니다</h3>
          <p className="text-gray-600 dark:text-gray-400">
            첫 번째 식단을 기록해보세요!
          </p>
        </div>
      )}
    </div>
  )
}
