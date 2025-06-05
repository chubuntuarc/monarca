import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import translations from "./translations";

const rows = [
  { month: "April 2024", income: "$5,500", expenses: "$4,000", savings: "$1,500", balance: "$1,500" },
  { month: "May 2024", income: "$5,500", expenses: "$4,200", savings: "$1,300", balance: "$2,800" },
  { month: "June 2024", income: "$5,500", expenses: "$4,500", savings: "$1,000", balance: "$3,800" },
  { month: "July 2024", income: "$5,500", expenses: "$4,800", savings: "$700", balance: "$4,500" },
  { month: "August 2024", income: "$5,500", expenses: "$5,000", savings: "$500", balance: "$5,000" },
  { month: "September 2024", income: "$5,500", expenses: "$5,200", savings: "$300", balance: "$5,300" },
];

export default function ProjectedBreakdownTable() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className={`${theme === "dark" ? "bg-[#18181b] rounded-lg p-6 border border-[#232323]" : "bg-white rounded-lg p-6 border border-gray-300"}`}>
      <div className={`${theme === "dark" ? "font-bold mb-4 text-lg text-white" : "font-bold mb-4 text-lg text-black"}`}>{t.projected_breakdown}</div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-400">
            <th>{t.month}</th>
            <th>{t.projected_income}</th>
            <th>{t.projected_expenses}</th>
            <th>{t.net_savings}</th>
            <th>{t.carry_over_balance}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.month} className={`${theme === "dark" ? "border-t border-[#232323]" : "border-t border-gray-300"}`}>
              <td>{row.month}</td>
              <td>{row.income}</td>
              <td>{row.expenses}</td>
              <td>{row.savings}</td>
              <td>{row.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
