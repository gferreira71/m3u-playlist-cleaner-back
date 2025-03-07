## M3u Playlist Cleaner - Server

A simple nodejs application to download and retrieve a m3u file from a URL, used by the [m3u Playlist Cleaner app][frontrepo].

### What is inside

The application contains only 2 endpoints that are both designed to be specifically used for the [Playlist Cleaner app][applink].

It contains the following endpoints :
- */health* to get the status of the server and make sure that the file dowload is available.
- */get-file* to get the URL, check if it's a valid .m3u or .m3u8 file and send it ready to be unsed by the app.

[frontrepo]: https://github.com/gferreira71/m3u-playlist-cleaner
[applink]: https://m3u.guillaumeferreira.com