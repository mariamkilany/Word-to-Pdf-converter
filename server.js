const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
var docxConverter = require('docx-pdf');
const logger = require("morgan")
const cors = require("cors");

const app = express();
const extend_pdf = '.pdf'
const extend_docx = '.docx'
var down_name

app.use(fileUpload());
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,"/client/build")))

app.get('*',(_,res)=>{
  res.sendFile(path.join(__dirname,"/client/build/index.html"),(err)=>{
    if(err)
    res.status(500).send(err)
  })
})

// Upload Endpoint
app.post('/api/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  var file = req.files.file,name = file.name,type = file.mimetype;
  var uploadpath = __dirname + '/client/public/uploads/'+ name;
  const First_name = name.split('.')[0];
  down_name = First_name;
  file.mv(uploadpath, 
    err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    else{
    var initialPath = path.join(__dirname, `/client/public/uploads/${First_name}${extend_docx}`);
    var upload_path = path.join(__dirname, `/client/public/uploads/${First_name}${extend_pdf}`);
    docxConverter(initialPath,upload_path,function(err,result){
        if(err){
          console.log(err);
        }
        console.log('result'+result);
        res.json({ fileName: file.name, filePath: `/uploads/${First_name}.pdf` });
        });
    }
  });
});
const PORT=5000
app.listen(PORT, () => console.log('Server Started on '+PORT));
