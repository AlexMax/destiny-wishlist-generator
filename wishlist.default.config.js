const path = require("path");

module.exports = {
    apiKey: "<Insert API Key Here>",
    cacheFile: path.resolve(__dirname, "var/cache.json"),
    dataDir: path.resolve(__dirname, "data"),
    outDir: path.resolve(__dirname, "out")
};
