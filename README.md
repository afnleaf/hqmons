# hqmons
Web server for high quality pokemon artwork.

## API
The basic get request you can make is `https://chiy.uk/full/bulbasaur`. This will return a png file of the pokemon bulbasaur. Pokemon names contain spaces and some weird apostrophes, these get encoded out of the images and replaced with `%20` or `%27` respectively.

You can make a post request to `https://chiy.uk/getroute` and get back the encoded pokemon name from which you can build a route to get back an image. It is important to use https because http requests get redirected and may cause issues with cloudflare getting in the middle.

Curl example:
```
Linux:
user@pc:~# curl -X POST https://chiy.uk/getroute -H "Content-Type: text/plain" -d 'flutter mane'
flutter%20mane

Windows:
PS C:\> curl.exe -X POST https://chiy.uk/getroute -H "Content-Type: text/plain" -d 'flutter mane'
flutter%20mane
```

An example usage for the /getroute api would be in combination with the smogon [dex](https://github.com/smogon/pokemon-showdown/blob/master/sim/DEX.md).

## Quality options
There are full quality (varying sizes), 1024x1024 and 256x256 resolution images found on the server, with the respective routes: `/full`, `/1024`, `/256`. 
