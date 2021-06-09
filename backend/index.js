const setUpDb = require('./db/db-setup');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const {verify} = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(verify);
app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

setUpDb();

const {
    getSignUp,
    postSignUp,
    getSignIn,
    postSignIn,
    getMyProfile,
} = require('./controllers/users');

const {
    getCreateChannel,
    postCreateChannel,
    getAllChannels,
    getParticularChannel,
    getDeleteChannel,
    postDeleteChannel,
} = require('./controllers/channels');

const {
    getCreateVideo,
    postCreateVideo,
    getAllVideo,
    getAllVideoOfChannel,
    getParticularVideo,
    getDeleteVideo,
    postDeleteVideo,
} = require('./controllers/videos')

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.route('/signUp')
    .get(getSignUp)
    .post(postSignUp);

app.route('/signIn')
    .get(getSignIn)
    .post(postSignIn);

app.route('/getMyProfile')
    .get(getMyProfile);

app.route('/createChannel')
    .get(getCreateChannel)
    .post(postCreateChannel);

app.route('/getAllChannels')
    .get(getAllChannels);

app.route('/getChannel/:id')
    .get(getParticularChannel);

app.route('/deleteChannel/:id')
    .get(getDeleteChannel)
    .post(postDeleteChannel);

app.route('/createVideo')
    .get(getCreateVideo)
    .post(postCreateVideo);

app.route('/getAllVideo')
    .get(getAllVideo);

app.route('/:id/allVideo')
    .get(getAllVideoOfChannel);

app.route('/video/:videoId')
    .get(getParticularVideo);

app.route('/deleteVideo/:id')
    .get(getDeleteVideo)
    .post(postDeleteVideo);

const PORT = process.env.PORT || 8080;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);