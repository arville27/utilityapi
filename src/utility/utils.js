const puppeteer = require('puppeteer');

async function getPptrSession() {
    const opt = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
    if (process.arch === 'arm64')
        return await puppeteer.launch({ ...opt, executablePath: '/usr/bin/chromium' });
    else if (process.arch === 'x64')
        return await puppeteer.launch({ ...opt, executablePath: '/usr/bin/google-chrome' });
}

function constructContentUri(request, id) {
    const uri = new URL(`${request.protocol}://${request.rawHeaders[1]}${request.originalUrl}`);
    return uri.origin + uri.pathname + `/${id}` + uri.search;
}

module.exports = { constructContentUri, getPptrSession };
