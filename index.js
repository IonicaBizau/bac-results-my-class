// Dependencies
var Mongo = require("mongodb")
  , MongoClient = Mongo.MongoClient
  , Mustache = require("mustache")
  , Fs = require("fs")
  ;

const MONGO_URI = "mongodb://localhost:27017/baccalaureate"
var template = Fs.readFileSync("./template").toString();
var surnames = [
    "Banciu",
    "Bizău",
    "Bogan",
    "Bogdan",
    "Bota",
    "Cîrle",
    "Dagău",
    "Drăgoi",
    "Turle",
    "Matiu",
    "Gurscă",
    "Vintilă",
    "Pantiș",
    "Miklo",
    "Mărginean",
    "Gruie",
    "Ile",
    "Țirban",
    "Jurca",
    "Bulc",
    "Hălbac"
];

function replaceDiacritics(i) {
    return i
        .replace("ă", "a")
        .replace("â", "a")
        .replace("î", "i")
        .replace("ț", "t")
        .replace("ș", "s")
        .replace("Ă", "A")
        .replace("Â", "A")
        .replace("Î", "I")
        .replace("Ț", "T")
        .replace("Ș", "S")
        ;
}

MongoClient.connect(MONGO_URI, function(err, db) {
    if (err) { throw err; }

    var finalData = [];
    var complete = 0;

    for (var i = 0; i < surnames.length; ++i) {
        (function (cS) {
            db.collection("students").findOne({
                "specialization" : "Matematica-Informatica",
                "name": new RegExp(cS, "i")
            }, function (err, obj) {
                if (err) { throw err; }
                finalData.push(obj);
                if (++complete === surnames.length) {
                    finalData.sort(function (a, b) {
                        return replaceDiacritics(a.name) > replaceDiacritics(b.name) ? 1 : -1;
                    });
                    console.log(Mustache.render(template, {
                        results: finalData
                    }));
                    db.close();
                }
            });
        })(surnames[i]);
    }
});
