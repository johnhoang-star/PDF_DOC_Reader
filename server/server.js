var express = require('express');
var multer  = require('multer');
var fs  = require('fs');
var fs_mover = require('fs-extra');
var path = require('path')
var app = express();
var multiparty = require('multiparty');
const pdf = require('pdf-parse');
const WordExtractor = require("word-extractor"); 
var cors = require('cors')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())
app.post('/upload', function (req, res, next) {
 
    var form_data = new multiparty.Form();
    form_data.parse(req, async function(err, fields, files) {
        if(files.files) {
            var fileName = files.files[0].originalFilename;
            var file = files[0]
            var sourcePath = files.files[0].path
             
            const directoryPath = path.join(__dirname, '\\news');
            var  destpath = directoryPath + '\\' + fileName;
            fs.exists(destpath, function(exists) {
              if(exists) {
                //Show in green
                fs.unlinkSync(destpath);
                
                fs_mover.move(sourcePath, destpath, function (err) {
                    if (err) return console.error(err)
                      res.end("success");
                });

              } else {

                    fs_mover.move(sourcePath, destpath, function (err) {
                    if (err) return console.error(err)
                     res.end('success');    
                    });
              }
            });
        }
    })

 })
const getOriginalExamples = (content) =>{
  var index = 0;
  var result = [];
  var start,end;
  while(content.indexOf('“',index) > 0) {
     start = content.indexOf('“',index)
     end = content.indexOf('”',start + 1)
     if(end == -1) break;
     result.push(content.substring(start,end+1))
     index = end + 1
  }
  return result
}
const analysisDoc = async (filename,exceptionList) => {

const extractor = new WordExtractor();
const doc = await extractor.extract(filename); 
    const content = doc.getBody();
const example_list =  getOriginalExamples(content)
          // console.log(example_list)
    const word_list = content.split(/[\s,.?()/:]+/);
    var result = {}
    var examples = {}
    var example_v;
    for (var i = 0; i < word_list.length; i++) {
         if(Object.keys(result).indexOf(word_list[i].toLowerCase()) == -1){
            if(word_list[i] == '' || exceptionList.indexOf(word_list[i].toLowerCase()) > 0 || !isNaN(word_list[i]) ) continue;
            result[word_list[i].toLowerCase()] = 1
            example_v =  example_list.filter(item => item.indexOf(word_list[i].toLowerCase()) > 0)
            examples[word_list[i].toLowerCase()] =  example_v
         }
         else{
            result[word_list[i].toLowerCase()] ++;
         } 
    }
    return {result : result, example : examples};

}

const analysisPdf = async (filename,exceptionList) => {

    let dataBuffer = fs.readFileSync(filename);
    const data = await pdf(dataBuffer); 
          const content = data.text
          const example_list =  getOriginalExamples(content)
          // console.log(example_list)
          const word_list = content.split(/[\s,.?()/:]+/);
          var result = {}
          var examples = {}
          var example_v;
          for (var i = 0; i < word_list.length; i++) {
             if(Object.keys(result).indexOf(word_list[i].toLowerCase()) == -1){
            if(word_list[i] == '' || exceptionList.indexOf(word_list[i].toLowerCase()) > 0 || !isNaN(word_list[i]) ) continue;
                  result[word_list[i].toLowerCase()] = 1
                  example_v =  example_list.filter(item => item.indexOf(word_list[i].toLowerCase()) > 0)
                  examples[word_list[i].toLowerCase()] =  example_v
             }
             else{
                result[word_list[i].toLowerCase()] ++;
             } 
          }
          
 
    return {result : result, example : examples};
}
app.post('/start', async function(req,res){
 
    const {fileName,exclude}  = req.body
    const exceptionList = exclude.split(' ')
    var type = fileName.indexOf('.pdf') > 0; 
    var result;
    if(type){
       result = await analysisPdf('news/' + fileName,exceptionList)
    }
    else
    {
       result = await analysisDoc('news/' + fileName,exceptionList)
    }
   return  res.send(result)
  


})
// analysisPdf('news/test.pdf')
// const bits = "Hello are awesome, world.".split(/[\s,.?()]+/)
// console.log(bits)
// analysisDoc(null,'news/test.docx')
app.listen(process.env.PORT || 5000);
