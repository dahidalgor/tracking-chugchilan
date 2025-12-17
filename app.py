from flask import Flask, request, jsonify, send_from_directory
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='frontend', static_url_path='')

# Configuración CORRECTA de la carpeta de uploads
# Las imágenes deben guardarse en frontend/data/img/Guias/
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'frontend', 'data', 'img', 'Guias')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Crear directorio si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
print(f"Upload folder set to: {UPLOAD_FOLDER}")

# Ruta para servir archivos estáticos
@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')

@app.route('/admin')
def admin():
    return send_from_directory('frontend', 'admin.html')

# Endpoint para obtener guías
@app.route('/api/guides', methods=['GET'])
def get_guides():
    guides_path = os.path.join('frontend', 'data', 'guides', 'guides.json')
    try:
        with open(guides_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para crear un nuevo guía
@app.route('/api/guides', methods=['POST'])
def create_guide():
    try:
        new_guide = request.json
        guides_path = os.path.join('frontend', 'data', 'guides', 'guides.json')
        
        with open(guides_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Asignar ID automáticamente
        if data['guides']:
            new_id = max(g['id'] for g in data['guides']) + 1
        else:
            new_id = 1
        
        new_guide['id'] = new_id
        data['guides'].append(new_guide)
        
        with open(guides_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return jsonify({'success': True, 'guide': new_guide})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para actualizar un guía
@app.route('/api/guides/<int:guide_id>', methods=['PUT'])
def update_guide(guide_id):
    try:
        updated_guide = request.json
        guides_path = os.path.join('frontend', 'data', 'guides', 'guides.json')
        
        with open(guides_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Encontrar y actualizar
        for i, guide in enumerate(data['guides']):
            if guide['id'] == guide_id:
                data['guides'][i] = updated_guide
                break
        
        with open(guides_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return jsonify({'success': True, 'guide': updated_guide})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para eliminar un guía
@app.route('/api/guides/<int:guide_id>', methods=['DELETE'])
def delete_guide(guide_id):
    try:
        guides_path = os.path.join('frontend', 'data', 'guides', 'guides.json')
        
        with open(guides_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Filtrar
        original_count = len(data['guides'])
        data['guides'] = [g for g in data['guides'] if g['id'] != guide_id]
        
        if len(data['guides']) == original_count:
            return jsonify({'error': 'Guide not found'}), 404
        
        with open(guides_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para subir imagen - CORREGIDO
@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file:
            # Asegurar nombre seguro
            filename = secure_filename(file.filename)
            
            # Crear nombre único para evitar sobrescribir
            name, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
                filename = f"{name}_{counter}{ext}"
                counter += 1
            
            # Guardar archivo
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Devolver ruta relativa correcta para el frontend
            # IMPORTANTE: Esta ruta debe coincidir con cómo se accede desde el frontend
            relative_path = f"./data/img/Guias/{filename}"
            
            print(f"Imagen guardada en: {filepath}")
            print(f"Ruta relativa devuelta: {relative_path}")
            
            return jsonify({
                'success': True,
                'path': relative_path,
                'filename': filename
            })
    
    except Exception as e:
        print(f"Error en upload_image: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Servir archivos estáticos desde la carpeta frontend/data
@app.route('/data/<path:path>')
def serve_data(path):
    return send_from_directory('frontend/data', path)

if __name__ == '__main__':
    print("Starting Flask server on port 3000...")
    print(f"Upload folder: {app.config['UPLOAD_FOLDER']}")
    print(f"Upload folder exists: {os.path.exists(app.config['UPLOAD_FOLDER'])}")
    app.run(debug=True, port=3000)