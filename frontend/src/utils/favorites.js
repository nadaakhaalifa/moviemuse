const FAVORITES_KEY = "moviemuse_favorites";

export function getFavorites() {
  const saved = localStorage.getItem(FAVORITES_KEY);

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(movieId) {
  const favorites = getFavorites();
  return favorites.some((movie) => Number(movie.id) === Number(movieId));
}

export function addFavorite(movie) {
  const favorites = getFavorites();

  const exists = favorites.some(
    (favorite) => Number(favorite.id) === Number(movie.id)
  );

  if (exists) {
    return favorites;
  }

  const updatedFavorites = [movie, ...favorites];
  saveFavorites(updatedFavorites);

  return updatedFavorites;
}

export function removeFavorite(movieId) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (movie) => Number(movie.id) !== Number(movieId)
  );

  saveFavorites(updatedFavorites);

  return updatedFavorites;
}

export function toggleFavorite(movie) {
  if (isFavorite(movie.id)) {
    return removeFavorite(movie.id);
  }

  return addFavorite(movie);
}