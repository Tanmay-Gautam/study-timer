let timerInterval;
let timerSeconds = 0;
const jsonBinUrl = 'https://api.jsonbin.io/v3/b/67128897ad19ca34f8bac7e8'; // Replace with your bin ID
const jsonBinKey = '$2a$10$BIaE1jtujFV0xnqOPVVLJOoRWYI29xVqq96SKqQqHPeKgGOybCckC'; // Replace with your master key
const iframe = document.querySelector('iframe');


async function updateBin(data) {
    const response = await fetch(jsonBinUrl, {
        method: 'PUT', // Use PUT to update the existing bin
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': jsonBinKey
        },
        body: JSON.stringify(data) // Send the updated data
    });

    if (response.ok) {
        const result = await response.json();
        console.log('Bin updated:', result);
    } else {
        console.error('Error updating bin:', response.statusText);
    }
}

function saveTimerData(duration) {
    const now = new Date();
    const timerData = {
        date: now.toISOString().split('T')[0], // YYYY-MM-DD
        startTime: new Date(now.getTime() - (duration * 1000)).toISOString().split('T')[1].slice(0, 8), // HH:MM:SS
        endTime: now.toISOString().split('T')[1].slice(0, 8), // HH:MM:SS
        duration: duration
    };

    // Fetch existing bin data first
    fetch(jsonBinUrl, {
        method: 'GET',
        headers: {
            'X-Master-Key': jsonBinKey
        }
    })
    .then(response => response.json())
    .then(existingData => {
        // Append new timer data to existing data
        const updatedData = {
            timers: [...existingData.record.timers, timerData]
        };
        updateBin(updatedData); // Update the bin with new data
    })
    .catch(error => {
        console.error('Error fetching existing bin data:', error);
    });
}

document.getElementById('start-timer').addEventListener('click', function () {
    timerInterval = setInterval(() => {
        timerSeconds++;
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        document.getElementById('timer').innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
    this.style.display = 'none'; // Hide start button
    document.getElementById('stop-timer').style.display = 'inline-block'; // Show stop button
});

document.getElementById('stop-timer').addEventListener('click', function () {
    clearInterval(timerInterval);
    saveTimerData(timerSeconds); // Save timer data when stopped
    timerSeconds = 0; // Reset timer
    document.getElementById('timer').innerText = '00:00';
    document.getElementById('start-timer').style.display = 'inline-block'; // Show start button
    this.style.display = 'none'; // Hide stop button
});

window.onload = function() {
    const iframe = document.getElementById('iframe');
    if (iframe) {
        iframe.onload = function() {
            const iframeDoc = iframe.contentDocument;
            const logo = iframeDoc.querySelector('.logo');
            console.log(iframeDoc, iframe, logo);
            
            if (logo) {
                logo.style.display = 'none';
            }
        };
    } else {
        console.error('Iframe not found');
    }
};
