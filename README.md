

![enter image description here](https://agar3s-assets.s3.amazonaws.com/dwarfEmpire/assets/dwarf_empire_title.png)
# Dwarf Empire

**Dwarf Empire** is an HTML5 game based on [Adventure Capitalist](https://en.wikipedia.org/wiki/AdVenture_Capitalist)., created with [Phaser3-boilerplate template](https://github.com/blackmambastudio/phaser3-jam-boilerplate).
The game was designed mobile first and you can play it now on: [https://dwarf-empire.herokuapp.com/](https://dwarf-empire.herokuapp.com/)

## Development
### Installation
Just run: `$ npm install`

### Run Game
`$ npm run start` the game will be automatically launched on `localhost:3000`. Start script uses livereload.

### Build
To build the game run `$ npm run build` it generates a `dist` folder with: `app.bundle.js`, `index.html` and all the assets on `assets` folder.

If you store the assets in a different static server provider beware to set the awsPrefix=`url` on `src/scenes/ui/boot.js` and `src/scenes/ui/preboot.js` files. (check the [deploy](https://github.com/agar3s/advcapitalist/tree/deploy) branch to see an example)

### Deploy
Dist folder can be compressed and upload to any site that support HTML5 games like itch.io or gamejolt.

### Deploy on AWS S3
All assets are stored on S3, to sync your files run `$ aws s3 cp dist/ s3://bucket-url/ --grants read=uri=http://acs.amazonaws.com/groups/global/`
An online version is available on: [https://agar3s-assets.s3.amazonaws.com/dwarfEmpire/index.html](https://agar3s-assets.s3.amazonaws.com/dwarfEmpire/index.html)

### Database
Games played by users could be listed on: [https://dwarf-empire.herokuapp.com/games](https://dwarf-empire.herokuapp.com/games)

## Project structure
The game uses 4 scenes: 
* `src/scenes/ui/boot.js` to load all the assets required for the game
* `src/scenes/ui/preboot.js` only loads the logo and background images in order to provide a better loading screen
* `src/scenes/game/HUDgame.js` displays notifications and avatar related data. ![image](https://user-images.githubusercontent.com/1063587/84469511-d2a5f080-ac46-11ea-95c8-f615486158dd.png)
* `src/scenes/game/game.js` is the main scene, contains a dictionary of `Business`, sound bg and fxs, particle emitters.

### Business
`src/scenes/game/business/Business.js`
![image](https://user-images.githubusercontent.com/1063587/84469721-56f87380-ac47-11ea-8242-8410c9076a39.png)
Is a Container that groups all the behaviour and logic related to the business, is composed by:

![image](https://user-images.githubusercontent.com/1063587/84470253-8b206400-ac48-11ea-9ffc-10d6ef6628e4.png)
`src/scenes/game/businesss/Icon.js`: contains the icon image for the business, handles the action of produce money, and displays the total invesments on this business, also a progress bar indicating how far is to duplicate the production speed. 

![image](https://user-images.githubusercontent.com/1063587/84470326-bb680280-ac48-11ea-950e-2296d65a5dae.png)
`src/scenes/game/business/Progress.js` displays the progress of the production and how much money will be generated after completion.

![image](https://user-images.githubusercontent.com/1063587/84470355-cde23c00-ac48-11ea-914c-4282fe0e51e3.png)
`src/scenes/game/business/Invest.js` handles the action of invest, it also displays the ammount of money required to purchase.


![image](https://user-images.githubusercontent.com/1063587/84470401-e7838380-ac48-11ea-8166-90937e24b182.png)
`src/scenes/game/business/Time.js` displays the remaining time to get the money.

![image](https://user-images.githubusercontent.com/1063587/84470440-f8cc9000-ac48-11ea-93c3-4e25cd09d599.png)
`src/scenes/game/business/Manager.js` is a button that allows to purchase a manager to handle automatic production, a dwarf sprite is displayed when is active.

### Data
- `src/config/constants.js`: contains all non transient data, this file contains definitions about, resolution, scenes to load, debug mode and business sprites, coefficients an fixed costs.
- `src/config/gameStats.js`: is a variable board containing all logic state that requires to be stored.

Data on `gameStats` is synced every 5 seconds on localstorage (as a fallback) and to a remote server. (see [https://github.com/agar3s/dwarfEmpireServer](https://github.com/agar3s/dwarfEmpireServer))

## Mechanics
All mechanics are basically the same as adventure capitalist,
* Buy and upgrade business
* Make money from a business
* Hire managers
* When game is closed, the next time you open it, it displays the money that all business made.

## Next work
- Options to enable/disable music
- Change the name of the dwarf
-  Strategy to handle big numbers https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
- new mechanics related with managers:
	- pick one of two possible manager for every business
	- each manager has different skills: produce faster, reduce costs, 
	- each manager has levels, player need to upgrade managers in order to unlock new skills.
- new mechanics related with business:
	- every business triggers unexpected events, could be bad or good ones. miners discover a big diamond, thieves steal jewels from jewelries.

## Credits
Development, game design and game concept by @agar3s
Art adapted by [@prinfrexita](https://www.behance.net/prinfrexita) based on assets from `Kandi Maciejewski` [https://www.artstation.com/artbykandles/store](https://www.artstation.com/artbykandles/store)
Sound and Music, various,  [https://soundcloud.com/user-500193990](https://soundcloud.com/user-500193990)