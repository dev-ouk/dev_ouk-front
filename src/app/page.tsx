"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Dashboard
          </p>
          <h1 className="text-4xl font-bold text-zinc-900">
            개발 환경과 코딩 테스트 결과를 한 곳에서 관리하세요.
          </h1>
          <p className="text-base leading-relaxed text-zinc-600">
            이 메인 페이지에서는 진행 중인 프로젝트 현황이나 참고 링크 등을 배치할 수 있습니다.
            좌측 사이드바의 <span className="font-semibold text-zinc-900">Coding Test</span>{" "}
            메뉴로 이동하면 최근 문제 풀이 기록을 확인할 수 있습니다.
          </p>

          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8">
            <h2 className="text-lg font-semibold text-zinc-900">빠른 시작 가이드</h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li>
                1. `.env.local` 파일에{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700">
                  NEXT_PUBLIC_API_BASE_URL
                </code>{" "}
                값을 설정하세요.
              </li>
              <li>2. Spring Boot 서버를 실행해 `GET /api/v1/problems` API를 준비합니다.</li>
              <li>
                3. 사이드바의 <strong>Coding Test</strong> 메뉴에서 문제 풀이 기록 테이블을
                확인합니다.
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/coding-test"
              className="inline-flex items-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Coding Test 바로가기
            </Link>
            <a
              href="https://spring.io/projects/spring-boot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            >
              Spring Boot 문서 보기
            </a>
          </div>
        </div>
      </div>
  );
}
