const fs = require("fs");
const superagent = require("superagent");

const config = require("../wishlist.config.js");
const API_KEY = config.apiKey;
const API_PLATFORM_URL = "https://www.bungie.net/Platform";
const API_DATA_URL = "https://www.bungie.net";

const API_WEAPONS = new Set([
    "Auto Rifle",
    "Combat Bow",
    "Fusion Rifle",
    "Grenade Launcher",
    "Hand Cannon",
    "Linear Fusion Rifle",
    "Machine Gun",
    "Pulse Rifle",
    "Rocket Launcher",
    "Scout Rifle",
    "Shotgun",
    "Sidearm",
    "Sniper Rifle",
    "Submachine Gun",
    "Sword",
    "Trace Rifle"
]);
const API_PERKS = new Set([
    "Barrel",
    "Blade",
    "Guard",
    "Launcher Barrel",
    "Magazine",
    "Sight",
    "Trait"
]);

(async () => {
    // Obtain the latest item manifest from Bungie.
    const manifest = await superagent
        .get(API_PLATFORM_URL + "/Destiny2/Manifest/")
        .set("X-API-Key", API_KEY);
    const dataURL =
        manifest.body.Response.jsonWorldComponentContentPaths.en
            .DestinyInventoryItemLiteDefinition;
    const data = await superagent.get(API_DATA_URL + dataURL);

    const weapons = {};
    const perks = {};

    // Parse the item manifest for all weapons and perks.
    for (const id in data.body) {
        const item = data.body[id];
        const name = item.displayProperties.name;
        const type = item.itemTypeDisplayName;

        if (API_WEAPONS.has(type)) {
            if (name in weapons) {
                weapons[name].id.push(id);
            } else {
                weapons[name] = {
                    id: [id],
                    type: type
                };
            }
        } else if (API_PERKS.has(type)) {
            if (name in perks) {
                perks[name].id.push(id);
            } else {
                perks[name] = {
                    id: [id],
                    type: type
                };
            }
        }
    }
    fs.writeFileSync(
        config.cacheFile,
        JSON.stringify({
            weapons: weapons,
            perks: perks
        })
    );
})();
