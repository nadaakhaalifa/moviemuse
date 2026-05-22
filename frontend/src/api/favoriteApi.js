import api from "./axios";

export const getMyFavorites = async () => {
  const response = await api.get("/favorites/me");
  return response.data;
};

export const addFavoriteToBackend = async (movie) => {
  const response = await api.post("/favorites", {
    movie_id: Number(movie.id),
    title: movie.title,
    poster_url: movie.poster_url || null,
    backdrop_url: movie.backdrop_url || null,
    release_date: movie.release_date || null,
    vote_average: movie.vote_average || null,
    overview: movie.overview || null,
  });

  return response.data;
};

export const removeFavoriteFromBackend = async (movieId) => {
  const response = await api.delete(`/favorites/${movieId}`);
  return response.data;
};

export const checkFavoriteInBackend = async (movieId) => {
  const response = await api.get(`/favorites/check/${movieId}`);
  return response.data;
};