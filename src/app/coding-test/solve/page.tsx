"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Timer, Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SidebarLayout } from "../../_components/sidebar-layout";
import { useSearchParams } from "next/navigation";

type SearchParams = {
  site?: string;
  siteProblemId?: string;
  title?: string;
  difficulty?: string;
  verdict?: string;
  attemptedAt?: string;
};

type Attempt = {
  verdict: string;
  attemptedAt: string;
  duration: string;
  language: string;
  summary: string;
  code?: string;
  failureCategory?: string;
  failureReason?: string;
  learnings?: string;
  nextReview?: string;
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

export default function SolvePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [draft, setDraft] = useState<Attempt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const searchParams = useSearchParams();

  const data = useMemo(() => {
    const getOrDefault = (key: keyof SearchParams, fallback: string) =>
      searchParams?.get(key) ?? fallback;
    const parsedDifficulty = searchParams?.get("difficulty")
      ? Number(searchParams.get("difficulty"))
      : null;
    const difficulty =
      parsedDifficulty == null || Number.isNaN(parsedDifficulty) ? 15 : parsedDifficulty;

    return {
      site: getOrDefault("site", "BAEKJOON"),
      siteProblemId: getOrDefault("siteProblemId", "1000"),
      title: getOrDefault("title", "A+B"),
      difficulty,
      lastAttempt: {
        verdict: getOrDefault("verdict", "AC"),
        attemptedAt: getOrDefault("attemptedAt", "2025-12-05T13:45:00Z"),
      },
    };
  }, [searchParams]);

  // API 연동 전: 최근 시도/상태 탭용 가짜 데이터
  const [attempts, setAttempts] = useState<Attempt[]>([
    {
      verdict: "AC",
      attemptedAt: "2025-12-05T13:45:00Z",
      duration: "18분",
      language: "Java",
      summary:
        "DFS/백트래킹으로 한 줄에 퀸 하나만 두고, 대각선 충돌만 검사하는 방식으로 통과했다. " +
        "행·열을 비트마스크로 관리해서 분기를 줄였고, 대각선은 이전 행만 비교해도 충분했다. " +
        "중간에 방문 배열을 잘못 초기화해서 한 번 TLE가 났지만, 범위 줄이기로 해결했다. " +
        "테스트 데이터가 작다고 방심하지 말고 최악 케이스를 항상 염두에 둬야 한다. " +
        "시간 복잡도와 가지치기 조건을 먼저 적어두면 구현 실수가 크게 줄어든다.",
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
      learnings:
        "대각선 충돌만 체크해도 충분하다는 점을 수식으로 먼저 확인하자. " +
        "비트마스크로 열을 관리하면 O(1)로 열 충돌을 확인할 수 있어 분기 수가 확 줄었다. " +
        "중간 상태를 프린트해서 디버깅하는 대신, 조건을 표로 정리하고 놓친 케이스를 체크리스트로 관리하니 더 빨랐다. " +
        "다음에는 실패 케이스를 먼저 적고, 그걸 막는 조건을 코드로 옮기는 습관을 들이겠다.",
      nextReview: "2025-12-12",
    },
    {
      verdict: "WA",
      attemptedAt: "2025-12-04T21:10:00Z",
      duration: "25분",
      language: "Java",
      summary:
        "대각선 체크를 빼먹어 일부 케이스에서 충돌을 놓쳤다. " +
        "행/열만 검사하면 충분하다고 착각한 게 원인이었다. " +
        "테스트를 몇 개만 돌려보고 통과했다고 판단한 것이 치명적이었다. " +
        "체크리스트 없이 구현하면 제약을 하나씩 빼먹기 쉽다는 것을 다시 느꼈다. " +
        "최소한의 반례라도 직접 만들어 보는 습관이 필요하다.",
      code: "// 대각선 체크 누락 버전",
      failureCategory: "Correctness",
      failureReason: "대각선 충돌 로직을 넣지 않아 오답.",
      learnings:
        "필수 제약(행/열/대각선)을 먼저 종이에 적고, 구현 후 하나씩 체크해 보자. " +
        "반례를 직접 만들고, 그 반례가 통과하는지 확인하는 과정을 빼먹지 않는다. " +
        "테스트를 짧게 끝내지 말고, 실패한 케이스를 기록해 두면 다음 번에 같은 실수를 줄일 수 있다. " +
        "디버깅 시에는 로그 대신 제약 조건 목록과 실제 코드 흐름을 나란히 보며 차이를 찾는 것이 효과적이었다.",
      nextReview: "2025-12-10",
    },
    {
      verdict: "TLE",
      attemptedAt: "2025-12-01T09:05:00Z",
      duration: "40분",
      language: "Java",
      summary:
        "모든 칸을 다 돌며 백트래킹을 돌려서 시간 초과가 났다. " +
        "가지치기 전에 하위 분기를 전부 확장해버려 연산량이 폭증했다. " +
        "열/대각선 체크를 뒤늦게 넣어도 이미 쌓인 재귀 깊이 때문에 효과가 없었다. " +
        "입력 크기가 커질 때의 연산량을 대략 계산하지 않고 구현부터 한 것이 문제였다. " +
        "최악 복잡도를 추정해보고, 줄일 수 있는 제약을 먼저 반영해야 한다.",
      code: "// 전체 탐색으로 인한 TLE",
      failureCategory: "Performance",
      failureReason: "불필요한 완전 탐색으로 가지치기 부족.",
      learnings:
        "가지치기 조건을 초기에 넣지 않으면 재귀 깊이가 걷잡을 수 없게 커진다. " +
        "연산량이 의심되면 먼저 최악 복잡도를 적고, 줄일 수 있는 제약을 모두 열거한 뒤 코드에 반영하자. " +
        "무조건 전체 탐색을 시도하기보다, 배제할 수 있는 상태를 더 일찍 제거하는 순서를 고민하는 게 중요하다. " +
        "다음에는 구현 전에 상태·제약·복잡도를 체크리스트로 작성한 뒤 진행하기.",
      nextReview: "2025-12-08",
    },
  ]);

  const handleAddAttempt = () => {
    const now = new Date();
    const iso = now.toISOString();
    const dateOnly = iso.split("T")[0];

    const newDraft: Attempt = {
      verdict: "AC",
      attemptedAt: dateOnly,
      duration: "10",
      language: "Java",
      summary: "",
      code: "",
      failureCategory: "",
      failureReason: "",
      learnings: "",
      nextReview: dateOnly,
    };

    setDraft(newDraft);
    setIsEditing(true);
    setActiveTab(attempts.length);
  };

  const handleDraftChange = <K extends keyof Attempt>(key: K, value: Attempt[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSaveDraft = () => {
    if (!draft) return;
    setAttempts((prev) => {
      const updated = [...prev, draft];
      setActiveTab(updated.length - 1);
      return updated;
    });
    setDraft(null);
    setIsEditing(false);
  };

  const handleCancelDraft = () => {
    setDraft(null);
    setIsEditing(false);
    setActiveTab((prev) => (prev >= attempts.length ? Math.max(0, attempts.length - 1) : prev));
  };

  // activeTab이 유효한 범위를 벗어나지 않도록 보정
  useEffect(() => {
    const displayLength = (isEditing && draft ? attempts.length + 1 : attempts.length) || 1;
    if (activeTab >= displayLength) {
      setActiveTab(Math.max(0, displayLength - 1));
    }
  }, [activeTab, attempts.length, draft, isEditing]);

  const getAttemptTitle = (attempt: Attempt) => {
    const label = formatAttemptedAt(attempt.attemptedAt);
    return `${label} 시도`;
  };

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
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
            <div className="flex flex-wrap gap-2">
              {(isEditing && draft ? [...attempts, draft] : attempts).map((attempt, idx) => {
                const { label, className } = getVerdictDisplay(attempt.verdict);
                const isDraftTab = isEditing && draft && idx === attempts.length;
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
                    {isDraftTab ? "새 시도 (편집중)" : getAttemptTitle(attempt)}{" "}
                    <span className={className}>· {label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleAddAttempt}
              className="rounded-full border border-dashed border-zinc-300 px-3 py-1 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            >
              + 시도 추가
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {(() => {
              const displayAttempts = isEditing && draft ? [...attempts, draft] : attempts;
              const attempt = displayAttempts[activeTab] ?? displayAttempts[0];
              const isDraftTab = isEditing && draft && activeTab === attempts.length;

              if (isDraftTab && draft) {
                return (
                  <div className="space-y-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-4">
                    <div className="flex items-center justify-between pb-1">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Attempt</p>
                        <h2 className="text-lg font-semibold text-zinc-900">새 시도 작성</h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCancelDraft}
                          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
                        >
                          저장
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600">시도 일시</label>
                        <input
                          type="date"
                          value={draft.attemptedAt}
                          onChange={(e) => handleDraftChange("attemptedAt", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600">풀이 시간</label>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={draft.duration}
                          onChange={(e) => handleDraftChange("duration", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600">사용 언어</label>
                        <select
                          value={draft.language}
                          onChange={(e) => handleDraftChange("language", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                        >
                          {["Java", "JavaScript", "TypeScript", "Python", "C++", "Go", "Kotlin", "C#"].map(
                            (lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600">시도 결과</label>
                        <select
                          value={draft.verdict}
                          onChange={(e) => handleDraftChange("verdict", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                        >
                          {["AC", "WA", "TLE", "MLE", "RE", "CE", "PE", "GAVE_UP"].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600">복습 예정일</label>
                        <input
                          type="text"
                          value={draft.nextReview ?? ""}
                          onChange={(e) => handleDraftChange("nextReview", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600">풀이 정리</label>
                        <textarea
                          value={draft.summary}
                          onChange={(e) => handleDraftChange("summary", e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600">코드</label>
                        <textarea
                          value={draft.code ?? ""}
                          onChange={(e) => handleDraftChange("code", e.target.value)}
                          rows={6}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm text-zinc-800 outline-none focus:border-zinc-300"
                        />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-600">실패 원인 분류</label>
                          <input
                            type="text"
                            value={draft.failureCategory ?? ""}
                            onChange={(e) => handleDraftChange("failureCategory", e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-600">구체적 원인</label>
                          <input
                            type="text"
                            value={draft.failureReason ?? ""}
                            onChange={(e) => handleDraftChange("failureReason", e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600">해결과정/배운점</label>
                        <textarea
                          value={draft.learnings ?? ""}
                          onChange={(e) => handleDraftChange("learnings", e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancelDraft}
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                );
              }

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
                    <div className="text-base font-semibold text-zinc-800">시도 결과</div>
                    <div className={`text-sm font-semibold ${verdictDisplay.className}`}>
                      {verdictDisplay.label} ({attempt.verdict})
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <div className="text-base font-semibold text-zinc-800">풀이 정리</div>
                    <p className="text-sm leading-relaxed text-zinc-700">{attempt.summary}</p>
                  </div>

                  <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    <div className="flex items-center gap-2 text-base font-semibold text-zinc-800">
                      <Code2 className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                      코드
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-zinc-200">
                      <SyntaxHighlighter
                        language={(attempt.language ?? "text").toLowerCase()}
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                          lineHeight: "1.6",
                        }}
                        showLineNumbers
                      >
{attempt.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {(attempt.failureCategory ||
                    attempt.failureReason ||
                    attempt.learnings ||
                    attempt.nextReview) && (
                    <div className="space-y-3 rounded-lg border border-rose-100 bg-rose-50 p-3">
                      <div className="text-base font-semibold text-rose-600">실패/교훈 메모</div>
                      {attempt.failureCategory && (
                        <div className="space-y-1 border-t border-rose-100 pt-2">
                          <div className="text-sm font-semibold text-rose-700">실패 원인 분류</div>
                          <div className="text-sm leading-relaxed text-rose-700">
                            {attempt.failureCategory}
                          </div>
                        </div>
                      )}
                      {attempt.failureReason && (
                        <div className="space-y-1 border-t border-rose-100 pt-2">
                          <div className="text-sm font-semibold text-rose-700">구체적 원인</div>
                          <div className="text-sm leading-relaxed text-rose-700">
                            {attempt.failureReason}
                          </div>
                        </div>
                      )}
                      {attempt.learnings && (
                        <div className="space-y-1 border-t border-rose-100 pt-2">
                          <div className="text-sm font-semibold text-rose-700">해결과정/배운점</div>
                          <div className="text-sm leading-relaxed text-rose-700">
                            {attempt.learnings}
                          </div>
                        </div>
                      )}
                      {attempt.nextReview && (
                        <div className="space-y-1 border-t border-rose-100 pt-2">
                          <div className="text-sm font-semibold text-rose-700">다음 복습 예정일</div>
                          <div className="text-sm font-semibold text-rose-700">{attempt.nextReview}</div>
                        </div>
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

