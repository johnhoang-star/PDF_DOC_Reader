const WordExtractor = require("word-extractor"); 
const extractor = new WordExtractor();
const extracted = extractor.extract("Petri.docx");

extracted.then(function(doc) { console.log(doc.getBody()); });