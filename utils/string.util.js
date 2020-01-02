class StringUtil {
    paddingZero(str, digit = 2) {
        let padding = '';
        for (let i = 0; i < 2; i++) padding += '0';
        return (padding + str).slice(-digit);
    }

    matchRawImage(str) {
        // result: index:0 => match str, index:1 => type(jpeg png etc)
        return str.match(/^data:image\/(.+);base64,/);
    }

    isDataStr(str) {
        const result = this.matchRawImage(str);
        return result && result.length > 0 ? true : false;
    }

    getImageData(str) {
        const result = this.matchRawImage(str);
        if (result && result.length > 0) {
            // remove header
            const data = str.replace(result[0], '');
            // return decode data
            return new Buffer(data, 'base64');
        } else {
            return '';
        }
    }

    getImageType(str) {
        const result = this.matchRawImage(str);
        if (result && result.length > 0) {
            // return image type
            return result[1];
        } else {
            return '';
        }
    }

    isUrl(str) {
        const result = str.match(/^https?:\/\//);
        return result ? true : false;
    }
}

module.exports = new StringUtil();
