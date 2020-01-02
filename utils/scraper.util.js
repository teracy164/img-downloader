const scraperjs = require('scraperjs');

class ScraperUtil {
    getTargetImgUrl(pageUrl) {
        return this.scrape(pageUrl, ($) => {
            return $('img').map(function () {
                return $(this).attr('src');
            }).get();
        });
    }

    scrape(pageUrl, fnScraping) {
        return new Promise((resolve, reject) => {
            scraperjs.StaticScraper.create(pageUrl)
                .scrape(($) => fnScraping($))
                .then(items => resolve(items))
                .catch(err => reject(err));
        });
    }
}

module.exports = new ScraperUtil();
