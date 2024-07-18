import express from 'express'
import 'dotenv/config'
const app = express()
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.send('Hello World')
})


mongoose.connect(`${process.env.BACKEND_MONGODBCONNECTION_URL}`, { useNewUrlParser: true,  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.listen(process.env.PORT,()=>{
    console.log(`express running on port ${process.env.PORT}`);
})

app.get('/',()=>{
  return "hello world"
})