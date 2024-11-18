document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

let map;
let userMarker;

// Inicjalizacja mapy satelitarnej
function initMap() {
    map = L.map('map').setView([52.2297, 21.0122], 13); // Początkowa lokalizacja

    // Użycie warstwy satelitarnej Esri
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);
}

// Obsługa lokalizacji użytkownika
document.getElementById('locateBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);

            if (userMarker) {
                userMarker.setLatLng([latitude, longitude]);
            } else {
                userMarker = L.marker([latitude, longitude]).addTo(map)
                    .bindPopup("Twoja lokalizacja")
                    .openPopup();
            }
        }, error => {
            alert("Nie udało się uzyskać lokalizacji: " + error.message);
        });
    } else {
        alert("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
    }
});

// Pobieranie mapy i generowanie puzzli
document.getElementById('downloadMapBtn').addEventListener('click', () => {
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error("Błąd przy przechwytywaniu obrazu mapy:", err);
            return;
        }
        
        // Wyświetlenie podglądu obrazu w sekcji `originalImage`
        const originalImageContainer = document.getElementById('originalImage');
        originalImageContainer.innerHTML = ''; // Wyczyść zawartość, jeśli istnieje
        originalImageContainer.appendChild(canvas);

        // Generowanie puzzli z obrazu
        generatePuzzleFromCanvas(canvas);
    });
});

// Funkcja do generowania puzzli z wygenerowanego `canvas`
function generatePuzzleFromCanvas(canvas) {
    const pieceWidth = canvas.width / 4;
    const pieceHeight = canvas.height / 4;

    let tiles = [];
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const piece = document.createElement('canvas');
            piece.width = pieceWidth;
            piece.height = pieceHeight;
            const pieceCtx = piece.getContext('2d');
            pieceCtx.drawImage(canvas, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
            
            piece.dataset.correctX = x;
            piece.dataset.correctY = y;
            piece.draggable = true;
            piece.addEventListener('dragstart', dragStart);
            
            tiles.push(piece);
        }
    }
    
    shuffleArray(tiles);
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = '';
    tiles.forEach((tile, index) => {
        tile.dataset.index = index;
        puzzleContainer.appendChild(tile);
    });

    createDropTargets(pieceWidth, pieceHeight);
}

// Funkcja startowa dla drag-and-drop
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

// Pozwolenie na przeciąganie nad obszarem
function dragOver(e) {
    e.preventDefault();
}

// Obsługa upuszczania elementów
function drop(e) {
    e.preventDefault();
    const index = e.dataTransfer.getData('text/plain');
    const tile = document.querySelector(`[data-index="${index}"]`);

    // Pozwól na przenoszenie puzzli między obszarem początkowym i docelowym
    if (e.target.classList.contains("drop-target") || e.target.id === 'puzzleContainer') {
        e.target.innerHTML = ''; // Wyczyść zawartość celu (usuń poprzedni puzzel, jeśli istnieje)
        e.target.appendChild(tile); // Umieść nowy puzzel
        checkIfPuzzleComplete();
    }
}

// Tworzenie obszarów do upuszczania puzzli
function createDropTargets(pieceWidth, pieceHeight) {
    const dropArea = document.getElementById('dropArea');
    dropArea.innerHTML = '';
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const dropTarget = document.createElement('div');
            dropTarget.style.width = `${pieceWidth}px`;
            dropTarget.style.height = `${pieceHeight}px`;
            dropTarget.classList.add('drop-target');
            dropTarget.dataset.x = x;
            dropTarget.dataset.y = y;
            dropTarget.addEventListener('dragover', dragOver);
            dropTarget.addEventListener('drop', drop);
            dropArea.appendChild(dropTarget);
        }
    }
}

// Tasowanie puzzli
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Funkcja sprawdzająca czy puzzle są ułożone
function checkIfPuzzleComplete() {
    const tiles = document.querySelectorAll('#dropArea .drop-target canvas');
    const isComplete = tiles.length === 16 && Array.from(tiles).every(tile => {
        return tile.dataset.correctX == tile.parentElement.dataset.x && tile.dataset.correctY == tile.parentElement.dataset.y;
    });

    if (isComplete) {
        // Wyświetlenie komunikatu w konsoli
        console.log("Gratulacje! Ułożyłeś puzzle!");

        // Wyświetlenie powiadomienia systemowego, jeśli jest dostępne
        if (Notification.permission === "granted") {
            showNotification();
        } else if (Notification.permission !== "denied") {
            // Poproś o zgodę na wyświetlanie powiadomień, jeśli jeszcze nie zapytano
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showNotification();
                }
            });
        }

        // Alternatywnie: wyświetlenie alertu jako zapasowe powiadomienie
        alert("Gratulacje! Ułożyłeś puzzle!");
    }
}

// Funkcja do wyświetlenia powiadomienia
function showNotification() {
    const notification = new Notification("Gratulacje!", {
        body: "Ułożyłeś puzzle poprawnie!",
        icon: 'path_to_your_icon.png', // opcjonalnie: ścieżka do ikony dla powiadomienia
    });
    notification.onclick = () => {
        window.focus();
    };
}