const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const config = require("../wishlist.config.js");

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));

/**
 * Return cartesian product of parameters.
 *
 * Not going to lie, I didn't come up with this.
 */
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

/**
 * Call String.prototype.trim on first parameter.
 */
const stringTrim = str => {
    return str.trim();
};

/**
 * Deconstruct perk string into perk and any types contained in parenthesis.
 */
const deconstructPerk = str => {
    const decon = str.match(/(.+)\((.+)\)/);
    if (decon) {
        return {
            name: decon[1].trim(),
            types: decon[2].split(",").map(stringTrim)
        };
    } else {
        return {
            name: str.trim()
        };
    }
};

const perkTypes = new Set();

// Read our cache file.
const json = JSON.parse(fs.readFileSync(config.cacheFile));
const weaponsCache = json.weapons;
const perksCache = json.perks;

for (const file of fs.readdirSync(config.dataDir)) {
    const full = path.join(config.dataDir, file);
    const doc = yaml.safeLoad(fs.readFileSync(full));

    for (const weapon of doc) {
        // Check to see if the weapon even exists.
        if (!(weapon.name in weaponsCache)) {
            throw new Error("Cannot find weapon " + weapon.name);
        }

        if (weapon.perks) {
            // Find all permutations of perks.
            const permutations = cartesian(...weapon.perks);
            for (const perm of permutations) {
                // Check to see if we have any added info in parenthesis.
                const perks = perm.map(deconstructPerk);

                // Check for conflicting perk types.
                const perkNames = [];
                perkTypes.clear();
                for (const perk of perks) {
                    // Check to see if the perk actually exists
                    if (!(perk.name in perksCache)) {
                        throw new Error("Cannot find perk " + perk.name);
                    }
                    perkNames.push(perk.name);

                    if (perk.types) {
                        for (const type of perk.types) {
                            perkTypes.add(type);
                        }
                    }
                }

                if (perkTypes.has("PvE") && perkTypes.has("PvP")) {
                    // PvE and PvP perks cannot coexist.
                    continue;
                }

                const notes = [];
                if (perkTypes.size > 0) {
                    notes.push("(" + Array.from(perkTypes).join(", ") + ")");
                }
                if (weapon.notes) {
                    notes.push(weapon.notes);
                }
                console.debug(weapon.name, perkNames, notes);
            }
        } else {
        }
    }
}
