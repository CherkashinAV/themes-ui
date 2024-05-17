import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import secrets from '../secrets/secrets.json'
import {
	getSignedUrl
} from "@aws-sdk/s3-request-presigner";

// Установка региона Object Storage
const REGION = "ru-central1";
// Установка эндпоинта Object Storage
const ENDPOINT = "https://storage.yandexcloud.net";
// Создание клиента для Object Storage
const s3Client = new S3Client({ region: REGION, endpoint: ENDPOINT, credentials: {
	accessKeyId: secrets.s3AccessKeyId,
	secretAccessKey: secrets.s3AccessKey
}});

export const getDownloadLink = (bucket: string, key: string) => {
	const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  	return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export {s3Client};