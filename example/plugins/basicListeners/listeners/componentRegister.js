const {Listener} = require('../../../../dist');

new Listener('componentRegister', {
	name: 'component-register',
	run: (component) => {
		return console.log(`Component "${component.name}" registered`);
	}
});
