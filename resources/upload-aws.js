const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const AWSConfig = require('./aws.config.js');


const PUBLIC_DIR = './dist/'

const s3 = new AWS.S3({
    accessKeyId: AWSConfig.ID,
    secretAccessKey: AWSConfig.SECRET
});

const uploadFolder = () => {
    fs.readdirSync(PUBLIC_DIR).forEach(file => {
        uploadFile(file)
    });
}

const uploadFile = (fileName) => {

    const fileContent = fs.readFileSync(PUBLIC_DIR + fileName);
      

    const params = {
        Bucket: AWSConfig.BUCKET_NAME,
        Key: fileName,
        ContentType: (path.extname(fileName) == ".html") ? "text/html" : "text/javascript",
        Body: fileContent
    };

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadFolder();