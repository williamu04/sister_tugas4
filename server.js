const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');
const fs = require('fs');
const AWS = require('aws-sdk');

const app = express();
const server = http.createServer(app);

// Gunakan server HTTP untuk WebSocket
const wss = new WebSocket.Server({ server });
app.use(express.static('public'));

// // === MinIO config ===
// const s3 = new AWS.S3({
//   endpoint: 'http://localhost:9000',   
//   accessKeyId: 'admin',
//   secretAccessKey: 'password123',
//   s3ForcePathStyle: true,
//   signatureVersion: 'v4'
// });
// const BUCKET_NAME = 'chat-files';
// const upload = multer({ dest: 'uploads/' });

// // Pastikan bucket ada
// s3.createBucket({ Bucket: BUCKET_NAME }, (err) => {
//   if (err && err.code !== 'BucketAlreadyOwnedByYou') {
//     console.error('Bucket error:', err);
//   } else {
//     console.log(`Bucket ${BUCKET_NAME} siap dipakai`);
//   }
// });

// === WebSocket Chat ===
const clients = [];

wss.on('connection', (ws) => {
  console.log('Koneksi baru berhasil!');
  clients.push(ws);

  ws.on('message', (message) => {
    const receivedMessage = message.toString();
    console.log(`Menerima pesan: ${receivedMessage}`);

    // broadcast ke semua client lain
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(receivedMessage);
      }
    });
  });

  ws.on('close', () => {
    console.log('Koneksi terputus');
    const index = clients.indexOf(ws);
    if (index > -1) clients.splice(index, 1);
  });

  ws.on('error', (err) => console.error('WS error:', err));
});

// // === Endpoint Upload File ke MinIO ===
// app.post('/upload', upload.single('file'), (req, res) => {
//   const file = req.file;
//   const fileStream = fs.createReadStream(file.path);

//   s3.upload({
//     Bucket: BUCKET_NAME,
//     Key: file.originalname,
//     Body: fileStream
//   }, (err, data) => {
//     fs.unlinkSync(file.path); // hapus file lokal
//     if (err) return res.status(500).send('Upload gagal: ' + err);
//     res.send(`File berhasil diupload: ${data.Location}`);
//   });
// });

// // List file
// app.get('/files', (req, res) => {
//   s3.listObjectsV2({ Bucket: BUCKET_NAME }, (err, data) => {
//     if (err) return res.status(500).send(err);
//     res.json(data.Contents.map(f => f.Key));
//   });
// });

// // Download file
// app.get('/download/:filename', (req, res) => {
//   const filename = req.params.filename;
//   s3.getObject({ Bucket: BUCKET_NAME, Key: filename })
//     .createReadStream()
//     .pipe(res);
// });

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
