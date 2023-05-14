import os
import cv2

DATA_DIR = "./data"
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

cap = cv2.VideoCapture(0)
while True:
    # ask user for word number to collect data for
    i = int(input("Enter word number (-1 to eit): "))
    if i == -1:
        break
    if os.path.exists(os.path.join(DATA_DIR, str(i))):
        # find last image number
        count = len(os.listdir(os.path.join(DATA_DIR, str(i))))
    else:
        os.makedirs(os.path.join(DATA_DIR, str(i)))
        count = 0
    print("Collecting data")
    done = False
    # takes a picture every time the space bar is pressed, ends when q is pressed
    print("Press space to take a picture, press q to stop")
    while not done:
        ret, frame = cap.read()
        cv2.imshow("Frame", frame)
        if cv2.waitKey(25) == ord(" "):
            print("Saving image " + str(count))
            cv2.imwrite(os.path.join(DATA_DIR, str(i), str(count) + ".jpg"), frame)
            count += 1
        if cv2.waitKey(25) == ord("q"):
            done = True
            break
cap.release()
cv2.destroyAllWindows()
