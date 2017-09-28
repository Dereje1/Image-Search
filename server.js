
let express = require('express')
let mongo = require('mongodb').MongoClient
let apiGetter = require("./getHTTPS")

let app = express();
let dbLink =process.env.MONGOLAB_URI;
let googleAPIConnect = "https://www.googleapis.com/customsearch/v1?key="+process.env.GOOGLE_API_KEY+"&cx=" +process.env.GOOGLE_ENGINE_CX + "&searchType=image"

app.use(express.static('public'));

app.get("/", function (req, res) {//default page
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/images/:imageSearch", function (req, res) {
  let imageQuery = req.params.imageSearch
  let offsetQuery = req.query.offset ? req.query.offset : 1 //default offset of 1
  //concatenate api search link by using both params & query (if available)
  let APIlink =googleAPIConnect +"&start=" + offsetQuery + "&q="+ imageQuery
  let recentqueries;
  apiGetter(APIlink) // calls api with promise
    .then(function(result){
      //google api allows only 100 hits / day, so must handle this exception here as the message does not really comback as an error
      if(Object.keys(result)[0]==="error"){//daily limit exceeded send error message
        res.end(result)
        return
      }
      let fullJSONresult = JSON.parse(result)
      let extraction = JSON.parse(result).items.map(function(r){//extract and modify output
        let report ={}
        report.url = r.link
        report.snippet = r.snippet
        report.thumbnail = r.image.thumbnailLink
        report.context = r.image.contextLink
        return report
      })

      findRecentQuery().then(function(q){//find recent searches
          recentqueries = q
          recentqueries.unshift(imageQuery)
      }).then(function(){//insert current query into db
            insertQuery(imageQuery)
              .then(function(){
                  res.end(JSON.stringify({extraction,recentqueries,offsetQuery})); //once insertion is done then print report
              })
              .catch(function(err){
                res.end(err)
              })
      }).catch(function(err){
        res.end(err)
      })
    })
    .catch(function(err){
      res.end(err)
    })

});


// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

//database functions below

function findRecentQuery(){// finds last 10 queries
  return mongo.connect(dbLink)//returns promise after finding
    .then(function(db){
      let collection = db.collection('Imgsearch')//specify collection
      return collection.find().sort({timeStamp:-1}).toArray()//look for all documents sorted with the time stamp descending
    })
    .then(function(items) {
      let allQueris = items.map((u)=>{//transpose object just to recent query array
        return u.imageQuery
      })
      return allQueris.slice(0,9)//only return last 10
    })
    .catch(function(err) {
        throw err;
    });
}
function insertQuery(imgQuery){//inserts imgQuery into database
  return mongo.connect(dbLink)//returns promise after inserting
    .then(function(db){
      let collection = db.collection('Imgsearch')//specify collection
      let insertedObject = {
        imageQuery: imgQuery,
        timeStamp: Date.now()
      }
      return collection.insert(insertedObject)
    })
    .then(function(newInsertion){//insert then log(for debugginh)
      console.log(imgQuery + " succesfully entered into DB")
    })
    .catch(function(err) {
        throw err;
    });
}
