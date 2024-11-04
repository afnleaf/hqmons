// encoder.ts

function encoder(name: string) {
    if(name.includes(" ")) {
        name = name.replace(" ", "%20");
    }
    if(name.includes("’")) {
        name = name.replace("’", "%27");
    }
    if(name.includes("'")) {
        name = name.replace("'", "%27");
    }
    return name;
}

export default encoder;
