"use client";

import {
  CheckCircle2,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Map,
  Mountain,
  NotebookPen,
  Sparkles,
  Timer,
  Trees,
  Waves,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SidebarLayout } from "../_components/sidebar-layout";

type Routine = {
  title: string;
  detail: string;
  notes: string;
};

type Category = {
  id: string;
  label: string;
  icon: typeof Dumbbell;
  tone: string;
  highlight: string;
  stats: { title: string; value: string; sub: string }[];
  routines: Routine[];
  checklist: string[];
  quickNotes: string[];
};

const categories: Category[] = [
  {
    id: "calisthenics",
    label: "Calisthenics",
    icon: Dumbbell,
    tone: "bg-emerald-50 border-emerald-200 text-emerald-800",
    highlight: "체중을 활용한 전신 컨트롤과 안정성",
    stats: [
      { title: "주간 빈도", value: "4회", sub: "상·하체 교차 진행" },
      { title: "평균 볼륨", value: "55분", sub: "6-8개 동작, 3-4세트" },
      { title: "목표", value: "풀업 10회", sub: "링 딥스 안정화" },
    ],
    routines: [
      {
        title: "Pull & Core",
        detail: "풀업 5×5 · 호로우 바디 3×30초 · 슈퍼맨 홀드 3×20초",
        notes: "쉼 90초, 당기기 동작에서 광배/코어 동시 활성",
      },
      {
        title: "Push 스킬",
        detail: "링 딥스 4×8 · 푸쉬업 4×12 · 파이크 푸쉬업 3×10",
        notes: "어깨 안정화 중점, 팔꿈치 벌어짐 주의",
      },
      {
        title: "Leg Control",
        detail: "Pistol box squat 4×8 · 노르딕 네거티브 3×5",
        notes: "무릎 정렬과 균형 감각 체크",
      },
    ],
    checklist: [
      "손목·어깨 모빌리티 7분",
      "초반 2세트 RPE 7 이하로 예열",
      "마무리 링 서포트 홀드 3×20초",
    ],
    quickNotes: [
      "오늘의 스킬: 텅 플랜치 10초 시도",
      "그립 강도: 너클 그립 유지",
      "회복: 세션 후 가벼운 밴드 풀어파트 30회",
    ],
  },
  {
    id: "climbing",
    label: "Climbing",
    icon: Mountain,
    tone: "bg-indigo-50 border-indigo-200 text-indigo-800",
    highlight: "크림핑·풋워크 중심의 테크닉 디테일",
    stats: [
      { title: "볼더 레벨", value: "V3-V4", sub: "슬랩/오버행 교차" },
      { title: "세션 길이", value: "90분", sub: "2:1 등반:휴식" },
      { title: "목표", value: "V5 완등", sub: "크림프 유지력 강화" },
    ],
    routines: [
      {
        title: "워밍업",
        detail: "이지 볼더 6-8문제 · 포켓/크림프 슬로우 터치",
        notes: "손가락 관절 온도 올리고 테이핑 확인",
      },
      {
        title: "메인 세션",
        detail: "V3-V4 6문제 시도 · 플래시 2회, 리드 4회",
        notes: "각 시도 후 3-4분 휴식, 발의 방향성 기록",
      },
      {
        title: "보강",
        detail: "데드행 5×10초 · 힐훅 드릴 3×8",
        notes: "마지막에 스트레칭 10분",
      },
    ],
    checklist: [
      "테이핑/초크 준비",
      "첫 20분 저강도 크루징",
      "발끝/골반 회전각 체크",
    ],
    quickNotes: [
      "오늘의 포커스: 발 교차 후 중심 이동 느리게",
      "그립: 하프 크림프 위주, 풀 크림프 제한",
      "피로도 높으면 캠퍼스 미진행",
    ],
  },
  {
    id: "flexibility",
    label: "Mobility / Flexibility",
    icon: Waves,
    tone: "bg-cyan-50 border-cyan-200 text-cyan-800",
    highlight: "가동범위 확보와 회복 중심의 루틴",
    stats: [
      { title: "세션 길이", value: "25-35분", sub: "저강도 유지" },
      { title: "주간 빈도", value: "3-4회", sub: "운동 전후 배치" },
      { title: "목표", value: "어깨·엉덩 관절 가동 +10%", sub: "호흡 연동" },
    ],
    routines: [
      {
        title: "프리 모빌리티",
        detail: "목·흉추·골반 써클 각 45초 × 2",
        notes: "작은 가동범위부터 점진 확대",
      },
      {
        title: "어깨/흉곽",
        detail: "밴드 풀어파트 3×20 · 월 슬라이드 3×12",
        notes: "늑골 들림 없이 견갑 움직임 느리게",
      },
      {
        title: "엉덩/햄스트링",
        detail: "90/90 힙 스위치 3×6 · 스탠딩 굿모닝 3×12",
        notes: "통증 0-1 수준에서 멈추기",
      },
    ],
    checklist: [
      "호흡: 4초 들이쉬고 6초 내쉬며 긴장 완화",
      "각 동작 통증 체크, 날카로운 통증 시 중단",
      "세션 후 1-2컵 수분 보충",
    ],
    quickNotes: [
      "오늘의 포커스: 흉추 회전 각도 확보",
      "밴드 강도: 가벼운 텐션으로 60-70% 범위",
      "컨디션 나쁘면 볼륨 절반으로 감축",
    ],
  },
  {
    id: "running",
    label: "Running",
    icon: Footprints,
    tone: "bg-amber-50 border-amber-200 text-amber-800",
    highlight: "유산소 베이스와 가벼운 템포 조합",
    stats: [
      { title: "주간 거리", value: "24 km", sub: "3회 달림" },
      { title: "페이스", value: "5'40\"/km", sub: "이지 페이스 기준" },
      { title: "목표", value: "10K 55분", sub: "주 1회 템포" },
    ],
    routines: [
      {
        title: "이지런",
        detail: "6-8km @ 5'50\"-6'10\"/km",
        notes: "호흡 3-3 유지, 케이던스 170↑",
      },
      {
        title: "템포런",
        detail: "2km 워밍업 → 3km @ 5'05\" → 1km 조깅",
        notes: "폼 무너질 때 즉시 페이스 다운",
      },
      {
        title: "마무리",
        detail: "햄스트링/비복근 스트레칭 8분",
        notes: "폼롤러 5분",
      },
    ],
    checklist: [
      "간단한 런지·레그스윙 5분",
      "첫 1km는 워밍업 페이스",
      "수분: 30분 이상 시 250-300ml",
    ],
    quickNotes: [
      "착지: 미드풋, 소음 최소화",
      "팔치기: 어깨 이완, 팔꿈치 90° 유지",
      "심박 150대 유지되면 거리 1km 추가 가능",
    ],
  },
  {
    id: "hiking",
    label: "Hiking",
    icon: Trees,
    tone: "bg-lime-50 border-lime-200 text-lime-800",
    highlight: "완만한 고도와 안정적 페이스로 트레킹",
    stats: [
      { title: "예정 코스", value: "8-10 km", sub: "누적 상승 450m" },
      { title: "소요 시간", value: "3h", sub: "20분 이동 · 5분 휴식" },
      { title: "목표", value: "무릎 무리 없이 하산", sub: "폴 사용 연습" },
    ],
    routines: [
      {
        title: "프리 체크",
        detail: "신발 끈/배낭 스트랩 조절 · 폴 길이 확인",
        notes: "워킹룰: 상체 전진, 무릎 정렬",
      },
      {
        title: "등반 페이스",
        detail: "RPE 6 이하, 20/5 규칙 유지",
        notes: "호흡 불안정 시 2분 속도 감속",
      },
      {
        title: "하산 케어",
        detail: "힐 스트라이크 최소화, 사선 보행",
        notes: "무릎 피로 시 폴 더블 플랜트",
      },
    ],
    checklist: [
      "물 1L, 소금 캡/젤 1-2개",
      "비상 간식·바람막이 확인",
      "GPS 앱/맵 다운로드",
    ],
    quickNotes: [
      "오늘의 포커스: 폴 플랜트 타이밍",
      "경사도 15% 이상 구간에서 스텝 짧게",
      "하산 전 가벼운 햄스트링 스트레칭",
    ],
  },
];

export default function WorkoutPage() {
  const [selectedId, setSelectedId] = useState<Category["id"]>("calisthenics");
  const selected = useMemo(
    () => categories.find((item) => item.id === selectedId) ?? categories[0],
    [selectedId],
  );

  return (
    <SidebarLayout>
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-8">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 px-8 py-7 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  Workout
                </p>
                <h1 className="text-4xl font-bold text-zinc-900">
                  오늘의 운동 허브
                </h1>
                <p className="text-base leading-relaxed text-zinc-600">
                  Calisthenics · Climbing · Running · Hiking 을 한 화면에서
                  관리하고, 바로 체크리스트와 루틴을 확인하세요.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
                  <NotebookPen className="h-4 w-4" aria-hidden="true" />
                  오늘 기록 추가
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:-translate-y-0.5 hover:shadow-lg">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  루틴 불러오기
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-600">
                종목별 대시보드
              </span>
              <span className="text-xs text-zinc-500">
                클릭해서 해당 종목 루틴 보기
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {categories.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === selected.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`group flex flex-col items-start gap-2 rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${isActive ? `${item.tone} shadow-inner` : "border-zinc-200 bg-white text-zinc-800"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${isActive ? "border-white/60 bg-white/70" : "border-zinc-200 bg-zinc-50 text-zinc-700"}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {item.label}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {item.highlight}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 space-y-6">
              <div
                className={`rounded-3xl border ${selected.tone} bg-white/70 p-6 shadow-sm`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-600">
                      핵심 포커스
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-900">
                      {selected.label} · {selected.highlight}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-zinc-700 shadow-inner">
                      <Timer className="h-4 w-4 text-emerald-600" />
                      준비 5-7분
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-zinc-700 shadow-inner">
                      <Flame className="h-4 w-4 text-orange-500" />
                      집중 구간 유지
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                  {selected.stats.map((stat) => (
                    <div
                      key={stat.title}
                      className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-inner"
                    >
                      <p className="text-xs font-semibold text-zinc-500">
                        {stat.title}
                      </p>
                      <p className="text-lg font-bold text-zinc-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-zinc-600">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-600">
                      루틴 스크립트
                    </p>
                    <h3 className="text-xl font-bold text-zinc-900">
                      오늘 진행할 순서
                    </h3>
                  </div>
                  <Map className="h-5 w-5 text-zinc-500" aria-hidden="true" />
                </div>

                <div className="mt-5 space-y-3">
                  {selected.routines.map((routine) => (
                    <div
                      key={routine.title}
                      className="flex flex-col gap-1 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-900">
                          {routine.title}
                        </span>
                        <span className="text-[11px] font-semibold text-zinc-500">
                          진행 체크
                        </span>
                      </div>
                      <p className="text-sm text-zinc-700">{routine.detail}</p>
                      <p className="text-xs text-zinc-500">{routine.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
