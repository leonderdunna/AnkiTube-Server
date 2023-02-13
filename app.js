let express = require("express")
let cors = require("cors")
let mongoose = require("mongoose")
let https = require("https")
let fs = require("fs")

// CONNECT TO DATABASE
mongoose.connect(
    "mongodb://127.0.0.1:27017/"
)
    .then(() => console.log("mongodb connected"))
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    });

const cardSchema = new mongoose.Schema({
    id: {type: String, required: true},
    deck_id: {type: String, required: true},
    text: String,
    type: String,
    question: String,
    answer: String,
    time: Number,
});
const Card = mongoose.model("Card", cardSchema)

const deckSchema = new mongoose.Schema({
    name: String,
    uuid: String,
    ids: [],
    children: []
})
const Deck = mongoose.model("Deck",deckSchema)

// CREATE Routes
let app = express()
app.use(cors())
app.use(express.json())

app.get('/card/', (req, res) => {
    Card.find({}, (err, found) => {
        if (!err) {
            res.send(found);
        } else {
            console.log(err);
            res.send("Some error occured!")
        }
    })
});
app.get('/card/:deck', (req, res) => {
    Card.find({deck_id: req.params.deck}, (err, found) => {
        if (!err) {
            res.send(found);
        } else {
            console.log(err);
            res.send("Some error occured!")
        }
    })
});






app.get('/deck/', (req, res) => {
    Deck.find({}, (err, found) => {
        if (!err) {
            res.send(found);
        } else {
            console.log(err);
            res.send("Some error occured!")
        }
    })
});
app.get('/deck/:uuid', (req, res) => {
    Deck.find({uuid: req.params.uuid}, (err, found) => {
        if (!err) {
            res.send(found);
        } else {
            console.log(err);
            res.send("Some error occured!")
        }
    })
});






app.post("/card/", async (req, res) => {
    let validate = false
    if (req.body.id != null && req.body.deck_id != null) validate = true
    if (validate) {
        await Card.find({id: req.body.id}).remove()
        new Card(req.body).save().then(r => {
            res.send({message:"Successfully added"})
        })
    } else {
        console.log(req.body)
        res.status(400).send({message: "die karte kann nicht gespeichert werden, weil sie den anforderungen nicht entspricht"})
    }
})
app.delete("/card/:id", (req, res) => {
    Card.find({id: req.params.id}, (err, result) => {
        console.log("Deleting:", result)

    }).remove()
    res.send({message: "Karte wird gelösht, wenn sie existiert"})
})


app.post("/deck", async (req, res) => {
    let validate = false
    if (req.body.uuid != null && req.body.name != null && req.body.children != null && req.body.ids != null) validate = true
    if (validate) {
        await Deck.find({uuid: req.body.uuid}).remove()
        new Deck(req.body).save().then(r => {
            res.send({message: "Successfully added"})
        })
    } else {
        console.log(req.body)
        res.status(400).send({message: "dieses Deck kann nicht gespeichert werden, weil es den anforderungen nicht entspricht"})
    }
})
app.delete("/deck/:uuid", (req, res) => {
    Deck.find({uuid: req.params.uuid}, (err, result) => {
        console.log("Deleting:", result, req.params.uuid)

    }).remove()
    res.send({message:"Deck wird gelösht, wenn es existiert"})
})

// START SERVER testing
app.listen(3000, () => {
    console.log("AnkiTube Server Testing is listening on port 3000")
})


// START SERVER Prod...
/*
let server = https.createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/139-162-135-50.ip.linodeusercontent.com/privkey.pem","utf8"),
    cert: fs.readFileSync("/etc/letsencrypt/live/139-162-135-50.ip.linodeusercontent.com/fullchain.pem", "utf8")
},app);
server.listen(80);
*/
