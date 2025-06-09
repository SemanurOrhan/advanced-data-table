import { Badge } from "../ui/badge";

export default function CharacterEpisodeBadges({ episodes, showAll, displayLimit }) {
  const episodesToShow = showAll ? episodes : episodes.slice(0, displayLimit);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {episodesToShow.map((ep) => {
        const episodeNumber = ep.split("/").pop();
        return (
          <Badge key={ep} variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 px-2 py-1">
            Episode {episodeNumber}
          </Badge>
        );
      })}
    </div>
  );
}
