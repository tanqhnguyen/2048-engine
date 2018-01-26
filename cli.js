const readline = require('readline'),
      Engine = require('./src/engine');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '2048> '
});

function newGame() {
  const engine = new Engine();
  engine.fillRandomTiles();

  return engine;
}

function clear() {
  console.log('\033[2J');
}

clear();
let engine = newGame();
engine.print();

rl.on('line', (input) => {
  if (input === 'new') {
    clear();
    engine = newGame();
    engine.print();
  } else if (input === 'quit') {
    process.exit(0);
  }

  rl.clearLine();
});

process.stdin.on('keypress',function(sequence, {name}){
  if (engine.isEnded) return;
  if ([
    'up',
    'down',
    'left',
    'right'
  ].indexOf(name) === -1) return;

  clear();

  try {
    engine.move(name, true);
    engine.print();
  } catch (e) {
    console.log('THE END. Type "new" to play another one, and "quit" to quit');
    rl.prompt(true);
  }
});