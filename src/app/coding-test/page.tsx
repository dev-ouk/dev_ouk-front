"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
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
      </header>

      <section className="mt-10">{content}</section>
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

