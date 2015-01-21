
/** 
 *App.js - Exposes rest interface to clients
 **/

var restify = require('restify');
var mongojs = require("mongojs");

var server = restify.createServer({
    name : "emc"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var connection_string = 'mongodb://localhost:27017/emc';
var db = mongojs(connection_string, ['definitions','templates']);

server.listen(3000,function(){
    console.log('%s listening at %s ', server.name , server.url);
});

var PATH = '/definitions';

server.get(PATH, function (req, res, next) {
    db.definitions.find({ StateName: 'Released' }, { _id:0, defnitionLabel: 1, defnitionDescription: 1 }).limit(50,function (err, definitions) {
        console.log(definitions);
        res.end(JSON.stringify(definitions));
    });
    //res.end(JSON.stringify(db.definitions.find().limit(20)));
    return next();
});

server.get(PATH +'/:id', findDefinition);
server.post(PATH ,postNewDefinition);
server.del(PATH +'/:id' ,deleteDefinition);

function findDefinition(req, res , next){
    //res.setHeader('Access-Control-Allow-Origin','*');
    db.definitions.findOne({ StateName: 'Released',_id:req.params.id }, { defnitionLabel: 1, defnitionDescription: 1 },function (err, definition) {
        console.log(definition);
        res.end(JSON.stringify(definition));
    });
    return next();
}

function postNewDefinition(req , res , next){
    var definition = {};
    definition._id = req.params.id;
    definition.ProgrammaticName = req.params.id;

    //res.setHeader('Access-Control-Allow-Origin','*');

    definitions.save(job , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , job);
            return next();
        }else{
            return next(err);
        }
    });
}

function deleteDefinition(req , res , next){
    //res.setHeader('Access-Control-Allow-Origin','*');
    definitions.remove({_id:req.params.id} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(204);
            return next();
        } else{
            return next(err);
        }
    });
}
