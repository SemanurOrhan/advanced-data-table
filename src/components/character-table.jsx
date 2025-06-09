// character-table.jsx - Karakter tablosu ve detay gösterimi
// Bu bileşen, karakter listesini tablo olarak gösterir ve satıra tıklanınca detay açar.

import { ChevronDown, ChevronUp, MapPin, Calendar, Tv, User, Heart, Skull, HelpCircle } from "lucide-react"
import Badge from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import CharacterDetail from "./character-detail"
import StatusBadge from "./CharacterTable/StatusBadge"

export default function CharacterTable({ characters, sortConfig, onSort, onSelect, selectedCharacter }) {
  // Sıralanabilir kolonlar
  const sortableColumns = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
    { key: "species", label: "Species" },
    { key: "gender", label: "Gender" },
  ]

  // Sıralama ikonunu render et
  const renderSortIcon = (columnKey) => {
    if (!sortConfig || !sortConfig.key) {
      return <ChevronDown className="h-4 w-4 ml-1 opacity-30" />
    }
    if (sortConfig.key !== columnKey) {
      return <ChevronDown className="h-4 w-4 ml-1 opacity-30" />
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1 text-blue-600" />
    )
  }

  // Status için renk ve ikon seç
  const getStatusInfo = (status) => {
    switch (status) {
      case "Alive":
        return { color: "bg-green-500", icon: Heart, textColor: "text-green-700" }
      case "Dead":
        return { color: "bg-red-500", icon: Skull, textColor: "text-red-700" }
      default:
        return { color: "bg-gray-400", icon: HelpCircle, textColor: "text-gray-700" }
    }
  }

  return (
    // Küçük ekranlarda yatay scroll için overflow-x-auto ve min-w ekleniyor
    <div className="bg-white rounded-2xl shadow-card border border-border overflow-x-auto animate-fadeIn w-full max-w-full">
      <div className="min-w-[700px] md:min-w-0">
        {/* Table Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-b from-white via-accent to-accent border-b-2 border-primary/30 w-full shadow-md shadow-primary/10">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 px-2 sm:px-4 md:px-6 lg:px-8 py-5 text-base md:text-lg font-bold text-primary-dark tracking-wide uppercase select-none">
            <div className="col-span-1"></div> {/* Avatar column */}
            {sortableColumns.map((column) => (
              <div
                key={column.key}
                className="col-span-1 sm:col-span-2 cursor-pointer flex items-center gap-1 transition-colors hover:text-primary"
                onClick={() => onSort(column.key)}
              >
                {column.label}
                {renderSortIcon(column.key)}
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3 flex items-center gap-1">
              <MapPin className="h-5 w-5 mr-1 text-secondary" />
              Location
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border w-full">
          {characters.map((character) => {
            const isSelected = selectedCharacter?.id === character.id
            const statusInfo = getStatusInfo(character.status)
            const StatusIcon = statusInfo.icon

            return (
              <div key={character.id} className="transition-all duration-200">
                {/* Main Row */}
                <div
                  onClick={() => onSelect(character)}
                  className={`grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 px-2 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4 cursor-pointer transition-all duration-200 items-center relative
                    ${isSelected ? "bg-accent border-l-4 border-l-primary ring-2 ring-primary/30 ring-inset shadow-lg shadow-primary/10 z-10" : "hover:bg-accent"}
                  `}
                >
                  {/* Avatar */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden ring-2 ring-white shadow-card">
                      <img
                        src={character.image || "/placeholder.svg"}
                        alt={character.name}
                        width={48}
                        height={48}
                        className="object-cover h-10 w-10 md:h-12 md:w-12 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="col-span-1 sm:col-span-2 flex items-center min-w-[80px] sm:min-w-[120px]">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm md:text-base sm:text-lg hover:text-primary transition-colors break-words">
                        {character.name}
                      </p>
                      {character.type && <p className="text-xs text-muted mt-0.5">{character.type}</p>}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 sm:col-span-2 flex items-center min-w-[80px] sm:min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={character.status} />
                    </div>
                  </div>

                  {/* Species */}
                  <div className="col-span-1 sm:col-span-2 flex items-center min-w-[80px] sm:min-w-[120px]">
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-none px-2 sm:px-3 py-1 font-semibold">
                      {character.species}
                    </Badge>
                  </div>

                  {/* Gender */}
                  <div className="col-span-1 sm:col-span-2 flex items-center min-w-[80px] sm:min-w-[120px]">
                    <div className="flex items-center gap-1 text-muted">
                      <User className="h-5 w-5" />
                      <span className="text-xs sm:text-base font-medium">{character.gender}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="col-span-2 sm:col-span-3 flex flex-col justify-center min-w-[120px] sm:min-w-[180px]">
                    {/* whitespace-nowrap kaldırıldı, responsive bozulmasın diye */}
                    <span className="text-gray-900 font-semibold text-xs sm:text-base truncate break-words">{character.location.name}</span>
                    <span className="text-xs text-muted">Current location</span>
                  </div>
                </div>
                {/* Expanded Detail Row */}
                {isSelected && (
                  <div className="w-full flex justify-center py-6 animate-fadeIn">
                    <CharacterDetail character={character} onClose={() => onSelect(null)} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// InfoCard yardımcı bileşeni (kullanılmıyor, örnek olarak bırakıldı)
function InfoCard({ label, value, icon }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-base font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}