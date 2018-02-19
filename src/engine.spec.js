const Engine = require('./engine'),
      expect = require('chai').expect;

describe('Engine', () => {
  let engine;

  beforeEach(() => {
    engine = new Engine();
  });

  it('should construct the initial tiles', () => {
    const tiles = engine.getTiles();
    expect(tiles.size).to.equal(16);
    [...tiles.values()].forEach(({value}) => {
      expect(value).to.equal(null);
    });
  });

  it('should allow setting the value for a specific tile', () => {
    engine.setTile(3, 4, 8);
    const tile = engine.getTile(3, 4);
    expect(tile).to.eql({
      x: 3,
      y: 4,
      value: 8
    });
  });

  it('should allow getting empty tiles', () => {
    engine.setTile(3, 3, 8).setTile(2, 2, 2);
    const tiles = engine.getEmptyTiles();
    expect(tiles).to.have.length(14);
  });

  describe('movements', () => {
    beforeEach(() => {
      engine.setTile(3, 3, 8)
      .setTile(0, 3, 4)
      .setTile(2, 2, 2)
      .setTile(0, 2, 2)
      .setTile(0, 0, 2)
      .setTile(0, 1, 4)
      .setTile(1, 0, 8)
      .setTile(1, 1, 16)
      .setTile(3, 0, 8);
    });

    it('should move tiles to the left', () => {
      const moved = engine.move('left');
      expect(engine.print({
        returnString: true,
        paddingSize: 2
      })).to.equal(`
[ 2][16][  ][  ]
[ 4][16][  ][  ]
[ 4][  ][  ][  ]
[ 4][ 8][  ][  ]
      `.trim());
      expect(moved).to.eql([
        {
          from: {
            x: 3,
            y: 0,
            value: null
          },
          to: {
            x: 1,
            y: 0,
            value: 16
          }
        },
        {
          from: {
            x: 2,
            y: 2,
            value: null
          },
          to: {
            x: 0,
            y: 2,
            value: 4
          }
        },
        {
          from: {
            x: 3,
            y: 3,
            value: null
          },
          to: {
            x: 1,
            y: 3,
            value: 8
          }
        }
      ]);
    });
  
    it('should move tiles to the right', () => {  
      const moved = engine.move('right');
      expect(engine.print({
        returnString: true,
        paddingSize: 2
      })).to.equal(`
[  ][  ][ 2][16]
[  ][  ][ 4][16]
[  ][  ][  ][ 4]
[  ][  ][ 4][ 8]
      `.trim());
      expect(moved).to.eql([
        {
          from: {
            x: 0,
            y: 3,
            value: null
          },
          to: {
            x: 2,
            y: 3,
            value: 4
          }
        },
        {
          from: {
            x: 2,
            y: 2,
            value: null
          },
          to: {
            x: 3,
            y: 2,
            value: 4
          }
        },
        {
          from: {
            x: 0,
            y: 2,
            value: null
          },
          to: {
            x: 3,
            y: 2,
            value: 4
          }
        },
        {
          from: {
            x: 1,
            y: 1,
            value: null
          },
          to: {
            x: 3,
            y: 1,
            value: 16
          }
        },
        {
          from: {
            x: 0,
            y: 1,
            value: null
          },
          to: {
            x: 2,
            y: 1,
            value: 4
          }
        },
        {
          from: {
            x: 1,
            y: 0,
            value: null
          },
          to: {
            x: 3,
            y: 0,
            value: 16
          }
        },
        {
          from: {
            x: 0,
            y: 0,
            value: null
          },
          to: {
            x: 2,
            y: 0,
            value: 2
          }
        }
      ]);
    });
  
    it('should move tiles to the top', () => {
      const moved = engine.move('up');
      expect(engine.print({
        returnString: true,
        paddingSize: 2
      })).to.equal(`
[ 2][ 8][ 2][16]
[ 4][16][  ][  ]
[ 2][  ][  ][  ]
[ 4][  ][  ][  ]
      `.trim());

      expect(moved).to.eql([
        {
          from: {
            x: 2,
            y: 2,
            value: null
          },
          to: {
            x: 2,
            y: 0,
            value: 2
          }
        },
        {
          from: {
            x: 3,
            y: 3,
            value: null
          },
          to: {
            x: 3,
            y: 0,
            value: 16
          }
        }
      ]);
    });
  
    it('should move tiles to the bottom', () => {
      const moved = engine.move('down');
      expect(engine.print({
        returnString: true,
        paddingSize: 2
      })).to.equal(`
[ 2][  ][  ][  ]
[ 4][  ][  ][  ]
[ 2][ 8][  ][  ]
[ 4][16][ 2][16]
      `.trim());
      expect(moved).to.eql([
        {
          from: {
            value: null,
            x: 2,
            y: 2
          },
          to: {
            value: 2,
            x: 2,
            y: 3
          }
        },
        {
          from: {
            value: null,
            x: 1,
            y: 1
          },
          to: {
            value: 16,
            x: 1,
            y: 3
          }
        },
        {
          from: {
            value: null,
            x: 3,
            y: 0
          },
          to: {
            value: 16,
            x: 3,
            y: 3
          }
        },
        {
          from: {
            value: null,
            x: 1,
            y: 0
          },
          to: {
            value: 8,
            x: 1,
            y: 2
          }
        }
      ]);
    });

    it('should not add new tiles if not be able to move', () => {
      let moved = engine.move('left');
      expect(engine.print({
        returnString: true,
        paddingSize: 2
      })).to.equal(`
[ 2][16][  ][  ]
[ 4][16][  ][  ]
[ 4][  ][  ][  ]
[ 4][ 8][  ][  ]
      `.trim());
      expect(moved).to.eql([
        {
          from: {
            x: 3,
            y: 0,
            value: null
          },
          to: {
            x: 1,
            y: 0,
            value: 16
          }
        },
        {
          from: {
            x: 2,
            y: 2,
            value: null
          },
          to: {
            x: 0,
            y: 2,
            value: 4
          }
        },
        {
          from: {
            x: 3,
            y: 3,
            value: null
          },
          to: {
            x: 1,
            y: 3,
            value: 8
          }
        }
      ]);

      moved = engine.move('left', true);
      expect(moved).to.eql([]);
      expect(engine.print({
        returnString: true,
        paddingSize: 2
      })).to.equal(`
[ 2][16][  ][  ]
[ 4][16][  ][  ]
[ 4][  ][  ][  ]
[ 4][ 8][  ][  ]
      `.trim());
    });

  });

  describe('random tiles', () => {
    it('should fill random tiles', () => {
      engine.fillRandomTiles();
      expect(engine.getEmptyTiles().length).to.be.at.least(14);
    });

    it('should fill random tiles with a specified amount', () => {
      engine.fillRandomTiles(5);
      expect(engine.getEmptyTiles().length).to.be.equal(11);
    });
  });

});