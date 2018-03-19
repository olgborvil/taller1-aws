'use strict';

var path = require('path');
var DataStore = require('nedb');
var dbFileName = path.join(__dirname, 'Researchers.json');

var db = new DataStore({
    filename : dbFileName,
    autoload : true
});


var Researchers = function () {};

Researchers.prototype.allResearchers = function(callback) {
    return db.find({}, callback);
};

Researchers.prototype.add = function(Researcher, callback) {
    return db.insert(Researcher, callback);
};

Researchers.prototype.removeAll = function(callback) {
    return db.remove({},{ multi: true},callback);
};

Researchers.prototype.get = function(name, callback) {
    return db.find({name:name}, callback);
};

Researchers.prototype.remove = function(name, callback) {
    return db.remove({name:name},{ multi: true}, callback);
};

Researchers.prototype.update = function(name, updatedResearcher, callback) {
    return db.update({name:name},updatedResearcher,{}, callback);
};

module.exports = new Researchers();