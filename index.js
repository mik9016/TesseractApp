const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');



const app = express();


// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(morgan('dev'));
app.use(express.static('uploads'));

//start app 
const port = process.env.PORT || 3000;



let imgArr = {};

app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file !!!
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);
            
            //add filename to imgArr object
            Object.assign(imgArr,avatar);
            // console.log(imgArr.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/upload-avatar', function(req, res, next) {
    try{
        res.sendFile(path.join(__dirname + '/uploads/' + imgArr.name));//path to last file
        fileUpload.FileArray
    }catch(err){
        res.send(err);
    }
    
    
//    next();
  });




app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);


