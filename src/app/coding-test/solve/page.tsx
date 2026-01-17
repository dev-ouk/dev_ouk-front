"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Timer, Code2, Loader2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useSearchParams } from "next/navigation";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-kotlin";

type SearchParams = {
  site?: string;
  siteProblemId?: string;
  title?: string;
  difficulty?: string;
  verdict?: string;
  attemptedAt?: string;
};

type TaxonomyTerm = {
  slug: string;
  name: string;
};

type ProblemDetailResponse = {
  site: string;
  siteProblemId: string;
  title: string;
  difficulty: number | null;
  url: string;
  lastAttempt: {
    verdict: string;
    attemptedAt: string;
  } | null;
  taxonomies: {
    algo?: TaxonomyTerm[];
  };
};

// API 응답 타입 (시도 목록)
type AttemptItemResponse = {
  attemptUuid: string;
  timeSpent: number | null;
  language: string | null;
  notes: string | null;
  verdict: string | null;
  code: string | null;
  attemptedAt: string;
  failType: string | null;
  failDetail: string | null;
  solution: string | null;
  nextReviewAt: string | null;
  algoNotes?: Array<{
    slug: string;
    title?: string | null;
  }>;
};

type AttemptsListResponse = {
  total: number;
  items: AttemptItemResponse[];
};

type AlgoNoteSummary = {
  slug: string;
  title: string;
  createdAt: string;
  taxonomies?: {
    algo?: {
      terms?: Array<{
        slug: string;
        name: string;
      }>;
    };
  } | null;
};

type AlgoNotesResponse = {
  items: AlgoNoteSummary[];
  size?: number;
  hasNext?: boolean;
  nextCursor?: string | null;
  sort?: string | null;
};

// 프론트엔드에서 사용하는 Attempt 타입
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
  linkedNotes?: Array<{
    slug: string;
    title?: string | null;
  }>;
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

const LANGUAGE_MAP: Record<string, string> = {
  java: "java",
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  "c++": "cpp",
  c: "c",
  cpp: "cpp",
  "c#": "csharp",
  csharp: "csharp",
  go: "go",
  golang: "go",
  kotlin: "kotlin",
};

function getPrismLanguage(lang?: string) {
  if (!lang) return "text";
  const key = lang.toLowerCase();
  return LANGUAGE_MAP[key] ?? "text";
}

// 언어명 매핑: 프론트엔드 -> API
function mapLanguageToApi(language: string): string {
  const mapping: Record<string, string> = {
    Java: "JAVA",
    JavaScript: "JS",
    TypeScript: "TS",
    Python: "PYTHON",
    "C++": "CPP",
    C: "C",
    CPP: "CPP",
    "C#": "C#",
    Csharp: "C#",
    Go: "GO",
    Golang: "GO",
    Kotlin: "KOTLIN",
  };
  return mapping[language] ?? language.toUpperCase();
}

// verdict 매핑: 프론트엔드 RE -> API RTE
function mapVerdictToApi(verdict: string): string {
  return verdict === "RE" ? "RTE" : verdict;
}

// duration 문자열에서 숫자 추출 (예: "18분" -> 18, "10" -> 10)
function parseDurationToMinutes(duration: string): number {
  const numericMatch = duration.match(/\d+/);
  return numericMatch ? parseInt(numericMatch[0], 10) : 0;
}

// YYYY-MM-DD 형식을 ISO_OFFSET_DATE_TIME으로 변환
function convertDateToIsoOffsetDateTime(dateString: string): string {
  if (!dateString) return "";
  // 이미 ISO 형식이면 그대로 반환
  if (dateString.includes("T")) return dateString;
  // YYYY-MM-DD 형식이면 시간 추가
  const date = new Date(dateString + "T00:00:00");
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
  return `${date.toISOString().slice(0, 19)}${sign}${hours}:${minutes}`;
}

// ISO_OFFSET_DATE_TIME을 YYYY-MM-DD로 변환
function convertIsoOffsetDateTimeToDate(isoString: string | null): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

// API 응답을 프론트엔드 Attempt 타입으로 변환
function mapAttemptItemToAttempt(item: AttemptItemResponse): Attempt {
  return {
    verdict: item.verdict ?? "AC",
    attemptedAt: item.attemptedAt,
    duration: item.timeSpent != null ? `${item.timeSpent}` : "0",
    language: item.language ?? "Java",
    summary: item.notes ?? "",
    code: item.code ?? undefined,
    failureCategory: item.failType ?? undefined,
    failureReason: item.failDetail ?? undefined,
    learnings: item.solution ?? undefined,
    nextReview: convertIsoOffsetDateTimeToDate(item.nextReviewAt),
    linkedNotes: item.algoNotes?.map((note) => ({
      slug: note.slug,
      title: note.title ?? null,
    })),
  };
}

export default function SolvePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [draft, setDraft] = useState<Attempt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [problemDetail, setProblemDetail] = useState<ProblemDetailResponse | null>(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [problemError, setProblemError] = useState<string | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteSearch, setNoteSearch] = useState("");
  const [algoNotes, setAlgoNotes] = useState<AlgoNoteSummary[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [selectedNoteSlugs, setSelectedNoteSlugs] = useState<string[]>([]);
  const [notesHasNext, setNotesHasNext] = useState(false);
  const [notesNextCursor, setNotesNextCursor] = useState<string | null>(null);
  const notesObserverTarget = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  // URL 쿼리에서 문제 식별 정보만 가져오기
  const problemKey = useMemo(() => {
    const site = searchParams?.get("site") ?? "BAEKJOON";
    const siteProblemId = searchParams?.get("siteProblemId") ?? "";
    return { site, siteProblemId };
  }, [searchParams]);

  const [attempts, setAttempts] = useState<Attempt[]>([]);

  // 문제 정보 조회
  useEffect(() => {
    if (!problemKey.site || !problemKey.siteProblemId) {
      return;
    }

    const controller = new AbortController();

    const fetchProblemDetail = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        setProblemError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
        setIsLoadingProblem(false);
        return;
      }

      try {
        setIsLoadingProblem(true);
        setProblemError(null);

        const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
        const response = await fetch(
          `${normalizedBaseUrl}/api/v1/problems/${encodeURIComponent(problemKey.site)}/${encodeURIComponent(problemKey.siteProblemId)}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          if (response.status === 404) {
            const errorData = (await response.json()) as {
              code?: string;
              message?: string;
            };
            throw new Error(errorData.message || "해당 문제를 찾을 수 없습니다.");
          } else if (response.status === 400) {
            const errorData = (await response.json()) as {
              code?: string;
              message?: string;
            };
            throw new Error(errorData.message || "잘못된 요청입니다.");
          }
          throw new Error(`문제 정보를 불러올 수 없습니다. (status: ${response.status})`);
        }

        const payload = (await response.json()) as ProblemDetailResponse;
        setProblemDetail(payload);
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        setProblemError((fetchError as Error).message);
        setProblemDetail(null);
      } finally {
        setIsLoadingProblem(false);
      }
    };

    fetchProblemDetail();

    return () => {
      controller.abort();
    };
  }, [problemKey.site, problemKey.siteProblemId]);

  const fetchNotes = useCallback(
    async (cursor?: string | null, append = false) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        setNotesError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
        setIsLoadingNotes(false);
        return;
      }

      try {
        setIsLoadingNotes(true);
        setNotesError(null);

        const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
        const params = new URLSearchParams();
        params.append("size", "10");
        params.append("sort", "created_at_desc");

        if (noteSearch.trim()) {
          params.append("q", noteSearch.trim());
        }

        if (cursor) {
          params.append("cursor", cursor);
        }

        const response = await fetch(
          `${normalizedBaseUrl}/api/v1/algo-notes?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error(`노트 목록을 불러올 수 없습니다. (status: ${response.status})`);
        }

        const payload = (await response.json()) as AlgoNotesResponse;
        if (append) {
          setAlgoNotes((prev) => [...prev, ...(payload.items ?? [])]);
        } else {
          setAlgoNotes(payload.items ?? []);
        }
        setNotesHasNext(Boolean(payload.hasNext));
        setNotesNextCursor(payload.nextCursor ?? null);
      } catch (fetchError) {
        setNotesError((fetchError as Error).message);
        if (!append) {
          setAlgoNotes([]);
          setNotesHasNext(false);
          setNotesNextCursor(null);
        }
      } finally {
        setIsLoadingNotes(false);
      }
    },
    [noteSearch],
  );

  useEffect(() => {
    if (!isNoteModalOpen) {
      return;
    }

    setNotesHasNext(false);
    setNotesNextCursor(null);
    setAlgoNotes([]);

    fetchNotes(null, false);
  }, [isNoteModalOpen, noteSearch, fetchNotes]);

  useEffect(() => {
    if (!isNoteModalOpen) {
      return;
    }

    const target = notesObserverTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && notesHasNext && !isLoadingNotes) {
          fetchNotes(notesNextCursor, true);
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isNoteModalOpen, notesHasNext, notesNextCursor, isLoadingNotes, fetchNotes]);

  // 시도 목록 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchAttempts = async () => {
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
        const params = new URLSearchParams({
          site: problemKey.site,
          siteProblemId: problemKey.siteProblemId,
        });
        const response = await fetch(
          `${normalizedBaseUrl}/api/v1/attempts?${params.toString()}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          if (response.status === 400) {
            const errorData = (await response.json()) as {
              code?: string;
              message?: string;
            };
            throw new Error(errorData.message || "잘못된 요청입니다.");
          } else if (response.status === 404) {
            const errorData = (await response.json()) as {
              code?: string;
              message?: string;
            };
            throw new Error(errorData.message || "해당 문제를 찾을 수 없습니다.");
          }
          throw new Error(`시도 목록을 불러올 수 없습니다. (status: ${response.status})`);
        }

        const payload = (await response.json()) as AttemptsListResponse;
        // API 응답을 프론트엔드 타입으로 변환
        const mappedAttempts = payload.items.map(mapAttemptItemToAttempt);
        setAttempts(mappedAttempts);
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        setError((fetchError as Error).message);
        setAttempts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (problemKey.site && problemKey.siteProblemId) {
      fetchAttempts();
    }

    return () => {
      controller.abort();
    };
  }, [problemKey.site, problemKey.siteProblemId]);

  const openNoteModal = () => {
    setSelectedNoteSlugs([]);
    setNoteSearch("");
    setSubmitError(null);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setNotesError(null);
  };

  const toggleNoteSlug = (slug: string) => {
    setSelectedNoteSlugs((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug],
    );
  };

  const handleSaveWithNotes = async () => {
    const isSuccess = await handleSaveDraft(selectedNoteSlugs);
    if (isSuccess) {
      setIsNoteModalOpen(false);
    }
  };

  const handleSaveWithoutNotes = async () => {
    const isSuccess = await handleSaveDraft([]);
    if (isSuccess) {
      setIsNoteModalOpen(false);
    }
  };

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

    // draft와 isEditing을 먼저 설정하고, 그 다음 activeTab 설정
    setDraft(newDraft);
    setIsEditing(true);
    // activeTab을 draft 탭 인덱스(attempts.length)로 설정
    const newActiveTab = attempts.length;
    setActiveTab(newActiveTab);
  };

  const handleDraftChange = <K extends keyof Attempt>(key: K, value: Attempt[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSaveDraft = async (noteSlugs?: string[]) => {
    if (!draft) return false;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      setSubmitError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
      return;
    }

    let isSuccess = false;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // 필수 필드 검증
      if (!draft.verdict || !draft.attemptedAt || !draft.language) {
        setSubmitError("필수 정보가 누락되었습니다.");
        return;
      }

      // duration 문자열에서 숫자 추출
      const timeSpent = parseDurationToMinutes(draft.duration);
      if (timeSpent < 0) {
        setSubmitError("풀이 시간은 0 이상이어야 합니다.");
        return;
      }

      // 날짜 형식 변환
      const attemptedAt = convertDateToIsoOffsetDateTime(draft.attemptedAt);
      const nextReviewAt = draft.nextReview
        ? convertDateToIsoOffsetDateTime(draft.nextReview)
        : undefined;

      // API 요청 Body 준비 (프론트엔드 필드 -> API 필드 매핑)
      const requestBody = {
        site: problemKey.site,
        siteProblemId: problemKey.siteProblemId,
        timeSpent,
        language: mapLanguageToApi(draft.language),
        notes: draft.summary || undefined,
        verdict: mapVerdictToApi(draft.verdict),
        code: draft.code || undefined,
        attemptedAt,
        failType:
          draft.verdict !== "AC" && draft.failureCategory
            ? draft.failureCategory
            : undefined,
        failDetail:
          draft.verdict !== "AC" && draft.failureReason
            ? draft.failureReason
            : undefined,
        solution:
          draft.verdict !== "AC" && draft.learnings ? draft.learnings : undefined,
        nextReviewAt,
        noteSlugs: noteSlugs && noteSlugs.length > 0 ? noteSlugs : undefined,
      };

      const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
      const response = await fetch(`${normalizedBaseUrl}/api/v1/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as {
          message?: string;
          correlationId?: string;
          errors?: Array<{
            field?: string;
            code?: string;
            errorMessage?: string;
          }>;
        };

        let errorMessage = errorData.message || "시도 추가에 실패했습니다.";

        // 상태 코드별 에러 메시지 처리
        if (response.status === 400) {
          const validationErrors = errorData.errors
            ?.map((err) => err.errorMessage || `${err.field}: ${err.code}`)
            .join(", ");
          errorMessage = `입력 정보가 올바르지 않습니다. ${validationErrors || errorMessage}`;
        } else if (response.status === 404) {
          errorMessage = `해당 문제를 찾을 수 없습니다. ${errorMessage}`;
        } else if (response.status >= 500) {
          errorMessage = `서버 오류가 발생했습니다. ${errorMessage}`;
        }

        if (errorData.correlationId) {
          errorMessage += ` (ID: ${errorData.correlationId})`;
        }

        throw new Error(errorMessage);
      }

      const result = (await response.json()) as {
        attemptUuid: string;
        site: string;
        siteProblemId: string;
      };

      if (noteSlugs && noteSlugs.length > 0) {
        const linkResponse = await fetch(
          `${normalizedBaseUrl}/api/v1/attempts/${encodeURIComponent(result.attemptUuid)}/algo-notes`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ algoNoteSlugs: noteSlugs }),
          },
        );

        if (!linkResponse.ok) {
          let linkErrorMessage = "알고리즘 노트 연결에 실패했습니다.";
          if (linkResponse.status === 400 || linkResponse.status === 404) {
            const linkErrorData = (await linkResponse.json()) as {
              errorCode?: string;
              message?: string;
              details?: Record<string, unknown>;
            };
            linkErrorMessage = linkErrorData.message || linkErrorMessage;
          } else if (linkResponse.status >= 500) {
            linkErrorMessage = `서버 오류가 발생했습니다. ${linkErrorMessage}`;
          }

          throw new Error(linkErrorMessage);
        }
      }

      // 성공 시 draft 초기화하고 시도 목록 다시 불러오기
      setDraft(null);
      setIsEditing(false);

      // 시도 목록을 다시 불러와서 최신 데이터로 갱신
      const fetchAttempts = async () => {
        const params = new URLSearchParams({
          site: problemKey.site,
          siteProblemId: problemKey.siteProblemId,
        });
        const listResponse = await fetch(
          `${normalizedBaseUrl}/api/v1/attempts?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (listResponse.ok) {
          const listPayload = (await listResponse.json()) as AttemptsListResponse;
          // API 응답을 프론트엔드 타입으로 변환
          const updatedAttempts = listPayload.items.map(mapAttemptItemToAttempt);
          setAttempts(updatedAttempts);
          // 새로 추가된 시도 탭으로 이동
          setActiveTab(updatedAttempts.length - 1);
        }
      };

      await fetchAttempts();
      isSuccess = true;
    } catch (fetchError) {
      setSubmitError((fetchError as Error).message);
    } finally {
      setIsSubmitting(false);
    }

    return isSuccess;
  };

  const handleCancelDraft = () => {
    setDraft(null);
    setIsEditing(false);
    setActiveTab((prev) => (prev >= attempts.length ? Math.max(0, attempts.length - 1) : prev));
  };

  // activeTab이 유효한 범위를 벗어나지 않도록 보정
  useEffect(() => {
    const displayLength = isEditing && draft ? attempts.length + 1 : attempts.length;
    if (displayLength > 0 && activeTab >= displayLength) {
      setActiveTab(Math.max(0, displayLength - 1));
    }
    // 편집 모드이고 draft가 있을 때 activeTab이 draft 탭을 가리키도록 보정
    if (isEditing && draft !== null && activeTab !== attempts.length) {
      setActiveTab(attempts.length);
    }
  }, [activeTab, attempts.length, draft, isEditing]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAttemptTitle = (attempt: Attempt) => {
    const label = formatAttemptedAt(attempt.attemptedAt);
    return `${label} 시도`;
  };

  // 문제 정보 (API 응답 또는 URL 쿼리 fallback)
  const problemData = problemDetail ?? {
    site: problemKey.site,
    siteProblemId: problemKey.siteProblemId,
    title: searchParams?.get("title") ?? "문제 제목",
    difficulty: searchParams?.get("difficulty") ? Number(searchParams.get("difficulty")) : null,
    url: "",
    lastAttempt: searchParams?.get("verdict") && searchParams?.get("attemptedAt")
      ? {
          verdict: searchParams.get("verdict")!,
          attemptedAt: searchParams.get("attemptedAt")!,
        }
      : null,
    taxonomies: {},
  };

  const meta = getMeta(problemData.site);
  const displayAttempts = isEditing && draft ? [...attempts, draft] : attempts;
  const selectedAttempt = displayAttempts[activeTab];
  const isDraftSelected = isEditing && draft && activeTab === attempts.length;

  return (
    <>
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

        {problemError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
            <p className="font-medium">{problemError}</p>
          </div>
        ) : (
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
                {problemData.site?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}

            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="font-mono text-xs">{problemData.siteProblemId}</span>
                <span className="text-xs text-zinc-400">·</span>
                <span>{meta.name}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {isLoadingProblem ? (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    <span className="text-lg">로딩 중...</span>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-semibold text-zinc-900 leading-tight">{problemData.title}</h1>
                    {problemData.difficulty != null && (
                      <>
                        {problemData.site?.toUpperCase() === "BAEKJOON" ? (
                          <Image
                            src={`https://static.solved.ac/tier_small/${problemData.difficulty}.svg`}
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
                              color: PROGRAMMERS_LEVEL_COLORS[problemData.difficulty] ?? "#1bbaff",
                            }}
                          >
                            Lv. {problemData.difficulty}
                          </span>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
              {problemData.lastAttempt && (() => {
                const verdictDisplay = getVerdictDisplay(problemData.lastAttempt.verdict);
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
                      최근 시도: {formatAttemptedAt(problemData.lastAttempt.attemptedAt)}
                    </span>
                  </div>
                );
              })()}
              {problemData.taxonomies?.algo && problemData.taxonomies.algo.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {problemData.taxonomies.algo.map((term: TaxonomyTerm) => (
                    <span
                      key={term.slug}
                      className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700"
                    >
                      {term.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
              disabled={isLoading}
              className="rounded-full border border-dashed border-zinc-300 px-3 py-1 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + 시도 추가
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {isLoading && !isEditing ? (
              <div className="flex items-center justify-center py-8 text-sm text-zinc-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                시도 목록을 불러오는 중입니다...
              </div>
            ) : isEditing && draft ? (
              // 편집 중이고 draft가 있으면 무조건 draft 폼 표시 (최우선)
              (() => {
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
                            disabled={isSubmitting}
                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                          onClick={openNoteModal}
                            disabled={isSubmitting}
                            className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                저장 중...
                              </>
                            ) : (
                              "저장"
                            )}
                          </button>
                        </div>
                      </div>
                      {submitError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
                          <p className="font-medium">{submitError}</p>
                        </div>
                      )}

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
                <div className="overflow-hidden rounded-lg border border-zinc-700 bg-[#282c34]">
                  <Editor
                    value={draft.code ?? ""}
                    onValueChange={(code) => handleDraftChange("code", code)}
                    highlight={(code) =>
                      Prism.highlight(
                        code,
                        Prism.languages[getPrismLanguage(draft.language)] ?? Prism.languages.text,
                        getPrismLanguage(draft.language),
                      )
                    }
                    padding={12}
                    textareaClassName="font-mono text-sm leading-6 text-white outline-none"
                    className="min-h-[180px] bg-[#282c34] font-mono text-sm text-white"
                  />
                </div>
              </div>

                      {draft.verdict !== "AC" ? (
                        <>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-zinc-600">실패 원인 분류</label>
                              <select
                                value={draft.failureCategory ?? ""}
                                onChange={(e) => handleDraftChange("failureCategory", e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                              >
                                <option value="">선택</option>
                                {["IMPLEMENTATION", "ALGORITHM", "EDGE_CASE", "PERFORMANCE", "CARELESS", "OTHER"].map(
                                  (item) => (
                                    <option key={item} value={item}>
                                      {item}
                                    </option>
                                  ),
                                )}
                              </select>
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

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600">다음 복습 예정일</label>
                            <input
                              type="date"
                              value={draft.nextReview ?? ""}
                              onChange={(e) => handleDraftChange("nextReview", e.target.value)}
                              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-300"
                            />
                          </div>
                        </>
                      ) : null}
                    </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelDraft}
                          disabled={isSubmitting}
                          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={openNoteModal}
                          disabled={isSubmitting}
                          className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                              저장 중...
                            </>
                          ) : (
                            "저장"
                          )}
                        </button>
                      </div>
                    </div>
                  );
              })()
            ) : error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                <p className="font-medium">{error}</p>
              </div>
            ) : attempts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
                <p className="text-sm font-medium">아직 기록된 시도가 없습니다.</p>
                <p className="mt-1 text-xs">+ 시도 추가 버튼을 눌러 첫 시도를 기록해보세요.</p>
              </div>
            ) : (
              (() => {
                const displayAttempts = attempts;
                const attempt = displayAttempts[activeTab];
                if (!attempt) {
                  return (
                    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
                      <p className="text-sm font-medium">시도를 선택해주세요.</p>
                    </div>
                  );
                }

                const verdictDisplay = getVerdictDisplay(attempt.verdict);
                const Icon = verdictDisplay.Icon;
                return (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Icon className={`h-4 w-4 ${verdictDisplay.className}`} aria-hidden="true" />
                      <span className="text-xs text-zinc-500">
                        시도 일시: {formatAttemptedAt(attempt.attemptedAt)}
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
                    <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-[#282c34]">
                      {mounted ? (
                        <SyntaxHighlighter
                          language={getPrismLanguage(attempt.language)}
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            fontSize: "12px",
                            lineHeight: "1.6",
                            background: "#282c34",
                          }}
                        >
{attempt.code}
                        </SyntaxHighlighter>
                      ) : (
                        <pre className="whitespace-pre bg-[#282c34] px-3 py-2 text-xs text-white">
{attempt.code}
                        </pre>
                      )}
                    </div>
                  </div>

                  {attempt.verdict !== "AC" &&
                    (attempt.failureCategory ||
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
            })()
            )}
          </div>
        </div>

        <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center text-zinc-500">
          <p className="text-sm font-medium">풀이 작성 영역은 곧 연결됩니다.</p>
          <p className="text-xs">현재는 예시 데이터로 표시 중입니다. 원하시는 UI를 알려주세요.</p>
        </section>

        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur">
            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            >
              <header className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    DS&A
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-zinc-900">
                    연결할 알고리즘 노트 선택
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    관련 노트를 선택해 시도 기록과 연결하세요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeNoteModal}
                  aria-label="모달 닫기"
                  className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                >
                  닫기
                </button>
              </header>

              <div className="space-y-4 px-6 py-6">
                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  노트 검색
                </label>
                <input
                  type="search"
                  placeholder="노트 제목으로 검색"
                  value={noteSearch}
                  onChange={(event) => setNoteSearch(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200"
                />

                <div className="min-h-[200px] max-h-[300px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  {isLoadingNotes ? (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      노트 목록을 불러오는 중입니다...
                    </div>
                  ) : notesError ? (
                    <p className="text-center text-sm text-rose-500">{notesError}</p>
                  ) : algoNotes.length === 0 ? (
                    <p className="text-center text-sm text-zinc-500">
                      검색 조건에 맞는 노트가 없습니다.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {algoNotes.map((note) => {
                        const isSelected = selectedNoteSlugs.includes(note.slug);
                        return (
                          <button
                            key={note.slug}
                            type="button"
                            onClick={() => toggleNoteSlug(note.slug)}
                            className={`flex w-full items-start justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                              isSelected
                                ? "border-zinc-900 bg-zinc-900 text-white"
                                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                            }`}
                          >
                            <div className="space-y-1">
                              <p className="font-semibold">{note.title}</p>
                              <p
                                className={`text-xs ${
                                  isSelected ? "text-white/70" : "text-zinc-400"
                                }`}
                              >
                                {note.slug}
                              </p>
                            </div>
                            <span className="text-xs font-semibold">
                              {isSelected ? "선택됨" : "선택"}
                            </span>
                          </button>
                        );
                      })}
                      <div ref={notesObserverTarget} />
                    </div>
                  )}
                </div>

                {selectedNoteSlugs.length > 0 && (
                  <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      선택한 노트
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedNoteSlugs.map((slug) => (
                        <span
                          key={slug}
                          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white"
                        >
                          {slug}
                          <button
                            type="button"
                            onClick={() => toggleNoteSlug(slug)}
                            aria-label={`${slug} 제거`}
                            className="text-white/70 transition hover:text-white"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                    onClick={closeNoteModal}
                    disabled={isSubmitting}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveWithoutNotes}
                    disabled={isSubmitting}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    선택 없이 저장
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveWithNotes}
                    disabled={isSubmitting || selectedNoteSlugs.length === 0}
                    className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        저장 중...
                      </>
                    ) : (
                      "연결하고 저장"
                    )}
                  </button>
                </div>
              </footer>
            </div>
          </div>
        )}
      </div>
      <aside className="hidden xl:block">
        <div className="fixed top-24 w-[240px] [left:calc(50%+448px+140px)]">
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-4 py-3">
              <p className="text-sm font-semibold text-zinc-800">연결된 알고리즘 노트</p>
              <p className="text-xs text-zinc-500">선택한 시도 기준</p>
            </div>
            <div className="space-y-3 px-4 py-4">
              {isDraftSelected ? (
                <p className="text-xs text-zinc-500">
                  작성 중인 시도입니다. 저장 후 연결된 노트를 확인할 수 있어요.
                </p>
              ) : !selectedAttempt ? (
                <p className="text-xs text-zinc-500">시도를 선택해주세요.</p>
              ) : selectedAttempt.linkedNotes && selectedAttempt.linkedNotes.length > 0 ? (
                selectedAttempt.linkedNotes.map((note) => (
                  <div
                    key={note.slug}
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-700"
                  >
                    <div className="font-semibold text-zinc-900">
                      {note.title || note.slug}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-400">{note.slug}</div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">연결된 노트가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

