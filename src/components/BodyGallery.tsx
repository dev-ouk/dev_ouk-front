'use client'

import { useState, useRef, useEffect } from 'react'

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

interface BodyGalleryProps {
  photos: BodyPhoto[]
}

export default function BodyGallery({ photos }: BodyGalleryProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([])
  const [modalPhoto, setModalPhoto] = useState<BodyPhoto | null>(null)
  const [comparePhotos, setComparePhotos] = useState<BodyPhoto[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Masonry 그리드를 위한 높이 배열
  const getRandomHeight = () => Math.floor(Math.random() * 200) + 200

  // 사진 선택/해제
  const togglePhotoSelection = (photoId: number) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId)
      } else if (prev.length < 2) {
        return [...prev, photoId]
      }
      return prev
    })
  }

  // 모달 열기
  const openModal = (photo: BodyPhoto) => {
    setModalPhoto(photo)
  }

  // 모달 닫기
  const closeModal = () => {
    setModalPhoto(null)
  }

  // 비교 모드 시작
  const startCompare = () => {
    const photosToCompare = photos.filter(photo => selectedPhotos.includes(photo.id))
    setComparePhotos(photosToCompare)
    setShowCompare(true)
  }

  // 비교 모드 종료
  const endCompare = () => {
    setShowCompare(false)
    setComparePhotos([])
    setSelectedPhotos([])
  }

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCompare) {
          endCompare()
        } else {
          closeModal()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showCompare])

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        if (showCompare) {
          endCompare()
        } else {
          closeModal()
        }
      }
    }

    if (modalPhoto || showCompare) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalPhoto, showCompare])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">눈바디 갤러리</h3>
        <div className="flex gap-2">
          {selectedPhotos.length > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedPhotos.length}/2 선택됨
            </span>
          )}
          {selectedPhotos.length === 2 && (
            <button
              onClick={startCompare}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              비교하기
            </button>
          )}
        </div>
      </div>

      {/* Masonry 그리드 */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={`relative mb-4 break-inside-avoid cursor-pointer group ${
              selectedPhotos.includes(photo.id) ? 'ring-4 ring-blue-500' : ''
            }`}
            style={{ height: `${getRandomHeight()}px` }}
          >
            <div className="relative h-full overflow-hidden rounded-lg shadow-lg">
              {/* 이미지 플레이스홀더 */}
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {photo.title}
                  </div>
                </div>
              </div>

              {/* 오버레이 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <button
                    onClick={() => openModal(photo)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => togglePhotoSelection(photo.id)}
                    className={`p-2 rounded-full shadow-lg transition-colors ${
                      selectedPhotos.includes(photo.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 날짜 및 정보 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="text-white">
                  <div className="text-sm font-medium">{photo.title}</div>
                  <div className="text-xs opacity-75">
                    {photo.date.toLocaleDateString('ko-KR')}
                  </div>
                  {photo.weight && (
                    <div className="text-xs opacity-75 mt-1">
                      {photo.weight}kg
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 사진이 없을 때 */}
      {photos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-4xl">📷</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">눈바디 사진이 없습니다</h3>
          <p className="text-gray-600 dark:text-gray-400">
            첫 번째 눈바디 사진을 업로드해보세요!
          </p>
        </div>
      )}

      {/* 모달 */}
      {modalPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="relative max-w-4xl max-h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {modalPhoto.title}
              </h2>
              
              {/* 이미지 플레이스홀더 */}
              <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-6xl mb-4">📸</div>
                  <div className="text-lg text-gray-600 dark:text-gray-400">
                    {modalPhoto.title}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">촬영 정보</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    날짜: {modalPhoto.date.toLocaleDateString('ko-KR')}
                  </p>
                  {modalPhoto.weight && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      체중: {modalPhoto.weight}kg
                    </p>
                  )}
                  {modalPhoto.bodyFat && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      체지방: {modalPhoto.bodyFat}%
                    </p>
                  )}
                  {modalPhoto.muscleMass && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      근육량: {modalPhoto.muscleMass}kg
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">설명</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {modalPhoto.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {modalPhoto.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 비교 모달 */}
      {showCompare && comparePhotos.length === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="relative max-w-6xl max-h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={endCompare}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                눈바디 비교
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                {comparePhotos.map((photo, index) => (
                  <div key={photo.id} className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {photo.title}
                    </h3>
                    
                    {/* 이미지 플레이스홀더 */}
                    <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📸</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {photo.title}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>날짜: {photo.date.toLocaleDateString('ko-KR')}</p>
                      {photo.weight && <p>체중: {photo.weight}kg</p>}
                      {photo.bodyFat && <p>체지방: {photo.bodyFat}%</p>}
                      {photo.muscleMass && <p>근육량: {photo.muscleMass}kg</p>}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 변화량 표시 */}
              {comparePhotos.length === 2 && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">변화량</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">체중</div>
                      <div className={`font-bold ${
                        (comparePhotos[1].weight || 0) - (comparePhotos[0].weight || 0) >= 0 
                          ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {comparePhotos[1].weight && comparePhotos[0].weight 
                          ? `${(comparePhotos[1].weight - comparePhotos[0].weight).toFixed(1)}kg`
                          : 'N/A'
                        }
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">체지방</div>
                      <div className={`font-bold ${
                        (comparePhotos[1].bodyFat || 0) - (comparePhotos[0].bodyFat || 0) >= 0 
                          ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {comparePhotos[1].bodyFat && comparePhotos[0].bodyFat 
                          ? `${(comparePhotos[1].bodyFat - comparePhotos[0].bodyFat).toFixed(1)}%`
                          : 'N/A'
                        }
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">근육량</div>
                      <div className={`font-bold ${
                        (comparePhotos[1].muscleMass || 0) - (comparePhotos[0].muscleMass || 0) >= 0 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {comparePhotos[1].muscleMass && comparePhotos[0].muscleMass 
                          ? `${(comparePhotos[1].muscleMass - comparePhotos[0].muscleMass).toFixed(1)}kg`
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
