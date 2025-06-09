import { Badge } from "../ui/badge";

export default function StatusBadge({ status }) {
  let color = "bg-gray-400 text-white";
  if (status?.toLowerCase() === "alive") color = "!bg-green-500 text-white";
  else if (status?.toLowerCase() === "dead") color = "bg-red-500 text-white";
  return <Badge className={color}>{status}</Badge>;
}
