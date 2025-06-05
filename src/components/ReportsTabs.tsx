import { useLanguage } from "./LanguageContext";
import translations from "./translations";

export default function ReportsTabs() {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <div className="flex gap-8 border-b border-[#232323] mb-4">
      <button className="pb-2 text-gray-400 border-b-2 border-transparent">{t.overview}</button>
      <button className="pb-2 font-semibold border-b-2 border-white">{t.projections}</button>
    </div>
  );
}
