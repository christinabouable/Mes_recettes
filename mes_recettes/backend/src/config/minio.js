const { Client } = require('minio');

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost';
const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000', 10);
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || `http://${MINIO_ENDPOINT}:${MINIO_PORT}`;

const minioClient = new Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: MINIO_USE_SSL,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

const BUCKET = process.env.MINIO_BUCKET;

// Upload un buffer image vers MinIO et retourne l'URL publique
async function uploadImage(buffer, filename, mimetype) {
  await minioClient.putObject(BUCKET, filename, buffer, buffer.length, {
    'Content-Type': mimetype,
  });
  return `${MINIO_PUBLIC_URL}/${BUCKET}/${filename}`;
}

module.exports = { uploadImage };