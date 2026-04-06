export const getBodyFromFormDataReq = async (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const formattedBody = body.split('&').map(item => item.split('=')).reduce((acc, item) => {
        acc[item[0]] = item[1];
        return acc;
      }, {});

      resolve(formattedBody);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};

export const getBodyFromReq = async (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve(JSON.parse(body));
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};