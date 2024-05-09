# hqmons
web server for high quality pokemon artwork

## problem
```
we have 1341 high quality pokemon png files.
from 1.png to 1025.png, with names such as 1024-t.png (terapagos-terastal)
we want a static file server for all of these images
the routes need to be the names of the pokemon as found in the dex

/terapagos -> 1024.png
/terapagos-terastal -> 1024-t.png

This is so that the pokepastefix extension can do simple GET requests for the files based on the pokemon name. 

We can either make a large csv file and then do some scripting to help bind each route to a file.
Or we can rename the files and then create bindings to the route based on the filename minus the extension
Or we can make the extension add .png with the routes being .png

We decided to do the csv method.

Current issue: Conflicting routes or too many routes?

We checked /pikachu and /pikachu-starter, that works

too many? seems like we hit a limit at 996 routes
why?
```