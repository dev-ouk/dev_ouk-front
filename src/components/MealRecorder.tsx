'use client'

import { useState } from 'react'

interface MealRecord {
  id: number
  date: Date
  mealType: '아침' | '점심' | '저녁'
  food: string
  protein: number // 단백질 함량 (g)
  calories: number
  notes?: string
}

interface MealRecorderProps {
  onMealAdd: (meal: Omit<MealRecord, 'id'>) => void
}

export default function MealRecorder({ onMealAdd }: MealRecorderProps) {
  const [formData, setFormData] = useState({
    mealType: '아침' as '아침' | '점심' | '저녁',
    food: '',
    protein: '',
    calories: '',
    notes: ''
  })

  const mealTypes = [
    { value: '아침', label: '아침', icon: '🌅', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { value: '점심', label: '점심', icon: '☀️', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { value: '저녁', label: '저녁', icon: '🌙', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.food.trim() || !formData.protein || !formData.calories) {
      alert('음식명, 단백질, 칼로리를 모두 입력해주세요.')
      return
    }

    const newMeal: Omit<MealRecord, 'id'> = {
      date: new Date(),
      mealType: formData.mealType,
      food: formData.food.trim(),
      protein: parseFloat(formData.protein),
      calories: parseFloat(formData.calories),
      notes: formData.notes.trim() || undefined
    }

    onMealAdd(newMeal)
    
    // 폼 초기화
    setFormData({
      mealType: '아침',
      food: '',
      protein: '',
      calories: '',
      notes: ''
    })

    alert('식단이 기록되었습니다!')
  }

  const selectedMealType = mealTypes.find(type => type.value === formData.mealType)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">식단 기록</h3>
      
      {/* 식사 시간 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          식사 시간
        </label>
        <div className="grid grid-cols-3 gap-3">
          {mealTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mealType: type.value as any }))}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.mealType === type.value
                  ? `${type.color} border-current`
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 음식명 */}
        <div>
          <label htmlFor="food" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            음식명 *
          </label>
          <input
            type="text"
            id="food"
            name="food"
            value={formData.food}
            onChange={handleChange}
            placeholder="예: 닭가슴살 샐러드"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 단백질 */}
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              단백질 (g) *
            </label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              placeholder="25"
              step="0.1"
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>

          {/* 칼로리 */}
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              칼로리 (kcal) *
            </label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              placeholder="300"
              step="1"
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>
        </div>

        {/* 메모 */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            메모 (선택사항)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="추가 정보나 특이사항을 입력해주세요"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg">{selectedMealType?.icon}</span>
          {selectedMealType?.label} 식단 기록하기
        </button>
      </form>

      {/* 단백질 섭취 가이드 */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 단백질 섭취 가이드</h4>
        <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <p>• 일반인: 체중 1kg당 0.8-1g</p>
          <p>• 운동선수: 체중 1kg당 1.2-2g</p>
          <p>• 체중감량: 체중 1kg당 1.2-1.6g</p>
        </div>
      </div>
    </div>
  )
}
