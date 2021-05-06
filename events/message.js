module.exports = {
	name: "message",
    	once: false,
	run: async(client, message) => {
        	console.log(`${message.author.tag} -> ${message.content}`)
	}
};

