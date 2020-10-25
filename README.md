## Appland capture

A littile hacky project which uses Puppeteer, Express server and d3-appmap to fetch data save it in `local` db, render it on separate page and save as image using headless chrome.

To begin:

`npm install`

`npm run start`

```
GET / — renders an example page with dummy data.

GET /screenshot?url={url that responds with component diagram json}

POST /screenshot  {Accepts json as body of request}


```