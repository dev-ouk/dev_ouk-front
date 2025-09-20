'use client'

import { useState } from 'react'
import CategoryTabs from '@/components/CategoryTabs'
import ExerciseList from '@/components/ExerciseList'
import ExerciseListWithFilter from '@/components/ExerciseListWithFilter'
import CalendarSummary from '@/components/CalendarSummary'
import ExerciseStats from '@/components/ExerciseStats'
import MealRecorder from '@/components/MealRecorder'
import MealList from '@/components/MealList'
import ProteinChart from '@/components/ProteinChart'
import BodyGallery from '@/components/BodyGallery'
import ExerciseTabs from '@/components/ExerciseTabs'

interface MealRecord {
  id: number
  date: Date
  mealType: '아침' | '점심' | '저녁'
  food: string
  protein: number
  calories: number
  notes?: string
}

interface BodyPhoto {
  id: number
  date: Date
  title: string
  description: string
  imageUrl: string
  weight?: number
  bodyFat?: number
  muscleMass?: number
  tags: string[]
}

export default function Exercise() {
  const [activeTab, setActiveTab] = useState('exercise')
  const [selectedCategory, setSelectedCategory] = useState('Push')
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([
    {
      id: 1,
      date: new Date('2024-01-15'),
      mealType: '아침',
      food: '계란프라이 + 토스트',
      protein: 18.5,
      calories: 320,
      notes: '단백질 보충'
    },
    {
      id: 2,
      date: new Date('2024-01-15'),
      mealType: '점심',
      food: '닭가슴살 샐러드',
      protein: 35.2,
      calories: 280,
      notes: '운동 후 식사'
    },
    {
      id: 3,
      date: new Date('2024-01-15'),
      mealType: '저녁',
      food: '연어구이 + 현미밥',
      protein: 28.8,
      calories: 450,
      notes: '오메가3 풍부'
    },
    {
      id: 4,
      date: new Date('2024-01-14'),
      mealType: '아침',
      food: '그릭요거트 + 견과류',
      protein: 22.1,
      calories: 380,
      notes: '프로바이오틱스'
    },
    {
      id: 5,
      date: new Date('2024-01-14'),
      mealType: '점심',
      food: '소고기 스테이크',
      protein: 42.3,
      calories: 520,
      notes: '고단백 식사'
    },
    {
      id: 6,
      date: new Date('2024-01-14'),
      mealType: '저녁',
      food: '두부찌개 + 밥',
      protein: 25.6,
      calories: 420,
      notes: '식물성 단백질'
    },
    {
      id: 7,
      date: new Date('2024-01-13'),
      mealType: '아침',
      food: '프로틴 쉐이크',
      protein: 30.0,
      calories: 200,
      notes: '운동 전'
    },
    {
      id: 8,
      date: new Date('2024-01-13'),
      mealType: '점심',
      food: '치킨 샐러드',
      protein: 32.5,
      calories: 350,
      notes: '고단백 저칼로리'
    }
  ])
  const [exerciseRecords] = useState([
    {
      id: 1,
      exercise: '푸시업',
      category: 'Push',
      difficulty: '초급',
      reps: 30,
      sets: 3,
      date: new Date('2024-01-15'),
      notes: '좋은 자세로 완료'
    },
    {
      id: 2,
      exercise: '풀업',
      category: 'Pull',
      difficulty: '중급',
      reps: 10,
      sets: 3,
      date: new Date('2024-01-14'),
      notes: '점진적으로 개선 중'
    },
    {
      id: 3,
      exercise: '플랭크',
      category: 'Core',
      difficulty: '초급',
      reps: 1,
      sets: 3,
      date: new Date('2024-01-13'),
      notes: '60초씩 유지'
    },
    {
      id: 4,
      exercise: '스쿼트',
      category: 'Legs',
      difficulty: '초급',
      reps: 20,
      sets: 4,
      date: new Date('2024-01-12'),
      notes: '깊게 내려가기'
    },
    {
      id: 5,
      exercise: '벤치프레스',
      category: 'Push',
      difficulty: '중급',
      reps: 8,
      sets: 4,
      date: new Date('2024-01-11'),
      notes: '무게 증가'
    },
    {
      id: 6,
      exercise: '데드리프트',
      category: 'Legs',
      difficulty: '고급',
      reps: 5,
      sets: 3,
      date: new Date('2024-01-10'),
      notes: '기술 중점'
    },
    {
      id: 7,
      exercise: '머슬업',
      category: 'Pull',
      difficulty: '고급',
      reps: 5,
      sets: 3,
      date: new Date('2024-01-09'),
      notes: '동작 연습'
    },
    {
      id: 8,
      exercise: 'L-싯',
      category: 'Core',
      difficulty: '고급',
      reps: 10,
      sets: 3,
      date: new Date('2024-01-08'),
      notes: '균형 유지'
    }
  ])

  const [bodyPhotos] = useState<BodyPhoto[]>([
    {
      id: 1,
      date: new Date('2024-01-15'),
      title: '시작 전 체형',
      description: '운동 시작 전 기본 체형을 기록합니다',
      imageUrl: '/body-photos/start.jpg',
      weight: 75.5,
      bodyFat: 18.5,
      muscleMass: 32.2,
      tags: ['시작', '전체', '정면']
    },
    {
      id: 2,
      date: new Date('2024-01-10'),
      title: '2주차 체형',
      description: '운동 시작 2주차 체형 변화를 확인합니다',
      imageUrl: '/body-photos/week2.jpg',
      weight: 74.8,
      bodyFat: 17.8,
      muscleMass: 32.8,
      tags: ['2주차', '전체', '정면']
    },
    {
      id: 3,
      date: new Date('2024-01-05'),
      title: '1주차 측면',
      description: '측면 체형 변화를 추적합니다',
      imageUrl: '/body-photos/side.jpg',
      weight: 75.2,
      bodyFat: 18.2,
      muscleMass: 32.5,
      tags: ['1주차', '측면', '프로필']
    },
    {
      id: 4,
      date: new Date('2023-12-28'),
      title: '운동 전 체형',
      description: '운동 시작하기 전 마지막 체형 기록',
      imageUrl: '/body-photos/before.jpg',
      weight: 76.1,
      bodyFat: 19.2,
      muscleMass: 31.8,
      tags: ['운동전', '전체', '정면']
    },
    {
      id: 5,
      date: new Date('2023-12-20'),
      title: '겨울 체형',
      description: '겨울철 체형 관리 상태',
      imageUrl: '/body-photos/winter.jpg',
      weight: 76.8,
      bodyFat: 19.8,
      muscleMass: 31.5,
      tags: ['겨울', '전체', '정면']
    },
    {
      id: 6,
      date: new Date('2023-12-15'),
      title: '등 체형',
      description: '등 근육 발달 상태 확인',
      imageUrl: '/body-photos/back.jpg',
      weight: 76.5,
      bodyFat: 19.5,
      muscleMass: 31.7,
      tags: ['등', '후면', '근육']
    }
  ])

  const exerciseCategories = ['Push', 'Pull', 'Core', 'Legs']

  // 식단 추가 함수
  const handleMealAdd = (newMeal: Omit<MealRecord, 'id'>) => {
    const mealWithId: MealRecord = {
      ...newMeal,
      id: Math.max(...mealRecords.map(m => m.id), 0) + 1
    }
    setMealRecords(prev => [mealWithId, ...prev])
  }

  // 탭별 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'exercise':
        return (
          <>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 왼쪽: 운동 카테고리 및 운동 리스트 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 운동 카테고리 탭 */}
                <CategoryTabs
                  categories={exerciseCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                {/* 검색/필터가 포함된 운동 리스트 */}
                <ExerciseListWithFilter
                  exerciseRecords={exerciseRecords}
                  categories={exerciseCategories}
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
          </>
        )
      
      case 'nutrition':
        return (
          <>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 왼쪽: 식단 기록 및 목록 */}
              <div className="lg:col-span-2 space-y-6">
                <MealRecorder onMealAdd={handleMealAdd} />
                <MealList mealRecords={mealRecords} />
              </div>

              {/* 오른쪽: 단백질 섭취량 차트 */}
              <div className="space-y-6">
                <ProteinChart mealRecords={mealRecords} />
              </div>
            </div>
          </>
        )
      
      case 'body':
        return (
          <>
            <div className="space-y-6">
              <BodyGallery photos={bodyPhotos} />
            </div>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ExerciseTabs activeTab={activeTab} onTabChange={setActiveTab}>
          {renderTabContent()}
        </ExerciseTabs>
      </div>
    </div>
  )
}
