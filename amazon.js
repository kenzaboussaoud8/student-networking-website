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

function uploadToServer(file) {
    // Getting the file type, ie: jpeg, png or gif
    const type = file.split(';')[0].split('/')[1]
        //configuring parameters
    var params = {
        Bucket: "loveacademy",
        Body: base64Data,
        Key: "images/" + Date.now() + "_" + path.basename(file),
        ACL: 'public-read',
        ContentEncoding: 'base64', // required
        ContentType: `image/${type}` // required. Notice the back ticks
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