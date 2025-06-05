"use client";
import Header from "@/components/Header";
import ReportsTabs from "@/components/ReportsTabs";
import ProjectionsFilter from "@/components/ProjectionsFilter";
import ProjectedFinancialsCard from "@/components/ProjectedFinancialsCard";
import ProjectedBreakdownTable from "@/components/ProjectedBreakdownTable";
import { useTheme } from "@/components/ThemeContext";

export default function ReportsPage() {
  const { theme } = useTheme();

  return (
    <>
      <div className={`min-h-screen pt-16 ${theme === "dark" ? "bg-[#111]" : "bg-white"}`}>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-gray-400 mb-6">Analyze your financial activities over time</p>
          <ReportsTabs />
          <div className="mt-6">
            <ProjectionsFilter />
            <ProjectedFinancialsCard />
            <ProjectedBreakdownTable />
          </div>
        </main>
        <footer className="border-t border-gray-800 mt-12 py-6">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-400">
                © 2025 arciniega.dev.
              </div>
              <div className="flex gap-6">
                <a href="https://github.com/chubuntuarc/monarca/issues" className="text-gray-400 hover:text-white transition-colors">Report a bug</a>
                <a href="https://arciniega.dev" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
