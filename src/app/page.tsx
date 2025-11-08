"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Code2, Menu } from "lucide-react";

const navItems = [
  {
    id: "coding-test",
    label: "Coding Test",
    icon: Code2,
  },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <aside
        className={`relative flex flex-shrink-0 flex-col border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex h-20 items-center gap-3 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </div>
          <span
            className={`overflow-hidden text-lg font-semibold transition-[max-width,opacity] duration-200 ${
              isOpen
                ? "max-w-[140px] opacity-100"
                : "pointer-events-none max-w-0 opacity-0"
            }`}
          >
            메뉴
          </span>
        </div>

        <nav className="flex-1 px-2 py-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`group relative flex w-full items-center justify-center rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 ${
                    isOpen ? "justify-start gap-3" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-all group-hover:bg-zinc-200">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span
                    className={`overflow-hidden whitespace-nowrap text-sm transition-[margin,max-width,opacity] duration-200 ${
                      isOpen
                        ? "ml-2 max-w-[150px] opacity-100"
                        : "pointer-events-none ml-0 max-w-0 opacity-0"
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
          className="absolute -right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:bg-zinc-100"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
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
