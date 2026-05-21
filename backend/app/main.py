from fastapi import FastAPI
from app.routes import recommendation_routes
from app.routes import movie_routes

app = FastAPI(
    title="MovieMuse API",
    description="A data-driven movie recommendation platform",
    version="1.0.0"
)

app.include_router(recommendation_routes.router)
app.include_router(movie_routes.router)


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