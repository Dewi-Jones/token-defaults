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

Currently, these options can be configured:

<table>
    <thead>
        <tr>
            <th>Category</th>
            <th>Options</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=5>Identity</td>
            <td>Display Name</td>
        </tr>
        <tr>
          <td>Token Disposition</td>
        </tr>
        <tr>
          <td>Append Incrementing Number (Prototype Tokens only)</td>
        </tr>
        <tr>
          <td>Prepend Random Adjective (Prototype Tokens only)</td>
        </tr>
        <tr>
          <td>Occlusion Radius</td>
        </tr>
        <tr>
            <td rowspan=1>Appearance</td>
            <td>Lock Artwork Rotation</td>
        </tr>
        <tr>
            <td rowspan=1>Vision</td>
            <td>Vision Enabled</td>
        </tr>
        <tr>
            <td rowspan=3>Dynamic Token Ring</td>
            <td>Ring Enabled</td>
        </tr>
        <tr>
          <td>Ring Color</td>
        </tr>
        <tr>
          <td>Background Color</td>
        </tr>
        <tr>
            <td rowspan=3>Resources</td>
            <td> Display Bars</td>
        </tr>
        <tr>
          <td>Bar 1 Attribute</td>
        </tr>
        <tr>
          <td>Bar 2 Attribute</td>
        </tr>
        <tr>
            <td rowspan=4>Combat Turn Marker</td>
            <td>Mode</td>
        </tr>
        <tr>
          <td>Animation</td>
        </tr>
        <tr>
          <td>Media Source</td>
        </tr>
        <tr>
          <td>Disposition Tint</td>
        </tr>
    </tbody>
</table>
