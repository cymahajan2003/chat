import os
from flask import Flask, render_template, request, jsonify
from googletrans import Translator, LANGUAGES

# Initialize Flask app with correct template and static folder paths
app = Flask(__name__,
            template_folder="../templates",
            static_folder="../static")
translator = Translator()

@app.route('/')
def index():
    return render_template('index.html', languages=LANGUAGES)

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data['text']
    source_lang = data['source_lang']
    target_lang = data['target_lang']
    
    try:
        translated = translator.translate(text, src=source_lang, dest=target_lang)
        return jsonify({'translated_text': translated.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Use the PORT environment variable provided by Render, default to 5000 locally
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
