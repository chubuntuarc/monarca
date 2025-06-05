import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import translations from "./translations";
import { useState } from "react";

const rowsData = [
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
  const [rows, setRows] = useState(rowsData);
  const [editing, setEditing] = useState<{row: number, col: 'income' | 'expenses' | null}>({row: -1, col: null});
  const [editValue, setEditValue] = useState("");

  const moneyFormat = (value: string) => {
    // Elimina todo excepto números y puntos
    const num = Number(value.replace(/[^\d.]/g, ""));
    if (isNaN(num)) return "$0";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
  };

  // Helper para extraer el número de un string de dinero
  const parseMoney = (value: string) => Number(value.replace(/[^\d.-]/g, "")) || 0;

  const handleDoubleClick = (rowIdx: number, col: 'income' | 'expenses') => {
    setEditing({row: rowIdx, col});
    setEditValue(rows[rowIdx][col]);
  };

  const handleBlur = (rowIdx: number, col: 'income' | 'expenses') => {
    const newRows = [...rows];
    newRows[rowIdx][col] = moneyFormat(editValue);
    setRows(newRows);
    setEditing({row: -1, col: null});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIdx: number, col: 'income' | 'expenses') => {
    if (e.key === 'Enter') {
      handleBlur(rowIdx, col);
    } else if (e.key === 'Escape') {
      setEditing({row: -1, col: null});
    }
  };

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
          {rows.map((row, rowIdx) => {
            const incomeNum = parseMoney(row.income);
            const expensesNum = parseMoney(row.expenses);
            const savingsNum = incomeNum - expensesNum;
            // Balance acumulado
            const prevSavings = rows.slice(0, rowIdx).reduce((acc, r) => acc + (parseMoney(r.income) - parseMoney(r.expenses)), 0);
            const balanceNum = prevSavings + savingsNum;
            return (
              <tr key={row.month} className={`${theme === "dark" ? "border-t border-[#232323]" : "border-t border-gray-300"}`}>
                <td>{row.month}</td>
                <td onDoubleClick={() => handleDoubleClick(rowIdx, 'income')} className="cursor-pointer">
                  {editing.row === rowIdx && editing.col === 'income' ? (
                    <input
                      className="w-20 px-1 py-0.5 rounded border border-gray-300 text-black"
                      value={editValue}
                      autoFocus
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => handleBlur(rowIdx, 'income')}
                      onKeyDown={e => handleKeyDown(e, rowIdx, 'income')}
                    />
                  ) : (
                    row.income
                  )}
                </td>
                <td onDoubleClick={() => handleDoubleClick(rowIdx, 'expenses')} className="cursor-pointer">
                  {editing.row === rowIdx && editing.col === 'expenses' ? (
                    <input
                      className="w-20 px-1 py-0.5 rounded border border-gray-300 text-black"
                      value={editValue}
                      autoFocus
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => handleBlur(rowIdx, 'expenses')}
                      onKeyDown={e => handleKeyDown(e, rowIdx, 'expenses')}
                    />
                  ) : (
                    row.expenses
                  )}
                </td>
                <td className={savingsNum < 0 ? "text-red-500" : undefined}>{moneyFormat(savingsNum.toString())}</td>
                <td className={balanceNum < 0 ? "text-red-500" : undefined}>{moneyFormat(balanceNum.toString())}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-xs text-gray-400 mt-2">
        {t.edit_disclaimer}
      </div>
    </div>
  );
}
