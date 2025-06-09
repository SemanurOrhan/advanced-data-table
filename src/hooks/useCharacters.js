import { useState, useEffect } from "react";
import { fetchCharacters } from "../api/rick-and-morty-char-services";

// Bu hook, Rick and Morty karakterlerini çeker ve yönetir.
export default function useCharacters() {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCharacters({ page: 1 }),
      fetchCharacters({ page: 2 })
    ])
      .then(([page1, page2]) => {
        setCharacters([...page1.results, ...page2.results]);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { characters, error, loading };
}
