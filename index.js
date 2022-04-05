const express = require('express');

const app = express();

app.set('json spaces', 2);
app.use(express.json());
app.use('/api/', require('./src/middleware/logging'));
app.use('/api/lyrics', require('./src/routes/api/lyrics'));
app.use('/api/anime', require('./src/routes/api/anime'));
app.use('/api/manga', require('./src/routes/api/manga'));

app.listen(process.env.PORT, () => console.log(`Server listerning on port ${process.env.PORT}`));
