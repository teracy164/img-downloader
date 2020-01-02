// get target page URL from arg
const targetPage = process.argv[2];

if (!targetPage) {
    console.log('target page URL not found.');
    return;
}

const fileUtil = require('./utils/file.util');
const httpUtil = require('./utils/http.util');
const strUtil = require('./utils/string.util');

const execDate = new Date();
let tmpRawCount = 1;

function getOutputDir() {
    return __dirname + '/output/' + execDate.getFullYear()
        + strUtil.paddingZero(execDate.getMonth() + 1)
        + strUtil.paddingZero(execDate.getDate())
        + strUtil.paddingZero(execDate.getHours())
        + strUtil.paddingZero(execDate.getMinutes())
        + strUtil.paddingZero(execDate.getSeconds());
}

function getDownLoadFileName(imageUrl) {
    const start = imageUrl.lastIndexOf('/') + 1;
    // remove query string
    const posiQuery = imageUrl.indexOf('?', start);
    const end = posiQuery < 0 ? imageUrl.length + 1 : posiQuery;
    // get file name
    return imageUrl.slice(start, end);
}

async function downloadImage(imageUrl) {
    try {
        let imageData = null;
        let fileName = null;
        if (strUtil.isDataStr(imageUrl)) {
            imageData = strUtil.getImageData(imageUrl);
            const type = strUtil.getImageType(imageUrl);
            fileName = 'raw' + (tmpRawCount++) + '.' + type;
        } else {
            const url = strUtil.isUrl(imageUrl) ? imageUrl : targetPage + '/' + imageUrl;
            // get image
            imageData = await httpUtil.requestGet(url);
            // get file name
            fileName = getDownLoadFileName(imageUrl);
        }
        const outputDir = getOutputDir();
        // write file
        await fileUtil.writeFile(outputDir + '/' + fileName, imageData);
        console.log('save => ' + (outputDir + '/' + fileName));

        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}

async function downloadImages(imageUrls) {
    console.log('download start...');
    const tmpPromise = [];
    for (const imageUrl of imageUrls) {
        tmpPromise.push(downloadImage(imageUrl));
    }
    // wait all promise
    const result = await Promise.all(tmpPromise);
    if (result.some(r => !r)) {
        // exit error
        // nop
    }
}

async function getImageUrls(pageUrl) {
    const scraper = require('./utils/scraper.util');
    return scraper.getTargetImgUrl(pageUrl);
}

async function main() {
    console.log('\n\n\n\n\n');
    console.log('target page: ', targetPage)

    const outputDir = getOutputDir();
    console.log('output dir: ' + outputDir);
    try {
        // create output dir
        fileUtil.makeDir(outputDir);

        // get image urls from target page
        const imgUrls = await getImageUrls(targetPage);
        // download images
        await downloadImages(imgUrls);

        console.log('complete!');
    } catch (err) {
        console.log('err:', err);
    }
}

main();