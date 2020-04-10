from fastapi import FastAPI
from starlette.requests import Request
from ML.model import Inference
from sqlalchemy import create_engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
inference_obj = Inference()

origins = [
    "http://localhost:8080"
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
    db_engine = create_engine('sqlite:///../Database/pythonsqlite.db')
    conn = db_engine.connect()
    query = conn.execute("select distinct(City) from us_accident_data;")
    res = []
    for i in query.cursor:
        res.append(i)
    return {"results": res}
