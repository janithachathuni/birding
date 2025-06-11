const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

//middleware - will make the connection to the frontend of the site
app.use(cors());
app.use(express.json());

//mongodb password nbLE51snak0wtG57


app.get('/', (req, res) => {
    res.send('Hello world!')
}
)

//mongodb configuration

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://birder-application:nbLE51snak0wtG57@cluster0.tahbmnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create a collection of documents
    const birdCollections = client.db("KurulloDatabase").collection("birds");

    //insert a bird to the database using the db post method
    app.post("/upload-bird", async(req, res) => {
        const data = req.body;
        const result = await birdCollections.insertOne(data);
        res.send(result);
    })

    //get all birds from database
    app.get("/all-birds", async(req, res) =>{
        const birds = birdCollections.find();
        const result = await birds.toArray();
        res.send(result);
    })

    //update a bird data patch or update method
    app.patch("/bird/:id", async(req, res)=>{
        const id = req.params.id;
        // console.log(id);
        const updateBirdData = req.body;

        const filter = {_id:new ObjectId(id)};
        const options = {upsert: true};

        const updateDoc = {
            $set:{
                ...updateBirdData
            }
        }

        //update
        const result = await birdCollections.updateOne(filter, updateDoc, options);
        res.send(result);
    })

    //delete a bird data
    app.delete("book/:id", async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const result = await birdCollections.deleteOne(filter);
        res.send(result);
    })

    //finding a bird by family (filtering out data)
    app.get("/all-birds", async(req, res) =>{
      let query = {};
      if(req.query?.family){
        query = {family:req.query.family}
      }

      const result = await birdCollections.find(query).toArray();
      res.send(result);
    })

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app is listening on port ${port}`)
})