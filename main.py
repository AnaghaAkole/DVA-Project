from fastapi import FastAPI
from starlette.requests import Request
from Backend.ML.model import Inference
from Backend.Analytics.analytics import fetch_city_hot_spots, fetch_cities, fetch_day_wise_count, fetch_Description, fetch_road_topology
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
inference_obj = Inference()

origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def show_main_page():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


@app.get("/maps")
def show_map():
    pass


@app.post("/maps/safepath")
async def get_safest_route(request: Request):
    params = await request.json()
    routes = inference_obj.find_safest_path(params)
    return routes


@app.get("/cities")
def get_cities():
    return fetch_cities()

@app.get("/maps/hotspots")
def get_accident_hot_spots():
    return {"results": fetch_city_hot_spots()}


@app.get("/daywiseCount")
def get_day_wise_count():
    return fetch_day_wise_count()

@app.get("/roadTopology")
def get_day_wise_count():
    return fetch_road_topology()