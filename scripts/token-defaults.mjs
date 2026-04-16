Hooks.once("ready", () => {
	
	const actorTypes = Object.keys(CONFIG.Actor.typeLabels);
	actorTypes.splice(0,1); // get rid of base actor type
	
	actorTypes.forEach((type) => {
		game.settings.register("token-defaults", type, {
			name: `TYPES.Actor.${type}`,
			hint: "The ID of the actor used as a default for actors of this type.",
			scope: "world",
			config: true,
			requiresReload: false,
			type: String
		});
		getCreateActor(type)
	});
});

async function getCreateActor(type) {
	
	let actor = game.actors.get(game.settings.get("token-defaults", type));
	if ( actor ) return
	
	actor = await Actor.create({
		name: `default-token-${type}`,
		type: type
	});
	
	game.settings.set("token-defaults", type, actor.id);
}

Hooks.on("createActor", defaultTokenSettings);

async function defaultTokenSettings(document) {
	
	const defaultPrototypeToken = game.actors.get(game.settings.get("token-defaults", document.type)).prototypeToken.toObject();
	
	delete defaultPrototypeToken.actorLink;
	delete defaultPrototypeToken.depth;
	delete defaultPrototypeToken.height;
	delete defaultPrototypeToken.width;
	delete defaultPrototypeToken.texture;
	delete defaultPrototypeToken.ring.subject;
	delete defaultPrototypeToken.name;
	delete defaultPrototypeToken.randomImg;
	
	await document.update({"prototypeToken": defaultPrototypeToken});
}