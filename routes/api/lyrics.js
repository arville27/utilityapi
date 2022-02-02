const { Provider, searchLyrics } = require('lyrics-scraper');
const { constructContentUri } = require('../../utility/utils');
const express = require('express');
const lyrics = express.Router();

lyrics.get('/:id?', async (req, res) => {
    if (!req.query.q) return res.status(404).json({ status: 'ERROR', message: 'query required' });
    let provider = [Provider.LN, Provider.GENIUS];
    if (req.query.p) {
        switch (req.query.p) {
            case 'ln':
                provider = [Provider.LN];
                break;
            case 'genius':
                provider = [Provider.GENIUS];
                break;
        }
    }

    let results = null;
    try {
        results = await searchLyrics(req.query.q, provider)
    } catch (error) {
        return res.header('Content-Type', 'application/json').json({status: 'OK', results: []})
    }

    let index = null;
    if (req.params.id) index = parseInt(req.params.id) - 1;

    if (req.query.lyricsonly && req.query.lyricsonly == '1')
        return res.header('Content-Type', 'text/plain').send(await results[index].lyrics());

    res.header('Content-Type', 'application/json');

    if (req.params.id) {
        if (index >= 0 && index < results.length) {
            const lyrics = await results[index].lyrics();
            return res.json({ status: 'OK', ...results[index], lyrics });
        } else return res.json({ status: 'ERROR', message: 'index out of range' });
    }

    return res.json({
        status: 'OK',
        results: results.map((item, index) => {
            item.lyrics = `${constructContentUri(req, index + 1)}`;
            item.lyricsOnly = `${constructContentUri(req, index + 1)}&lyricsonly=1`;
            return item;
        })
    }
    );
});

module.exports = lyrics;
