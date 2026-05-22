import api from "./axios";

export const getPopularMovies = async () => {
  const response = await api.get("/tmdb/popular?limit=12");
  return response.data.results;
};

export const getTopRatedMovies = async () => {
  const response = await api.get("/tmdb/top-rated?limit=12");
  return response.data.results;
};

export const searchMovies = async (query) => {
  const response = await api.get(`/movies/search?query=${query}&limit=12`);
  return response.data.results;
};