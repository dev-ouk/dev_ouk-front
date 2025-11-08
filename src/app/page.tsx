"use client";

import { useState } from "react";

const navItems = [
  {
    id: "coding-test",
    label: "Coding Test",
    abbreviation: "CT",
  },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <aside
        className={`relative flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
            CT
          </div>
          <span
            className={`text-lg font-semibold transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            메뉴
          </span>
        </div>

        <nav className="flex-1 px-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                    {item.abbreviation}
                  </div>
                  <span
                    className={`transition-opacity duration-200 ${
                      isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          aria-label={isOpen ? "사이드 메뉴 닫기" : "사이드 메뉴 열기"}
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute -right-4 top-24 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:bg-zinc-100"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </button>
      </aside>

      <main className="flex flex-1 flex-col justify-center px-10">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl font-semibold text-zinc-900">
            사이드 메뉴 예제
          </h1>
          <p className="text-base leading-relaxed text-zinc-600">
            화면 왼쪽 상단의 버튼을 눌러 사이드 메뉴를 열고 닫을 수 있습니다.
            현재는 &quot;Coding Test&quot; 메뉴 하나만 준비되어 있으며, 페이지
            연결은 추후 구성하면 됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
