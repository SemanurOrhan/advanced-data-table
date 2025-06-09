"use client"

import { useState, useEffect, useCallback } from "react"
import { CharacterFilters } from "./components/character-filter"
import CharacterDetail from "./components/character-detail"
import { CharacterTable } from "./components/character-table"
import { Pagination } from "./components/character-pagination"
import { LoadingSpinner } from "./components/loading-spinner"
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

  // Fetch characters with current filters and pagination
  const loadCharacters = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchCharacters({
        page: currentPage,
        ...filters,
      })

      setCharacters(response.results)
      setTotalPages(response.info.pages)
      setTotalResults(response.info.count)
      setSelectedCharacter(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch characters")
      setCharacters([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters])

  // Load characters on mount and when dependencies change
  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
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

  // sortConfig kaldırıldığı için local sıralama da kaldırıldı
  const sortedCharacters = characters

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-blue-600 mb-4">
            Rick and Morty Characters
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the multiverse with our advanced character database featuring detailed information about every character
          </p>
        </header>

        {/* Filters */}
        <div className="mb-8">
          <CharacterFilters filters={filters} onFiltersChange={handleFilterChange} loading={loading} />
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
                <div className="flex items-center justify-end mb-2">
                  <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="font-medium">
                      Showing {characters.length} of {totalResults} characters
                    </span>
                  </div>
                </div>
                <CharacterTable
                  characters={sortedCharacters}
                  onSelect={handleCharacterSelect}
                  selectedCharacter={selectedCharacter}
                />
              </div>
              <div className="hidden lg:block">
                {selectedCharacter && (
                  <CharacterDetail character={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
                )}
              </div>
            </div>

            {/* Mobile Character Detail */}
            {selectedCharacter && (
              <div className="lg:hidden mb-8">
                <CharacterDetail character={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
              </div>
            )}

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
