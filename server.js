
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app = express();

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));

//start app
const port = process.env.PORT || 3000;

let imgArr = {};


app.post("/", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "picture") to retrieve the uploaded file
      let picture = req.files.picture;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      picture.mv("./uploads/" + picture.name);

      //add filename to imgArr object
      Object.assign(imgArr, picture);
      // console.log(imgArr.name);

      //send response
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: picture.name,
          mimetype: picture.mimetype,
          size: picture.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


app.get("/", function (req, res, next) {
  try {
    res.sendFile(path.join(__dirname + "/uploads/" + imgArr.name)); //path to last file
    fileUpload.FileArray;
    setTimeout(() => {
      fs.unlink(path.join(__dirname + "/uploads/" + imgArr.name), () => {
        console.log("file removed");
      });
    },4000);
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => console.log(`App is listening on port ${port}.`));
