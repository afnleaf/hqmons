// index.ts
/* 2026 04 12 - Pokemon ZA/Champions Update
* 
* added all new mega form images, but they are limited to the 530 by 530 sizes
* removed the 1024 image size, no reason to have it, either you get 256 or full
*/

// node modules
import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import parse from "csv-simple-parser";
// src modules
import compressor from "./compressor.ts";
import encoder from "./encoder.ts";

const PORT = process.env.PORT || 5555;
 
// parse csv file with binds
const filePath = "./src/dict.csv";
const dictFile = Bun.file(filePath);
type pokepath = { 
    name: string, 
    file: string 
};
const csv: pokepath[] = parse(await dictFile.text(), {header: true}) as pokepath[];

// make elysia server
const server = new Elysia();
// key for headers
server.use(html());

// serve index
server.get("/", () => compressor("./public/index.html"));
server.get("/styles.css", () => compressor("./public/styles.css"));
// putting the htmx file through the compressor mangles it via Elysia headers
//server.get("/htmx", () => compressor("./public/htmx.min.js"));
//server.get("/htmx", () => Bun.file("./public/htmx.min.js"));
// htmx loaded from CDN in index.html

// make routes based on csv file
const listRoutesFull: string[] = [];
const listRoutes256: string[] = [];
const dirPathFull = "./art/pokemon_art/";
const dirPath256 = "./art/pokemon_art_256/";
for(const row of csv) {
    if (!row.name || !row.file) {
        console.log(`Skipping invalid row: ${JSON.stringify(row)}`);
        continue;
    }
    //console.log(row);
    // get name of pokemon
    let name: string = row.name.toLowerCase().toString();
    // encode name as route, removing bad characters
    name = encoder(name);
    // create route paths
    const routePathFull: string = `/full/${name}`;
    const routePath256: string = `/256/${name}`;
    // add routes to list
    listRoutesFull.push(routePathFull);
    listRoutes256.push(routePath256);
    // create filepaths
    const filePathFull: string = `${dirPathFull}${row.file}`;
    const filePath256: string = `${dirPath256}${row.file}`;
    // create server routes
    server.get(routePathFull, () => compressor(filePathFull));
    server.get(routePath256, () => compressor(filePath256));
    //server.get(routePath, () => Bun.file(filePath));
    // print
    console.log(`route: ${routePathFull} for ${filePathFull}`);
    console.log(`route: ${routePath256} for ${filePath256}`);
}

server.get("/full", () => {
    let html: string = ``;
    html += `<div hx-boost="true"><h1>Index of /pokemon_art/</h1><hr><pre hx-boost="false">`;
    //html += `<a href="/home" hx-get="/home" hx-target="#content">../</a><br>`;
    html += `<a href="/">../</a><br>`;
    listRoutesFull.forEach(route => {
        html += `<a href="${route}">${route}</a><br>`;
    });
    html += `</pre><hr></div>`;
    return html;
    //return new Response(compressor(html));
});

server.get("/256", () => {
    let html: string = ``;
    html += `<div hx-boost="true"><h1>Index of /pokemon_art_256/</h1><hr><pre hx-boost="false">`;
    //html += `<a href="/home" hx-get="/home" hx-target="#content">../</a><br>`;
    html += `<a href="/">../</a><br>`;
    listRoutes256.forEach(route => {
        html += `<a href="${route}">${route}</a><br>`;
    });
    html += `</pre><hr></div>`;
    return html;
    //return new Response(compressor(html));
});

// post request to return encoded route
// curl -X POST http://localhost:4444/getroute -H "Content-Type: text/plain" -d 'flutter mane'
// curl.exe -X POST http://localhost:4444/getroute -H "Content-Type: text/plain" -d 'flutter mane'
server.post("/getroute", async (content) => {
    //return encoder(await content.request.text());
    return new Response(encoder(await content.request.text()), {
        headers: {
            "Cache-Control": "no-store"
        }
    });
});

// port
server.listen(PORT)

// hello we up
console.log(
    `Frontend is running at http://${server.server?.hostname}:${server.server?.port}`
);
