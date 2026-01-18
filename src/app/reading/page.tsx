"use client";

export default function ReadingPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Reading</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">독서</h1>
        <p className="mt-2 text-sm text-zinc-600">
          독서 기록과 요약을 여기에 쌓아보세요.
        </p>
      </header>
      <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center text-zinc-500">
        <p className="text-sm font-medium">독서 기록 영역은 곧 연결됩니다.</p>
        <p className="text-xs">필요한 UI를 알려주시면 바로 맞춰드릴게요.</p>
      </section>
    </div>
  );
}
