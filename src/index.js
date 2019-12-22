const fs = require("fs");
const path = require("path");
const util = require("util");
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

/**
 * Return a formatted wishlist row.
 */
const formatPerks = (weapon, perks, notes = null) => {
    if (notes && notes.length > 0) {
        return util.format(
            "dimwishlist:item=%d&perks=%s#notes:%s",
            weapon,
            perks.join(","),
            notes.join(" ")
        );
    } else {
        return util.format(
            "dimwishlist:item=%d&perks=%s",
            weapon,
            perks.join(",")
        );
    }
};

/**
 * Format a standalone weapon suggestion.
 */
const formatWeapon = (weapon, trash = false, notes = null) => {
    if (notes && notes.length > 0) {
        return util.format(
            "dimwishlist:item=%s%d#notes:%s",
            trash ? "-" : "",
            weapon,
            notes.join(" ")
        );
    } else {
        return util.format("dimwishlist:item=%s%d", trash ? "-" : "", weapon);
    }
};

const perkTypes = new Set();

// Open an output file.
const outfile = fs.createWriteStream(config.outDir + "/wishlist.txt", {
    flags: "w"
});
outfile.write(util.format("title:%s\r\n", "Generated Wishlist"));
outfile.write(
    util.format(
        "description:%s\r\n",
        "Generated by destiny-wishlist-generator."
    )
);

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
        if (!weapon.source) {
            throw new Error('No source provided for ' + weapon.name);
        }

        outfile.write(util.format("\r\n// %s\r\n// %s\r\n", weapon.name, weapon.source));
        if (weapon.notes) {
            // Notes are not written in notes: format because if they
            // exist, they'll be added to every roll.
            outfile.write(util.format("// %s\r\n", weapon.notes));
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

                // Construct notes.
                const notes = [];
                if (perkTypes.size > 0) {
                    notes.push("(" + Array.from(perkTypes).join(", ") + ")");
                }
                if (weapon.notes) {
                    notes.push(weapon.notes);
                }

                // Assemble ID's.
                //
                // Every weapon/perk permutation itself could have
                // permutations due to dupes in Bungie's database.
                const idPerms = [
                    weaponsCache[weapon.name].id,
                    ...perkNames.map(perk => {
                        return perksCache[perk].id;
                    })
                ];
                const rows = cartesian(...idPerms);
                for (const row of rows) {
                    const wid = row.shift();
                    outfile.write(formatPerks(wid, row, notes) + "\r\n");
                }
            }
        } else {
            const trash = weapon.trash ? weapon.trash : false;
            const notes = weapon.notes ? [weapon.notes] : [];
            for (const wid of weaponsCache[weapon.name].id) {
                outfile.write(formatWeapon(wid, trash, notes));
            }
        }
    }
}
