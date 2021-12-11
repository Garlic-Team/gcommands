const {Listener} = require('../../dist');

new Listener('ready', {
    name: 'ready',
    once: true,
    run: () => {
        console.log('I\'m ready!')
    }
})