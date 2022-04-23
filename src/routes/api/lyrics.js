const { Provider, searchLyrics } = require('lyrics-scraper');
const { constructContentUri } = require('../../utility/utils');
const express = require('express');
const lyrics = express.Router();

lyrics.get('/:id?', async (req, res) => {
    if (!req.query.q) return res.status(404).json({ status: 'ERROR', message: 'query required' });
    let provider = [Provider.LN, Provider.GENIUS, Provider.AL];
    if (typeof req.query.q === 'string') {
        if (req.query.p) {
            switch (req.query.p) {
                case 'ln':
                    provider = [Provider.LN];
                    break;
                case 'genius':
                    provider = [Provider.GENIUS];
                    break;
                case 'al':
                    provider = [Provider.AL];
                    break;
                default:
                    provider = [];
            }
        }
    } else {
        provider = req.query.q.filter((provider) => ['ln', 'genius', 'al'].includes(provider));
    }

    if (provider.length === 0) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'Please provide a valid lyrics provider',
        });
    }

    let results = null;
    try {
        results = await searchLyrics(req.query.q, provider);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'ERROR', message: 'No lyrics found' });
    }

    let index = null;
    if (req.params.id) index = parseInt(req.params.id) - 1;

    if (req.query.lyricsonly && req.query.lyricsonly == '1') {
        res.header('Content-Type', 'text/plain');
        return res.send(await results[index].lyrics());
    }

    if (req.params.id) {
        if (index >= 0 && index < results.length) {
            const lyrics = await results[index].lyrics();
            return res.json({ status: 'OK', ...results[index], lyrics });
        } else return res.status(404).json({ status: 'ERROR', message: 'index out of range' });
    }

    return res.json({
        status: 'OK',
        results: results.map((item, index) => {
            item.lyrics = `${constructContentUri(req, index + 1)}`;
            item.lyricsOnly = `${constructContentUri(req, index + 1)}&lyricsonly=1`;
            return item;
        }),
    });
});

module.exports = lyrics;
