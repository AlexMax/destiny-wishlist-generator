## How does this work?

This ain't meant to be used by anybody yet. If you _really_ want to try it...

1. Copy `wishlist.default.config.js` to `wishlist.config.js` and fill out your API key.
2. Run `npm run build-cache` to cache weapons and perks.
3. Modify the wishlists in the data directory.
4. Run `npm run build` to actually generate wishlists based on wishlist data.

## Data format

The input data format is in [YAML][1] format.

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
# Rolls that have a PvE or PvP-specific perk will have a (PvE) or (PvP) added
# to the front of their notes.  Rolls that mix PvE and PvP perks will be
# automatically filtered out and not wishlisted.
  - - A suggested perk for slot 4 that is only viable with mouse and keyboard (MKb)
    - A suggested perk for slot 4 that is only viable with a controller (Cont)
# Rolls that mix mouse and keyboard and controller perks will be similarly
# filtered out.
    - A suggested perk for slot 4 that is only viable with a controller in PvE (Cont, PvE)
# Rolls can be specific to both content and control style.

# You can also wishlist a weapon without perks.
- name: Name of the weapon
  source: Where the perk suggestions came from. # Not optional.
  notes: Any notes about the weapon you want to show up in DIM. # Optional
  trash: true # Only works without perk suggestions.
```

## Notes

The format of DIM wishlists can be found [here][2].

[1]: https://yaml.org/
[2]: https://github.com/DestinyItemManager/DIM/blob/master/docs/COMMUNITY_CURATIONS.md
