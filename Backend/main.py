from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def show_main_page():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.get("/maps")
def show_map():
    pass
