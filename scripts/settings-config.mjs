const { HandlebarsApplicationMixin, Application, DialogV2 } = foundry.applications.api;
const { StringField, ColorField, FilePathField, NumberField } = foundry.data.fields;
const { createFormGroup, createSelectInput } = foundry.applications.fields;

export class TokenDefaultsConfig extends HandlebarsApplicationMixin(Application) {
	
	static DEFAULT_OPTIONS = {
		id: "token-defaults",
		tag: "form",
		position: {
			width: 560,
		},
		window: {
			title: "TOKEN_DEFAULTS.SETTINGS.MENU.Title",
			icon: "fa-solid fa-circle-user",
			contentClasses: ["standard-form"],
		},
		form: {
			submitOnChange: false,
			closeOnSubmit: true,
			handler: this._onSubmit,
		},
		actions: {
			onReset: this._onReset,
			applyDefaults: this._applyDefaults,
		},
	};

	static PARTS = {
		tabs: {template: "templates/generic/tab-navigation.hbs"},
		body: {template: "modules/token-defaults/templates/token-defaults.hbs"},
		footer: {template: "templates/generic/form-footer.hbs"},
	};

	async _prepareContext(options) {
		return {
			buttons: this._prepareButtons(),
			tabs: this._prepareTabs(),
			tabClasses: "vertical",
			verticalTabs: true,
			id: this.id
		};
	}
	
	_prepareButtons(){
		return [
			{
				type: "button",
				icon: "fa-solid fa-arrow-rotate-left",
				label: "TOKEN_DEFAULTS.SETTINGS.MENU.Reset",
				action: "onReset"
			},
			{
				type: "button",
				icon: "fa-solid fa-user-pen",
				label: "TOKEN_DEFAULTS.SETTINGS.MENU.Apply.Label",
				action: "applyDefaults"
			},
			{
				type: "submit",
				icon: "fa-solid fa-floppy-disk",
				label: "TOKEN_DEFAULTS.SETTINGS.MENU.Submit"
			}
		];
	}
	
	_prepareTabs() {
		const bool = game.release.generation > 13 ? { true: "COMMON.Yes", false: "COMMON.No" } : { true: "Yes", false: "No" };
		
		const tokenDisplayModes = foundry.utils.invertObject(CONST.TOKEN_DISPLAY_MODES);
		for ( const [key] of Object.entries(tokenDisplayModes) ) {
			tokenDisplayModes[key] = `TOKEN.DISPLAY_${tokenDisplayModes[key]}`
		}
		
		const tokenDispositions = foundry.utils.invertObject(CONST.TOKEN_DISPOSITIONS);
		for ( const [key] of Object.entries(tokenDispositions) ) {
			tokenDispositions[key] = `TOKEN.DISPOSITION.${tokenDispositions[key]}`
		}
		
		const tokenTurnMarkerModes = foundry.utils.invertObject(CONST.TOKEN_TURN_MARKER_MODES);
		for ( const [key] of Object.entries(tokenTurnMarkerModes) ) {
			tokenTurnMarkerModes[key] = `TOKEN.TURNMARKER.MODES.${tokenTurnMarkerModes[key]}`
		}
		
		const tokenTurnMarkerAnimation = {
			"spin": "COMBAT.TURN_MARKERS.ANIMATIONS.SPIN",
			"spinPulse": "COMBAT.TURN_MARKERS.ANIMATIONS.SPIN_PULSE",
			"pulse": "COMBAT.TURN_MARKERS.ANIMATIONS.PULSE"
		}
		
		// If left empty: 
		// StringField/ColorField/FilePathField -> ""
		// NumberField -> null
		
		const fields = {
			displayName: new StringField({ initial: undefined, required: false, choices: tokenDisplayModes, label: "TOKEN.FIELDS.displayName.label" }),
			disposition: new StringField({ initial: undefined, required: false, choices: tokenDispositions, label: "TOKEN.FIELDS.disposition.label" }),
			displayBars: new StringField({ initial: undefined, required: false, choices: tokenDisplayModes, label: "TOKEN.FIELDS.displayBars.label" }),
			appendNumber: new StringField({ initial: undefined, required: false, choices: bool, label: "TOKEN.FIELDS.appendNumber.label" }),
			occludable:{
				radius: new NumberField({ initial: undefined, required: false, label: "TOKEN.FIELDS.occludable.radius.label" })
			},
			prependAdjective: new StringField({ initial: undefined, required: false, choices: bool, label: "TOKEN.FIELDS.prependAdjective.label" }),
			bar1: { attribute: new StringField({ initial: undefined, required: false, label: "TOKEN.FIELDS.bar1.attribute.label" })},
			bar2: { attribute: new StringField({ initial: undefined, required: false, label: "TOKEN.FIELDS.bar2.attribute.label" })},
			sight: { enabled: new StringField({ initial: undefined, required: false, choices: bool, label: "TOKEN.FIELDS.sight.enabled.label" })},
			ring: { 
				enabled: new StringField({ initial: undefined, required: false, choices: bool, label: "TOKEN.FIELDS.ring.enabled.label" }),
				colors: {
					ring: new ColorField({ initial: undefined, required: false, label: "TOKEN.FIELDS.ring.colors.ring.label" }),
					background: new ColorField({ initial: undefined, required: false, label: "TOKEN.FIELDS.ring.colors.background.label" })
				},
			},
			lockRotation: new StringField({ initial: undefined, required: false, choices: bool, label: "TOKEN.FIELDS.lockRotation.label" }),
			turnMarker: {
				mode: new StringField({ initial: undefined, required: false, choices: tokenTurnMarkerModes, label: "TOKEN.FIELDS.turnMarker.mode.label" }),
				animation: new StringField({ initial: undefined, required: false, choices: tokenTurnMarkerAnimation, label: "TOKEN.FIELDS.turnMarker.animation.label" }),
				src: new FilePathField({ initial: undefined, required: false, categories: ["IMAGE"], label: "TOKEN.FIELDS.turnMarker.src.label" }),
				disposition: new StringField({ initial: undefined, required: false, choices: bool, label: "TOKEN.FIELDS.turnMarker.disposition.label" }),
			}
		};
		
		const fieldsets = {
			identity: "TOKEN.TABS.identity",
			appearance: "TOKEN.TABS.appearance",
			dtr: "TOKEN.RING.SHEET.legend",
			vision: "TOKEN.TABS.vision",
			resources: "TOKEN.TABS.resources",
			ctm: "TOKEN.TURNMARKER.SHEET.legend"
		}
		
		return Actor.TYPES.reduce((prev, type) => {
			prev[type] = {
				id: type,
				group: "main",
				label: type === "base" ? "SETTINGS.PrototypeTokenOverrides.TABS.AllTypes.Label" : `TYPES.Actor.${type}`,
				cssClass: type === "base" ? "active" : "",
				fields,
				fieldsets,
				data: game.settings.get("token-defaults", type),
			};
			return prev;
		}, {});
	}
	
	static async _onSubmit(event, form, formData) {
		const booleanOrNullish = {true: true, false: false, null: null, "": undefined};
		for ( const [key, value] of Object.entries(formData.object) ) {
			if ( value in booleanOrNullish ) formData.object[key] = booleanOrNullish[value]
			if ( key.includes("occludable.radius") && value === null ) delete formData.object[key]
			if ( formData.object[key] === undefined ) delete formData.object[key]
		}
		
		for ( const [key, value] of Object.entries(foundry.utils.expandObject(formData.object)) ) {
			game.settings.set("token-defaults", key, value)
		}
	}

	static async _onReset() {
		await DialogV2.confirm({
			window: {
				title: "TOKEN_DEFAULTS.SETTINGS.MENU.Confirm.Label",
				icon: "fa-solid fa-arrow-rotate-left"
			},
			position: {
				width: 400,
			},
			content: `<p><strong>${_loc("COMMON.AreYouSure")}</strong> ${_loc("TOKEN_DEFAULTS.SETTINGS.MENU.Confirm.Warning")}</p>`,
			yes: {
				callback: async () => {
					await Actor.TYPES.forEach((type) => {
						game.settings.set("token-defaults", type, {});
					});
					await this.close();
				}
			}
		});
	}
	
	static async _applyDefaults(event, form, formData) {
		const content = window.document.createElement("div");
		const warning = window.document.createElement("p");
		warning.innerHTML = `<strong>${_loc("COMMON.AreYouSure")}</strong> ${_loc("TOKEN_DEFAULTS.SETTINGS.MENU.Apply.Warning")}`;
		const actorType = createFormGroup({
			label: _loc("TOKEN_DEFAULTS.SETTINGS.MENU.Apply.ActorType"),
			input: createSelectInput({
				name: "actorType",
				options: Actor.TYPES.map(type => ({value: type, label: type === "base" ? _loc("SETTINGS.PrototypeTokenOverrides.TABS.AllTypes.Label") : _loc(`TYPES.Actor.${type}`)})),
				disabled: Actor.TYPES.length <= 1
			}),
			classes: Actor.TYPES.length === 1 ? ["hidden"] : []
		});
		const tokenType = createFormGroup({
			label: _loc("TOKEN_DEFAULTS.SETTINGS.MENU.Apply.TokenType"),
			input: createSelectInput({
				name: "tokenType",
				options: [{value: "token", label: _loc("DOCUMENT.Tokens")}, {value: "prototype", label: _loc("TOKEN_DEFAULTS.SETTINGS.MENU.Apply.Prototype")}]
			}),
		});
		content.append(warning, actorType, tokenType);
		
		const input = await DialogV2.input({
			window: {
				title: "TOKEN_DEFAULTS.SETTINGS.MENU.Apply.Title",
				icon: "fa-solid fa-user-pen"
			},
			position: {
				width: 400,
			},
			content,
			ok: {label: "TOKEN_DEFAULTS.SETTINGS.MENU.Apply.Label"}
		});
		
		if ( !input ) return
		
		const defaults = {};
		
		if ( input.actorType !== "base" ) {
			defaults[input.actorType] = getDefaults(input.actorType, input.tokenType)
		} else {
			Actor.TYPES.forEach((type) => {
				defaults[type] = getDefaults(type, input.tokenType);
				if ( foundry.utils.isEmpty(defaults[type]) ) delete defaults[type]
			});
		}
		if ( foundry.utils.isEmpty(defaults) ) return
		
		if ( input.tokenType === "prototype" ) {
			game.actors.updateAll(
				actor => ( {prototypeToken: defaults[actor.type]} ),
				actor => ( !!defaults[actor.type] )
			);
			console.log("Defaults applied to Prototype Tokens.");
		} else {
			game.scenes.forEach((scene) => {
				const updates = scene.tokens.reduce((result, token) => {
					if ( !token.actor?.type ) return
					if ( !defaults[token.actor.type] ) return
					result.push(foundry.utils.mergeObject({_id: token.id}, defaults[token.actor.type], { inplace: false }))
					return result
				}, []);
				if ( !updates ) return
				if ( updates.length === 0 ) return
				scene.updateEmbeddedDocuments("Token", updates);
				console.log(`Defaults applied to ${updates.length} Tokens in scene: ${scene.name} (${scene.id})`);
			})
		}
	}
}

export function getDefaults(actorType, tokenType) {
	const defaults = foundry.utils.mergeObject(game.settings.get("token-defaults", "base") ?? {}, game.settings.get("token-defaults", actorType) ?? {}, { inplace: false });
	if ( tokenType === "token" && defaults.appendNumber !== undefined ) delete defaults.appendNumber
	if ( tokenType === "token" && defaults.prependAdjective !== undefined ) delete defaults.prependAdjective
	return defaults
}