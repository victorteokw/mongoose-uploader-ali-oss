const OSS = require('ali-oss');
const baseUploader = require('mongoose-uploader/lib/baseUploader');
const path = require('path');

const createAliOSSUploader = (config) => {
  const client = new OSS({
    region: config.region,
    bucket: config.bucket,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    internal: config.internal,
    endpoint: config.endpoint,
    secure: config.secure,
    timeout: config.timeout
  });
  const host = () =>
    config.host || `https://${config.bucket}.${config.region}.aliyuncs.com`;
  const upload = async function(upload) {
    const { stream, filename, mimetype, encoding } = await upload;
    const newFileName = path.join(this.storePath(filename), this.filename(filename));
    const result = await client.putStream(newFileName, stream);
    return {
      url: host() + newFileName,
      filename: newFileName,
      mimetype,
      encoding
    };
  };
  const remove = async function(file) {
    await client.delete(file.filename);
  };
  return Object.assign({}, baseUploader, { upload, remove });
};

module.exports = { createAliOSSUploader };
