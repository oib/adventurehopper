from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI()

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.post("/api/start")
async def start_game(request: Request):
    return JSONResponse({"status": "started"})

@app.post("/api/score")
async def submit_score(request: Request):
    data = await request.json()
    score = data.get("score", 0)
    # TODO: Implement score saving logic
    return JSONResponse({"status": "saved", "score": score}) 
