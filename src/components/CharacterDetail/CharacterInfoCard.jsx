import { Card } from "../ui/card";

export default function CharacterInfoCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 border border-border shadow-sm">
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted mb-0.5 font-semibold">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
