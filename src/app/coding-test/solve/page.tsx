"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Timer, Code2 } from "lucide-react";
import { SidebarLayout } from "../../_components/sidebar-layout";

type SearchParams = {
  site?: string;
  siteProblemId?: string;
  title?: string;
  difficulty?: string;
  verdict?: string;
  attemptedAt?: string;
};

const SITE_META: Record<
  string,
  {
    name: string;
    logoSrc: string;
  }
> = {
  BAEKJOON: { name: "백준", logoSrc: "/logos/baekjoon.png" },
  PROGRAMMERS: { name: "프로그래머스", logoSrc: "/logos/programmers.png" },
};

const PROGRAMMERS_LEVEL_COLORS: Record<number, string> = {
  0: "#2189ff",
  1: "#1bbaff",
  2: "#47c84c",
  3: "#ffa85a",
  4: "#ff6b18",
  5: "#c658e1",
};

function getMeta(site?: string) {
  const key = site?.toUpperCase();
  return SITE_META[key ?? ""] ?? { name: site ?? "-", logoSrc: "" };
}

function formatAttemptedAt(dateString?: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/\s/g, "")
    .replace(/\.$/, "");
}

function getVerdictDisplay(verdict?: string | null) {
  const normalized = verdict?.toUpperCase();
  switch (normalized) {
    case "AC":
      return { label: "성공", className: "text-emerald-600", Icon: CheckCircle2 };
    case "WA":
      return { label: "오답", className: "text-rose-500", Icon: XCircle };
    case "TLE":
      return { label: "시간 초과", className: "text-amber-500", Icon: Timer };
    case "MLE":
      return { label: "메모리 초과", className: "text-amber-600", Icon: Timer };
    case "RE":
      return { label: "런타임 에러", className: "text-orange-500", Icon: XCircle };
    case "CE":
      return { label: "컴파일 에러", className: "text-zinc-500", Icon: XCircle };
    case "PE":
      return { label: "출력 형식 에러", className: "text-orange-500", Icon: XCircle };
    case "GAVE_UP":
      return { label: "포기", className: "text-zinc-500", Icon: XCircle };
    default:
      return { label: "미정", className: "text-zinc-400", Icon: XCircle };
  }
}

export default function SolvePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [activeTab, setActiveTab] = useState(0);

  const data = useMemo(() => {
    const parsedDifficulty = searchParams.difficulty ? Number(searchParams.difficulty) : null;
    const difficulty =
      parsedDifficulty == null || Number.isNaN(parsedDifficulty) ? 15 : parsedDifficulty;

    // API 연동 전이므로 검색 파라미터가 없으면 예시 데이터를 사용합니다.
    return {
      site: searchParams.site ?? "BAEKJOON",
      siteProblemId: searchParams.siteProblemId ?? "1000",
      title: searchParams.title ?? "A+B",
      difficulty,
      lastAttempt: {
        verdict: searchParams.verdict ?? "AC",
        attemptedAt: searchParams.attemptedAt ?? "2025-12-05T13:45:00Z",
      },
    };
  }, [searchParams]);

  // API 연동 전: 최근 시도/상태 탭용 가짜 데이터
  const attempts = [
    {
      title: "12월 5일 시도",
      verdict: "AC",
      attemptedAt: "2025-12-05T13:45:00Z",
      duration: "18분",
      language: "Java",
      summary:
        "DFS/백트래킹으로 한 줄에 퀸 하나만 두고, 대각선 충돌만 검사하는 방식으로 통과.",
      code: `import java.util.*;
import java.io.*;

class Main {
    static int N;
    static int count = 0;

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        N = Integer.parseInt(br.readLine());
        int[] col = new int[N];
        dfs(0, 0, col);
        System.out.println(count);
    }

    static void dfs(int r, long usedCol, int[] col) {
        if (r == N) { count++; return; }
        for (int c = 0; c < N; c++) {
            if ((usedCol & (1L << c)) != 0) continue;
            boolean cross = false;
            for (int pr = 0; pr < r; pr++) {
                if (Math.abs(pr - r) == Math.abs(col[pr] - c)) { cross = true; break; }
            }
            if (cross) continue;
            col[r] = c;
            dfs(r + 1, usedCol | (1L << c), col);
        }
    }
}`,
      learnings: "대각선만 빠르게 체크하면 된다. 비트마스크로 열 방문을 관리하면 속도가 잘 나온다.",
      nextReview: "2025-12-12",
    },
    {
      title: "12월 4일 시도",
      verdict: "WA",
      attemptedAt: "2025-12-04T21:10:00Z",
      duration: "25분",
      language: "Java",
      summary: "대각선 체크를 빼먹어 일부 케이스에서 충돌을 놓침.",
      code: "// 대각선 체크 누락 버전",
      failureCategory: "Correctness",
      failureReason: "대각선 충돌 로직을 넣지 않아 오답.",
      learnings: "체크 리스트를 먼저 적고, 필수 제약(행/열/대각선)을 모두 반영했는지 검증한다.",
      nextReview: "2025-12-10",
    },
    {
      title: "12월 1일 시도",
      verdict: "TLE",
      attemptedAt: "2025-12-01T09:05:00Z",
      duration: "40분",
      language: "Java",
      summary: "모든 칸을 다 돌며 백트래킹을 돌려서 시간 초과.",
      code: "// 전체 탐색으로 인한 TLE",
      failureCategory: "Performance",
      failureReason: "불필요한 완전 탐색으로 가지치기 부족.",
      learnings: "가로/세로/대각선 제약을 조기에 체크해 분기 줄이기.",
      nextReview: "2025-12-08",
    },
  ];

  const meta = getMeta(data.site);

  return (
    <SidebarLayout>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="flex justify-between">
          <Link
            href="/coding-test"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            목록으로
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-b border-zinc-200 pb-4">
          {meta.logoSrc ? (
            <Image
              src={meta.logoSrc}
              alt={`${meta.name} 로고`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-200 text-sm font-semibold text-zinc-600">
              {data.site?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}

          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="font-mono text-xs">{data.siteProblemId}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span>{meta.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold text-zinc-900 leading-tight">{data.title}</h1>
              {data.difficulty != null && (
                <>
                  {data.site?.toUpperCase() === "BAEKJOON" ? (
                    <Image
                      src={`https://static.solved.ac/tier_small/${data.difficulty}.svg`}
                      alt="난이도"
                      width={32}
                      height={32}
                      className="h-8 w-8"
                      unoptimized
                    />
                  ) : (
                    <span
                      className="inline-flex items-center rounded-full border border-current px-3 py-1 text-sm font-semibold uppercase"
                      style={{
                        color: PROGRAMMERS_LEVEL_COLORS[data.difficulty] ?? "#1bbaff",
                      }}
                    >
                      Lv. {data.difficulty}
                    </span>
                  )}
                </>
              )}
            </div>
            {data.lastAttempt && (() => {
              const verdictDisplay = getVerdictDisplay(data.lastAttempt.verdict);
              const Icon = verdictDisplay.Icon;
              return (
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 font-semibold ${verdictDisplay.className}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {verdictDisplay.label}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    최근 시도: {formatAttemptedAt(data.lastAttempt.attemptedAt)}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
            {attempts.map((attempt, idx) => {
              const { label, className } = getVerdictDisplay(attempt.verdict);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                    activeTab === idx
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {attempt.title} <span className={className}>· {label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            {(() => {
              const attempt = attempts[activeTab] ?? attempts[0];
              const verdictDisplay = getVerdictDisplay(attempt.verdict);
              const Icon = verdictDisplay.Icon;
              return (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Icon className={`h-4 w-4 ${verdictDisplay.className}`} aria-hidden="true" />
                    <span className="font-semibold text-zinc-900">{attempt.title}</span>
                    <span className="text-xs text-zinc-500">
                      최근 시도: {formatAttemptedAt(attempt.attemptedAt)}
                    </span>
                    <span className="text-xs text-zinc-500">· 풀이 시간 {attempt.duration}</span>
                    <span className="text-xs text-zinc-500">· 사용 언어 {attempt.language}</span>
                  </div>

                  <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <div className="text-sm font-semibold text-zinc-800">시도 결과</div>
                    <div className={`text-sm font-semibold ${verdictDisplay.className}`}>
                      {verdictDisplay.label} ({attempt.verdict})
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <div className="text-sm font-semibold text-zinc-800">풀이 정리</div>
                    <p className="text-sm text-zinc-700">{attempt.summary}</p>
                  </div>

                  <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                      <Code2 className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                      코드
                    </div>
                    <pre className="max-h-64 overflow-auto rounded-lg bg-black px-3 py-2 text-xs text-white">
{attempt.code}
                    </pre>
                  </div>

                  {(attempt.failureCategory ||
                    attempt.failureReason ||
                    attempt.learnings ||
                    attempt.nextReview) && (
                    <div className="space-y-2 rounded-lg border border-rose-100 bg-rose-50 p-3">
                      <div className="text-sm font-semibold text-rose-600">실패/교훈 메모</div>
                      {attempt.failureCategory && (
                        <div className="text-sm text-rose-700">실패 원인 분류: {attempt.failureCategory}</div>
                      )}
                      {attempt.failureReason && (
                        <div className="text-sm text-rose-700">구체적 원인: {attempt.failureReason}</div>
                      )}
                      {attempt.learnings && (
                        <div className="text-sm text-rose-700">해결과정/배운점: {attempt.learnings}</div>
                      )}
                      {attempt.nextReview && (
                        <div className="text-sm text-rose-700">다음 복습 예정일: {attempt.nextReview}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center text-zinc-500">
          <p className="text-sm font-medium">풀이 작성 영역은 곧 연결됩니다.</p>
          <p className="text-xs">현재는 예시 데이터로 표시 중입니다. 원하시는 UI를 알려주세요.</p>
        </section>
      </div>
    </SidebarLayout>
  );
}

