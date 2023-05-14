from fastapi import FastAPI, Request
import uvicorn
from starlette.middleware.cors import CORSMiddleware
import pickle
import numpy as np

app = FastAPI()

origins = ["http://localhost"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_dict = pickle.load(open("./model.p", "rb"))
model = model_dict["model"]
labels_dict = {0: "hello", 1: "i love you", 2: "yes", 3: "good", 4: "bad", 5: "okay", 6: "you", 7: "i/i'm", 8: "why", 9: "no"}

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

@app.post("/")
async def process_json(request: Request):
    # Get the JSON data from the request
    data = await request.json()
    if len(data) == 0:
        return {"result": "no data"}
    hands_data = data
    data_aux = []

    # hand landmarks are taken from data.json
    if len(hands_data) == 42:
        hand = hands_data[:21]
    else:
        hand = hands_data

    for landmark in hand:
        x = landmark["x"]
        y = landmark["y"]
        data_aux.append(x)
        data_aux.append(y)

    prediction = model.predict([np.asarray(data_aux)])
    predicted_sign = labels_dict[int(prediction[0])]
    print(predicted_sign)
    return {"result": predicted_sign}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
