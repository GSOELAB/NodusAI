import { App, PluginSettingTab } from 'obsidian';
import type NodusPlugin from '../../main';

export class NodusSettingTab extends PluginSettingTab {
	plugin: NodusPlugin;

	constructor(app: App, plugin: NodusPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();
	}
}
