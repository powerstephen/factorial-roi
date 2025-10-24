import dynamic from "next/dynamic";

// Recharts needs 'dynamic' when using Next's SSR by default.
const FactorialRoiCalculator = dynamic(
  () => import("../components/FactorialRoiCalculator"),
  { ssr: false }
);

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl p-6 md:p-10">
        {/* Header bar styled to Factorial */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Factorial ROI Calculator
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Plug in your assumptions to estimate payback, annual savings and ROI.
            </p>
          </div>
          <div className="flex items-center">
            <div className="rounded-full bg-[var(--brand-primary)] px-4 py-1 text-white text-sm">
              Built with Fira Sans
            </div>
          </div>
        </div>

        <FactorialRoiCalculator />
      </section>
      <footer className="py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ROI demo. Not affiliated with Factorial.
      </footer>
    </main>
  );
}
