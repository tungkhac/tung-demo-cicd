// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var cron = require('node-cron');
var crawlDataTravel = require('./cronjob/travel.class');
var crawMynaviRecommend = require('./cronjob/mynavi.class');
var LeverageCron = require('./cronjob/leverage.class');
var karubi = require('./cronjob/karubi.class');
//var botchanAccount = require('./cronjob/botchan_account.class.js');
var checkEFOCV = require('./cronjob/check.efo.class');
var checkEFO2CV = require('./cronjob/check.efo2.class');
var TryPlusCron = require('./cronjob/tryplus.class');
const rakurakuRefreshToken = require('./cronjob/rakurakuRefreshToken');
const FukuuroCron = require('./cronjob/fukuuro.class');
const ChurnPreventionBulkhommeCron = require('./cronjob/churn_prevention_bulkhomme');
const ChurnPreventionItemFTGCron = require('./cronjob/churn_prevention_item_ftg');

//crawlDatatravelTourArea = new crawlDataTravel.CrawlDataTour('area');
//crawlDatatravelTourTopic = new crawlDataTravel.CrawlDataTour('topic');
//crawlDataTravelGuide = new crawlDataTravel.CrawlDataGuide('guide');

//***check_efo_cv
const checkEFOCVcron = new checkEFOCV();
const checkEFO2CVcron = new checkEFO2CV();
cron.schedule('0 0 */1 * * *', () => {
    console.log('========== RUNNNING checkEFOCV CRON ==========');
    checkEFOCVcron.check();
    checkEFO2CVcron.check();
}, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
});

cron.schedule('0 0 4 1 * *', () => {
    console.log('========== RUNNNING Refresh Rakuraku Token at 4:00 AM on the first day each month ==========');
    rakurakuRefreshToken.run();
}, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
});


// karubi
var k = new karubi();
cron.schedule('00 1 2 * * *', () => {
    console.log('Running crawl data karubi every day at 2 AM  ');
    k.readGoogleSheet();
},
    {
        scheduled: true,
        timezone: "Asia/Tokyo"
    }
);

cron.schedule('0 */1 * * *', function() {
        console.log('Running updateReportTracking  ');
        k.updateReportTracking();
    },
    {
        scheduled: true,
        timezone: "Asia/Tokyo"
    }
);

//** Mynavi */
var crawMynavi = new crawMynaviRecommend();
cron.schedule('0 10 4 * * *', () => {
    console.log('Running crawl data recomned mynavi every day at 4:10 AM  ');
    crawMynavi.getDataRecommend();
},
    {
        scheduled: true,
        timezone: "Asia/Tokyo"
    }
);

cron.schedule('00 5 2 10 * *', () => {
    console.log('Running crawl data mynavi Point every month at 10/2:5 AM  ');
    crawMynavi.getDataPointGoogleSheet();
},
    {
        scheduled: true,
        timezone: "Asia/Tokyo"
    }
);

const leverageCron = new LeverageCron();
cron.schedule('0 0 0,6,12,18 * * *', () => {
    console.log('========== RUNNNING LEVERAGE CRON ==========');
    leverageCron.run();
}, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
});

const tryPlusCron = new TryPlusCron();
cron.schedule('0 0 0,6,12,18 * * *', () => {
    console.log('========== RUNNNING TRYPLUS CRON ==========');
    tryPlusCron.run();
}, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
});



//cron.schedule('00 55 23 * * *', () => {
//    console.log('Running crawl data travel every day at 12 PM  ');
//    crawlDatatravelTourArea.crawlData();
//    crawlDatatravelTourTopic.crawlData();
//    crawlDataTravelGuide.crawlData();
//},
//    {
//        scheduled: true,
//        timezone: "Asia/Tokyo"
//    }
//);

const fukuuroCron = new FukuuroCron();
cron.schedule('0 0 0,6,12,18 * * *', () => {
    console.log('========== RUNNNING FUKUURO CRON ==========');
    fukuuroCron.run();
}, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
});

const churnPreventionBulkhommeCron = new ChurnPreventionBulkhommeCron();
cron.schedule('0 0 1,2,9,10 * * *', () => {
    console.log('========== RUNNNING ChurnPreventionBulkhomme CRON ==========');
    churnPreventionBulkhommeCron.run();
}, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
});

const churnPreventionItemFTGCron = new ChurnPreventionItemFTGCron();
cron.schedule('0 30 0 * * *', () => {
    console.log('========== RUNNNING ChurnPreventionItemFTGCron CRON ==========');
    churnPreventionItemFTGCron.run();
}, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
});
