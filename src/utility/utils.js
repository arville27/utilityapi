const puppeteer = require('puppeteer');

function constructContentUri(request, id) {
    const uri = new URL(`${request.protocol}://${request.rawHeaders[1]}${request.originalUrl}`);
    return uri.origin + uri.pathname + `/${id}` + uri.search;
}

module.exports = {
    constructContentUri,
    pptr: (() => {
        const opt = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
        switch (process.arch) {
            case 'x64':
                return puppeteer.launch({ ...opt, executablePath: '/usr/bin/google-chrome' });
            case 'arm64':
                return puppeteer.launch({ ...opt, executablePath: '/usr/bin/chromium' });
        }
    })(),
};
