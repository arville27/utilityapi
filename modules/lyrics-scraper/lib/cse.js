const cheerio = require('cheerio');
const { pptr } = require('../../../src/utility/utils');

const getSources = async (keyword, cseId) => {
    const BASE = 'https://cse.google.com/cse';

    const cseEndpoint = `${BASE}?cx=${cseId}&q=`;
    const browser = await pptr;
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'image') request.abort();
        else request.continue();
    });

    await page.goto(`${cseEndpoint}${keyword}`);

    if ((await page.title()).match(/error [0-9]*?/i)) {
        await browser.close();
        throw Error('Invalid cse id');
    }

    const results = await page.$$eval('.gsc-webResult .gsc-result', (res) => res.map((x) => x.outerHTML));
    await page.close();

    if (results.length == 1 && cheerio.load(results[0]).text().indexOf('http') === -1) {
        return [];
    }
    return results.filter((x) => !x.includes('gs-spelling')).map((x) => cheerio.load(x));
};

const extractUrl = (src) => {
    const $ = src;
    let url = null;
    $('.gs-per-result-labels').each((_, el) => {
        url = $(el).attr('url');
    });
    return url;
};

module.exports = { extractUrl, getSources };
