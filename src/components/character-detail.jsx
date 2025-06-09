import { X, MapPin, Calendar, Tv, Globe } from "lucide-react"
import Button from "./ui/button"
import { useState } from "react"
import { Card } from "./ui/card"
import Badge from "./ui/badge"
import StatusBadge from "./CharacterTable/StatusBadge"

/**
 * Character detail component
 * @param {Object} props
 * @param {Object} props.character - Character data
 * @param {Function} props.onClose - Close handler
 */
const CharacterDetail = ({ character, onClose }) => {
  const [showAllEpisodes, setShowAllEpisodes] = useState(false)
  if (!character) return null

  const episodeCount = character.episode?.length || 0
  const EPISODE_DISPLAY_LIMIT = 4
  const shouldShowMoreButton = episodeCount > EPISODE_DISPLAY_LIMIT
  const episodesToShow = showAllEpisodes ? character.episode : character.episode?.slice(0, EPISODE_DISPLAY_LIMIT)

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full max-w-5xl mx-auto border-primary/30 shadow-xl shadow-blue-100 animate-fadeIn p-0 overflow-visible relative z-20">
      {/* Exit button: floating, always visible, modern style */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 bg-white/80 hover:bg-primary/90 hover:text-white text-primary border border-primary/20 shadow-lg rounded-full p-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Close detail"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="flex flex-col md:flex-row gap-0 md:gap-6">
        {/* Left: Image & Basic Info */}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center bg-gradient-to-br from-blue-50/80 via-white/90 to-white md:rounded-l-xl p-6 md:w-2/5 w-full relative min-w-[220px]">
          <img
            src={character.image || "/placeholder.svg"}
            alt={character.name}
            className="h-32 w-32 md:h-36 md:w-36 rounded-2xl object-cover shadow-lg border-4 border-white mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex flex-col items-center md:items-start w-full">
            <h2 className="text-xl md:text-2xl font-bold text-primary-dark mb-1 text-center md:text-left w-full break-words">{character.name}</h2>
            <div className="flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
              <StatusBadge status={character.status} />
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{character.species}</Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{character.gender}</Badge>
            </div>
            {character.type && <div className="text-xs text-muted mb-2">Type: <span className="font-semibold text-gray-700">{character.type}</span></div>}
            <div className="flex items-center gap-1 text-xs text-muted mt-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Created: {formatDate(character.created)}</span>
            </div>
          </div>
        </div>
        {/* Right: Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Info Cards: Origin, Current Location, Episodes yan yana */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <InfoCard
              icon={<Globe className="h-5 w-5 text-blue-500" />}
              label="Origin"
              value={character.origin?.name || "Unknown"}
            />
            <InfoCard
              icon={<MapPin className="h-5 w-5 text-red-500" />}
              label="Current Location"
              value={character.location?.name || "Unknown"}
            />
            <InfoCard
              icon={<Tv className="h-5 w-5 text-blue-500" />}
              label="Episodes"
              value={`${episodeCount} episode${episodeCount !== 1 ? "s" : ""}`}
            />
          </div>
          <div className="mb-2">
            <h3 className="text-base font-semibold text-primary mb-2 flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-500" /> Episode Appearances</h3>
            <div className="flex flex-wrap items-center gap-2">
              {episodesToShow?.map((ep) => {
                const episodeNumber = ep.split("/").pop()
                return (
                  <Badge key={ep} variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 px-2 py-1">
                    Episode {episodeNumber}
                  </Badge>
                )
              })}
              {shouldShowMoreButton && !showAllEpisodes && (
                <Button
                  variant="default"
                  size="sm"
                  className="px-3 py-1 text-xs font-semibold h-auto ml-2 bg-blue-100 text-primary border border-blue-300 hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-300 transition-colors"
                  onClick={() => setShowAllEpisodes(true)}
                >
                  +{episodeCount - EPISODE_DISPLAY_LIMIT} more episode{episodeCount - EPISODE_DISPLAY_LIMIT > 1 ? 's' : ''}
                </Button>
              )}
              {shouldShowMoreButton && showAllEpisodes && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3 py-1 text-xs font-medium h-auto ml-2"
                  onClick={() => setShowAllEpisodes(false)}
                >
                  Show less
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Helper component for info cards
const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 border border-border shadow-sm">
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted mb-0.5 font-semibold">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  )
}

export default CharacterDetail
