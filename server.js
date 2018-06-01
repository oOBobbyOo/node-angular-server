const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const port = process.env.port || 3000;
const api = require('./routers/api');

app.use(cors())
app.use(bodyParser.json());
app.use('/api', api)

app.get('/', (req, res) => {
  res.send('hello from server');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
})




