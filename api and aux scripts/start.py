# DEPENDENCIES ------>
import json
import pickle
import numpy as np


model_dict = pickle.load(open("./model.p", "rb"))
model = model_dict["model"]
labels_dict = {1: "hello", 2: "Nothing"}

hands_data = json.load(open("./data.json", "r"))
data_aux = []

# hand landmarks are taken from data.json
hand = hands_data[0]
for landmark in hand:
    x = landmark["x"]
    y = landmark["y"]
    z = landmark["z"]
    data_aux.append(x)
    data_aux.append(y)
    data_aux.append(z)

prediction = model.predict([np.asarray(data_aux)])
print(prediction)
predicted_sign = labels_dict[int(prediction[0])]
print(predicted_sign)
data_aux = []


# if results.multi_hand_landmarks:
#     for hand_landmarks in results.multi_hand_landmarks:
#         mp_drawing.draw_landmarks(
#             frame,
#             hand_landmarks,
#             mp_hands.HAND_CONNECTIONS,
#             mp_drawing_styles.get_default_hand_landmarks_style(),
#             mp_drawing_styles.get_default_hand_connections_style())
#
#         for i in range(len(hand_landmarks.landmark)):
#             x = hand_landmarks.landmark[i].x
#             y = hand_landmarks.landmark[i].y
#             z = hand_landmarks.landmark[i].z
#             data_aux.append(x)
#             data_aux.append(y)
#             data_aux.append(z)
#             x_.append(x)
#             y_.append(y)
#         prediction = model.predict([np.asarray(data_aux)])
#         predicted_sign = labels_dict[int(prediction[0])]
#         data_aux = []
#         x_ = []
#         y_ = []
#
# cv2.imshow("Handy", frame)
# cv2.waitKey(1)

#
# capture.release()
# cv2.destroyAllWindows()
