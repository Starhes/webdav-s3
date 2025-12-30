
async function main() {
    const url = 'http://127.0.0.1:8790/mybucket/test%20space.txt';
    const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');

    // Create a dummy auth header to force strict structure parsing
    const authHeader = `AWS4-HMAC-SHA256 Credential=test/${date.slice(0, 8)}/us-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=0000000000000000000000000000000000000000000000000000000000000000`;

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': authHeader,
                'x-amz-date': date,
                'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
                // Host header is automatically set by fetch, but we can override if needed to match signature
                // But here we signed 'host' so we need to ensure the value matches. 
                // Fetch might add port. 
            },
            body: 'test'
        });

        const text = await res.text();
        console.log("Status:", res.status);
        const fs = await import('fs');
        fs.writeFileSync('debug_output.txt', text);
        console.log("Written to debug_output.txt");
    } catch (e) {
        console.error(e);
    }
}

main();
