import Image from "next/image";
import Header from "@/components/Header";
import ReportsTabs from "@/components/ReportsTabs";
import ProjectionsFilter from "@/components/ProjectionsFilter";
import ProjectedFinancialsCard from "@/components/ProjectedFinancialsCard";
import ProjectedBreakdownTable from "@/components/ProjectedBreakdownTable";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white">
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
    </div>
  );
}
