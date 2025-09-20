'use client'

import { useMemo } from 'react'

interface MealRecord {
  id: number
  date: Date
  mealType: '아침' | '점심' | '저녁'
  food: string
  protein: number
  calories: number
  notes?: string
}

interface ProteinChartProps {
  mealRecords: MealRecord[]
}

interface ChartData {
  mealType: string
  protein: number
  color: string
  icon: string
}

export default function ProteinChart({ mealRecords }: ProteinChartProps) {
  const chartData = useMemo(() => {
    // 최근 7일간의 데이터만 사용
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentMeals = mealRecords.filter(meal => meal.date >= sevenDaysAgo)
    
    // 식사 타입별 단백질 합계
    const proteinByMeal: { [key: string]: number } = {
      '아침': 0,
      '점심': 0,
      '저녁': 0
    }
    
    recentMeals.forEach(meal => {
      proteinByMeal[meal.mealType] += meal.protein
    })
    
    // 차트 데이터 생성
    const data: ChartData[] = [
      {
        mealType: '아침',
        protein: proteinByMeal['아침'],
        color: '#FCD34D', // yellow-400
        icon: '🌅'
      },
      {
        mealType: '점심',
        protein: proteinByMeal['점심'],
        color: '#FB923C', // orange-400
        icon: '☀️'
      },
      {
        mealType: '저녁',
        protein: proteinByMeal['저녁'],
        color: '#A78BFA', // violet-400
        icon: '🌙'
      }
    ]
    
    const totalProtein = data.reduce((sum, item) => sum + item.protein, 0)
    
    // 백분율 계산
    data.forEach(item => {
      item.protein = totalProtein > 0 ? (item.protein / totalProtein) * 100 : 0
    })
    
    return { data, totalProtein, recentMeals }
  }, [mealRecords])

  const { data, totalProtein, recentMeals } = chartData

  // PieChart를 위한 각도 계산
  let currentAngle = 0
  const segments = data.map((item, index) => {
    const angle = (item.protein / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle

    // SVG path 계산 (원의 중심: 100, 100, 반지름: 80)
    const centerX = 100
    const centerY = 100
    const radius = 80
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180)
    const endAngleRad = (endAngle - 90) * (Math.PI / 180)
    
    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return {
      ...item,
      pathData,
      startAngle,
      endAngle,
      actualProtein: data[index].protein
    }
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">주간 단백질 섭취 분석</h3>
      
      {/* 총 단백질 섭취량 */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {totalProtein.toFixed(1)}g
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          최근 7일간 총 단백질 섭취량
        </p>
      </div>

      {/* PieChart */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </svg>
          
          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {recentMeals.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                식단 기록
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.icon} {item.mealType}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.protein.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {segments[index]?.actualProtein.toFixed(1)}g
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 추가 정보 */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">📊 분석 정보</h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>• 일평균 단백질: {(totalProtein / 7).toFixed(1)}g</p>
          <p>• 기록된 식단: {recentMeals.length}개</p>
          <p>• 가장 많은 섭취: {data.reduce((max, item) => item.protein > max.protein ? item : max, data[0])?.mealType}</p>
        </div>
      </div>
    </div>
  )
}
