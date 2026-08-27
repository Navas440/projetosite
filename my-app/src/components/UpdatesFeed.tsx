import type { Update } from "@/data/updates";
import { formatRelativeTime } from "@/lib/time";

const categoryColor: Record<string, string> = {
  Bastidores: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  "Capítulo Novo": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
  Divulgação: "bg-pink-500/20 text-pink-300 border-pink-400/40",
};

export default function UpdatesFeed({ updates }: { updates: Update[] }) {
  return (
    <ul className="flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {updates.map((update) => (
        <li key={update.id} className="flex items-start gap-4 p-5">
          <span
            className={`shrink-0 text-xs px-2 py-1 rounded-full border ${categoryColor[update.category]}`}
          >
            {update.category}
          </span>
          <div className="flex-1">
            <p className="text-gray-200">{update.text}</p>
            <span className="text-xs text-gray-500">{formatRelativeTime(update.date)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
