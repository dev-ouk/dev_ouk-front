"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { SidebarLayout } from "../../_components/sidebar-layout";

type SearchParams = {
  site?: string;
  siteProblemId?: string;
  title?: string;
  difficulty?: string;
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

export default function SolvePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
    };
  }, [searchParams]);

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

