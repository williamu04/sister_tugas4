const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

// Gunakan server HTTP untuk WebSocket
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

const clients = [];

wss.on('connection', (ws) => {
  console.log('Koneksi baru berhasil!');

  clients.push(ws);

  ws.on('message', (message) => {
    const receivedMessage = message.toString();
    console.log(`Menerima pesan: ${receivedMessage}`);

    // Broadcast ke semua client lain
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(receivedMessage);
      }
    });
  });

  ws.on('close', () => {
    console.log('Koneksi terputus');
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });

  ws.on('error', (err) => {
    console.error('Terjadi kesalahan:', err);
  });
});

// Render akan kasih PORT lewat env
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
