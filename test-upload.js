
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function main() {
    const s3 = new S3Client({
        region: "us-east-1",
        endpoint: "http://127.0.0.1:8788",
        credentials: {
            accessKeyId: "test",
            secretAccessKey: "test"
        },
        forcePathStyle: true
    });

    try {
        console.log("Attempting PutObject...");
        const response = await s3.send(new PutObjectCommand({
            Bucket: "mybucket",
            Key: "hello.txt",
            Body: "Hello World"
        }));
        console.log("Success:", response);
    } catch (err) {
        console.error("Error:", err);
        if (err.Code === 'SignatureDoesNotMatch') {
            console.error("Debug Info:", err.message);
        }
    }
}

main();
