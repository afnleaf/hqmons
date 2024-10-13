// node modules
import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import parse from "csv-simple-parser";
// src modules
import compressor from "./compressor.ts";
import encoder from "./encoder.ts";

const PORT = process.env.PORT || 4444;
 
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
server.get("/htmx", () => compressor("./public/htmx.min.js"));

// make routes based on csv file
const listRoutesFull: string[] = [];
const listRoutes1024: string[] = [];
const listRoutes256: string[] = [];
const dirPathFull = "./pokemon_art/";
const dirPath1024 = "./pokemon_art_1024/";
const dirPath256 = "./pokemon_art_256/";
for(const row of csv) {
    //console.log(row);
    // get name of pokemon
    let name: string = row.name.toLowerCase().toString();
    // encode name as route, removing bad characters
    name = encoder(name);
    // create route paths
    const routePathFull: string = `/full/${name}`;
    const routePath1024: string = `/1024/${name}`;
    const routePath256: string = `/256/${name}`;
    // add routes to list
    listRoutesFull.push(routePathFull);
    listRoutes1024.push(routePath1024);
    listRoutes256.push(routePath256);
    // create filepaths
    const filePathFull: string = `${dirPathFull}${row.file}`;
    const filePath1024: string = `${dirPath1024}${row.file}`;
    const filePath256: string = `${dirPath256}${row.file}`;
    // create server routes
    server.get(routePathFull, () => compressor(filePathFull));
    server.get(routePath1024, () => compressor(filePath1024));
    server.get(routePath256, () => compressor(filePath256));
    //server.get(routePath, () => Bun.file(filePath));
    // print
    console.log(`route: ${routePathFull} for ${filePathFull}`);
    console.log(`route: ${routePath1024} for ${filePath1024}`);
    console.log(`route: ${routePath256} for ${filePath256}`);
}

// create html the old fashioned way
/*
server.get("/home", () => {
    let html: string = ``;
    html += `<h1>Index of server</h1><hr><pre>`;
    html += `<a href="/full">/full</a><br>`;
    html += `<a href="/1024">/1024</a><br>`;
    html += `<a href="/256">/256</a><br>`;
    html += `</pre><hr>`;
    return html;
});
*/
server.get("/home", () => {
    let html: string = ``;
    html += `<div hx-boost="true"><h1>Index of server</h1><hr><pre>`;
    //html += `<a href="/full" hx-get="/full" hx-target="#content">/full</a><br>`;
    //html += `<a href="/1024" hx-get="/1024" hx-target="#content">/1024</a><br>`;
    //html += `<a href="/256" hx-get="/256" hx-target="#content">/256</a><br>`;
    html += `<a href="/full">/full</a><br>`;
    html += `<a href="/1024">/1024</a><br>`;
    html += `<a href="/256">/256</a><br>`;
    html += `</pre><hr></div>`;
    return html;
});

server.get("/full", () => {
    let html: string = ``;
    html += `<div hx-boost="true"><h1>Index of /pokemon_art/</h1><hr><pre hx-boost="false">`;
    //html += `<a href="/home" hx-get="/home" hx-target="#content">../</a><br>`;
    html += `<a href="/home">../</a><br>`;
    listRoutesFull.forEach(route => {
        html += `<a href="${route}">${route}</a><br>`;
    });
    html += `</pre><hr></div>`;
    return html;
});

server.get("/1024", () => {
    let html: string = ``;
    html += `<div hx-boost="true"><h1>Index of /pokemon_art_1024/</h1><hr><pre hx-boost="false">`;
    //html += `<a href="/home" hx-get="/home" hx-target="#content">../</a><br>`;
    html += `<a href="/home">../</a><br>`;
    listRoutes1024.forEach(route => {
        html += `<a href="${route}">${route}</a><br>`;
    });
    html += `</pre><hr></div>`;
    return html;
});

server.get("/256", () => {
    let html: string = ``;
    html += `<div hx-boost="true"><h1>Index of /pokemon_art_256/</h1><hr><pre hx-boost="false">`;
    //html += `<a href="/home" hx-get="/home" hx-target="#content">../</a><br>`;
    html += `<a href="/home">../</a><br>`;
    listRoutes256.forEach(route => {
        html += `<a href="${route}">${route}</a><br>`;
    });
    html += `</pre><hr></div>`;
    return html;
});

// post request to return encoded route
// curl -X POST http://localhost:4444/getroute -H "Content-Type: text/plain" -d 'flutter mane'
// curl.exe -X POST http://localhost:4444/getroute -H "Content-Type: text/plain" -d 'flutter mane'
server.post("/getroute", async (content) => {
    return encoder(await content.request.text());
});

// port
server.listen(PORT)

// hello we up
console.log(
    `Frontend is running at http://${server.server?.hostname}:${server.server?.port}`
);
