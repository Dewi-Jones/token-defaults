With this module, a GM can configure Token Defaults.

**Prototype Tokens**

When an Actor is created, the module applies the Token Defaults to the Prototype Token of that Actor. This does include Actors that are duplicated, imported from a compendium, or created in a compendium (the latter can be disabled via a setting). In case you *only* want to apply the Token Defaults to your Tokens (see below), you can disable this entire behavior in the settings.

**Tokens**

The module can also apply the Token Defaults to created Tokens. This needs to be enabled in the setting.


**Existing Tokens and Actors**

This module does not affect any existing Tokens or Actors. It only ever does something when creating a Token or Actor.

**Systems**

Though the module was developed and tested primarely in dnd5e, it is designed as system-agnostic. If you encounter problems in a system, feel free to give feedback on the [issues](https://github.com/Dewi-Jones/token-defaults/issues) page.

**Available Configurations**

The Configuration Dialog lets you configure various aspects of Tokens for the different Actor Types. The `[All Types]` tab can be used to apply a setting regardless of actor type. If a setting is present for `[All Types]` and a specific Actor Type, the setting of the specific Actor Type takes priority.

<img width="438" height="841" alt="grafik" src="https://github.com/user-attachments/assets/f1c0c7a4-83cc-49f5-ab45-410b90b65e31" />
