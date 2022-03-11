// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var katsudenRouter = require('./routes/katsuden');
var palRouter = require('./routes/pal');
var paRouter = require('./routes/pa');
var menkyoRouter = require('./routes/menkyo');
var rakushouRouter = require('./routes/rakushou');
var otsukaRouter = require('./routes/otsuka');
var nikibicRouter = require('./routes/nikibic');
var acneRouter = require('./routes/acne');
var decollteRouter = require('./routes/decollte');
var coopdeliRouter = require('./routes/coopdeli');
var kuronekoRouter = require('./routes/kuroneko');
var npRouter = require('./routes/np');
var npatobaraiRouter = require('./routes/npatobarai/index');

var afteeRouter = require('./routes/aftee');
var atoneRouter = require('./routes/atone');
var paidyRouter = require('./routes/paidy');
var zeusRouter = require('./routes/zeus');
var paygentRouter = require('./routes/paygent');
var paygent2Router = require('./routes/paygent2');
var lineMenuRouter = require('./routes/line-menu');
var linePayRouter = require('./routes/line_pay');
// var AloOrganicRouter = require('./routes/alo-organic');
// var AloOrganicRouter2 = require('./routes/alo-organic2');
var AloOrganicRouter3 = require('./routes/alo-organic3');
var act = require('./routes/act');
var demoRouter = require('./routes/demo');
var umusic = require('./routes/umusic');
var isc = require('./routes/isc');
var common = require('./routes/common');
var custom = require('./routes/custom');
var gmoCOD = require('./routes/gmocod');
var gmoPoint = require('./routes/gmopoint');
var gmoPointV2 = require('./routes/gmopoint_v2');
var pointTown = require('./routes/pointtown');
var puppeteer = require('./routes/puppeteer');
var conversation = require('./routes/conversation');
var analytic_webchat = require('./routes/analytic_webchat');
var trendexpress = require('./routes/trendexpress');
var okurahome = require('./routes/okurahome');
var efoPOrderHistoryRouter = require('./routes/efo_order_history');
var efoSendCvRouter = require('./routes/tmjnet');
var edspsRouter = require('./routes/edsps');
var matchwatchRouter = require('./routes/matchwatch');
var matchwatchProdRouter = require('./routes/matchwatchProd');
var biyoRouter = require('./routes/biyo');
var levtechRouter = require('./routes/levtech');
var levtechRouter2 = require('./routes/levtech2');
var PureMedicalRouter = require('./routes/pure-medical');
var mailChimp = require('./routes/mailchimp');
var tamagokichi = require('./routes/tamagokichi');
var minorinomiRouter = require('./routes/minorinomi');
var escrit = require('./routes/escrit');
var chintai = require('./routes/chintai.class');
var pulito = require('./routes/pulito.class');
var kyotokimonoRouter = require('./routes/kyotokimono');
var biyobot = require('./routes/biyo.bot');
var kateikyoushiRouter = require('./routes/kateikyoushi');
var aiScholarRouter = require('./routes/ai-scholar');
var nojimaRouter = require('./routes/nojima');
var boxilRouter = require('./report/boxil');
var boxilRouter2 = require('./report/boxil2');

var mbhonline = require('./routes/mbhonline');
var trackingRouter = require('./routes/tracking');
var marimoRouter = require('./routes/marimo');
var zohoRouter = require('./routes/zoho');
var veritranRouter = require('./routes/veritrans_payment');
var travelRouter = require('./routes/travel');
var deliRouter = require('./routes/deli');
var mynaviRouter = require('./routes/mynavi');
var karubiRouter = require('./routes/karubi');
var karubiP2Router = require('./routes/karubi_p2');
var karubiP3Router = require('./routes/karubi_p3');
var calbeeRouter = require('./routes/calbee');
var willRouter = require('./routes/will');
var boxUploadRouter = require('./routes/box_upload');
var validateEmailRouter = require('./routes/common');
var nicorioRouter = require('./routes/nicorio');
var efoEcCartRouter = require('./routes/efo_ec_cart.js');
var kouzaRouter = require('./routes/kouza.class.js');
var efoCvRouter = require('./routes/efo_cv.js');
var bellaShopRouter = require('./routes/bella_shop.js');

var app = express();

const Log4js = require("log4js");
const today = (new Date()).toISOString().slice(0, 10);
Log4js.configure({
	appenders: {
	  system: { type: 'stdout' },
	  temona: { type: "file", filename: `logs/temona-${today}.log` },
	  sapporo: { type: "file", filename: `logs/sapporo-${today}.log` }
	},
	categories: {
	  default: { appenders: ['system'], level: 'info' },
	  temona: { appenders: ["system", "temona"], level: "info" },
	  sapporo: { appenders: ["system", "sapporo"], level: "info" },
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/katsuden', katsudenRouter);
app.use('/api/pal', palRouter);
app.use('/api/p-a', paRouter);
app.use('/api/menkyo', menkyoRouter);
app.use('/api/rakushou', rakushouRouter);
app.use('/api/otsuka', otsukaRouter);
app.use('/api/nikibic', nikibicRouter);
app.use('/api/acne', acneRouter);
app.use('/api/decollte', decollteRouter);
app.use('/api/coopdeli', coopdeliRouter);
app.use('/api/kuroneko', kuronekoRouter);
app.use('/api/np', npRouter);
app.use('/api/npatobarai/index', npatobaraiRouter);
app.use('/api/aftee', afteeRouter);
app.use('/api/atone', atoneRouter);
app.use('/api/paidy', paidyRouter);
app.use('/api/zeus', zeusRouter);
app.use('/api/paygent', paygentRouter);
app.use('/api/paygent2', paygent2Router);
app.use('/api/line-menu', lineMenuRouter);
app.use('/api/line-pay', linePayRouter);
// app.use('/api/alo-organic', AloOrganicRouter);
// app.use('/api/alo-organic2', AloOrganicRouter2);
app.use('/api/alo-organic3', AloOrganicRouter3);
app.use('/api/pure-medical', PureMedicalRouter);
app.use('/api/act', act);
app.use('/api/demo', demoRouter);
app.use('/api/umusic', umusic);
app.use('/api/isc', isc);
app.use('/api/common', common);
app.use('/api/custom', custom);
app.use('/api/gmo-cod', gmoCOD);
app.use('/api/gmopoint', gmoPoint);
app.use('/api/gmoPointNew', gmoPointV2);
app.use('/api/pointTown', pointTown);
app.use('/api/puppeteer', puppeteer);
app.use('/api/cv', conversation);
app.use('/api/analytic/wc', analytic_webchat);
app.use('/api/trendexpress', trendexpress);
app.use('/api/okurahome', okurahome);
app.use('/api/efo/orderHistory', efoPOrderHistoryRouter);
app.use('/api/tmjnet', efoSendCvRouter);
app.use('/api/edsps', edspsRouter);
app.use('/api/matchwatch', matchwatchRouter);
app.use('/api/matchwatchProd', matchwatchProdRouter);
app.use('/api/biyo', biyoRouter);
app.use('/api/biyo2', biyoRouter);
app.use('/api/levtech', levtechRouter);
app.use('/api/levtech2', levtechRouter2);
app.use('/api/mailchimp', mailChimp);
app.use('/api/tamagokichi', tamagokichi);
app.use('/api/escrit', escrit);
app.use('/api/chintai', chintai);
app.use('/api/minorinomi', minorinomiRouter);
app.use('/api/pulito', pulito);
app.use('/api/kyotokimono', kyotokimonoRouter);
app.use('/api/biyobot', biyobot);
app.use('/api/kateikyoushi', kateikyoushiRouter);
app.use('/api/ai-scholar', aiScholarRouter);
app.use('/api/nojima', nojimaRouter);
app.use('/api/count-boxil', boxilRouter);
app.use('/api/count-boxil2', boxilRouter2);
app.use('/api/mbhonline', mbhonline);
app.use('/api/tracking', trackingRouter);
app.use('/api/marimo', marimoRouter);
app.use('/api/zoho', zohoRouter);
app.use('/api/veritrans', veritranRouter);
app.use('/api/travel', travelRouter);
app.use('/api/deli', deliRouter);
app.use('/api/mynavi', mynaviRouter);
app.use('/api/karubi', karubiRouter);
app.use('/api/karubi_p2', karubiP2Router);
app.use('/api/karubi_p3', karubiP3Router);
app.use('/api/calbee', calbeeRouter);
app.use('/api/will', willRouter);
app.use('/api/boxUpload', boxUploadRouter);
app.use('/api/common', validateEmailRouter);
app.use('/api/nicorio', nicorioRouter);
app.use('/api/efo-ec', efoEcCartRouter);
app.use('/api/kouza', kouzaRouter);
app.use('/api/efo_cv', efoCvRouter);
app.use('/api/bellaShop', bellaShopRouter);

const services = require('./services');
app.use(services);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	//next(createError(404));
	res.json({});
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
