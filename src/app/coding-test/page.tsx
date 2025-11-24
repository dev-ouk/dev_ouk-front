"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { SidebarLayout } from "../_components/sidebar-layout";

type Problem = {
  site: string;
  siteProblemId: number | string;
  tier?: string | null;
  level?: number | null;
  title?: string | null;
  name?: string | null;
  lastAttempt?: {
    verdict?: string | null;
    attemptedAt?: string | null;
  } | null;
};

type SiteMeta = {
  name: string;
  logoSrc: string;
};

const SITE_META: Record<string, SiteMeta> = {
  BAEKJOON: {
    name: "백준",
    logoSrc: "/logos/baekjoon.svg",
  },
  PROGRAMMERS: {
    name: "프로그래머스",
    logoSrc: "/logos/programmers.svg",
  },
};

const PROGRAMMERS_LEVEL_COLORS: Record<number, string> = {
  0: "#21a1ff",
  1: "#1bbaff",
  2: "#47c84c",
  3: "#ffa800",
  4: "#ff6b18",
  5: "#c658e1",
};

const BAEKJOON_TIERS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"];

function getBaekjoonTierId(tier?: string | null, level?: number | null) {
  if (!tier || level == null) {
    return undefined;
  }

  const normalizedTier =
    typeof tier === "string"
      ? tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()
      : tier;
  const tierIndex = BAEKJOON_TIERS.indexOf(normalizedTier);

  if (tierIndex === -1 || level < 1 || level > 5) {
    return undefined;
  }

  return tierIndex * 5 + (6 - level);
}

function getBaekjoonTierLabel(tier?: string | null, level?: number | null) {
  if (!tier || level == null) {
    return "-";
  }
  const normalizedTier =
    typeof tier === "string"
      ? tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()
      : tier;
  return `${normalizedTier} ${level}`;
}

function getProgrammersLevelLabel(level?: number | null) {
  if (level == null) {
    return "-";
  }
  return `Lv. ${level}`;
}

function formatAttemptedAt(dateString?: string | null) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  const raw = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date).replace(/\s/g, "");

  return raw.endsWith(".") ? raw.slice(0, -1) : raw;
}

function getProblemTitle(problem: Problem) {
  return problem.title ?? problem.name ?? "-";
}

function getSiteMeta(site: string): SiteMeta {
  const key = site?.toUpperCase();
  return SITE_META[key] ?? { name: site ?? "-", logoSrc: "" };
}

function getVerdictDisplay(verdict?: string | null) {
  const normalized = verdict?.toUpperCase();
  const isAccepted = normalized === "AC";

  if (isAccepted) {
    return {
      label: "정답",
      icon: CheckCircle2,
      className: "text-emerald-500",
    };
  }

  return {
    label: "오답",
    icon: XCircle,
    className: "text-rose-500",
  };
}

export default function CodingTestPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProblems = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        setError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
        const response = await fetch(`${normalizedBaseUrl}/api/v1/problems`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`문제 목록을 불러올 수 없습니다. (status: ${response.status})`);
        }

        const payload = (await response.json()) as Problem[];
        setProblems(Array.isArray(payload) ? payload : []);
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        setError((fetchError as Error).message);
        setProblems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();

    return () => {
      controller.abort();
    };
  }, []);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span className="text-sm font-medium">문제 목록을 불러오는 중입니다...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-600">
          <p className="text-sm font-medium">{error}</p>
        </div>
      );
    }

    if (!problems.length) {
      return (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white text-center text-zinc-500">
          <p className="text-sm font-medium">아직 풀이 기록이 없습니다.</p>
          <p className="mt-1 text-xs">
            첫 번째 코딩 테스트 문제를 풀고 나면 이곳에 기록이 표시됩니다.
          </p>
        </div>
      );
    }

    return <ProblemTable problems={problems} />;
  }, [error, isLoading, problems]);

  return (
    <SidebarLayout>
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Coding Test
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">풀이 기록</h1>
        <p className="mt-2 text-sm text-zinc-600">
          <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700">
            GET /api/v1/problems
          </code>{" "}
          응답을 기반으로 최근 코딩 테스트 풀이 내역을 보여줍니다.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
          >
            문제 풀이 기록 추가하기
          </button>
        </div>
      </header>

      <section className="mt-10">{content}</section>

      {isModalOpen ? (
        <AddProblemModal
          onClose={() => {
            setIsModalOpen(false);
            setIsDirectModalOpen(false);
          }}
          onOpenDirectModal={() => setIsDirectModalOpen(true)}
        />
      ) : null}
      {isDirectModalOpen ? (
        <DirectAddModal onClose={() => setIsDirectModalOpen(false)} />
      ) : null}
    </SidebarLayout>
  );
}

function ProblemTable({ problems }: { problems: Problem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full table-fixed">
        <thead className="bg-zinc-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <th className="px-6 py-4">문제 풀이 사이트</th>
            <th className="px-6 py-4">티어 / 난이도</th>
            <th className="px-6 py-4">문제 명</th>
            <th className="px-6 py-4">문제 ID</th>
            <th className="px-6 py-4">최종 시도일</th>
            <th className="px-6 py-4">최종 상태</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr
              key={`${problem.site}-${problem.siteProblemId}-${index}`}
              className="border-t border-zinc-100 text-sm text-zinc-700 transition hover:bg-zinc-50"
            >
              <td className="px-6 py-4">
                <SiteCell site={problem.site} />
              </td>
              <td className="px-6 py-4">
                <TierCell problem={problem} />
              </td>
              <td className="px-6 py-4">
                <span className="block max-w-xs truncate font-medium text-zinc-900">
                  {getProblemTitle(problem)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-sm text-zinc-600">
                  {problem.siteProblemId ?? "-"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-zinc-600">
                  {formatAttemptedAt(problem.lastAttempt?.attemptedAt)}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusCell verdict={problem.lastAttempt?.verdict} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SiteCell({ site }: { site: string }) {
  const meta = getSiteMeta(site);

  if (!meta.logoSrc) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600">
          {site?.[0]?.toUpperCase() ?? "?"}
        </div>
        <span className="text-sm font-medium text-zinc-800">{meta.name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        src={meta.logoSrc}
        alt={`${meta.name} 로고`}
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg"
      />
      <span className="text-sm font-medium text-zinc-800">{meta.name}</span>
    </div>
  );
}

function TierCell({ problem }: { problem: Problem }) {
  const siteKey = problem.site?.toUpperCase();

  if (siteKey === "BAEKJOON") {
    const tierId = getBaekjoonTierId(problem.tier, problem.level);
    const label = getBaekjoonTierLabel(problem.tier, problem.level);

    return (
      <div className="flex items-center gap-2">
        {tierId ? (
          <Image
            src={`https://static.solved.ac/tier_small/${tierId}.svg`}
            alt={`${label} 아이콘`}
            width={32}
            height={32}
            className="h-8 w-8"
            unoptimized
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-500">
            -
          </div>
        )}
        <span className="text-sm font-medium text-zinc-700">{label}</span>
      </div>
    );
  }

  if (siteKey === "PROGRAMMERS") {
    const color = PROGRAMMERS_LEVEL_COLORS[problem.level ?? -1] ?? "#1bbaff";
    const label = getProgrammersLevelLabel(problem.level);

    return (
      <span
        className="inline-flex items-center rounded-full border border-current px-3 py-1 text-xs font-semibold uppercase"
        style={{ color }}
      >
        {label}
      </span>
    );
  }

  return <span className="text-sm text-zinc-500">-</span>;
}

function StatusCell({ verdict }: { verdict?: string | null }) {
  const { label, icon: Icon, className } = getVerdictDisplay(verdict);

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  );
}

function AddProblemModal({
  onClose,
  onOpenDirectModal,
}: {
  onClose: () => void;
  onOpenDirectModal: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Coding Test
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-900">
              문제 풀이 기록 추가
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              사이트와 문제를 검색하여 기록을 추가할 수 있습니다. 지금은 UI만 준비되어 있어요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-5">
            <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                사이트 선택
              </span>
              <div className="flex flex-wrap gap-2">
                {["백준", "프로그래머스", "기타"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 focus-within:border-zinc-300 focus-within:bg-white focus-within:text-zinc-700">
                <Search className="h-4 w-4" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="문제 번호 또는 이름으로 검색하세요"
                  className="w-full border-none bg-transparent text-sm text-zinc-700 outline-none"
                  disabled
                />
              </label>

              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                검색 결과는 이 영역에 표시됩니다. API 연동 전이라 아직 비어 있습니다.
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              선택한 문제
            </span>
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-500">
              아직 선택된 문제가 없습니다. 검색 결과에서 문제를 선택하면 상세 정보가 여기에 표시됩니다.
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
              disabled
            >
              선택한 문제 추가
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDirectModal();
              }}
              className="w-full rounded-xl border border-dashed border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700"
            >
              해당 문제 직접 추가
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectAddModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Coding Test
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-900">
              문제 직접 추가
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              검색에 없는 문제를 직접 입력해 새로운 풀이 기록을 생성할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              사이트 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {["백준", "프로그래머스", "기타"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="사이트 문제 ID">
              <input
                type="text"
                placeholder="예: 1000"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-300"
                disabled
              />
            </Field>
            <Field label="문제명">
              <input
                type="text"
                placeholder="예: A+B"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-300"
                disabled
              />
            </Field>
          </div>

          <Field label="문제 링크">
            <input
              type="url"
              placeholder="https://..."
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-300"
              disabled
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="백준 티어 선택">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
                선택 버튼은 추후 연동 예정입니다.
              </div>
            </Field>
            <Field label="백준 난이도 선택">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
                선택 버튼은 추후 연동 예정입니다.
              </div>
            </Field>
            <Field label="프로그래머스 Level 선택">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
                Level 선택 UI는 추후 추가됩니다.
              </div>
            </Field>
          </div>

          <Field label="알고리즘 태그 선택">
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
              API 연동 시 태그 선택 컴포넌트가 이 자리에 표시될 예정입니다.
            </div>
          </Field>
        </div>

        <footer className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
          >
            취소
          </button>
          <button
            type="button"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
          >
            문제 추가 완료
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  );
}

