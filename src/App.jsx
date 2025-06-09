import { useState, useEffect, useCallback } from "react"
import CharacterTable from "./components/character-table";
import CharacterDetail from "./components/character-detail";
import CharacterFilters from "./components/character-filter";
import Pagination from "./components/character-pagination";
import LoadingSpinner from "./components/loading-spinner"
// ErrorMessage ve NoResults yoksa, basit hata ve sonuçsuz mesajı ekle

import { fetchCharacters } from "./api/rick-and-morty-char-services"

export default function App() {
  // State management
  const [characters, setCharacters] = useState([])
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [pageSize, setPageSize] = useState(20)

  // Filter and sort state
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    species: "",
    gender: "",
    type: "",
  })

  // sortConfig kaldırıldığı için local sıralama da kaldırıldı
  // Sıralama desteği ekle
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' })

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }, [])

  let sortedCharacters = [...characters]
  if (sortConfig.key) {
    sortedCharacters.sort((a, b) => {
      const aValue = (a[sortConfig.key] || '').toString().toLowerCase()
      const bValue = (b[sortConfig.key] || '').toString().toLowerCase()
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  // Fetch characters with current filters and pagination
  const loadCharacters = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // API'nin beklediği gibi filtreleri küçük harfe çevir
      const apiFilters = {
        ...filters,
        status: filters.status ? filters.status.toLowerCase() : '',
        gender: filters.gender ? filters.gender.toLowerCase() : '',
        species: filters.species ? filters.species.toLowerCase() : '',
      }

      // Rick and Morty API'de pageSize yok, ancak kullanıcıya istenen kadar karakter göstermek için birden fazla sayfa fetch edilebilir
      let allResults = []
      let totalCount = 0
      let totalPagesApi = 1
      let fetched = false
      if (pageSize > 20) {
        // API max 20 karakter döner, daha fazlası için birden fazla sayfa çek
        let remaining = pageSize
        let startPage = (currentPage - 1) * Math.ceil(pageSize / 20) + 1
        for (let p = startPage; remaining > 0; p++) {
          const response = await fetchCharacters({
            page: p,
            ...apiFilters,
          })
          if (!fetched) {
            totalCount = response.info.count
            totalPagesApi = response.info.pages
            fetched = true
          }
          allResults = allResults.concat(response.results)
          remaining -= response.results.length
          if (p >= totalPagesApi || response.results.length === 0) break
        }
        setCharacters(allResults.slice(0, pageSize))
        setTotalPages(Math.ceil(totalCount / pageSize))
        setTotalResults(totalCount)
      } else {
        const response = await fetchCharacters({
          page: currentPage,
          ...apiFilters,
        })
        setCharacters(response.results)
        setTotalPages(response.info.pages)
        setTotalResults(response.info.count)
      }
      setSelectedCharacter(null)
    } catch {
      // Hata mesajını İngilizce ve kullanıcı dostu yap
      setError("No results found for your filter.")
      setCharacters([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters, pageSize])

  // Load characters on mount and when dependencies change
  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
    setSelectedCharacter(null) // Seçili karakteri de sıfırla
  }, [])

  // Handle pagination
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  // Handle character selection (toggle)
  const handleCharacterSelect = useCallback(
    (character) => {
      if (!character) {
        setSelectedCharacter(null)
      } else {
        setSelectedCharacter(selectedCharacter?.id === character?.id ? null : character)
      }
    },
    [selectedCharacter],
  )

  return (
    <div className="min-h-screen bg-[#f3f6fd]">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-primary-dark mb-4">
            Rick and Morty Characters
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the multiverse with our advanced character database featuring detailed information about every character
          </p>
        </header>

        {/* Filters */}
        <div className="mb-8">
          <CharacterFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            resultSummary={(() => {
              // Her zaman (filtre aktifse veya değilse) gösterilecek şekilde
              if (loading || error || characters.length === 0) return null
              const startResult = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1
              const endResult = Math.min(currentPage * pageSize, totalResults)
              return (
                <>Showing {startResult}-{endResult} of {totalResults} results</>
              )
            })()}
          />
        </div>

        {/* Error State */}
        {error && <div className="text-red-600 text-center my-8">{error}</div>}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* No Results */}
        {!loading && !error && characters.length === 0 && (
          <div className="text-center my-8 text-gray-500">
            No results found.
            <button className="ml-2 underline" onClick={() => handleFilterChange({ name: "", status: "", species: "", gender: "", type: "" })}>Clear filters</button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && characters.length > 0 && (
          <>
            {/* Character Table & Detail */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-1 gap-12">
              <div className="flex flex-col gap-4 w-full">
                <CharacterTable
                  characters={sortedCharacters}
                  onSelect={handleCharacterSelect}
                  selectedCharacter={selectedCharacter}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              </div>
            </div>
            {/* Pagination */}
            <div className="mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalResults={totalResults}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
