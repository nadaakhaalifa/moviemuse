import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Database,
  Film,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getAnalyticsOverview,
  getGenreDistribution,
  getPopularAnalyticsMovies,
  getRatingDistribution,
  getRevenueMovies,
  getMoviesByYear,
} from "../api/analyticsApi";

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <Icon size={22} />
      </div>

      <p className="text-sm text-zinc-400">{title}</p>
      <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
        {value}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

function Analytics() {
  const [overview, setOverview] = useState(null);
  const [genres, setGenres] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [revenueMovies, setRevenueMovies] = useState([]);
  const [moviesByYear, setMoviesByYear] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);

        const [
          overviewData,
          genreData,
          popularData,
          revenueData,
          yearData,
          ratingData,
        ] = await Promise.all([
          getAnalyticsOverview(),
          getGenreDistribution(),
          getPopularAnalyticsMovies(),
          getRevenueMovies(),
          getMoviesByYear(),
          getRatingDistribution(),
        ]);

        setOverview(overviewData);
        setGenres(genreData.slice(0, 10));
        setPopularMovies(popularData);
        setRevenueMovies(revenueData);
        setMoviesByYear(yearData.slice(-30));
        setRatingDistribution(ratingData);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const revenueChartData = useMemo(() => {
    return revenueMovies.map((movie) => ({
      title:
        movie.title.length > 15
          ? `${movie.title.slice(0, 15)}...`
          : movie.title,
      revenue: Math.round(movie.revenue / 1000000000),
    }));
  }, [revenueMovies]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
          <p className="text-zinc-400">Loading analytics dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-zinc-950 via-black to-red-950/30">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mt-12 max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              <BarChart3 size={15} />
              Data Mining Dashboard
            </div>

            <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
              MovieMuse Analytics
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
              Visualizing movie metadata, genre distribution, ratings,
              popularity, revenue patterns, and yearly movie trends from the
              platform dataset.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Movies"
            value={overview?.total_movies?.toLocaleString()}
            subtitle="Movies in TMDB 5000 dataset"
            icon={Film}
          />

          <StatCard
            title="Average Rating"
            value={overview?.average_rating}
            subtitle="Average vote score"
            icon={Star}
          />

          <StatCard
            title="Total Votes"
            value={overview?.total_votes?.toLocaleString()}
            subtitle="Aggregated user votes"
            icon={Users}
          />

          <StatCard
            title="Total Revenue"
            value={`$${Math.round(
              (overview?.total_revenue || 0) / 1000000000
            )}B`}
            subtitle="Movies with available revenue"
            icon={Database}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <h2 className="mb-1 text-xl font-black">Top Genres</h2>
            <p className="mb-6 text-sm text-zinc-500">
              Most frequent genres in the dataset
            </p>

            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genres}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="genre" stroke="#a1a1aa" fontSize={11} />
                  <YAxis stroke="#a1a1aa" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "14px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {genres.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index % 2 === 0 ? "#e50914" : "#7f1d1d"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <h2 className="mb-1 text-xl font-black">Rating Distribution</h2>
            <p className="mb-6 text-sm text-zinc-500">
              Movie count grouped by rating ranges
            </p>

            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    dataKey="count"
                    nameKey="rating_range"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {ratingDistribution.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          ["#e50914", "#991b1b", "#ef4444", "#f97316", "#facc15"][
                            index % 5
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "14px",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
          <h2 className="mb-1 text-xl font-black">Movies by Year</h2>
          <p className="mb-6 text-sm text-zinc-500">
            Number of movies released over the last 30 years in the dataset
          </p>

          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moviesByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="year" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "14px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#e50914"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <h2 className="mb-1 text-xl font-black">Top Popular Movies</h2>
            <p className="mb-6 text-sm text-zinc-500">
              Highest popularity score in the dataset
            </p>

            <div className="space-y-3">
              {popularMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div>
                    <p className="text-sm font-bold">
                      #{index + 1} {movie.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Rating {movie.vote_average} · Votes {movie.vote_count}
                    </p>
                  </div>

                  <div className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-black text-red-400">
                    {movie.popularity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <h2 className="mb-1 text-xl font-black">Top Revenue Movies</h2>
            <p className="mb-6 text-sm text-zinc-500">
              Revenue shown in billions of dollars
            </p>

            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis type="number" stroke="#a1a1aa" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="title"
                    stroke="#a1a1aa"
                    fontSize={11}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "14px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#e50914" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-red-500/20 p-3 text-red-300">
              <TrendingUp size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black">Data Mining Insight</h2>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-red-100/80">
                The dashboard shows how movie popularity, genres, rating
                behavior, revenue, and yearly release patterns can be mined from
                structured movie metadata. These insights support the
                recommendation engine by revealing dominant genres, highly rated
                content, and commercially successful patterns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Analytics;