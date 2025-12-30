
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
        console.log("Attempting PutObject with space in filename...");
        const response = await s3.send(new PutObjectCommand({
            Bucket: "mybucket",
            Key: "hello world.txt",
            Body: "Hello World"
        }));
        console.log("Success:", response);
    } catch (err) {
        console.error("Error:", err);
        if (err.Code === 'SignatureDoesNotMatch') {
            // The debug info is in the response body, which AWS SDK puts in .message usually, 
            // or check err.$response.body if possible.
            // But my code puts it in the XML Message field, which SDK parses into err.message.
            // It might be truncated or formatted.
            console.log("Full Error Message:", err.message);
        }
    }
}

main();
