from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS

model = MobileNetV2(weights='imagenet')

def model_predict(img_path, model, top_k=5, confidence_threshold=0.2):
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    preds = model.predict(x)
    decoded_preds = decode_predictions(preds, top=top_k)[0]  # Get top-k predictions

    # Filter predictions based on confidence threshold
    results = [{'label': label, 'probability': float(prob)} for (_, label, prob) in decoded_preds if prob > confidence_threshold]
    
    return results


@app.route('/classify', methods=['POST'])
def classify():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found'})

    img_file = request.files['image']
    img_path = os.path.join('uploads', img_file.filename)
    img_file.save(img_path)

    results = model_predict(img_path, model, top_k=5, confidence_threshold=0.2)
    print(results)
    return jsonify({'results': results})


if __name__ == '__main__':
    app.run(debug=True)
