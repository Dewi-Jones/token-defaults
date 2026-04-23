const { HandlebarsApplicationMixin, Application } = foundry.applications.api;
const { StringField } = foundry.data.fields;

export default class TokenDefaultsConfig extends HandlebarsApplicationMixin(Application) {
	
	/** @inheritdoc */
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
			handler: TokenDefaultsConfig.#onSubmit,
		},
		actions: {
			onReset: TokenDefaultsConfig.#onReset,
		},
	};

	static PARTS = {
		tabs: {template: "templates/generic/tab-navigation.hbs"},
		body: {template: "modules/token-defaults/templates/token-defaults.hbs"},
		footer: {template: "templates/generic/form-footer.hbs"},
	};

	async _prepareContext(options) {
		return {
			buttons: this.#prepareButtons(),
			tabs: this.#prepareTabs(),
			tabClasses: "vertical",
			id: this.id
		};
	}
	
	#prepareButtons(){
		return [
			{
				type: "button",
				icon: "fa-solid fa-arrow-rotate-left",
				label: "TOKEN_DEFAULTS.SETTINGS.MENU.Reset",
				action: "onReset"
			},
			{
				type: "submit",
				icon: "fa-solid fa-floppy-disk",
				label: "TOKEN_DEFAULTS.SETTINGS.MENU.Submit"
			}
		];
	}
	
	#prepareTabs() {
		const bool = { true: game.i18n.localize("COMMON.Yes"), false: game.i18n.localize("COMMON.No") };
		
		const tokenDisplayModes = foundry.utils.invertObject(CONST.TOKEN_DISPLAY_MODES);
		for ( const [key] of Object.entries(tokenDisplayModes) ) {
			tokenDisplayModes[key] = game.i18n.localize(`TOKEN.DISPLAY_${tokenDisplayModes[key]}`)
		}
		
		const tokenDispositions = foundry.utils.invertObject(CONST.TOKEN_DISPOSITIONS);
		for ( const [key] of Object.entries(tokenDispositions) ) {
			tokenDispositions[key] = game.i18n.localize(`TOKEN.DISPOSITION.${tokenDispositions[key]}`)
		}
		
		const tokenTurnMarkerModes = foundry.utils.invertObject(CONST.TOKEN_TURN_MARKER_MODES);
		for ( const [key] of Object.entries(tokenTurnMarkerModes) ) {
			tokenTurnMarkerModes[key] = game.i18n.localize(`TOKEN.TURNMARKER.MODES.${tokenTurnMarkerModes[key]}`)
		}
		
		const tokenTurnMarkerAnimation = {
			"spin": game.i18n.localize("COMBAT.TURN_MARKERS.ANIMATIONS.SPIN"),
			"spinPulse": game.i18n.localize("COMBAT.TURN_MARKERS.ANIMATIONS.SPIN_PULSE"),
			"pulse": game.i18n.localize("COMBAT.TURN_MARKERS.ANIMATIONS.PULSE")
		}
		
		const fields = {
			displayName: new foundry.data.fields.StringField({ initial: undefined, required: false, choices: tokenDisplayModes, label: game.i18n.localize("TOKEN.FIELDS.displayName.label") }),
			disposition: new foundry.data.fields.StringField({ initial: undefined, required: false, choices: tokenDispositions, label: game.i18n.localize("TOKEN.FIELDS.disposition.label") }),
			displayBars: new foundry.data.fields.StringField({ initial: undefined, required: false, choices: tokenDisplayModes, label: game.i18n.localize("TOKEN.FIELDS.displayBars.label") }),
			bar1: { attribute: new foundry.data.fields.StringField({ initial: undefined, required: false, label: game.i18n.localize("TOKEN.FIELDS.bar1.attribute.label") })},
			bar2: { attribute: new foundry.data.fields.StringField({ initial: undefined, required: false, label: game.i18n.localize("TOKEN.FIELDS.bar2.attribute.label") })},
			sight: { enabled: new foundry.data.fields.StringField({ initial: undefined, required: false, choices: bool, label: game.i18n.localize("TOKEN.FIELDS.sight.enabled.label") })},
			ring: { 
				enabled: new foundry.data.fields.StringField({ initial: undefined, required: false, choices: bool, label: game.i18n.localize("TOKEN.FIELDS.ring.enabled.label") }),
				colors: {
					ring: new foundry.data.fields.ColorField({ initial: undefined, required: false, label: game.i18n.localize("TOKEN.FIELDS.ring.colors.ring.label") }),
					background: new foundry.data.fields.ColorField({ initial: undefined, required: false, label: game.i18n.localize("TOKEN.FIELDS.ring.colors.background.label") })
				},
			},
			turnMarker: {
				mode: new foundry.data.fields.StringField({ initial: undefined, required: false, choices: tokenTurnMarkerModes, label: game.i18n.localize("TOKEN.FIELDS.turnMarker.mode.label") }),
				animation: new foundry.data.fields.StringField({ initial: undefined, required: false, choices: tokenTurnMarkerAnimation, label: game.i18n.localize("TOKEN.FIELDS.turnMarker.animation.label") }),
				src: new foundry.data.fields.FilePathField({ initial: undefined, required: false, categories: ["IMAGE"], label: game.i18n.localize("TOKEN.FIELDS.turnMarker.src.label") }),
				disposition: new foundry.data.fields.StringField({ initial: undefined, required: false, choices: bool, label: game.i18n.localize("TOKEN.FIELDS.turnMarker.disposition.label") }),
			}
		};
		
		const fieldsets = {
			identity: game.i18n.localize("TOKEN.TABS.identity"),
			dtr: game.i18n.localize("TOKEN.RING.SHEET.legend"),
			vision: game.i18n.localize("TOKEN.TABS.vision"),
			resources: game.i18n.localize("TOKEN.TABS.resources"),
			ctm: game.i18n.localize("TOKEN.TURNMARKER.SHEET.legend")
		}
		
		return Actor.TYPES.reduce((prev, type) => {
			prev[type] = {
				id: type,
				group: "main",
				label: type === "base" ? "SETTINGS.PrototypeTokenOverrides.TABS.AllTypes.Label" : `TYPES.Actor.${type}`,
				cssClass: type === "base" ? "active" : "",
				fields,
				fieldsets,
				scrollable: [".scrollable"],
				data: game.settings.get("token-defaults", type),
			};
			return prev;
		}, {});
	}
	
	static async #onSubmit(event, form, formData) {
		const booleanOrNullish = {true: true, false: false, null: null, "": undefined};
		for ( const [key, value] of Object.entries(formData.object) ) {
			if ( value in booleanOrNullish ) formData.object[key] = booleanOrNullish[value]
		}
		
		for ( const [key, value] of Object.entries(foundry.utils.expandObject(formData.object)) ) {
			game.settings.set("token-defaults", key, value)
		}
	}

	static async #onReset() {
		await foundry.applications.api.DialogV2.confirm({
			window: {
				title: "TOKEN_DEFAULTS.SETTINGS.MENU.Confirm.Label"
			},
			content: `<p><strong>${game.i18n.localize("COMMON.AreYouSure")}</strong> ${game.i18n.localize("TOKEN_DEFAULTS.SETTINGS.MENU.Confirm.Warning")}</p>`,
			yes: {
				callback: async () => {
					await Actor.TYPES.forEach((type) => {
						game.settings.set("token-defaults", type, undefined);
					});
					await this.close();
				}
			}
		});
	}
}