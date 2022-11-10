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
    // for service table
    const db=client.db('service').collection('service');
    // for review table
    const reviews=client.db('service').collection('reviews')

    // only 3 service load by default
    app.get('/', async (req,res)=>{
      const query={};
      const cursor=db.find(query);
      const service=await cursor.limit(3).toArray();
      res.send(service)
    })

    // load all services
    app.get('/showall',async(req,res)=>{
      const query={};
      const cursor=db.find(query);
      const service=await cursor.toArray();
      res.send(service)
    })

    // load service details with reviews
    app.get('/services/:id',async(req,res)=>{
      const {id}=req.params;
      const query={_id:ObjectId(id)};
      const query_comment={service_id:id}
      const services=await db.findOne(query);
      const cursor= reviews.find(query_comment)
      const comments=await cursor.toArray();
      res.send({services,comments})
    })

    // insert reviews
    app.post('/review', async (req, res) => {
      
      const myreview = req.body;
      console.log(myreview)
      const result = await reviews.insertOne(myreview);
      res.send(result);
    });

    // insert service
    app.post('/addService', async (req, res) => {
      
      const newService = req.body;
      console.log(newService)
      const result = await db.insertOne(newService);
      res.send(result);
    });

    // find user reviews
    app.get('/myreviews/:email', async (req,res)=>{
      const query={email:req.params.email};
      const cursor=reviews.find(query);
      const result=await cursor.toArray();
      console.log(result);
      res.send(result)
    })

    // delete review
    app.delete('/deletereview/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) };
      const result = await reviews.deleteOne(query);
      res.send(result);
  })
  }
  catch(err){
    
  }
  
}
run().catch(err=> console.log(err))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})