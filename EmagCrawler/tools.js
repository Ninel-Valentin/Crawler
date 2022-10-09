// Making the Apify and routes.js' features available.
const Apify = require('apify');
const routes = require('./routes');
// Replacing console.log with the log function from Apify's utils because of it's log levels.
const {
    utils: { log },
} = Apify;

exports.getSources = async () => {
    log.debug('Getting sources.');
    // Getting the starting links from the INPUT.json file.
    const input = await Apify.getInput();
    // Mapping each link created and marking them with the 'ITEM' label.
    return input.input.categories.map(item => ({
        url: `https://www.emag.ro/${item}`,
        userData: {
            label: 'ITEM',
        },
    }));
};

// We create an route which consits of links that haven't been checked by the crawler yet
exports.createRouter = globalContext => {
    return async function(routeName, requestContext) {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, globalContext);
    };
};