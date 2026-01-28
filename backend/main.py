from fastapi import FastAPI 

app = FastAPI()

@app.get("/")
async def root():
    return{
        "message": "Welcome to MyDuka API",
        "docs":"/docs",
        "health":"/health_check"
        "I am in my branch": "Branch"
    }

@app.get("/health_check")
async def ping():
    return {"result": "healthy"}