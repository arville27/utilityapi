const { MALScraper } = require('malscraper');
const { constructContentUri } = require('../../utility/utils');
const express = require('express');
const anime = express.Router();

anime.get('/:id?', async (req, res) => {
    if (!req.query.q) return res.status(404).json({ status: 'ERROR', message: 'query required' });
    let status = null;
    if (req.query.status) {
        switch (req.query.status) {
            case 'airing':
                status = MALScraper.Status.AIRING;
                break;
            case 'finished':
                status = MALScraper.Status.FINISHIED_AIRING;
                break;
            case 'notairing':
                status = MALScraper.Status.NOT_YET_AIRING;
                break;
        }
    }

    let results = null;
    try {
        results = status
            ? await MALScraper.searchAnime(req.query.q, status)
            : await MALScraper.searchAnime(req.query.q);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'ERROR', message: 'Server error' });
    }

    let index = null;
    if (req.params.id) index = parseInt(req.params.id) - 1;

    if (req.params.id) {
        if (index >= 0 && index < results.length)
            return res.json({ status: 'OK', ...(await results[index].fetchDetails()) });
        else return res.status(404).json({ status: 'ERROR', message: 'index out of range' });
    }

    return res.json({
        status: 'OK',
        results: results.map((item, index) => {
            item.details = `${constructContentUri(req, index + 1)}`;
            return item;
        }),
    });
});

module.exports = anime;
