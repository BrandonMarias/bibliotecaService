const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const fs = require("fs");

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_PUBLIC_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

const uploadFile = async (file, key) => {
    if (!file) return;
    const stream = fs.createReadStream(file.tempFilePath);
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: stream,
    };
    const command = new PutObjectCommand(uploadParams);

    try {
        return await s3.send(command);
    } catch (err) {
        console.log(err);
        console.log("Error uploading file");
        return err;
    }
};

const getFile = async (key) => {
    const getParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };
    const command = new GetObjectCommand(getParams);

    try {
        return await getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (err) {
        console.log(err);
        console.log("Error getting file");
        return err;
    }
};

module.exports = { uploadFile, getFile };
