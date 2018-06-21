var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var YahooFantasy = require('yahoo-fantasy');
var cors = require('cors');

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
var redirectUri = process.env.REDIRECT_URI || 'http://localhost:3000/auth/yahoo/callback';

// var yf = new YahooFantasy(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET
// );
//
// yf.setUserToken(
//   Y!OAuthAccessToken
// );
//
// yf.league.teams(
//
// )


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

console.log("hayyyyyyyyy");

app.get('/', function(req, res) {
  var data;
  if (req.session.result)
    data = JSON.stringfy(req.session.result, null, 2);

  res.render('home', {
    title: 'Home',
    user: req.session.token,
    data: data
  });
});

console.log("yooooooo");

app.get('/logout', function(req, res) {
  delete req.session.token;
  res.redirect('/');
});

app.get('/auth/yahoo', function(req, res) {
  var authorizationUrl = 'https://api.login.yahoo.com/oauth2/request_auth';
  var queryParams = qs.stringify({
    cliend_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code'
  });

  res.redirect(authorizationUrl + '?' + queryParams);
});

app.get('/auth/yahoo/callback', function(req, res) {
  var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
  var options = {
    url: accessTokenUrl,
    headers: { Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64') },
    rejectUnauthorized: false,
    json: true,
    form: {
      code: req.query.code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }
  };

  request.post(options, function(err, response, body) {
    if (err)
      console.log(err);
    else {
      var accessToken = body.access_token;

      req.session.token = accessToken;

      yf.setUserToken(accessToken);
      yf.user.games(
        function(err, data) {
          if (err)
            console.log(err);
          else
            req.session.result = data;

            return res.redirect('/');
        }
      );
    }
  });
});

console.log("bottom");

app.listen(process.env.PORT || 3000);



// module.exports = app;
