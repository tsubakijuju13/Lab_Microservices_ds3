from fastapi import FastAPI

app = FastAPI()

@app.get("/comestibles")
def read_comestibles():
    return {
        "papas": ["Papas fritas", "Papas a la francesa", "Papas bravas"],
        "salchichas": ["Salchicha vienesa", "Salchicha parrillera", "Salchicha alemana"]
    }