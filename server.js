const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = [];

wss.on('connection', function connection(ws) {
  console.log('Koneksi baru berhasil!');
  
  clients.push(ws);

  ws.on('message', function incoming(message) {
    const receivedMessage = message.toString();
    console.log(`Menerima pesan: ${receivedMessage}`);
    
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(receivedMessage);
      }
    });
  });

  ws.on('close', function close() {
    console.log('Koneksi terputus');
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });

  ws.on('error', function error(err) {
    console.error('Terjadi kesalahan:', err);
  });
});

console.log('Server WebSocket berjalan di ws://localhost:8080');