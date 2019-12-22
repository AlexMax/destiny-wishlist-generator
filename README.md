## How does this work?

This is a script that takes files containing perk suggestions for various Destiny 2 weapons and turns them into wishlist files that can be used with DIM.

If all you want is a wishlist to use with DIM, I keep my own personal curated suggestions over at [AlexMax/destiny-wishlists][1].  That repository also contains data files that you can use as a base for your own perk lists.  That said, if you _really_ want to run the script yourself...

1. Clone the repository and install the dependencies with `npm`.
2. Copy `wishlist.default.config.js` to `wishlist.config.js` and fill out all of the parameters.  In particular, you will need a Bungie API key in order to retrieve the latest set of weapon and perk data, as well as a set of data files to process.
3. Run `npm run build-cache` to cache weapons and perks.
4. Run `npm run build` to actually generate the wishlist based on the data files.

## Data format

The input data format is in [YAML][2] format.

```yaml
# Wishlist a weapon with specific perks.
- name: Name of the weapon
  source: Where the perk suggestions came from. # Not optional.
  notes: Any notes about the weapon you want to show up in DIM. # Optional
  perks:
  - - A suggested perk for slot 1.
    - Another suggested perk for slot 1.
  - - A suggested perk for slot 2.
    - Another suggested perk for slot 2.
  - - A suggested perk for slot 3 that is only viable in PvE (PvE)
    - A suggested perk for slot 3 that is only viable in PvP (PvP)
    # Rolls that have a PvE or PvP-specific perk will have a (PvE) or (PvP)
    # added to the front of their notes.  Rolls that mix PvE and PvP perks
    # will be automatically filtered out and not wishlisted.
  - - A suggested perk for slot 4 that is only viable with mouse and keyboard (MKb)
    - A suggested perk for slot 4 that is only viable with a controller (Cont)
    # Rolls that mix mouse and keyboard and controller perks will be similarly
    # filtered out.
    - A suggested perk for slot 4 that is only viable with a controller in PvE (Cont, PvE)
    # Rolls can be specific to both content and control style.
  masterworks:
  - A suggested masterwork
  - Another suggested masterwork
    # Masterwork suggestions are just added to the notes of the roll.

# You can also wishlist a weapon without perks.
- name: Name of the weapon
  source: Where the perk suggestions came from. # Not optional.
  notes: Any notes about the weapon you want to show up in DIM. # Optional
  trash: true # Only works without perk suggestions.
```

## Notes

The format of DIM wishlists can be found [here][3].

[1]: https://github.com/AlexMax/destiny-wishlists
[1]: https://yaml.org/
[2]: https://github.com/DestinyItemManager/DIM/blob/master/docs/COMMUNITY_CURATIONS.md
