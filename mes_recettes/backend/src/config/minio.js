const { Client } = require('minio');

const minioClient = new Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

const BUCKET = process.env.MINIO_BUCKET;

// Upload un buffer image vers MinIO et retourne l'URL publique
async function uploadImage(buffer, filename, mimetype) {
  await minioClient.putObject(BUCKET, filename, buffer, buffer.length, {
    'Content-Type': mimetype,
  });
  return `http://localhost:9000/${BUCKET}/${filename}`;
}

module.exports = { uploadImage };