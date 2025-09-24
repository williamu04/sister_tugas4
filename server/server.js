// server.js
const WebSocket = require('ws');

// Inisialisasi WebSocket server pada port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Array untuk menyimpan semua koneksi klien yang aktif
const clients = [];

// Event listener saat ada koneksi baru
wss.on('connection', function connection(ws) {
  console.log('Koneksi baru berhasil!');
  
  // Tambahkan koneksi baru ke daftar klien
  clients.push(ws);

  // Event listener saat server menerima pesan dari klien
  ws.on('message', function incoming(message) {
    const receivedMessage = message.toString();
    console.log(`Menerima pesan: ${receivedMessage}`);
    
    // Kirim pesan ke semua klien lain yang terhubung
    clients.forEach(client => {
      // Pastikan klien dalam keadaan 'buka' sebelum mengirim pesan
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(receivedMessage);
      }
    });
  });

  // Event listener saat koneksi ditutup
  ws.on('close', function close() {
    console.log('Koneksi terputus');
    // Hapus koneksi yang terputus dari daftar klien
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });

  // Event listener untuk error
  ws.on('error', function error(err) {
    console.error('Terjadi kesalahan:', err);
  });
});

console.log('Server WebSocket berjalan di ws://localhost:8080');