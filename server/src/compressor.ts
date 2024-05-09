// function to compress all the static files that need to be served
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
            },
        });
    } catch (error) {
        console.error(`Error compressing ${filePath}:`, error);
        return new Response(`Internal Server Error, ${{ status: 500 }}`);
    }
}

export default compressor;
