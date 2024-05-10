// node modules
import { Elysia } from "elysia";
import parse from "csv-simple-parser";
// src modules
import compressor from "./compressor.ts";

const PORT = process.env.PORT || 4444;
 
// parse csv file with binds
const filePath = "src/dict.csv";
const dictFile = Bun.file(filePath);
type pokepath = { 
    name: string, 
    file: string 
};
const csv: pokepath[] = parse(await dictFile.text(), {header: true}) as pokepath[];

// make elysia app
const app = new Elysia();

// serve index
app.get("/", () => compressor("./public/index.html"));

// make routes based on csv file
const listRoutes: string[] = [];
const dirPath = "./pokemon_art/";
for(const row of csv) {
    //console.log(row);
    let name: string = row.name.toLowerCase().toString();
    if(name.includes(" ")) {
        name = name.replace(" ", "%20");
    }
    if(name.includes("'")) {
        name = name.replace("'", "%27");
    }
    const routePath: string = `/${name}`;
    listRoutes.push(routePath);
    const filePath: string = `${dirPath}${row.file}`;
    console.log(`route: ${routePath} for ${filePath}`);
    app.get(routePath, () => compressor(filePath));
    //app.get(routePath, () => Bun.file(filePath));
}

// create the body the old fashioned way
app.get("/home", () => {
    let html: string = ``;
    html += `<h1>Index of /pokemon_art/</h1><hr><pre>`;
    listRoutes.forEach(route => {
        html += `<a href="${route}">${route}</a><br>`;
    });
    html += `</pre><hr>`;
    return html;
});



// port
app.listen(PORT)

// hello we up
console.log(
    `Frontend is running at  http://${app.server?.hostname}:${app.server?.port}`
);