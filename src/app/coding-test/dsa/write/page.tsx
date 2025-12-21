"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Search, X, Loader2 } from "lucide-react";
import { SidebarLayout } from "../../../_components/sidebar-layout";
import { DsnaEditor } from "../_components/dsna-editor";

type TaxonomyTerm = {
  slug: string;
  name: string;
};

export default function DSAWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState<{
    json: any;
    html: string;
    text: string;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [terms, setTerms] = useState<TaxonomyTerm[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [isLoadingSlug, setIsLoadingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

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

  const handleCancel = () => {
    router.back();
  };

  const handlePreview = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setIsPreviewModalOpen(true);
    setIsLoadingSlug(true);
    setSlugError(null);
    setPreviewSlug(null);
    setIsSlugAvailable(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      setSlugError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
      setIsLoadingSlug(false);
      return;
    }

    try {
      const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
      const response = await fetch(`${normalizedBaseUrl}/api/v1/algo-notes/slug-preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Slug 미리보기를 불러올 수 없습니다. (status: ${response.status})`);
      }

      const payload = (await response.json()) as {
        slug: string;
        available: boolean;
      };

      setPreviewSlug(payload.slug);
      setIsSlugAvailable(payload.available);
    } catch (fetchError) {
      setSlugError((fetchError as Error).message);
    } finally {
      setIsLoadingSlug(false);
    }
  };

  const handlePreviewCancel = () => {
    setIsPreviewModalOpen(false);
    setPreviewSlug(null);
    setIsSlugAvailable(null);
    setSlugError(null);
  };

  const handlePreviewComplete = () => {
    // TODO: 실제 생성 API 연동
    console.log("작성 완료:", {
      title,
      slug: previewSlug,
      content: editorContent,
      tagSlugs: selectedTerms,
    });
    // 모달 닫기
    handlePreviewCancel();
  };

  return (
    <SidebarLayout>
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            뒤로가기
          </button>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            DS&A
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900">글쓰기</h1>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-xs font-semibold uppercase tracking-wide text-zinc-500"
            >
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="글 제목을 입력하세요"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-xs font-semibold uppercase tracking-wide text-zinc-500"
            >
              본문
            </label>
            <DsnaEditor
              onChange={(value) => {
                setEditorContent(value);
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                알고리즘 태그 선택
              </label>
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

                <div className="min-h-[100px] max-h-[200px] overflow-y-auto rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
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
            </div>

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

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-zinc-200 px-6 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
            >
              미리보기
            </button>
          </div>
        </div>
      </div>

      {/* 미리보기 모달 */}
      {isPreviewModalOpen && (
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
                <h2 className="mt-1 text-2xl font-semibold text-zinc-900">글 작성 미리보기</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  작성 내용을 확인하고 완료하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePreviewCancel}
                aria-label="모달 닫기"
                className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-5 px-6 py-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  제목
                </label>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900">
                  {title || "(제목 없음)"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Slug
                </label>
                {isLoadingSlug ? (
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Slug를 생성하는 중...
                  </div>
                ) : slugError ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {slugError}
                  </div>
                ) : previewSlug ? (
                  <div className="space-y-2">
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 font-mono">
                      {previewSlug}
                    </div>
                    {isSlugAvailable === false && (
                      <p className="text-xs text-rose-500">
                        ⚠️ 이 slug는 이미 사용 중입니다. 제목을 수정하면 다른 slug가 생성됩니다.
                      </p>
                    )}
                    {isSlugAvailable === true && (
                      <p className="text-xs text-emerald-600">
                        ✓ 사용 가능한 slug입니다.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  선택된 태그
                </label>
                {selectedTerms.length === 0 ? (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
                    선택된 태그가 없습니다.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    {selectedTerms.map((slug) => {
                      const term = terms.find((item) => item.slug === slug);
                      return (
                        <span
                          key={slug}
                          className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white"
                        >
                          {term?.name ?? slug}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <footer className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-5">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handlePreviewCancel}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handlePreviewComplete}
                  disabled={isLoadingSlug || !previewSlug}
                  className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  작성 완료
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

