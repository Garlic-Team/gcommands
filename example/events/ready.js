const {Listener} = require('../../dist');

// You can still use classes, but you will need to put the "new" keyword front of it
new Listener('ready', {
    name: 'ready',
    once: true,
    run: () => {
        console.log('I\'m ready!')
    }
})