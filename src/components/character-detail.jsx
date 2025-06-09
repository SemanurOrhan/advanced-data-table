import { X } from "lucide-react"
import Button from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import Badge from "./ui/badge"


const CharacterDetail = ({ character, onClose }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Alive":
        return "bg-green-500 hover:bg-green-600"
      case "Dead":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-400 hover:bg-gray-500"
    }
  }

  // Get episode count
  const episodeCount = character.episode.length

  return (
    <Card className="border border-border shadow-card animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between bg-accent border-b border-border rounded-t-xl">
        <CardTitle className="text-xl font-bold text-primary-dark">{character.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5 text-muted" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Character Image */}
          <div className="flex flex-col items-center">
            <div className="relative h-64 w-64 rounded-xl overflow-hidden shadow-card mb-4 border border-border">
              <img
                src={character.image || "/placeholder.svg"}
                alt={character.name}
                width={256}
                height={256}
                className="object-cover h-64 w-64 rounded-xl"
              />
            </div>
            <Badge className={getStatusColor(character.status) + " text-white px-4 py-2 text-sm font-semibold shadow-card"}>
              {character.status}
            </Badge>
          </div>

          {/* Character Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Species" value={character.species} />
              <InfoItem label="Gender" value={character.gender} />
              <InfoItem label="Type" value={character.type || "Unknown"} />
              <InfoItem label="Episodes" value={`${episodeCount} episode${episodeCount !== 1 ? "s" : ""}`} />
              <InfoItem label="Origin" value={character.origin.name} />
              <InfoItem label="Current Location" value={character.location.name} />
              <InfoItem label="Created" value={formatDate(character.created)} />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Episode Appearances</h3>
              <div className="flex flex-wrap gap-2">
                {character.episode.slice(0, 10).map((ep) => {
                  const episodeNumber = ep.split("/").pop()
                  return (
                    <Badge key={ep} variant="outline" className="bg-gray-100">
                      Ep. {episodeNumber}
                    </Badge>
                  )
                })}
                {character.episode.length > 10 && (
                  <Badge variant="outline" className="bg-gray-100">
                    +{character.episode.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for info items
function InfoItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  )
}

export default CharacterDetail
