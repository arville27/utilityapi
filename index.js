const express = require('express');

const app = express();
app.set('json spaces', 2);
app.use(express.json());
app.use('/api/', require('./middleware/logging').logging);
app.use('/api/lyrics', require('./routes/api/lyrics'));
app.use('/api/anime', require('./routes/api/anime'));
app.use('/api/manga', require('./routes/api/manga'));

app.listen(process.env.PORT, () => {
    console.log(`Server listerning on port ${process.env.PORT}`);
});
