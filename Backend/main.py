from fastapi import FastAPI
from starlette.requests import Request

from .ml.model import Inference

app = FastAPI()
inference_obj = Inference()


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
def get_safest_route(request: Request):
    print (request.body())
    pass
