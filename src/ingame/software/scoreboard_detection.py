import cv2
import numpy as np
from mss import mss
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

def detect_element(template_image_path, element_region):
    reference_image = cv2.imread(template_image_path, cv2.IMREAD_GRAYSCALE)

    monitor = {"left": element_region[0], "top": element_region[1], "width": element_region[2], "height": element_region[3]}

    with mss() as sct:
        screenshot = sct.grab(monitor)
        screenshot_gray = np.array(screenshot)[:, :, 0]

        res = cv2.matchTemplate(screenshot_gray, reference_image, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, _ = cv2.minMaxLoc(res)

        if max_val > 0.8:
            return True
        else:
            return False

@app.route("/update_hud", methods=["POST"])
def update_hud():
    scoreboard_template_path = "scoreboard_template.png"
    scoreboard_region = (626, 848, 1305 - 626 + 1, 855 - 848 + 1)
    scoreboard_state = detect_element(scoreboard_template_path, scoreboard_region)

    map_template_path = "map_template.png"
    map_region = (0, 0, 300, 300)  # Update these values with the actual map region
    map_state = detect_element(map_template_path, map_region)

    return jsonify(scoreboard_state=scoreboard_state, map_state=map_state)

if __name__ == "__main__":
    app.run(debug=True)
