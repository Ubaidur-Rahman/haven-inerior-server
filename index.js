const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5055

app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send("It's Working")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqdtk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const serviceCollection = client.db("havenInteriorDesign").collection("Services");
    const adminCollection = client.db("havenInteriorDesign").collection("Admins");
    const reviewCollection = client.db("havenInteriorDesign").collection("Reviews");
    const orderCollection = client.db("havenInteriorDesign").collection("Orders");
    const teamMemberCollection = client.db("havenInteriorDesign").collection("TeamMembers");


    console.log('database connected')

    app.post('/addService', (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })


    })


    app.post('/addATeamMember', (req, res) => {
        const newService = req.body;
        teamMemberCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('add new service', newReview)
        reviewCollection.insertOne(newReview)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })


    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log('add new service', newOrder)
        orderCollection.insertOne(newOrder)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })


    })


    app.post('/makeAnAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('add new service', newAdmin)
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        console.log(email)
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                console.log(admins.length)
                res.send(admins.length > 0);
            })
    })





    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/yourOrders', (req, res) => {
        console.log(req.query.email);
        orderCollection.find({email: req.query.email})
        .toArray((err, documents) => {
          res.send(documents);
        })
      })
    


    app.get('/teamMembers', (req, res) => {
        teamMemberCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });


    app.delete('/delete/:id', (req, res) => {
        const id = ObjectId(req.params.id)
        console.log('object', id)
        serviceCollection.deleteOne({ _id: id })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })


});




app.listen(port)
