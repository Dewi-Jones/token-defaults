import { TokenDefaultsConfig, getDefaults } from "./settings-config.mjs"

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

async function defaultPrototypeTokenSettings(actor, options, userId) {
	if ( game.user.id !== userId ) return
	if ( !game.settings.get("token-defaults", "actor-create") && !actor.uuid.startsWith("Compendium") ) return
	if ( !game.settings.get("token-defaults", "compendium") && actor.uuid.startsWith("Compendium") ) return
	
	const defaults = getDefaults(actor.type, "prototype")
	if ( foundry.utils.isEmpty(defaults) ) return
	
	await actor.update({prototypeToken: defaults});
	console.log(`Prototype Token Defaults Applied to ${actor.uuid} (${actor.name})`);
}

async function defaultTokenSettings(token, options, userId) {
	if ( game.user.id !== userId ) return
	if ( !game.settings.get("token-defaults", "token-create") ) return
	if ( !token.actor?.type ) return console.log(`No Actor Type found for ${token.uuid} (${token.name})`)
	
	const defaults = getDefaults(token.actor.type, "token");
	if ( foundry.utils.isEmpty(defaults) ) return
	
	await token.update(defaults);
	console.log(`Token Defaults Applied to ${token.uuid} (${token.name})`);
}