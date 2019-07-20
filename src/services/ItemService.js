const Random = require('../utility/Random.js');
const Constants = require('../utility/Constants.js');

class ItemService {
  async openCrate(crate, items) {
    const roll = Random.roll();
    const weapons = items.filter(x => x.type === 'gun' || x.type === 'knife' || x.type === 'armour').filter(x => x.crate_odds).sort((a, b) => a.crate_odds - b.crate_odds);
    const fullWeaponOdds = weapons.map(x => x.crate_odds).reduce((accumulator, currentValue) => accumulator + currentValue);
    const rollWeapon = Random.nextInt(1, fullWeaponOdds);
    const ammunation = items.filter(x => x.type === 'bullet' && x.crate_odds).filter(x => x.crate_odds).sort((a, b) => a.crate_odds - b.crate_odds);
    const fullAmmunationOdds = ammunation.map(x => x.crate_odds).reduce((accumulator, currentValue) => accumulator + currentValue);
    const rollAmmo = Random.nextInt(1, fullAmmunationOdds);
    let cumulativeWeapons = 0;
    let cumulativeAmmunition = 0;

    if (roll <= crate.item_odds) {
      for (let i = 0; i < weapons.length; i++) {
        const weapon = weapons[i];
        cumulativeWeapons += weapon.crate_odds;
        if (rollWeapon <= cumulativeWeapons) {
          return weapon;
        }
      }
    } else {
      for (let i = 0; i < ammunation.length; i++) {
        const ammo = ammunation[i];
        cumulativeAmmunition += ammo.crate_odds;
        if (rollAmmo <= cumulativeAmmunition) {
          return ammo;
        }
      }
    }
  }

  async massOpenCrate(quanity, crate, items) {
    const itemsWon = {};

    for (let i = 0; i < quanity; i++) {
      const item = await this.openCrate(crate, items);

      if (!Object.prototype.hasOwnProperty.call(itemsWon, item.names[0])) {
        itemsWon[item.names[0]] = 0;
      }

      itemsWon[item.names[0]]++;
    }
    return itemsWon;
  }

  fish(weapon, items) {
    const roll = Random.roll();
    const food = items.filter(x => x.type === 'fish').filter(x => x.acquire_odds).sort((a, b) => a.acquire_odds - b.acquire_odds);
    const fullFoodOdds = food.map(x => x.acquire_odds).reduce((accumulator, currentValue) => accumulator + currentValue);
    const rollOdds = Random.nextInt(1, fullFoodOdds);
    let cumulative = 0;

    if (roll <= weapon.accuracy) {
      for (let i = 0; i < food.length; i++) {
        const fish = food[i];
        cumulative += fish.acquire_odds;
        if (rollOdds <= cumulative) {
          return fish;
        }
      }
    }
  }

  hunt(weapon, items) {
    const roll = Random.roll();
    const food = items.filter(x => x.type === 'meat').filter(x => x.acquire_odds).sort((a, b) => a.acquire_odds - b.acquire_odds);
    const fullFoodOdds = food.map(x => x.acquire_odds).reduce((accumulator, currentValue) => accumulator + currentValue);
    const rollOdds = Random.nextInt(1, fullFoodOdds);
    let cumulative = 0;

    if (roll <= weapon.accuracy) {
      for (let i = 0; i < food.length; i++) {
        const meat = food[i];
        cumulative += meat.acquire_odds;
        if (rollOdds <= cumulative) {
          return meat;
        }
      }
    }
  }

  reduceDamage(dbUser, damage, items) {
    const armours = items.filter(x => x.type === 'armour');
    let reduce = damage;

    for (let i = 0; i < armours.length; i++) {
      if (dbUser.inventory[armours[i].names[0]] && dbUser.inventory[armours[i].names[0]] > 0) {
        reduce *= (100 - armours[i].damage_reduction) / 100;
      }
    }

    return Math.round(reduce);
  }

  async takeInv(killerId, deadUserId, guildId, db) {
    const dbUser = await db.userRepo.getUser(deadUserId, guildId);

    for (const key in dbUser.inventory) {
      const itemsGained = 'inventory.' + key;
      const amount = dbUser.inventory[key];

      await db.userRepo.updateUser(killerId, guildId, { $inc: { [itemsGained]: amount } });
    }
  }

  capitializeWords(str) {
    if (isNaN(str)) {
      return str.replace('_', ' ').replace(Constants.data.regexes.capitalize, x => x.charAt(0).toUpperCase() + x.substr(1));
    }

    return str;
  }
}

module.exports = new ItemService();
