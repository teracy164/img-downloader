// get target page URL from arg
const targetPage = process.argv[2];

if (!targetPage) {
    console.log('target page URL not found.');
    return;
}

console.log('target page: ', targetPage)

const fileUtil = require('./utils/file.util');
const httpUtil = require('./utils/http.util');

const execDate = new Date();

function getOutputDir() {
    const strUtil = require('./utils/string.util');
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
    // get image
    const image = await httpUtil.requestGet(imageUrl);
    // get file name
    const fileName = getDownLoadFileName(imageUrl);
    const outputDir = getOutputDir();
    // write file
    await fileUtil.writeFile(outputDir + '/' + fileName, image);
}

async function downloadImages(imageUrls) {
    console.log('download start...');
    const promises = [];

    for (const imageUrl of imageUrls) {
        const url = imageUrl.startsWith('/') ? targetPage + imageUrl : imageUrl;
        console.log('download from ' + url);
        // download image
        const promise = downloadImage(url);
        // push Promise
        promises.push(promise);
    }
    // wait download complete all files
    await Promise.all(promises);
}

async function getImageUrls(pageUrl) {
    const scraper = require('./utils/scraper.util');
    return scraper.getTargetImgUrl(pageUrl);
}

async function main() {
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