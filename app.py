from flask import Flask, render_template, request, send_file, jsonify
import fitz  # PyMuPDF
import os
import uuid
import shutil

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['RESULT_FOLDER'] = 'converted'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Sadece uygulama başlarken cache temizlensin
if os.path.exists(app.config['RESULT_FOLDER']):
    shutil.rmtree(app.config['RESULT_FOLDER'])
os.makedirs(app.config['RESULT_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert():
    pdf_files = request.files.getlist('pdf_files')
    page_limits = request.form.getlist('page_limits')
    download_urls = []

    for idx, pdf in enumerate(pdf_files):
        try:
            page_limit = int(page_limits[idx])
        except:
            page_limit = None

        filename = f"{uuid.uuid4().hex[:8]}.pdf"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        pdf.save(filepath)

        try:
            doc = fitz.open(filepath)
        except Exception:
            continue

        max_pages = len(doc)
        if page_limit is None or page_limit > max_pages:
            page_limit = max_pages

        base = os.path.splitext(pdf.filename)[0]
        for i in range(page_limit):
            try:
                page = doc.load_page(i)
                pix = page.get_pixmap(dpi=600)

                if i == 0:
                    filename_out = f"{base}.png"
                else:
                    filename_out = f"{base}_{i+1}.png"

                out_path = os.path.join(app.config['RESULT_FOLDER'], filename_out)
                pix.save(out_path)

                download_urls.append(f"/download/{filename_out}")
            except Exception:
                continue

        doc.close()
        os.remove(filepath)

    return jsonify({"urls": download_urls})

@app.route('/download/<filename>')
def download_file(filename):
    path = os.path.join(app.config['RESULT_FOLDER'], filename)
    if not os.path.exists(path):
        return "Dosya bulunamadı", 404
    return send_file(path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
