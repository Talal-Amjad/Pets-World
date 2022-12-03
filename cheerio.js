const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const writeStream = fs.createWriteStream("Products Price.csv");

// Write Headers
writeStream.write(`Product , Price \n`);

request("https://reempetstore.com/product-category/dogs/dog-accessories/", (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    $(".astra-shop-summary-wrap").each((i, el) => {
      const t_name = $(el).find("h2.woocommerce-loop-product__title").text();
      const price = $(el).find("bdi").text();
      // const t_email = $(el)
      //   .find("ul > li >p:nth-child(1)")
      //   .text()
      //   .replace(/,/, "");
      console.log(`${t_name} has price ${price}`);
      // Write Row To CSV
      writeStream.write(`${t_name}, ${price} \n`);
    });

    console.log("Scraping Done...");
  }
});
