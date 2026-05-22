import api from "./axios";

export const getAnalyticsOverview = async () => {
  const response = await api.get("/analytics/overview");
  return response.data;
};

export const getGenreDistribution = async () => {
  const response = await api.get("/analytics/genres");
  return response.data.results;
};

export const getPopularAnalyticsMovies = async () => {
  const response = await api.get("/analytics/popular-movies?limit=8");
  return response.data.results;
};

export const getRevenueMovies = async () => {
  const response = await api.get("/analytics/revenue?limit=8");
  return response.data.results;
};

export const getMoviesByYear = async () => {
  const response = await api.get("/analytics/movies-by-year");
  return response.data.results;
};

export const getRatingDistribution = async () => {
  const response = await api.get("/analytics/rating-distribution");
  return response.data.results;
};