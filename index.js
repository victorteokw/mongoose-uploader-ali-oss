const OSS = require('ali-oss');

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
  const upload = async (upload) => {
    const { stream, filename, mimetype, encoding } = await upload;
    const result = await client.putStream(filename, stream);
    return {
      url: host() + '/' + filename,
      filename: filename,
      mimetype,
      encoding
    };
  };
  const remove = async (file) => {
    await client.delete(file.filename);
  };
  return { upload, remove };
};

module.exports = { createAliOSSUploader };
