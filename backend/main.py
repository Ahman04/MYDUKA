from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import auth, users, products, inventory, reports, supply_requests


app = FastAPI(title="MyDuka API")

# Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(inventory.router)
app.include_router(reports.router)
app.include_router(supply_requests.router)

@app.get("/")
def root():
    return {"message":"MyDuka backend is running"}

@app.get("/health_check")
async def ping():
    return {"result": "healthy"}