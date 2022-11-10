const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors');
const port = process.env.PORT||5000;
require("dotenv").config();

app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.igfnd42.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    const db=client.db('service').collection('service');
    const reviews=client.db('service').collection('reviews')
    app.get('/', async (req,res)=>{
      const query={};
      const cursor=db.find(query);
      const service=await cursor.limit(3).toArray();
      res.send(service)
    })
    app.get('/showall',async(req,res)=>{
      const query={};
      const cursor=db.find(query);
      const service=await cursor.toArray();
      res.send(service)
    })
    app.get('/services/:id',async(req,res)=>{
      const {id}=req.params;
      const query={_id:ObjectId(id)};
      const query_comment={service_id:id}
      const services=await db.findOne(query);
      const cursor= reviews.find(query_comment)
      const comments=await cursor.toArray();
      res.send({services,comments})
    })
    app.post('/review', async (req, res) => {
      
      const myreview = req.body;
      console.log(myreview)
      const result = await reviews.insertOne(myreview);
      res.send(result);
    });
    app.post('/addService', async (req, res) => {
      
      const newService = req.body;
      console.log(newService)
      const result = await db.insertOne(newService);
      res.send(result);
    });
  }
  catch(err){
    
  }
  
}
run().catch(err=> console.log(err))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})