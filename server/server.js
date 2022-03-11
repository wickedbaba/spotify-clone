const { json, response } = require('express');
const express = require('express');
const cors =  require('cors');
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require("lyrics-finder")

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/refresh', (req, res) => {

    const refreshToken  = req.body.refreshToken
    const SpotifyApi = new SpotifyWebApi({

        redirectUri : 'http://localhost:3000',
        clientId : '1ad242363b9e4cda9200993251f8ed6e',
        clientSecret : '1ee360ad9ce141ceb30eb734dad9563a'
        refreshToken, 
    })

   // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
    spotifyApi
    .refreshAccessToken()
    .then( (data) => {
         res.json({
             accessToken : data.body.access_token,
             expiresIn : data.body.expires_in
         })
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
})

app.post('./login', (req,res) =>{
    const code = req.body.code

    const SpotifyApi = new SpotifyWebApi({

        redirectUri : 'http://localhost:3000',
        clientId : '1ad242363b9e4cda9200993251f8ed6e',
        clientSecret : '1ee360ad9ce141ceb30eb734dad9563a'
    })

    SpotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch((err) =>{
            console.log(err)
            res.sendStatus(400)
        })

})

app.get("/lyrics", async (req, res) => {
    const lyrics =
      (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
  })

app.listen(3001)