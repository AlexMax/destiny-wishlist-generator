const fs = require("fs");
const yaml = require("js-yaml");

const doc = yaml.safeLoad(fs.readFileSync("wishlist.yaml"));
console.debug(doc[1]);
