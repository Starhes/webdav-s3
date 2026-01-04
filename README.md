# WebDAV to S3 Gateway

A Cloudflare Pages Function that acts as an S3-compatible gateway to your WebDAV storage. This allows you to use S3 clients (like AWS CLI, rclone, or S3-compatible apps) to store and retrieve files on any WebDAV server (e.g., Nextcloud, ownCloud, InfiniCLOUD).

## Features

- **S3 API Compatibility**: Supports core S3 operations:
  - `PutObject` (Upload)
  - `GetObject` (Download)
  - `DeleteObject` (Delete)
  - `ListBucket` (List objects)
  - `HeadObject` (Metadata)
- **Streaming Support**: Efficiently streams files between WebDAV and the client without buffering entire files in memory.
- **Cache Control**: Configurable `Cache-Control` headers for downloads.
- **AWS Signature V4**: Fully implements AWS Signature V4 authentication verification.
- **Cloudflare Pages**: Runs on Cloudflare's edge network for low latency and high availability.

## Prerequisites

- A Cloudflare account
- NodeJS installed (for deployment via Wrangler)
- A WebDAV server account

## Deployment

### Option 1: Deploy via Wrangler (CLI)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Starhes/webdav2s3.git
   cd webdav2s3
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Secrets**:
   Set the following secrets in your Cloudflare Pages project. **DO NOT** commit these to source control.

   ```bash
   # Your WebDAV Server URL
   npx wrangler pages secret put WEBDAV_URL

   # Your WebDAV Username
   npx wrangler pages secret put WEBDAV_USERNAME

   # Your WebDAV Password
   npx wrangler pages secret put WEBDAV_PASSWORD

   # Define your own S3 Access Key ID (any string you want to use as username)
   npx wrangler pages secret put S3_ACCESS_KEY_ID

   # Define your own S3 Secret Access Key (any string you want to use as password)
   npx wrangler pages secret put S3_SECRET_ACCESS_KEY

   # Define a Region (e.g., "us-east-1")
   npx wrangler pages secret put S3_REGION
   ```

4. **Deploy**:
   ```bash
   npx wrangler pages deploy ./public --project-name your-project-name
   ```

### Option 2: Deploy via Cloudflare Dashboard

1. Connect your GitHub repository to Cloudflare Pages.
2. In the setup configuration:
   - **Build command**: `npm run build` (optional, as this is a Functions project)
   - **Build output directory**: `public`
3. Add the **Environment Variables** (Secrets) in the Pages settings:
   - `WEBDAV_URL`
   - `WEBDAV_USERNAME`
   - `WEBDAV_PASSWORD`
   - `S3_ACCESS_KEY_ID`
   - `S3_SECRET_ACCESS_KEY`
   - `S3_REGION`

## Configuration

You can configure non-sensitive settings in `wrangler.toml` or via Environment Variables.

| Variable | Description | Default |
|----------|-------------|---------|
| `CACHE_MAX_AGE` | Duration in seconds for `Cache-Control: public, max-age=N` header on downloads. | `15552000` (180 days) |

## Usage

Configure your S3 client to point to your deployed Cloudflare Pages URL.

### AWS CLI Example

```bash
# Configure environment variables
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_DEFAULT_REGION="us-east-1"

# Upload a file
aws s3 cp test.txt s3://my-bucket/test.txt --endpoint-url https://your-project.pages.dev

# List files
aws s3 ls s3://my-bucket/ --endpoint-url https://your-project.pages.dev

# Download a file
aws s3 cp s3://my-bucket/test.txt local.txt --endpoint-url https://your-project.pages.dev
```

## How It Works

1. **Request**: S3 Client sends a signed S3 request to Cloudflare Pages.
2. **Verification**: The Worker verifies the AWS Signature V4 using your configured credentials.
3. **Translation**: The Worker translates the S3 request into a corresponding WebDAV request.
4. **Forwarding**: The request is sent to your WebDAV server.
5. **Response**: The WebDAV response is translated back to an S3-compatible XML response and returned to the client.

## License

MIT
