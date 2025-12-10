"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, Loader2, Search, X, XCircle } from "lucide-react";
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

type TaxonomyTerm = {
  slug: string;
  name: string;
};

type ProblemPreview = {
  site?: string | null;
  siteProblemId?: string | number | null;
  title?: string | null;
  url?: string | null;
  difficulty?: number | null;
  taxonomies?: {
    algo?: {
      suggestedTermSlugs?: string[];
    };
  } | null;
};

type ProblemsResponse = {
  items?: Problem[];
  size?: number;
  hasNext?: boolean;
  nextCursor?: string | null;
  sort?: string | null;
};

type ProblemCandidate = {
  site: string;
  siteProblemId: string;
  title: string;
  difficulty: number | null;
  lastAttempt: {
    verdict: string;
    attemptedAt: string;
  } | null;
};

type ProblemCandidatesResponse = {
  items: ProblemCandidate[];
  size: number;
  hasNext: boolean;
  nextCursor: string | null;
};

const SITE_META: Record<string, SiteMeta> = {
  BAEKJOON: {
    name: "백준",
    logoSrc: "/logos/baekjoon.png",
  },
  PROGRAMMERS: {
    name: "프로그래머스",
    logoSrc: "/logos/programmers.png",
  },
};

const PROGRAMMERS_LEVEL_COLORS: Record<number, string> = {
  0: "#2189ff",
  1: "#1bbaff",
  2: "#47c84c",
  3: "#ffa85a",
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

type TabType = "problems" | "dsa";

export default function CodingTestPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("problems");
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

        const payload = (await response.json()) as ProblemsResponse | Problem[];
        if (Array.isArray(payload)) {
          setProblems(payload);
        } else {
          setProblems(payload.items ?? []);
        }
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
      <div className="mx-auto w-full max-w-4xl">
        <header>
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

        <div className="mt-8">
          <div className="flex gap-1 border-b border-zinc-200">
            <button
              type="button"
              onClick={() => setActiveTab("problems")}
              className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === "problems"
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              풀이 기록
              {activeTab === "problems" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dsa")}
              className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === "dsa"
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              DS&A 글
              {activeTab === "dsa" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
              )}
            </button>
          </div>
        </div>

        <section className="mt-10">
          {activeTab === "problems" ? (
            <>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
                >
                  문제 풀이 기록 추가하기
                </button>
              </div>
              {content}
            </>
          ) : (
            <>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => router.push("/coding-test/dsa/write")}
                  className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
                >
                  글쓰기
                </button>
              </div>
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white text-center text-zinc-500">
                <p className="text-sm font-medium">DS&A 글 섹션은 준비 중입니다.</p>
              </div>
            </>
          )}
        </section>
      </div>

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<ProblemCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ProblemCandidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const siteOptions = [
    { key: "BAEKJOON", label: "백준" },
    { key: "PROGRAMMERS", label: "프로그래머스" },
  ];

  const toggleSite = (siteKey: string) => {
    setSelectedSites((prev) =>
      prev.includes(siteKey) ? prev.filter((s) => s !== siteKey) : [...prev, siteKey],
    );
  };

  const fetchCandidates = async (cursor?: string | null, append = false) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      setError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.append("q", searchQuery.trim());
      }

      selectedSites.forEach((site) => {
        params.append("sites", site);
      });

      params.append("size", "20");

      if (cursor) {
        params.append("cursor", cursor);
      }

      const response = await fetch(
        `${normalizedBaseUrl}/api/v1/problem-candidates?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(`문제 검색에 실패했습니다. (status: ${response.status})`);
      }

      const payload = (await response.json()) as ProblemCandidatesResponse;

      if (append) {
        setCandidates((prev) => [...prev, ...payload.items]);
      } else {
        setCandidates(payload.items);
      }

      setHasNext(payload.hasNext);
      setNextCursor(payload.nextCursor);
    } catch (fetchError) {
      setError((fetchError as Error).message);
      if (!append) {
        setCandidates([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCandidates(null, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSites]);

  const loadMore = () => {
    if (nextCursor && !isLoading) {
      fetchCandidates(nextCursor, true);
    }
  };

  const handleSelectProblem = (problem: ProblemCandidate) => {
    setSelectedProblem(problem);
  };

  const handleSubmit = async () => {
    if (!selectedProblem) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const params = new URLSearchParams({
        site: selectedProblem.site,
        siteProblemId: selectedProblem.siteProblemId,
        title: selectedProblem.title,
      });

      if (selectedProblem.difficulty != null) {
        params.set("difficulty", String(selectedProblem.difficulty));
      }

      router.push(`/coding-test/solve?${params.toString()}`);
      onClose();
    } catch (fetchError) {
      setSubmitError((fetchError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              사이트와 문제를 검색하여 기록을 추가할 수 있습니다.
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
                {siteOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => toggleSite(option.key)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      selectedSites.includes(option.key)
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
                    }`}
                  >
                    {option.label}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-none bg-transparent text-sm text-zinc-700 outline-none"
                />
              </label>

              <div className="min-h-[200px] max-h-[400px] overflow-y-auto rounded-lg border border-zinc-200 bg-white">
                {isLoading && candidates.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    검색 중...
                  </div>
                ) : error ? (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                    {error}
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {candidates.map((candidate, index) => (
                      <button
                        key={`${candidate.site}-${candidate.siteProblemId}-${index}`}
                        type="button"
                        onClick={() => handleSelectProblem(candidate)}
                        className={`w-full px-4 py-3 text-left transition ${
                          selectedProblem?.site === candidate.site &&
                          selectedProblem?.siteProblemId === candidate.siteProblemId
                            ? "bg-zinc-100"
                            : "hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-zinc-500">
                                {candidate.siteProblemId}
                              </span>
                              <span className="text-sm font-medium text-zinc-900">
                                {candidate.title}
                              </span>
                            </div>
                            {candidate.lastAttempt && (() => {
                              const verdictDisplay = getVerdictDisplay(candidate.lastAttempt.verdict);
                              const Icon = verdictDisplay.icon;
                              return (
                                <div className="mt-1 flex items-center gap-2">
                                  <Icon
                                    className={`h-3 w-3 ${verdictDisplay.className}`}
                                    aria-hidden="true"
                                  />
                                  <span className="text-xs text-zinc-500">
                                    {verdictDisplay.label} ·{" "}
                                    {formatAttemptedAt(candidate.lastAttempt.attemptedAt)}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="ml-2 flex items-center gap-2">
                            {selectedProblem?.site === candidate.site &&
                              selectedProblem?.siteProblemId === candidate.siteProblemId ? (
                              <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                            ) : null}
                            {candidate.difficulty != null && (
                              <div>
                                {candidate.site === "BAEKJOON" ? (
                                  <Image
                                    src={`https://static.solved.ac/tier_small/${candidate.difficulty}.svg`}
                                    alt="난이도"
                                    width={24}
                                    height={24}
                                    className="h-6 w-6"
                                    unoptimized
                                  />
                                ) : (
                                  <span
                                    className="inline-flex items-center rounded-full border border-current px-2 py-0.5 text-xs font-semibold uppercase"
                                    style={{
                                      color:
                                        PROGRAMMERS_LEVEL_COLORS[candidate.difficulty] ?? "#1bbaff",
                                    }}
                                  >
                                    Lv. {candidate.difficulty}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {hasNext && !isLoading && (
                  <div className="border-t border-zinc-200 p-4">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      더 보기
                    </button>
                  </div>
                )}
                {isLoading && candidates.length > 0 && (
                  <div className="flex items-center justify-center border-t border-zinc-200 p-4 text-sm text-zinc-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    불러오는 중...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              선택한 문제
            </span>
            {selectedProblem ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const meta = getSiteMeta(selectedProblem.site);
                        return meta.logoSrc ? (
                          <Image
                            src={meta.logoSrc}
                            alt={`${meta.name} 로고`}
                            width={20}
                            height={20}
                            className="h-5 w-5 rounded"
                          />
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-200 text-xs font-semibold text-zinc-600">
                            {selectedProblem.site?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        );
                      })()}
                      <span className="font-mono text-xs text-zinc-500">
                        {selectedProblem.siteProblemId}
                      </span>
                      <span className="text-sm font-medium text-zinc-900">
                        {selectedProblem.title}
                      </span>
                    </div>
                    {selectedProblem.lastAttempt && (() => {
                      const verdictDisplay = getVerdictDisplay(selectedProblem.lastAttempt.verdict);
                      const Icon = verdictDisplay.icon;
                      return (
                        <div className="mt-1 flex items-center gap-2">
                          <Icon
                            className={`h-3 w-3 ${verdictDisplay.className}`}
                            aria-hidden="true"
                          />
                          <span className="text-xs text-zinc-500">
                            {verdictDisplay.label} ·{" "}
                            {formatAttemptedAt(selectedProblem.lastAttempt.attemptedAt)}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  {selectedProblem.difficulty != null && (
                    <div className="ml-2">
                      {selectedProblem.site === "BAEKJOON" ? (
                        <Image
                          src={`https://static.solved.ac/tier_small/${selectedProblem.difficulty}.svg`}
                          alt="난이도"
                          width={24}
                          height={24}
                          className="h-6 w-6"
                          unoptimized
                        />
                      ) : (
                        <span
                          className="inline-flex items-center rounded-full border border-current px-2 py-0.5 text-xs font-semibold uppercase"
                          style={{
                            color:
                              PROGRAMMERS_LEVEL_COLORS[selectedProblem.difficulty] ?? "#1bbaff",
                          }}
                        >
                          Lv. {selectedProblem.difficulty}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-500">
                아직 선택된 문제가 없습니다. 검색 결과에서 문제를 선택하면 상세 정보가 여기에
                표시됩니다.
              </div>
            )}

            {submitError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
                {submitError}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedProblem || isSubmitting}
              className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  등록 중...
                </span>
              ) : (
                "이 문제 풀이 등록하기"
              )}
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
  const [search, setSearch] = useState("");
  const [terms, setTerms] = useState<TaxonomyTerm[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [problemLink, setProblemLink] = useState("");
  const [detectedSite, setDetectedSite] = useState<"BAEKJOON" | "PROGRAMMERS" | null>(null);
  const [detectedProblemId, setDetectedProblemId] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewDifficulty, setPreviewDifficulty] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTerms = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        setTermsError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
        setIsLoadingTerms(false);
        setTerms([]);
        return;
      }

      try {
        setIsLoadingTerms(true);
        setTermsError(null);

        const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
        const query = search.trim()
          ? `?q=${encodeURIComponent(search.trim())}`
          : "";
        const response = await fetch(
          `${normalizedBaseUrl}/api/v1/taxonomies/algo/terms${query}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `알고리즘 태그를 불러올 수 없습니다. (status: ${response.status})`,
          );
        }

        const payload = (await response.json()) as {
          items?: TaxonomyTerm[];
        };

        setTerms(payload.items ?? []);
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        setTermsError((fetchError as Error).message);
        setTerms([]);
      } finally {
        setIsLoadingTerms(false);
      }
    };

    fetchTerms();

    return () => {
      controller.abort();
    };
  }, [search]);

  const toggleTerm = (slug: string) => {
    setSelectedTerms((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug],
    );
  };

  useEffect(() => {
    if (!problemLink.trim()) {
      setDetectedSite(null);
      setDetectedProblemId("");
      setLinkError(null);
      return;
    }

    try {
      const url = new URL(problemLink.trim());
      const hostname = url.hostname.toLowerCase();
      const pathname = url.pathname.toLowerCase();

      if (hostname.includes("acmicpc.net")) {
        const match = pathname.match(/\/problem\/(\d+)/);
        if (match) {
          setDetectedSite("BAEKJOON");
          setDetectedProblemId(match[1]);
          setLinkError(null);
          return;
        }
        setDetectedSite(null);
        setDetectedProblemId("");
        setLinkError("백준 링크 형식을 인식하지 못했습니다.");
        return;
      }

      if (hostname.includes("programmers.co.kr")) {
        const match = pathname.match(/\/lessons\/(\d+)/);
        if (match) {
          setDetectedSite("PROGRAMMERS");
          setDetectedProblemId(match[1]);
          setLinkError(null);
          return;
        }
        setDetectedSite(null);
        setDetectedProblemId("");
        setLinkError("프로그래머스 링크 형식을 인식하지 못했습니다.");
        return;
      }

      setDetectedSite(null);
      setDetectedProblemId("");
      setLinkError("지원하지 않는 문제 사이트입니다.");
    } catch (urlError) {
      setDetectedSite(null);
      setDetectedProblemId("");
      setLinkError("올바른 URL을 입력해 주세요.");
    }
  }, [problemLink]);

  useEffect(() => {
    if (!problemLink.trim() || linkError || !detectedSite) {
      setPreviewLoading(false);
      setPreviewError(null);
      setPreviewTitle("");
      setPreviewDifficulty(null);
      return;
    }

    const controller = new AbortController();

    const fetchPreview = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        setPreviewError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
        setPreviewLoading(false);
        setPreviewTitle("");
        setPreviewDifficulty(null);
        return;
      }

      try {
        setPreviewLoading(true);
        setPreviewError(null);

        const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
        const response = await fetch(`${normalizedBaseUrl}/api/v1/problem-previews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: problemLink.trim() }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `문제 정보를 불러올 수 없습니다. (status: ${response.status})`,
          );
        }

        const payload = (await response.json()) as ProblemPreview;
        const normalizedSite = payload.site?.toUpperCase() as
          | "BAEKJOON"
          | "PROGRAMMERS"
          | undefined;

        if (normalizedSite === "BAEKJOON" || normalizedSite === "PROGRAMMERS") {
          setDetectedSite(normalizedSite);
        }

        if (payload.siteProblemId) {
          setDetectedProblemId(String(payload.siteProblemId));
        }

        setPreviewTitle(payload.title ?? "");
        setPreviewDifficulty(
          typeof payload.difficulty === "number" ? payload.difficulty : null,
        );

        const suggestedSlugs =
          payload.taxonomies?.algo?.suggestedTermSlugs ?? [];
        setSelectedTerms(suggestedSlugs);
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        setPreviewError((fetchError as Error).message);
        setPreviewTitle("");
        setPreviewDifficulty(null);
      } finally {
        setPreviewLoading(false);
      }
    };

    fetchPreview();

    return () => {
      controller.abort();
    };
  }, [problemLink, detectedSite, linkError]);

  const renderDifficultyContent = () => {
    if (previewLoading) {
      return (
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          정보를 불러오는 중입니다...
        </div>
      );
    }

    if (previewError) {
      return <p className="text-sm text-rose-500">{previewError}</p>;
    }

    if (!detectedSite || previewDifficulty == null) {
      return <p className="text-sm text-zinc-500">문제 링크를 입력하면 난이도가 표시됩니다.</p>;
    }

    if (detectedSite === "BAEKJOON") {
      return (
        <div className="flex items-center justify-center">
          <Image
            src={`https://static.solved.ac/tier_large/${previewDifficulty}.svg`}
            alt="백준 난이도"
            width={48}
            height={48}
            className="h-12 w-12"
            unoptimized
          />
        </div>
      );
    }

    const color = PROGRAMMERS_LEVEL_COLORS[previewDifficulty] ?? "#1bbaff";
    return (
      <span
        className="inline-flex items-center rounded-full border border-current px-3 py-1 text-sm font-semibold"
        style={{ color }}
      >
        Lv. {previewDifficulty}
      </span>
    );
  };

  const handleSubmit = async () => {
    if (!detectedSite || !detectedProblemId || !problemLink.trim()) {
      setSubmitError("필수 정보가 누락되었습니다.");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      setSubmitError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
      const response = await fetch(`${normalizedBaseUrl}/api/v1/problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site: detectedSite,
          siteProblemId: detectedProblemId,
          title: previewTitle || null,
          url: problemLink.trim(),
          difficulty: previewDifficulty,
          tagSlugs: selectedTerms,
        }),
      });

      if (!response.ok) {
        throw new Error(`문제 등록에 실패했습니다. (status: ${response.status})`);
      }

      onClose();
    } catch (fetchError) {
      setSubmitError((fetchError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              백준/프로그래머스 링크만 입력하면 주요 정보가 자동으로 채워집니다.
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
              사이트 자동 인식
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "BAEKJOON", label: "백준" },
                { key: "PROGRAMMERS", label: "프로그래머스" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  disabled
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    detectedSite === item.key
                      ? "bg-zinc-900 text-white"
                      : "border border-dashed border-zinc-300 bg-white text-zinc-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              문제 링크를 입력하면 지원 사이트(백준/프로그래머스)를 자동으로 감지합니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="사이트 문제 ID">
              <input
                type="text"
                value={detectedProblemId}
                placeholder="문제 링크를 입력하면 자동으로 채워집니다."
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-300 disabled:bg-zinc-50"
                disabled
              />
            </Field>
            <Field label="문제명">
              <input
                type="text"
                value={previewTitle}
                placeholder="문제 정보를 불러오면 제목이 표시됩니다."
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-300 disabled:bg-zinc-50"
                disabled
              />
            </Field>
          </div>

          <Field label="문제 링크">
            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://www.acmicpc.net/problem/1237"
                value={problemLink}
                onChange={(event) => setProblemLink(event.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-sm text-zinc-700 outline-none ${
                  linkError
                    ? "border-rose-300 focus:border-rose-400"
                    : "border-zinc-200 focus:border-zinc-300"
                }`}
              />
              {linkError ? (
                <p className="text-xs text-rose-500">{linkError}</p>
              ) : (
                <p className="text-xs text-zinc-500">
                  백준/프로그래머스 문제 주소를 붙여넣으면 정보가 자동으로 채워집니다.
                </p>
              )}
            </div>
          </Field>

          <Field label="난이도">{renderDifficultyContent()}</Field>

          <div className="space-y-4">
            <Field label="알고리즘 태그 선택">
              <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 focus-within:border-zinc-300 focus-within:bg-white focus-within:text-zinc-700">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="태그 이름 또는 슬러그로 검색하세요"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full border-none bg-transparent text-sm text-zinc-700 outline-none"
                  />
                </label>

                <div className="min-h-[100px] max-h-[100px] overflow-y-auto rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
                  {isLoadingTerms ? (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      태그 목록을 불러오는 중입니다...
                    </div>
                  ) : termsError ? (
                    <p className="text-center text-sm text-rose-500">{termsError}</p>
                  ) : terms.length === 0 ? (
                    <p className="text-center text-sm text-zinc-500">
                      조건에 맞는 태그가 없습니다.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {terms.map((term) => (
                        <button
                          key={term.slug}
                          type="button"
                          onClick={() => toggleTerm(term.slug)}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                            selectedTerms.includes(term.slug)
                              ? "border-zinc-900 bg-zinc-900 text-white"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
                          }`}
                        >
                          {term.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Field>

            {selectedTerms.length > 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  선택한 태그
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTerms.map((slug) => {
                    const term = terms.find((item) => item.slug === slug);
                    return (
                      <span
                        key={slug}
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {term?.name ?? slug}
                        <button
                          type="button"
                          onClick={() => toggleTerm(slug)}
                          aria-label={`${term?.name ?? slug} 태그 제거`}
                          className="text-white/70 transition hover:text-white"
                        >
                          <X className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-5">
          {submitError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
              <p className="font-medium">{submitError}</p>
            </div>
          ) : null}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !detectedSite || !detectedProblemId || !problemLink.trim()}
              className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  등록 중...
                </>
              ) : (
                "문제 추가 완료"
              )}
            </button>
          </div>
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

