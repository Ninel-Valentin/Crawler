// Making the Apify and tools.js' features available.
const Apify = require('apify');
const tools = require('./tools');
// Replacing console.log with the log function from Apify's utils because of it's log levels.
const {
    utils: { log },
} = Apify;

// This is the main function ran by Apify.
Apify.main(async () => {
    log.info('Starting actor.');
    // Create the requestList constant with it's list name 'categories' using the getSources() function from the tools.js file.
    const requestList = await Apify.openRequestList('categories', await tools.getSources());
    // Create a requestQueue instance.
    const requestQueue = await Apify.openRequestQueue();
    // Create a router using the createRouter function from the tools.js file passing the requestQueue instance as a parameter.
    const router = tools.createRouter({ requestQueue });

    log.debug('Setting up crawler.');
    // Create an instance of a CheerioCrawler having:
    //      ~ 100 maximum requests/crawl
    //      ~ the requestList and requestQueue passed as options
    //      ~ a custom handlePageFunction that processes each request passed in the requestQueue
    const crawler = new Apify.CheerioCrawler({
        maxRequestsPerCrawl: 100,
        requestList,
        requestQueue,
        handlePageFunction: async context => {
            const { request } = context;
            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);
        },
    });

    log.info('Starting the crawl.');
    // Start the crawler.
    await crawler.run();
    log.info('Actor finished.');
});