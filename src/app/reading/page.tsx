"use client";

import Image from "next/image";

type Book = {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  progress: number;
  summary: string;
  tags: string[];
  rating: number;
  startedAt?: string;
  finishedAt?: string;
};

const BOOKS: Book[] = [
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    coverImage: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg",
    progress: 58,
    summary: "코드를 읽기 좋게 만드는 규칙과 사고방식.",
    tags: ["code", "practice"],
    rating: 4.5,
    startedAt: "2026-01-05",
    finishedAt: "2026-01-17",
  },
  {
    id: "ddia",
    title: "데이터 중심 애플리케이션 설계",
    author: "Martin Kleppmann",
    coverImage: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg",
    progress: 34,
    summary: "신뢰성과 확장성을 위한 시스템 설계 원리.",
    tags: ["system", "db"],
    rating: 4.8,
    startedAt: "2025-12-12",
    finishedAt: "2026-01-03",
  },
  {
    id: "designing-data-intensive-applications",
    title: "Effective TypeScript",
    author: "Dan Vanderkam",
    coverImage: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg",
    progress: 0,
    summary: "타입스크립트 실전 패턴과 실수 방지 전략.",
    tags: ["typescript", "frontend"],
    rating: 4.1,
    startedAt: "2025-11-11",
    finishedAt: "2025-12-01",
  },
  {
    id: "thinking-fast",
    title: "생각에 관한 생각",
    author: "Daniel Kahneman",
    coverImage: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg",
    progress: 100,
    summary: "의사결정과 사고방식을 좌우하는 두 시스템.",
    tags: ["mindset", "psychology"],
    rating: 4.2,
    startedAt: "2025-10-02",
    finishedAt: "2025-10-28",
  },
  {
    id: "refactoring",
    title: "Refactoring",
    author: "Martin Fowler",
    coverImage: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg",
    progress: 100,
    summary: "리팩터링의 단계별 접근과 예시.",
    tags: ["refactor", "practice"],
    rating: 4.7,
    startedAt: "2025-08-15",
    finishedAt: "2025-09-20",
  },
  {
    id: "deep-work",
    title: "딥 워크",
    author: "Cal Newport",
    coverImage: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg",
    progress: 0,
    summary: "깊은 몰입을 만드는 업무 방식.",
    tags: ["habits", "productivity"],
    rating: 4.0,
    startedAt: "2025-07-02",
    finishedAt: "2025-07-26",
  },
];

function BookCard({ book }: { book: Book }) {
  const fullStars = Math.floor(book.rating);
  const hasHalf = book.rating - fullStars >= 0.5;
  const stars = Array.from({ length: 5 }, (_, idx) => {
    if (idx < fullStars) return "★";
    if (idx === fullStars && hasHalf) return "☆";
    return "☆";
  });

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-32 items-end overflow-hidden rounded-xl bg-zinc-100 p-3">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={`${book.title} 표지`}
            fill
            className="object-contain bg-white/70"
            sizes="(min-width: 1024px) 240px, (min-width: 768px) 45vw, 90vw"
          />
        ) : null}
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{book.title}</p>
          <p className="text-xs text-zinc-500">{book.author}</p>
        </div>
        {(book.startedAt || book.finishedAt) ? (
          <p className="text-[11px] text-zinc-500">
            {book.startedAt ? book.startedAt : "—"} ~ {book.finishedAt ? book.finishedAt : "—"}
          </p>
        ) : null}
        <div className="flex items-center gap-2 text-xs text-amber-500">
          <span className="font-semibold">
            {stars.join("")}
          </span>
          <span className="text-zinc-400">{book.rating.toFixed(1)}</span>
        </div>
        <p className="text-xs text-zinc-600">{book.summary}</p>
        <div className="flex flex-wrap gap-1">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div />
      </div>
    </div>
  );
}

export default function ReadingPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Reading</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">나의 책장</h1>
        <p className="mt-2 text-sm text-zinc-600">
          지금 읽고 있는 책과 완독한 책을 책장처럼 정리해보세요.
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">현재 책장</p>
            <p className="text-xs text-zinc-500">완독한 책만 모아둔 책장 · 별점은 내 기준</p>
          </div>
          <div className="text-xs text-zinc-500">완독: {BOOKS.length}권</div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {BOOKS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
