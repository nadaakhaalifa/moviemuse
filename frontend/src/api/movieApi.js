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

export const getMovieDetails = async (movieId) => {
  const response = await api.get(`/tmdb/movie/${movieId}`);
  return response.data;
};

export const getSimilarMovies = async (movieId) => {
  const response = await api.get(`/tmdb/movie/${movieId}/similar?limit=12`);
  return response.data.results;
};

export const getContentRecommendations = async (movieTitle) => {
  const encodedTitle = encodeURIComponent(movieTitle);
  const response = await api.get(`/recommendations/content/${encodedTitle}?top_n=12`);
  return response.data.recommendations;
};