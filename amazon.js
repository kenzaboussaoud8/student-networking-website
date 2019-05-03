/*
This script uses the aws sdk to upload to the server
*/


const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

module.exports = { uploadToServer: uploadToServer };

//configuring the AWS environment
AWS.config.update({
  accessKeyId: "",
  secretAccessKey: ""
});

var s3 = new AWS.S3();

function uploadToServer(filePath) {
  //configuring parameters
  var params = {
    Bucket: "loveacademy",
    Body: fs.createReadStream(filePath),
    Key: "images/" + Date.now() + "_" + path.basename(filePath)
  };
  s3.upload(params, function(err, data) {
    //handle error
    if (err) {
      console.log("Error", err);
    }

    //success
    if (data) {
      console.log("Uploaded in:", data.Location);
      return data.Location
    }
  });
}
