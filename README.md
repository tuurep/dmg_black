# dmg_black

Forked from davidmogar's [lightdm-webkit2-dmg_blue](https://github.com/davidmogar/lightdm-webkit2-dmg_blue) to:
* modify the colors from blue to black with a dark teal accent 
* fix and maintain after `lightdm-webkit2-greeter` stopped working

![screenshot](screenshot.png)

## `lightdm-webkit2-greeter` deprecation

Arch package `lightdm-webkit2-greeter` ([link](https://github.com/Antergos/web-greeter)) is a project originating in the discontinued Antergos distro, and it is abandoned. After updating dependency `webkit2gtk` to version `2.38` logging in with the greeter stopped working.

Here's a very useful issue about this:

[lightdm-webkit-theme-litarvan issue #186 - "It simply doesn't log in"](https://github.com/Litarvan/lightdm-webkit-theme-litarvan/issues/186)

JezerM's `web-greeter` ([link](https://github.com/jezerm/web-greeter)) is an updated and maintained fork. Available in the AUR: https://aur.archlinux.org/packages/web-greeter 

## Changing colors

The colors (as well as font) can be easily changed in `css/style.css`, set them here:

```css
:root {
	--main-accent-color: #1a4f4c;
	--main-accent-color-hover: #1e5a57;
	--main-bg-color: #000000;
	--main-bg-color-disabled: #214240;
	--main-bg-color-input: #151515;
	--main-bg-color-panel: #222525;
	--main-bg-color-selected: #313438;
	--main-border-color: #282828;
	--main-fg-color: #ffffff;
	--main-fg-color-dimmed: #646464;
	--main-fg-color-placeholder: #373737;
	--main-fg-color-error: #f0c674;

	--main-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.6);
	--main-font: "DejaVu Sans";
}
```
