// encoder.ts


// encode as route
function encoder(name: string) {
    //if (!name) return "unknown";
    
    // Convert to lowercase for consistency
    // Instead of URL encoding, replace problematic characters with hyphens
    // This is more route-friendly and prevents double-encoding issues
    // Handle Type: Null and other colon-containing names
    // Replace spaces with hyphens instead of %20
    // Replace apostrophes with empty string or hyphen
    // Replace other problematic characters
    // female symbol
    // male symbol                name = name.replaceAll(":", "-");
    // accented e in Flabébé
    // question mark in Farfetch'dname = name.replaceAll(" ", "-");
    // Remove any remaining unsafe URL characters
    // Avoid double-hyphens and clean up
    
    name = name.toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(":", "-")
        .replaceAll("'", "")
        .replaceAll("'", "")
        .replaceAll(".", "")
        .replaceAll("♀", "-f")
        .replaceAll("♂", "-m") 
        .replaceAll("é", "e")  
        .replaceAll("?", "")   
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/\-+/g, "-")
        .replace(/^\-|\-$/g, "");
    
    return name;
}

export default encoder;

/*
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
*/

/*
function encoder2(name: string) {
    if (!name) return "unknown";
    
    // Convert to lowercase for consistency
    name = name.toLowerCase();
    
    // Instead of URL encoding, replace problematic characters with hyphens
    // This is more route-friendly and prevents double-encoding issues
    
    // Handle Type: Null and other colon-containing names
    name = name.replaceAll(":", "-");
    
    // Replace spaces with hyphens instead of %20
    name = name.replaceAll(" ", "-");
    
    // Replace apostrophes with empty string or hyphen
    name = name.replaceAll("'", "");
    name = name.replaceAll("'", "");
    
    // Replace other problematic characters
    name = name.replaceAll(".", "");
    name = name.replaceAll("♀", "-f"); // female symbol
    name = name.replaceAll("♂", "-m"); // male symbol
    name = name.replaceAll("é", "e");  // accented e in Flabébé
    name = name.replaceAll("?", "");   // question mark in Farfetch'd
    
    // Remove any remaining unsafe URL characters
    name = name.replace(/[^a-z0-9\-]/g, "");
    
    // Avoid double-hyphens and clean up
    name = name.replace(/\-+/g, "-");
    name = name.replace(/^\-|\-$/g, "");
    
    return name;
}
*/
