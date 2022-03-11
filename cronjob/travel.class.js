// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const Parent = require('../routes/parent.class');
const mode = require('../model');
const CustomTravelTour = mode.CustomTravelTour;
const CustomTravelGuide = mode.CustomTravelGuide;
const CustomTravelCrawlDataHistory = mode.CustomTravelCrawlDataHistory;
const data_travel = require('../data/travel').data;
const headless = true;

class CrawlData extends Parent {

    constructor(type) {
        super();
        this.browser = null;
        this.maxTimeFailer = 10;
        this.start_time = 0;
        this.end_time = 0;
        this.is_finish = 0;
        this.is_running = 0;
        this.list_data_save = [];
        this.list_link_page = [];
        this.done_get_link = 0;
        this.list_link_done = [];
        this.numberFailer = 0;
        this.type = type;
    }

    async startCraw() {
        if (this.numberFailer == 0) {
            this.is_running = 1;
            this.browser = await this.initBrowser(headless);
            this.start_time = +new Date();
            console.log('start crawl at ', new Date().toISOString(), this.start_time, this.type);
        }
    }

    async finishCraw() {
        this.end_time = +new Date();
        await new Promise((resolve, reject) => {
            try {
                let data_insert = {
                    type: this.type,
                    count:this.list_data_save.length,
                    time_start: this.start_time,
                    time_end: this.end_time,
                    time: this.end_time - this.start_time,
                    status: this.is_finish ? true : false,
                    created_at: new Date()
                }
                let insert_obj = new CustomTravelCrawlDataHistory(data_insert);
                insert_obj.save((err, result) => {
                    if (err) {
                        reject(err);
                    }
                    if (result) {
                        resolve(true)
                    }
                });
            } catch (error) {
                reject(error)
            }
        });

        console.log('crawl start at  ', this.type, new Date().toISOString(), this.start_time);
        console.log('crawl finish at  ', this.type, new Date().toISOString(), this.end_time);
        console.log('crawl in ', this.type, this.end_time - this.start_time, ' miniseconds');
        this.is_running = 0;
        this.start_time = 0;
        this.end_time = 0;
        this.list_data_save = [];
        this.list_link_page = [];
        this.done_get_link = 0;
        this.list_link_done = [];
        this.numberFailer = 0;
        this.is_finish = 0;
        await this.browser.close();
    }

    crawlData() { }

    getContentOfPage() { }

    getLinkPage() { }

}

class CrawlDataTour extends CrawlData {
    constructor(type) {
        super(type);
    }
    // Overide
    async crawlData() {
        if(this.is_running == 0 || ( this.is_running ==1 && this.numberFailer > 0)){
            try {
                await this.startCraw();
                let list_link = this.type == 'area' ? data_travel.list_link_area : data_travel.list_link_topic;
                if (this.done_get_link == 0) {
                    await this.asyncForEach(list_link, async (tour, index) => {
                        if (tour.status) {
                            await this.getLinkPage(tour);
                        }
                    });
                    this.done_get_link = 1;
                    console.log('done get link ', this.type);
                }
    
                await this.asyncForEach(this.list_link_page, async (link_page_object, index) => {
                    if (!this.list_link_done.includes(link_page_object.link)) {
                        await this.getContentOfPage(link_page_object);
                    }
                });
                console.log("get data ok ready save in database ", this.type);
                await new Promise((resolve, reject) => {
                    try {
                        if (this.list_data_save.length) {
                            CustomTravelTour.remove({ type: this.type }, (err) => {
                                resolve(true)
                            });
                        }
                    } catch (error) {
                        reject(error)
                    }
                });
                await this.asyncForEach(this.list_data_save, async (item, index) => {
                    item.tour_id = index;
                    await CustomTravelTour.updateOne({ tour_id: index, type: this.type }, {
                        $set: item
                    }, { upsert: true }, (err, result) => {
                        if (err) {
                            console.log('Have error when insert data', item);
                        } else {
                        }
                    });
                });
                this.is_finish = 1;
                this.finishCraw();
            } catch (error) {
                this.numberFailer++;
                console.log('Number_failer ---> ', this.type, this.numberFailer);
                if (this.numberFailer < this.maxTimeFailer) {
                    this.crawlData()
                } else {
                    this.finishCraw();
                    console.log(' can not craw data tour', this.type);
                }
                console.log('have error when crawl data tour', error)
            }
        }else{
            console.log('The previous run has not finished you cannot create new ', this.type);
        }
       
    }

    // Overide
    async getContentOfPage(link_page_object) {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.initPage(this.browser, ["font", "stylesheet", "script", "image"]);
                await page.goto(link_page_object.link, { waitUntil: 'networkidle0' });

                const element_page = data_travel.element.page_detail_tour;
                const list_link_tour = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.tour_link), element => element.href),
                    element_page
                );
                const list_title = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.title), element => element.textContent),
                    element_page
                );
                const list_price_note = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.price_note), element => element.textContent),
                    element_page
                );
                const list_price = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.price), element => element.textContent),
                    element_page
                );
                await this.asyncForEach(list_title, async (title, i) => {
                    let element_image = `div.resultlist > div:nth-child(${i}) #pntDtl > img`;
                    let link_image = "https://botchan.blob.core.windows.net/production/uploads/5b8a525ca24a611c48155218/5b90f8ab166ea.png";
                    if (await page.$(element_image) !== null) {
                        link_image = await page.$eval(element_image, el => el.src);
                    }
                    let data_save = {
                        type: link_page_object.type,
                        name_topic_area: link_page_object.name_topic_area,
                        link_page: link_page_object.link,
                        title: title,
                        price: list_price[i] ? list_price[i] : 0,
                        price_note: list_price_note[i] ? list_price_note[i] : 0,
                        link_tour: list_link_tour[i] ? list_link_tour[i] : "",
                        link_image: link_image
                    };
                    this.list_data_save.push(data_save);
                });
                await page.close();
                this.list_link_done.push(link_page_object.link);
                console.log('done ---> ', this.type, this.list_data_save.length);
                resolve(true);
            } catch (error) {
                reject(error)
            }

        });
    }

    // Overide
    getLinkPage(tour) {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.initPage(this.browser, ["font", "stylesheet", "script", "image"]);
                await page.goto(tour.link, { waitUntil: 'networkidle0' });
                var element_page = data_travel.element.tour;

                var list_page = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.page_info), element => element.href),
                    element_page
                );
                var last_page = 1;
                var generate_link_page = tour.link;
                list_page.forEach(page => {
                    if (page) {
                        let list_page_info = page.split("/49");
                        if (list_page_info.length == 2) {
                            generate_link_page = list_page_info[0];
                            let current_page = parseInt(list_page_info[1].replace("/", ""));
                            if (last_page < current_page) {
                                last_page = current_page;
                            }
                        }
                    }
                })
                console.log('last_page', tour.value, last_page);

                for (let i = 1; i <= last_page; i++) {
                    let link_page = tour.link;
                    if(i > 1){
                        link_page = generate_link_page + "/49" + i + "/";
                    }
                    if (!this.list_link_page.find(item => item.link == link_page)) {
                        this.list_link_page.push(
                            {
                                link: link_page,
                                name_topic_area: tour.value,
                                type: this.type
                            }
                        );
                    }
                }
                await page.close();
                resolve(true);
            } catch (error) {
                reject(error)
            }
        });
    }

    getNumberOflink(link) {
        if (link == null) {
            return 1;
        } else {
            link_page_list = link.split("")
        }

    }
}

class CrawlDataGuide extends CrawlData {
    constructor(type) {
        super(type);
    }
    // overide
    async crawlData() {
        if(this.is_running == 0 || ( this.is_running ==1 && this.numberFailer > 0)){
            try {
                await this.startCraw();
                if (this.done_get_link == 0) {
                    await this.getLinkPage(data_travel.link_guide);
                    console.log('done get link guide')
                }
    
                await this.asyncForEach(this.list_link_page, async (link_page_object, index) => {
                    if (!this.list_link_done.includes(link_page_object.link)) {
                     await this.getContentOfPage(link_page_object, index);
                    }
                });
    
                console.log("Get data ok, guide  ");
                await new Promise((resolve, reject) => {
                    try {
                        if (this.list_data_save.length) {
                            CustomTravelGuide.remove({}, (err) => {
                                resolve(true)
                            });
                        }
                    } catch (error) {
                        reject(error)
                    }
                });
                await this.asyncForEach(this.list_data_save, async (item, index) => {
                    item.guide_id = index;
                    await CustomTravelGuide.updateOne({ guide_id: index }, {
                        $set: item
                    }, { upsert: true }, (err, result) => {
                        if (err) {
                            console.log('Have error when insert data guide', item);
                        } else {
                        }
                    });
                });
                this.is_finish = 1;
    
                this.finishCraw();
            } catch (error) {
                console.log('list data save is done ready save in database', this.type);
                this.numberFailer++;
                console.log('Number_failer ---> guide ', this.numberFailer);
                if (this.numberFailer < this.maxTimeFailer) {
                    this.crawlData();
                } else {
                    this.finishCraw();
                    console.log(' can not craw data guide', this.type);
                }
                console.log('have error when crawl data guide', error)
            }
        }else{
            console.log('The previous run has not finished you cannot create new ', this.type);
        }
    }

    //Overide
    getLinkPage(link) {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.initPage(this.browser, ["font", "stylesheet", "script", "image"]);
                await page.goto(link, { waitUntil: 'networkidle0' });
                var element_page = data_travel.element.guide;
                var list_page = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.page_info), element => element.href),
                    element_page
                );
                var last_page = 0;
                list_page.forEach(page => {
                    let current_page = page ? parseInt(page.replace("https://www.travel.co.jp/guide/archive/list/world/p64/", "").replace("/", "")) : 0;
                    if (last_page < current_page) {
                        last_page = current_page
                    }
                })
                console.log('last_page', last_page);
                for (let i = 1; i <= last_page; i++) {
                    let link_page = link + i + "/";
                    if (!this.list_link_page.find(item => item.link == link_page)) {
                        this.list_link_page.push(
                            {
                                link: link_page
                            }
                        );
                    }
                }
                await page.close();
                resolve(true);
            } catch (error) {
                reject(error)
            }
        });
    }

    // Overide
    async getContentOfPage(link_page_object, index_page) {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.initPage(this.browser, []);
                await page.goto(link_page_object.link, { waitUntil: 'networkidle0' });
                const element_page = data_travel.element.page_detail_guide;
                await this.scrollToBottom(page);
                if (index_page == 0) {
                    await this.getContentOfPageDetail('matome', page, element_page, link_page_object.link);
                }
                await this.getContentOfPageDetail('article', page, element_page, link_page_object.link);
                this.list_link_done.push(link_page_object.link);
                await page.close();
                resolve(true);
            } catch (error) {
                reject(error)
            }
        });
    }

    async getContentOfPageDetail(type, page, element_page, link_page) {
        return new Promise(async (resolve, reject) => {
            try {
                const list_link = await page.evaluate(
                    (element_page, type) => Array.from(document.querySelectorAll(element_page[type + '_link']), element => element.href),
                    element_page, type
                );
                const list_title = await page.evaluate(
                    (element_page, type) => Array.from(document.querySelectorAll(element_page[type + '_title']), element => element.textContent),
                    element_page, type
                );

                const list_image = await page.evaluate(
                    (element_page, type) => Array.from(document.querySelectorAll(element_page[type + '_image']), element => element.src),
                    element_page, type
                );
                list_title.forEach((title, index) => {
                    let data_save = {
                        type: type,
                        title: title,
                        link: list_link[index],
                        link_page: link_page,
                        link_image: list_image[index],
                    };

                    this.list_data_save.push(data_save);
                });
                console.log('done ---> ', this.type, this.list_data_save.length);
                resolve(true);
            } catch (error) {
                reject(error);
            }

        });
    }

    async scrollToBottom(page) {
        const distance = 50; // should be less than or equal to window.innerHeight
        const delay = 50;
        while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
            await page.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
            await page.waitFor(delay);
        }
    }

}

module.exports =
    {
        CrawlDataTour: CrawlDataTour,
        CrawlDataGuide: CrawlDataGuide
    }