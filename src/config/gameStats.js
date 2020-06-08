
// base game stats
let stats = {
  game: {
    backgroundColor: '#000',
    language: 'en',
    debug: false
  },
  mainScene: { },
  scene: {
    restart: false,
    current: 'bootScene'
  },
  businesses: [
    {
      business: 'Lemonade Stand',
      icon: 'lemonade',
      cost: 373.8,
      coefficient: 1.07,
      time: 0.6,
      revenue: 100,
      investments: 1
    },
    {
      business: 'Newspaper Delivery',
      icon: 'newspaper',
      cost: 6000,
      coefficient: 1.15,
      time: 3,
      revenue: 6000,
      investments: 0
    },
    {
      business: 'Car Wash',
      icon: 'car',
      cost: 72000,
      coefficient: 1.14,
      time: 6,
      revenue: 54000,
      investments: 0
    },
    {
      business: 'Pizza Delivery',
      icon: 'pizza',
      cost: 864000,
      coefficient: 1.13,
      time: 12,
      revenue: 432000,
      investments: 0
    },
    {
      business: 'Donut Shop',
      icon: 'donut',
      cost: 10368000,
      coefficient: 1.12,
      time: 24,
      revenue: 5184000,
      investments: 0
    },
    {
      business: 'Shrimp Boat',
      icon: 'shrimp',
      cost: 124416000,
      coefficient: 1.11,
      time: 96,
      revenue: 62208000,
      investments: 0
    },
    {
      business: 'Hockey Team',
      icon: 'hockey',
      cost: 1492992000,
      coefficient: 1.10,
      time: 384,
      revenue: 746496000,
      investments: 0
    },
    {
      business: 'Movie Studio',
      icon: 'movie',
      cost: 17915904000,
      coefficient: 1.09,
      time: 1536,
      revenue: 8954952000,
      investments: 0
    },
    {
      business: 'Bank',
      icon: 'bank',
      cost: 214990848000,
      coefficient: 1.08,
      time: 6144,
      revenue: 1074954240,
      investments: 0
    },
    {
      business: 'Oil Company',
      icon: 'oil',
      cost: 2579890176000,
      coefficient: 1.07,
      time: 36864,
      revenue: 2966873702400,
      investments: 0
    }
  ]
}

function getNames(property) {
  let names = []
  if (typeof(property) !== 'object') {
    return [property]
  }

  let propertyKeys = Object.keys(property)
  propertyKeys.forEach( key => {
    let otherNames = getNames(property[key])
    if(otherNames.length === 1) {
      names.push(key)
    } else {
      otherNames.forEach( child => {
        names.push(`${key}.${child}`)
      })
    }
  })

  if(propertyKeys.length === 0) {
    return [property]
  }
  return names
}

let ids = getNames(stats)

let changeListeners = {}
ids.forEach(id => changeListeners[id] = _ => {})


let setListener = (id, listener) => {
  changeListeners[id] = listener
}

let removeListener = (id, listener) => {
  changeListeners[id] = _ => {}
}

let get = (key, data = stats) => {
  let parts = key.split('.')
  let value = data
  for (var i = 0; i < parts.length; i++) {
    value = value[parts[i]]
  }
  return value
}

let set = (key, newValue) => {
  if(newValue === undefined) return
  let parts = key.split('.')
  let value = stats
  for (var i = 0; i < parts.length - 1; i++) {
    value = value[parts[i]]
  }
  value[parts[i]] = newValue
  notifyListener(key, newValue)
}

let notifyListener = (key, newValue) => {
  if (changeListeners[key]) {
    changeListeners[key](newValue)
  }
}

let setAll = (key, data) => {
  let names = getNames(get(key))
  names.forEach(name => {
    set(`${key}.${name}`, get(name, data))
  })
}

export default {
  stats,
  setListener,
  removeListener,
  notifyListener,
  set,
  setAll
}