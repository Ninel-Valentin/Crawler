// Making the Apify's features available.
const Apify = require("apify");
// Replacing console.log with the log function from Apify's utils because of it's log levels.
const {
  utils: { log },
} = Apify;

// Finds each new link that should be crawled, on the pages that were marked with the 'ITEM' label in tools.js (I.E. the starting links)
// and marking them with the 'DETAIL' label. Each new link is found with the div.card-item a selector.
exports.ITEM = async ({ $, request }, { requestQueue }) => {
  return Apify.utils.enqueueLinks({
    $,
    requestQueue,
    selector: "div.card-item a",
    baseUrl: request.loadedUrl,
    transformRequestFunction: (req) => {
      req.userData.label = "DETAIL";
      return req;
    },
  });
};

// Each new link is processed and the crawler scrapes the data we need to collect.
exports.DETAIL = async ({ $, request }) => {
  log.debug(`Processing ${request.url}...`);
  // The name is the only h1 element with the 'page-title' class and we get it's text and remove all the doublespaces, newlines, tabs etc.
  const name = $("h1.page-title").text().replaceAll(/\s\s+/g, "");
  // Some pages' aspect differs so the price is contained by different elements after we check which type it is, we remove all the letters,
  // and dots (the numbers have a dot every 4 digits) after removing them we have a whole number.
  const price =
    $(".pricing-block .product-new-price").text() == ""
      ? $(".product-highlight .product-new-price")
          .text()
          .match(/[\d.]+/)[0]
      : $(".pricing-block .product-new-price")
          .text()
          .match(/[\d.]+/)[0]
          .replace(".", "");
  // We can check if the item is out of stock or if there are in stock many or few items left.
  const stock =
    $("div.product-page-pricing .label").text() == "Stoc epuizat"
      ? "OutOfStock"
      : "InStock";
  // Store the results to the default dataset. In local configuration,
  // the data will be stored as JSON files in ./apify_storage/datasets/default
  log.debug("Pushing data to dataset.");
  // Checking for any problems on creating the variables.
  if (!name || !price || !stock)
    throw new Error("One of the variables couldn't be retrieved");
  // If there are no problems, store the data.
  else
    await Apify.pushData({
      name,
      url: request.url,
      // The price has a format of integer_part,fractional_part(2 digits) we take all but the last 2 digits, add a dot and add the last 2 digits back.
      price: `${price.slice(0, -2)}.${price.slice(-2)}`,
      stock,
    });
};
