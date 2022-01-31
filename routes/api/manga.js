const { MALScraper } = require('malscraper');
const { constructContentUri } = require('../../utility/utils');
const express = require('express');
const manga = express.Router();

manga.get('/:id?', async (req, res) => {
    if (!req.query.q) return res.status(404).json({ code: 404, message: 'query required' });
    const results = await MALScraper.searchManga(req.query.q);

    let index = null;
    if (req.params.id) index = parseInt(req.params.id) - 1;
    res.header('Content-Type', 'application/json');

    if (req.params.id) {
        if (index >= 0 && index < results.length)
            return res.json(await results[index].fetchDetails());
        else return res.json({ code: 404, message: 'index out of range' });
    }

    return res.json(
        results.map((item, index) => {
            item.details = `${constructContentUri(req, index + 1)}`;
            return item;
        })
    );
});

module.exports = manga;
