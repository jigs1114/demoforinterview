require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_URL
    }
});
// Middleware
app.use(cors());
app.use(helmet( {crossOriginResourcePolicy: false}));
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

const router = require('./router/router')(io);

//routes
app.use("", router);

const PORT = process.env.PORT || 3001;

// server connection
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
