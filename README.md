# HQMONS

<img src="https://chiy.uk/256/chi-yu">

A simple web server for high quality pokemon artwork, hosted on [chiy.uk](https://chiy.uk)

In use as the image server for the [pokepastefix](https://github.com/afnleaf/pokepastefix) extension.

## API
The basic get request you can make is `https://chiy.uk/{size}/{pokemon-name}`, `https://chiy.uk/full/bulbasaur` 

This will return a png file of the pokemon bulbasaur <img src="https://chiy.uk/256/bulbasaur" width="32" height="32">. Pokemon names contain spaces and some other characters that don't work in URLs. These get encoded out of the images and replaced with a easily parsable character. See [encoder.ts](/server/src/encoder.ts)

You can make a post request to `https://chiy.uk/getroute` and get back the encoded pokemon name from which you can build a route to get back an image. It is important to use https because http requests get redirected and may cause issues with cloudflare getting in the middle.

Curl example:
```bash
Linux:
user@pc:~# curl -X POST https://chiy.uk/getroute -H "Content-Type: text/plain" -d 'flutter mane'
flutter-mane

Windows:
PS C:\> curl.exe -X POST https://chiy.uk/getroute -H "Content-Type: text/plain" -d 'flutter mane'
flutter-mane
```

An example usage for the /getroute api would be in combination with the [smogon dex](https://github.com/smogon/pokemon-showdown/blob/master/sim/DEX.md), which provides unencoded  pokemon names.

## Image Resolution 
There are full quality (varying sizes), 1024x1024 and 256x256 resolution images found on the server, with the respective routes: 
```
/full
/1024
/256
``` 
