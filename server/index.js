const express = require("express");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");
const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

require("dotenv").config();

const axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000";
app.set("port", port);

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js");
config.dev = !(process.env.NODE_ENV === "production");

app.get("/", async (req, res, next) => {
  if (req.query.hasOwnProperty("code")) {
    params = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: REDIRECT_URI,
      scope: "identify"
    };
    console.log(params);
    headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let response = null;
    try {
      response = await axios.post(
        "https://discordapp.com/api/v6/oauth2/token",
        null,
        { headers, params }
      );
    } catch (error) {
      console.log(error);
    }
    const token = response.data.access_token;
    const responseUserData = await axios.get(
      "https://discordapp.com/api/v6/users/@me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(responseUserData);
  }
  next();
});

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
