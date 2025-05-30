const icons = document.querySelectorAll('.icon-select');
const sections = document.querySelectorAll('.input-section');

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        icons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
        const target = icon.getAttribute('data-target');
        sections.forEach(section => section.classList.toggle('active', section.id === target));
    });
});

// Recording audio
let mediaRecorder, audioChunks = [], audioBlob, audioURL, audioPlayer;
const startBtn = document.getElementById("startRec");
const stopBtn = document.getElementById("stopRec");
const playerWrapper = document.getElementById("recordedPlayer");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("recordProgress");
const downloadLink = document.getElementById("downloadLink");

startBtn.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioURL = URL.createObjectURL(audioBlob);
        audioPlayer = new Audio(audioURL);
        playerWrapper.classList.remove("d-none");
        downloadLink.href = audioURL;
        downloadLink.style.display = 'block';

        audioPlayer.ontimeupdate = () => {
            progress.style.width = (audioPlayer.currentTime / audioPlayer.duration) * 100 + "%";
        };
    };

    mediaRecorder.start();
    startBtn.classList.add("d-none");
    stopBtn.classList.remove("d-none");
};

stopBtn.onclick = () => {
    mediaRecorder.stop();
    startBtn.classList.remove("d-none");
    stopBtn.classList.add("d-none");
};

playBtn.onclick = e => {
    e.preventDefault();
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
};

// Upload audio
const uploadInput = document.getElementById("importedAudio");
const uploadWrapper = document.getElementById("uploadedPlayer");
const playUpload = document.getElementById("playUpload");
const uploadProgress = document.getElementById("uploadProgress");

uploadInput.addEventListener("change", () => {
    const file = uploadInput.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        const uploadAudio = new Audio(url);
        uploadWrapper.classList.remove("d-none");

        playUpload.onclick = e => {
            e.preventDefault();
            if (uploadAudio.paused) {
                uploadAudio.play();
                playUpload.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                uploadAudio.pause();
                playUpload.innerHTML = '<i class="fas fa-play"></i>';
            }
        };

        uploadAudio.ontimeupdate = () => {
            uploadProgress.style.width = (uploadAudio.currentTime / uploadAudio.duration) * 100 + "%";
        };
    }
});

// Form submit
document.getElementById("audioForm").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("afterSubmit").style.display = "block";
});