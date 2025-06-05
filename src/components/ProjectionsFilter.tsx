import { useTheme } from "./ThemeContext";

export default function ProjectionsFilter() {
  const { theme } = useTheme();

  return (
    <div className="mb-6">
      <select className={`${theme === "dark" ? "bg-[#18181b] border border-[#232323] rounded px-4 py-2 text-white w-64" : "bg-white border border-gray-300 rounded px-4 py-2 text-black w-64"}`}>
        <option>Next 6 Months</option>
        {/* Más opciones */}
      </select>
    </div>
  );
}
