//compressor.ts

// function to compress all the static files that need to be served
// add 1 year cache headers
async function compressor(filePath: string) {
    try {
        // read file
        const file = Bun.file(filePath);
        // get "Content-Type"
        const contentType = new Response(file).headers.get("Content-Type");
        // convert file to single unsigned int byte array and compress
        const compressed = Bun.gzipSync(new Uint8Array(await file.arrayBuffer()));
        // create response content with header
        return new Response(compressed, {
            headers: {
                "Content-Type": contentType ?? "application/octet-stream",
                "Content-Encoding": "gzip",
                "Cache-Control": "public, max-age=31536000, immutable",
                "CDN-Cache-Control": "max-age=31536000",
                "Vary": "Accept-Encoding",
                "ETag": `"${Buffer.from(compressed).toString('base64').substring(0, 27)}"`,
            },
        });
        /*
        return new Response(compressed, {
            headers: {
                "Content-Type": contentType ?? "application/octet-stream",
                "Content-Encoding": "gzip",
            },
        });
        */
    } catch (error) {
        console.error(`Error compressing ${filePath}:`, error);
        return new Response(`Internal Server Error, ${{ status: 500 }}`);
    }
}

export default compressor;
