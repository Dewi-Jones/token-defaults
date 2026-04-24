import TokenDefaultsConfig from "./settings-config.mjs"

Hooks.once("init", () => {
	
	game.settings.registerMenu("token-defaults", "settings-config", {
		name: "TOKEN_DEFAULTS.SETTINGS.MENU.Name",
		label: "TOKEN_DEFAULTS.SETTINGS.MENU.Label",
		icon: "fa-solid fa-circle-user",
		type: TokenDefaultsConfig,
		restricted: true
	});
	
	Actor.TYPES.forEach((type) => {
		game.settings.register("token-defaults", type, {
			name: `TYPES.Actor.${type}`,
			scope: "world",
			config: false,
			requiresReload: false,
			type: Object,
			default: {}
		});
	});
	
	game.settings.register("token-defaults", "token-create", {
		name: "TOKEN_DEFAULTS.SETTINGS.TOKEN_CREATE.Name",
		hint: "TOKEN_DEFAULTS.SETTINGS.TOKEN_CREATE.Hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
		requiresReload: false,
	});
	
	game.settings.register("token-defaults", "actor-create", {
		name: "TOKEN_DEFAULTS.SETTINGS.ACTOR_CREATE.Name",
		hint: "TOKEN_DEFAULTS.SETTINGS.ACTOR_CREATE.Hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
		requiresReload: false,
	});
	
	game.settings.register("token-defaults", "compendium", {
		name: "TOKEN_DEFAULTS.SETTINGS.COMPENDIUM.Name",
		hint: "TOKEN_DEFAULTS.SETTINGS.COMPENDIUM.Hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
		requiresReload: false,
	});
});

Hooks.on("createActor", defaultPrototypeTokenSettings);
Hooks.on("createToken", defaultTokenSettings);

async function defaultPrototypeTokenSettings(document, options, userId) {
	if ( game.user.id !== userId ) return
	if ( !game.settings.get("token-defaults", "actor-create") ) return
	if ( document.uuid.startsWith("Compendium") && !game.settings.get("token-defaults", "compendium") ) return
	
	const defaults = foundry.utils.mergeObject(game.settings.get("token-defaults", "base") ?? {}, game.settings.get("token-defaults", document.type) ?? {}, { inplace: false });
	if ( Object.keys(defaults).length === 0 ) return
	
	await document.update({prototypeToken: defaults});
	console.log(`Token Defaults Applied to ${document.uuid} (${document.name})`);
}

async function defaultTokenSettings(document, options, userId) {
	if ( game.user.id !== userId ) return
	if ( !game.settings.get("token-defaults", "token-create") ) return
	
	const defaults = foundry.utils.mergeObject(game.settings.get("token-defaults", "base") ?? {}, game.settings.get("token-defaults", document.actor?.type) ?? {}, { inplace: false });
	if ( Object.keys(defaults).length === 0 ) return
	
	await document.update(defaults);
	console.log(`Token Defaults Applied to ${document.uuid} (${document.name})`);
}