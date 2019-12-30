const request = require('request');

class HttpUtil {
    requestGet(url) {
        return new Promise((resolve, reject) => {
            request(
                { method: 'GET', url, encoding: null },
                (err, res, body) => {
                    if (!err && res.statusCode === 200) {
                        resolve(body);
                    } else {
                        reject(err);
                    }
                }
            );
        });
    }    
}

module.exports = new HttpUtil();
