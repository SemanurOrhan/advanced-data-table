// character-filter.jsx - Karakter filtreleme bileşeni
// Bu bileşen, kullanıcıya çoklu filtreleme imkanı sunar ve filtre değişikliklerini üst bileşene iletir.

import { useState, useEffect } from "react";

import Input from "./ui/input";
import Label from "./ui/label";
import Button from "./ui/button";
import { Search, X } from "lucide-react";
import { getUniqueValues } from "../api/rick-and-morty-char-services";

export default function CharacterFilters({
  filters,
  onFiltersChange,
  resultSummary,
}) {
  // Filtre seçenekleri için state
  const [statuses, setStatuses] = useState([]);
  const [species, setSpecies] = useState([]);
  const [genders, setGenders] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);
  const [showClear, setShowClear] = useState(false);

  // Filtre seçeneklerini API'den yükle
  useEffect(() => {
    async function loadFilterOptions() {
      const statusValues = await getUniqueValues("status");
      const speciesValues = await getUniqueValues("species");
      const genderValues = await getUniqueValues("gender");

      setStatuses(statusValues);
      setSpecies(speciesValues);
      setGenders(genderValues);
    }

    loadFilterOptions();
  }, []);

  // Üstten gelen filtreler değişirse local filtreleri güncelle
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Input değişikliklerini işle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Form submit edildiğinde filtreleri uygula
  const handleSubmit = (e) => {
    e.preventDefault();
    onFiltersChange(localFilters);
    if (isFilterActive) setShowClear(true);
  };

  // Filtreleri temizle
  const handleClearFilters = () => {
    setLocalFilters({ name: "", status: "", species: "", gender: "", type: "" });
    onFiltersChange({ name: "", status: "", species: "", gender: "", type: "" });
    setShowClear(false);
  };

  // Herhangi bir filtre aktif mi?
  const isFilterActive = Object.entries(localFilters).some(
    ([key, value]) => key !== "type" && value && value !== ""
  )

  return (
    <form className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-xl shadow-card border border-border mb-6 animate-fadeIn" onSubmit={handleSubmit}>
      {/* İsim filtresi */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="name" className="text-sm font-semibold text-primary-dark">Name</Label>
        <Input
          id="name"
          name="name"
          value={localFilters.name}
          onChange={handleInputChange}
          placeholder="Search by name"
          className="border border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary text-base font-medium text-gray-900 placeholder:text-gray-400 bg-gray-50"
        />
      </div>
      {/* Status filtresi */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="status" className="text-sm font-semibold text-primary-dark">Status</Label>
        <select
          id="status"
          name="status"
          value={localFilters.status}
          onChange={handleInputChange}
          className="border border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary text-base font-medium text-gray-900 bg-gray-50"
        >
          <option value="">All</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      {/* Species filtresi */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="species" className="text-sm font-semibold text-primary-dark">Species</Label>
        <select
          id="species"
          name="species"
          value={localFilters.species}
          onChange={handleInputChange}
          className="border border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary text-base font-medium text-gray-900 bg-gray-50"
        >
          <option value="">All</option>
          {species.map((sp) => (
            <option key={sp} value={sp}>{sp}</option>
          ))}
        </select>
      </div>
      {/* Gender filtresi */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="gender" className="text-sm font-semibold text-primary-dark">Gender</Label>
        <select
          id="gender"
          name="gender"
          value={localFilters.gender}
          onChange={handleInputChange}
          className="border border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary text-base font-medium text-gray-900 bg-gray-50"
        >
          <option value="">All</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      {/* Filtrele ve temizle butonları */}
      <div className="flex flex-col gap-1 justify-end">
        <div className={`flex flex-row w-full gap-2 ${showClear ? "" : "md:justify-end"}`}>
          <Button
            type="submit"
            variant="primary"
            size={showClear ? "sm" : "default"}
            className={`h-10 flex-1 md:flex-none ${showClear ? "w-auto px-4" : "w-full"}`}
          >
            <Search className="h-4 w-4 mr-2" />
            Filter
          </Button>
          {showClear && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-10 flex-1 md:flex-none w-auto px-4"
              onClick={handleClearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Sonuç özeti: sadece filtre aktifse ve resultSummary varsa göster */}
      <div className="md:col-span-5 col-span-1 flex justify-end items-end min-h-[22px] pb-1">
        {isFilterActive && resultSummary && (
          <span className="text-xs text-muted font-normal">{resultSummary}</span>
        )}
      </div>
    </form>
  );
}
