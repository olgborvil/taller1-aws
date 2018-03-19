'use strict';

var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var researchers = require("./researchers.js");

var port = (process.env.PORT || 16778);
var baseAPI = "/api/v1";

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

researchers.add([{
        name: "pepe",
        phone: "12345",
        email: "pepe@pepe.com"
    }, {
        name: "luis",
        phone: "67890",
        email: "luis@pepe.com"
    }]);

app.get(baseAPI + "/researchers", (request, response) => {
    console.log("GET /researchers"); 
    
    researchers.allResearchers((err,researchers)=>{
        response.send(researchers);    
    });
});

app.post(baseAPI + "/researchers", (request, response) => {
    console.log("POST /researchers");
    var researcher = request.body;
    researchers.add(researcher);
    response.sendStatus(201);
});

app.delete(baseAPI + "/researchers", (request, response) => {
    console.log("DELETE /researchers");

    researchers.removeAll((err,numRemoved)=>{
        console.log("researchers removed:"+numRemoved);
        response.sendStatus(200);    
    });

});

app.get(baseAPI + "/researchers/:name", (request, response) => {
    console.log("GET /researchers/"+name);
    var name = request.params.name;

    researchers.get(name,(err,researchers)=>{
        if (researchers.length === 0) {
            response.sendStatus(404);
        }
        else {
            response.send(researchers[0]);  
        }
    });
});


app.delete(baseAPI + "/researchers/:name", (request, response) => {
    var name = request.params.name;

    researchers.remove(name,(err,numRemoved)=>{
        console.log("researchers removed:"+numRemoved);
        response.sendStatus(200);    
    });

    console.log("DELETE /researchers/" + name);
});


app.put(baseAPI + "/researchers/:name", (request, response) => {
    var name = request.params.name;
    var updatedResearcher = request.body;

    researchers.update(name, updatedResearcher ,(err,numUpdates) => {
        console.log("researchers updated:"+numUpdates);
        if (numUpdates === 0) {
            response.sendStatus(404);    
        } else {
            response.sendStatus(200);    
        }
        
    });

    console.log("UPDATE /researchers/"+name);
});


app.listen(port, () => {
    console.log("Server with GUI up and running!!");
});
