from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import recommendation_routes
from app.routes import movie_routes
from app.routes import analytics_routes
from app.routes import tmdb_routes


app = FastAPI(
    title="MovieMuse API",
    description="A data-driven movie recommendation platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendation_routes.router)
app.include_router(movie_routes.router)
app.include_router(analytics_routes.router)
app.include_router(tmdb_routes.router)


@app.get("/")
def root():
    return {
        "message": "MovieMuse API is running",
        "project": "Hybrid Movie Recommendation System"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }