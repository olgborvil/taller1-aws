var express = require("express");
var bodyParser = require("body-parser");
var DataStore = require("nedb");

var mongo = require('mongodb');

console.log("Starting server!");
var BASE_API_PATH = "/api/v1";
var dbFileName = __dirname + "/researchers.json";
var app = express();
app.use(bodyParser.json());

var initialResearchers = [
    { "name": "Manuel", "surname": "Resinas", "phone": "954556234", "email": "resinas@us.es", "researcherID": "B-3063-2008" },
    { "name": "Pablo", "surname": "Férnandez", "phone": "954536333", "email": "pablofm@us.es", "researcherID": "E-6362-2010" }
];
var db = new DataStore({
    filename: dbFileName,
    autoload: true
});

db.find({}, (err, researchers) => {
    if (err) {
        console.error("Error accesing DB");
        process.exit(1);
    }
    else {
        if (researchers.length == 0) {
            console.log("Empty DB, initializaing data...");
            db.insert(initialResearchers);
        }
        else {
            console.log("Loaded DB with " + researchers.length + " researchers.");
        }

    }
});

app.get(BASE_API_PATH + "/researchers", (req, res) => {
    //Obtain all researchers
    console.log(Date() + " GET RESEARCHER");
    db.find({}, (err, researchers) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);

        }
        else {


            res.send(researchers.map((researcher) => {
                delete researcher._id;
                return researcher;
            }));


        }
    });



});
app.post(BASE_API_PATH + "/researchers", (req, res) => {
    //Create a new researcher
    console.log(Date() + " POST RESEARCHER")
    var researcher = req.body;
    db.insert(researcher);
    res.sendStatus(201);

});
app.put(BASE_API_PATH + "/researchers", (req, res) => {
    //Forbidden
    console.log(Date() + " PUT RESEARCHER")
    res.sendStatus(405);

});
app.delete(BASE_API_PATH + "/researchers", (req, res) => {
    //Remove all researchers
    console.log(Date() + " REMOVE RESEARCHERS");
    db.remove({});


    res.sendStatus(200);
});
app.listen(process.env.PORT);

app.get(BASE_API_PATH + "/researchers/:researcherID", (req, res) => {
    //GET A SINGLE RESEARCH 
     var id = req.params.researcherID;
    console.log(Date() + " GET A  RESEARCHER WHOSE ID IS"+id);
   
    db.find({ "researcherID": id }, (err, researchers) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);

        }
        else {
            if (researchers.length > 1) {
                console.warn("Inconsistent DB: duplicated researcherID");
            }
            res.send(researchers.map((researcher) => {
                delete researcher._id;
                return researcher;
            })[0]);
        }
    });

});
app.delete(BASE_API_PATH + "/researchers/:researcherID", (req, res) => {
    //DELETE A SINGLE RESEARCH 
     var id = req.params.researcherID;
    console.log(Date() + " GET A  RESEARCHER WHOSE ID IS"+id);
   
    db.remove({ "researcherID": id },{}, (err, numRemoved) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);

        }
        else {
            if (numRemoved > 1) {
                console.warn("Inconsistent DB: duplicated researcherID");
            }else if(numRemoved ==0) {
            res.sendStatus(404);
            }else{
                 res.sendStatus(200);
            }
            
        }
    });

});
app.post(BASE_API_PATH + "/researchers/:researcherID", (req, res) => {
    //Forbidden
    console.log(Date() + "POST RESEARCHER")
    res.sendStatus(405);

});
app.put(BASE_API_PATH + "/researchers/:researcherID", (req, res) => {
    //DELETE A SINGLE RESEARCH 
     var id = req.params.researcherID;
     var updateResearcher = req.body;
    console.log(Date() + " GET A  RESEARCHER WHOSE ID IS"+id);
   
    db.update({ "researcherID": id },{updateResearcher}, (err, numUpdated) => {
        if(id!=updateResearcher.researcherID){
            res.sendStatus(409);
            return;
        }
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);

        }
        else {
            if (numUpdated > 1) {
                console.warn("Inconsistent DB: duplicated researcherID");
            }else if(numUpdated ==0) {
            res.sendStatus(404);
            }else{
                 res.sendStatus(200);
            }
            
        }
    });

});