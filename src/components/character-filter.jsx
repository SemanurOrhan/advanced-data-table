"use client";

import { useState, useEffect } from "react";

import Input from "./ui/input";
import Label from "./ui/label";
import Button from "./ui/button";
import { Search, X } from "lucide-react";
import { getUniqueValues } from "../api/rick-and-morty-char-services";

export function CharacterFilters({
  filters,
  onFiltersChange,
}) {
  const [statuses, setStatuses] = useState([]);
  const [species, setSpecies] = useState([]);
  const [genders, setGenders] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  // Load filter options
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

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onFiltersChange(localFilters);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setLocalFilters({ name: "", status: "", species: "", gender: "", type: "" });
    onFiltersChange({ name: "", status: "", species: "", gender: "", type: "" });
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-xl shadow-card border border-border mb-6 animate-fadeIn" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={localFilters.name}
          onChange={handleInputChange}
          placeholder="Search by name"
          className="border border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          value={localFilters.status}
          onChange={handleInputChange}
          className="border border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">All</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="species">Species</Label>
        <select
          id="species"
          name="species"
          value={localFilters.species}
          onChange={handleInputChange}
          className="border border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">All</option>
          {species.map((sp) => (
            <option key={sp} value={sp}>{sp}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="gender">Gender</Label>
        <select
          id="gender"
          name="gender"
          value={localFilters.gender}
          onChange={handleInputChange}
          className="border border-border rounded-xl px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">All</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 justify-end">
        <Button type="submit" variant="primary" className="w-full h-10">
          <Search className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button type="button" variant="outline" className="w-full h-10 mt-2" onClick={handleClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </form>
  );
}
