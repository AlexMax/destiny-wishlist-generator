const path = require("path");

module.exports = {
    apiKey: "<Insert Bungie.net API key here>",
    cacheFile: path.resolve(__dirname, "var/cache.json"),
    dataDir: "<Insert path to data directory here>",
    outDir: "<Insert path to output directory here>",
};
