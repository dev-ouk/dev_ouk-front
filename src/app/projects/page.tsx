"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  Github,
  Loader2,
  Plus,
  Calendar,
  Code,
  CheckCircle2,
  Clock,
  Pause,
} from "lucide-react";

type ProjectStatus = "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  updatedAt?: string | null;
};

type ProjectsResponse = {
  items?: Project[];
  size?: number;
  hasNext?: boolean;
  nextCursor?: string | null;
};

function getStatusDisplay(status: ProjectStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return {
        label: "진행중",
        icon: Clock,
        className: "text-blue-500",
        bgClassName: "bg-blue-50 border-blue-200",
      };
    case "COMPLETED":
      return {
        label: "완료",
        icon: CheckCircle2,
        className: "text-emerald-500",
        bgClassName: "bg-emerald-50 border-emerald-200",
      };
    case "ON_HOLD":
      return {
        label: "보류",
        icon: Pause,
        className: "text-amber-500",
        bgClassName: "bg-amber-50 border-amber-200",
      };
  }
}

function formatDate(dateString?: string | null) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// 가상 데이터
const mockProjects: Project[] = [
  {
    id: "1",
    name: "개인 포트폴리오 웹사이트",
    description:
      "Next.js와 TypeScript를 활용한 개인 포트폴리오 웹사이트입니다. 프로젝트 소개, 기술 스택, 연락처 정보를 포함하고 있습니다.",
    status: "COMPLETED",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    githubUrl: "https://github.com/example/portfolio",
    demoUrl: "https://portfolio.example.com",
    startedAt: "2024-01-15T00:00:00Z",
    completedAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "2",
    name: "실시간 채팅 애플리케이션",
    description:
      "WebSocket을 활용한 실시간 채팅 애플리케이션입니다. 사용자 인증, 메시지 전송, 파일 공유 기능을 제공합니다.",
    status: "IN_PROGRESS",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
    githubUrl: "https://github.com/example/chat-app",
    demoUrl: null,
    startedAt: "2024-03-01T00:00:00Z",
    completedAt: null,
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "3",
    name: "E-commerce 플랫폼",
    description:
      "전자상거래 플랫폼으로 상품 관리, 장바구니, 결제 시스템을 포함합니다. 관리자 대시보드와 사용자 인터페이스를 모두 제공합니다.",
    status: "IN_PROGRESS",
    techStack: ["Vue.js", "Django", "PostgreSQL", "Redis", "Stripe"],
    githubUrl: "https://github.com/example/ecommerce",
    demoUrl: "https://demo.ecommerce.example.com",
    startedAt: "2024-04-10T00:00:00Z",
    completedAt: null,
    updatedAt: "2024-12-10T00:00:00Z",
  },
  {
    id: "4",
    name: "날씨 정보 대시보드",
    description:
      "다양한 지역의 날씨 정보를 한눈에 볼 수 있는 대시보드입니다. 실시간 날씨 데이터와 7일 예보를 제공합니다.",
    status: "COMPLETED",
    techStack: ["React", "OpenWeatherMap API", "Chart.js", "CSS Modules"],
    githubUrl: "https://github.com/example/weather-dashboard",
    demoUrl: "https://weather.example.com",
    startedAt: "2024-02-01T00:00:00Z",
    completedAt: "2024-02-28T00:00:00Z",
    updatedAt: "2024-02-28T00:00:00Z",
  },
  {
    id: "5",
    name: "할일 관리 앱",
    description:
      "드래그 앤 드롭 기능을 지원하는 할일 관리 애플리케이션입니다. 카테고리별 분류, 우선순위 설정, 알림 기능을 포함합니다.",
    status: "ON_HOLD",
    techStack: ["React", "TypeScript", "Zustand", "LocalStorage"],
    githubUrl: "https://github.com/example/todo-app",
    demoUrl: null,
    startedAt: "2024-05-15T00:00:00Z",
    completedAt: null,
    updatedAt: "2024-08-20T00:00:00Z",
  },
  {
    id: "6",
    name: "블로그 CMS 시스템",
    description:
      "마크다운 에디터를 포함한 블로그 CMS 시스템입니다. 카테고리 관리, 태그 시스템, 댓글 기능을 제공합니다.",
    status: "IN_PROGRESS",
    techStack: ["Next.js", "Prisma", "PostgreSQL", "Markdown", "Tailwind CSS"],
    githubUrl: "https://github.com/example/blog-cms",
    demoUrl: null,
    startedAt: "2024-06-01T00:00:00Z",
    completedAt: null,
    updatedAt: "2024-12-12T00:00:00Z",
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 가상 데이터 사용
    // TODO: 나중에 실제 API로 교체
    const loadMockData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setProjects(mockProjects);
        setIsLoading(false);
      }, 500); // 로딩 효과를 위한 짧은 딜레이
    };

    loadMockData();

    // 실제 API 연동 코드 (주석 처리)
    /*
    const controller = new AbortController();

    const fetchProjects = async () => {
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
        const response = await fetch(`${normalizedBaseUrl}/api/v1/projects`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`프로젝트 목록을 불러올 수 없습니다. (status: ${response.status})`);
        }

        const payload = (await response.json()) as ProjectsResponse | Project[];
        if (Array.isArray(payload)) {
          setProjects(payload);
        } else {
          setProjects(payload.items ?? []);
        }
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        setError((fetchError as Error).message);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

    return () => {
      controller.abort();
    };
    */
  }, []);

  const content = () => {
    if (isLoading) {
      return (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span className="text-sm font-medium">프로젝트 목록을 불러오는 중입니다...</span>
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

    if (!projects.length) {
      return (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white text-center text-zinc-500">
          <p className="text-sm font-medium">아직 등록된 프로젝트가 없습니다.</p>
          <p className="mt-1 text-xs">
            첫 번째 프로젝트를 추가하면 이곳에 표시됩니다.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Projects
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900">프로젝트</h1>
          <p className="mt-2 text-sm text-zinc-600">
            현재는 가상 데이터로 표시되고 있으며, 추후{" "}
            <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700">
              GET /api/v1/projects
            </code>{" "}
            API와 연동할 예정입니다.
          </p>
        </header>

        <section className="mt-10">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                // TODO: 프로젝트 추가 모달 또는 페이지로 이동
                alert("프로젝트 추가 기능은 준비 중입니다.");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              프로젝트 추가하기
            </button>
          </div>
          {content()}
        </section>
      </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const statusDisplay = getStatusDisplay(project.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-zinc-900">{project.name}</h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusDisplay.bgClassName} ${statusDisplay.className}`}
            >
              <StatusIcon className="h-3 w-3" aria-hidden="true" />
              {statusDisplay.label}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-zinc-600">{project.description}</p>

          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            {project.startedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <span>시작: {formatDate(project.startedAt)}</span>
              </div>
            )}
            {project.updatedAt && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>수정: {formatDate(project.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {(project.githubUrl || project.demoUrl) && (
        <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Code className="h-3.5 w-3.5" aria-hidden="true" />
              데모
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

