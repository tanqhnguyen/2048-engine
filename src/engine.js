const _ = require('lodash');

const DEFAULT_SIZE = 4;

const DIRECTIONS = {
  left(x, y) {
    return {
      x: x - 1,
      y
    };
  },
  right(x, y) {
    return {
      x: x + 1,
      y
    };
  },
  up(x, y) {
    return {
      x,
      y: y - 1
    };
  },
  down(x, y) {
    return {
      x,
      y: y + 1
    };
  }
}

// 20% of having a 4
const RANDOM_TILE_VALUES = [
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  4
];

// 40% of having 2 random tiles
const RANDOM_TILE_AMOUNT = [
  1,
  1,
  1,
  2,
  2
];

class Engine {
  constructor(width = DEFAULT_SIZE, height = DEFAULT_SIZE) {
    this.width = width;
    this.height = height;

    this.tiles = new Map();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = this.tileIndex(x, y);
        const tile = {
          x, y, value: null
        };
        this.tiles.set(index, tile);
      }
    }
    this.states = [];
  }

  tileIndex(x, y) {
    return `${x}-${y}`;
  }

  setTile(x, y, value) {
    const index = this.tileIndex(x, y);
    let tile = this.tiles.get(index);
    if (!tile) {
      tile = {x, y};
      this.tiles.set(index, tile);
    }

    tile.value = value;
    return this;
  }

  getTiles() {
    return this.tiles;
  }

  getTile(x, y) {
    const index = this.tileIndex(x, y);
    return this.tiles.get(index);
  }

  getEmptyTiles() {
    return [...this.tiles.values()].filter(({value}) => {
      return !value;
    });
  }

  printTile({value}, paddingSize = 4) {
    value = value || '';
    return '[' + _.padStart(value, paddingSize) + ']';
  }

  print(options = {}) {
    const {
      returnString,
      paddingSize = 4
    } = options;

    let string = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.getTile(x, y);
        const isLast = x === this.width - 1;
        string += this.printTile(tile, paddingSize);
        if (isLast) string += '\n';
      }
    }

    if (returnString) return string.trim();
    console.log(string);
  }

  fillRandomTiles(amount) {
    const emptyTiles = this.getEmptyTiles();

    if (!emptyTiles.length) return null;

    amount = amount || _.sample(RANDOM_TILE_AMOUNT);
    amount = Math.min(amount, emptyTiles.length);

    const randomTiles = _.sampleSize(emptyTiles, amount);
    randomTiles.forEach((tile) => {
      tile.value = _.sample(RANDOM_TILE_VALUES);
    });

    return randomTiles;
  }

  moveTile(thisTile, direction) {
    if (!thisTile || thisTile.value === null) return null;
    const prevTilePos = DIRECTIONS[direction](thisTile.x, thisTile.y);
    const prevTile = this.getTile(prevTilePos.x, prevTilePos.y);

    if (prevTile) {
      if (prevTile.value === null) {
        prevTile.value = thisTile.value;
        thisTile.value = null;
        return this.moveTile(prevTile, direction);
      } else if (prevTile.value === thisTile.value) {
        prevTile.value = thisTile.value * 2;
        thisTile.value = null;
        return prevTile;
      }
    }

    return thisTile;
  }

  move(direction, fillRandomTiles) {
    if (Object.keys(DIRECTIONS).indexOf(direction) === -1) return null;
    const tiles = [...this.tiles.values()];

    if ([
      'right',
      'down'
    ].indexOf(direction) !== -1) tiles.reverse();

    const beforeMoveEmptyTiles = this.getEmptyTiles().length;

    const moved = tiles.map((tile) => {
      const destination = this.moveTile(tile, direction);
      if (!destination) return null;
      if (destination.x === tile.x
        && destination.y === tile.y) return null;
      return {
        from: tile,
        to: destination
      };
    }).filter(Boolean);

    if (fillRandomTiles && moved.length) {
      const result = this.fillRandomTiles();
      if (!result && moved.length === 0) {
        this.isEnded = true;
        throw new Error('End');
      }
    }

    return moved;
  }
}

module.exports = Engine;