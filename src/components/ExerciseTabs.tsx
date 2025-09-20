'use client'

import { useState } from 'react'

interface ExerciseTabsProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  {
    id: 'exercise',
    label: '운동',
    icon: '💪',
    description: '운동 기록 및 관리'
  },
  {
    id: 'nutrition',
    label: '식단',
    icon: '🍽️',
    description: '식단 기록 및 영양 분석'
  },
  {
    id: 'body',
    label: '눈바디',
    icon: '📸',
    description: '체형 변화 추적'
  }
]

export default function ExerciseTabs({ children, activeTab, onTabChange }: ExerciseTabsProps) {
  return (
    <div className="space-y-6">
      {/* 탭 헤더 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Exercise & Nutrition Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8">
          운동 기록과 식단 관리를 통해 건강한 라이프스타일을 만들어보세요
        </p>
        
        {/* 탭 네비게이션 */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="tab-content">
        {children}
      </div>
    </div>
  )
}
