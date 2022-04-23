const ln = require('./lyrics-src/ln');
const al = require('./lyrics-src/al');
const genius = require('./lyrics-src/genius');

// LN: Lyrical Nonsense
// AL: Animelyrics
const Provider = {
    LN: ln,
    AL: al,
    GENIUS: genius,
};

/**
 * @param {String} query keyword to find lyrics
 * @param {Object[]} Provider
 */
const searchLyrics = async (query, Provider) => {
    let results = Provider.map((provider) => provider.getResults(query));
    results = await Promise.all(results);
    results = results.reduce((total, result) => [...total, ...result], []);
    if (results.length == 0) throw Error('No lyrics found');
    return results;
};

module.exports = { Provider, searchLyrics };
