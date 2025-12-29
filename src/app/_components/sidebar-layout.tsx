"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import {ChevronLeft, ChevronRight, Code2, Dumbbell, FolderKanban, Home, LucideIcon, Menu} from "lucide-react";

const STORAGE_KEY = "sidebar:isOpen";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
};

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    id: "coding-test",
    label: "Coding Test",
    icon: Code2,
    href: "/coding-test",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    id: "workout",
    label: "Workout",
    icon: Dumbbell,
    href: "/workout",
  },
];

export function SidebarLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? saved === "1" : true;
  });
  const pathname = usePathname();

  // localStorage에 상태 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, isOpen ? "1" : "0");
    }
  }, [isOpen]);

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
            className={`min-w-0 text-lg font-semibold transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            메뉴
          </span>
        </div>

        <nav className="flex-1 px-2 py-2">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`group relative flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-zinc-100 ${
                      isOpen ? "justify-start gap-3" : "justify-center"
                    } ${isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-700"}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-all group-hover:bg-zinc-200">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span
                      className={`overflow-hidden whitespace-nowrap text-sm transition-[max-width,opacity] duration-200 ${
                        isOpen
                          ? "max-w-[180px] opacity-100"
                          : "pointer-events-none max-w-0 opacity-0"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
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

      <main className="flex flex-1 flex-col px-10 py-12">{children}</main>
    </div>
  );
}

