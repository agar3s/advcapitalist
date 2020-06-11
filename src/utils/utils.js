function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const millionUnits = [
  '',
  'million',
  'billion',
  'trillion',
  'quatrillion'
]

function parseGold (gold) {
  let value = gold
  let million = 0
  if (value > 1000000) {
    value /= 1000000
    million += 1
    while (value/1000 > 1) {
      value /= 1000
      million += 1
    }
  }
  return {
    value: formatter.format(value),
    units: millionUnits[million]
  }
}

export default {
  uuidv4,
  parseGold
}