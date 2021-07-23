const cheerio = require("cheerio");
const request = require("request");

module.exports = {
  scrape: (req, res) => {
    const scrapeArr = [];
    // First, we grab the body of the html with axios
    request(
      "https://www.npr.org/sections/music-news/",
      function (error, response, body) {
        console.log("error:", error); // Print the error if one occurred
        console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(body);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article").each(function (i, element) {
          // Save an empty result object
          var result = {};
          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this)
            .children(".item-info-wrap")
            .children()
            .children("h2")
            .children("a")
            .text();
          result.link = $(this)
            .children(".item-info-wrap")
            .children()
            .children("h2")
            .children("a")
            .attr("href");
          result.date = $(this)
            .children(".item-info-wrap")
            .children()
            .children("p")
            .children("a")
            .children("time")
            .children("span")
            .text()
            .replace("•", "")
            .trim();
          result.summary = $(this)
            .children(".item-info-wrap")
            .children()
            .children("p")
            .children("a")
            .contents()
            .eq(1)
            .text();
          result.image = $(this)
            .children(".item-image")
            .children(".imagewrap")
            .children("a")
            .children("picture")
            .children("img")
            .attr("src");
          // Create a new Article using the `result` object built require scraping
          result.title &&
            result.link &&
            result.date &&
            result.summary &&
            scrapeArr.push(result);
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        // console.log(scrapeArr);
        res.send(scrapeArr);
      }
    );
  },
};
