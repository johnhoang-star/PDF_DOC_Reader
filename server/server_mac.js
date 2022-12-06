var express = require('express');
var multer  = require('multer');
var fs  = require('fs');
var fs_mover = require('fs-extra');
var path = require('path')
var app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './news';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});


var upload = multer({storage: storage}).array('files', 12);
app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        res.end("Upload completed.");
    });
})

app.post('/newdata', (req, res) => {

    const directoryPath = path.join(__dirname, 'news');
    var result = [];
    //passsing directoryPath and callback function  
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        // res.writeHead(200, {"Content-Type": "application/json"});
        if (err) {
            res.json ({'status' :'failed','data' : []});
        }
        else
            res.json({'status' :'ok','data' : files}) ;
    });

});
app.get('/getfile',(req,res)=>{

    const directoryPath = path.join(__dirname, 'news');
    const destinationPath = path.join(__dirname, 'storage');

    var  pathname = directoryPath + '/' + req.query.filename;
    var  destpath = destinationPath + '/' + req.query.filename;

    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type','image/png');
        res.end(data);
      
        fs_mover.move(pathname, destpath, function (err) {
            if (err) return console.error(err)
                    console.log("success!");
                });
      }

    });    
})

app.listen(3000);
