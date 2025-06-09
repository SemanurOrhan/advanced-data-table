/**
 * Rick and Morty API'den karakter verilerini çeker.
 * @param {Object} params - Filtreler ve sayfa bilgisi.
 * @param {string} [params.name]
 * @param {string} [params.status]
 * @param {string} [params.gender]
 * @param {string} [params.species]
 * @param {number} [params.page]
 * @returns {Promise<Object>} - API'den dönen veri (results ve info)
 */
export async function fetchCharacters({ name = '', status = '', gender = '', species = '', page = 1 } = {}) {
  let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
  if (name) url += `&name=${encodeURIComponent(name)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;
  if (gender) url += `&gender=${encodeURIComponent(gender)}`;
  if (species) url += `&species=${encodeURIComponent(species)}`;

  const response = await fetch(url);
  if (!response.ok) {
    // Eğer sonuç yoksa veya hata varsa hatayı fırlat
    throw new Error('Sonuç bulunamadı veya API hatası');
  }
  return response.json();
}

// Helper to get unique values for a field from all characters
export async function getUniqueValues(field) {
  let unique = new Set();
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const data = await fetchCharacters({ page });
    data.results.forEach((char) => {
      if (char[field]) unique.add(char[field]);
    });
    if (data.info && data.info.next) {
      page++;
    } else {
      hasMore = false;
    }
  }
  return Array.from(unique);
}
