class StringUtil {
    paddingZero(str, digit = 2) {
        let padding = '';
        for (let i = 0; i < 2; i++) padding += '0';
        return (padding + str).slice(-digit);
    }

    isFullUrl(url) {
        const match = url.match(/^https?:\/\//);
        return match ? true : false;
    }
}

module.exports = new StringUtil();
