'use client'

interface ExerciseRecord {
  id: number
  exercise: string
  category: string
  reps: number
  sets: number
  date: Date
  notes: string
}

interface ExerciseListProps {
  exercises: ExerciseRecord[]
  selectedCategory: string
}

export default function ExerciseList({ exercises, selectedCategory }: ExerciseListProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredExercises = exercises.filter(record => 
    record.category === selectedCategory
  )

  return (
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
  )
}
