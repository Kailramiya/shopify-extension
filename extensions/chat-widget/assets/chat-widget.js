const path = require('path');
const express = require('express');
const app = express();

// Create toggle button
const button = document.createElement('button');
button.innerText = "💬";
button.style.position = 'fixed';
button.style.bottom = '20px';
button.style.right = '20px';
button.style.zIndex = 1000;
button.style.padding = '10px';
button.style.borderRadius = '50%';
button.style.border = 'none';
button.style.backgroundColor = '#008060';
button.style.color = 'white';
button.style.fontSize = '24px';
button.style.cursor = 'pointer';

// Chat box div
const chatBox = document.createElement('div');
chatBox.style.position = 'fixed';
chatBox.style.bottom = '70px';
chatBox.style.right = '20px';
chatBox.style.width = '300px';
chatBox.style.height = '400px';
chatBox.style.background = 'white';
chatBox.style.border = '1px solid #ccc';
chatBox.style.borderRadius = '8px';
chatBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
chatBox.style.display = 'none';
chatBox.innerText = 'Chat Widget UI Goes Here';

button.addEventListener('click', () => {
  chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
});

document.body.appendChild(button);
document.body.appendChild(chatBox);

// serve the extension assets directory at /extensions
app.use('/extensions', express.static(path.join(__dirname, '..', 'ai-assistant-1', 'extensions')));
