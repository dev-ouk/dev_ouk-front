"use client";

import { SidebarLayout } from "../_components/sidebar-layout";

export default function WorkoutPage() {
  return (
    <SidebarLayout>
      <div className="flex flex-1 flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Workout
          </p>
          <h1 className="text-4xl font-bold text-zinc-900">오늘의 운동 기록</h1>
          <p className="text-base leading-relaxed text-zinc-600">
            간단한 워밍업 아이디어나 운동 계획을 적어둘 수 있는 공간입니다.
            필요에 따라 운동 루틴, 세트/횟수, 메모 등을 추가로 구성하세요.
          </p>

          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8">
            <h2 className="text-lg font-semibold text-zinc-900">예시 섹션</h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li>• 스트레칭 10분</li>
              <li>• 스쿼트 3세트 (12회)</li>
              <li>• 플랭크 3세트 (40초)</li>
            </ul>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

