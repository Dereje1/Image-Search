//module will get any https request without any other dependencies but those that already
//built with node
const https=require('https')

module.exports = function (url){//will return a new promise with the results
  let body = []//array to collect results
  return new Promise (function(resolve,reject){//declare promise with a resolve or reject
    https.get(url,function(response){//refer back to learnyounode lessons on how https works
      response.setEncoding('utf8');
      response.on('data', function(chunk){
        body.push(chunk.toString())//must convert to string as in 'buffer' mode
      })
      response.on('end',function(){//omce all response has ended
        resolve(body.join(''))//send a resolution on success, if array needed just remove the join
      })
      response.on('error',function(err){
        reject(err)//send an error if site is not responding (or whatever)
      })
    })
  })
}
