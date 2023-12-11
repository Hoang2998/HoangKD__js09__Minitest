const express  = require('express');
const app = express();
const bodyParser = require('body-parser')
const router = require('./api')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const cors = require('cors')
const whitelist = ["http://localhost:3008"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use('/', router)

app.listen(8080, () => {
    console.log('Server listening on port 8080');
})