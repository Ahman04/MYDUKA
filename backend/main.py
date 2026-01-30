from fastapi import FastAPI 
from app.core.database import engine, Base
from app.models import user


app = FastAPI(title="MyDuka API")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message":"MyDuka backend is running"}

@app.get("/health_check")
async def ping():
    return {"result": "healthy"}