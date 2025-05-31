import os
os.environ["XDG_CACHE_HOME"] = "/tmp/.cache"

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import whisper 



app = FastAPI()

# Autoriser toutes les origines (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
)

# Chargement du modèle 
model = whisper.load_model("medium") 

@app.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    # Créer le dossier s'il n'existe pas
    os.makedirs("/tmp/temp_audio", exist_ok=True)


    # Définir le chemin du fichier temporaire    
    file_path = f"/tmp/temp_audio/{file.filename}"

    # Sauvegarder le fichier téléchargé
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Transcrire l'audio 
    result = model.transcribe(file_path)
    transcription = result["text"]

    #Supprimer le fichier après transcription pour la bon utilisation du mémoire
    os.remove(file_path)

    return {
        "filename": file.filename,
        "transcription": transcription
    }