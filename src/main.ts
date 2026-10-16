import { Plugin, WorkspaceLeaf } from 'obsidian';
import { NodusSettingTab } from './services/settings/SettingTab';
import { DEFAULT_SETTINGS, NodusSettings } from './types';
import i18n, { i18nReady } from './i18n';
import { NodusView, VIEW_TYPE_NODUS } from './views/ItemView';

export default class NodusPlugin extends Plugin {
	settings: NodusSettings = DEFAULT_SETTINGS;

	async onload() {
		await i18nReady;
		await this.loadSettings();

		this.registerView(VIEW_TYPE_NODUS, (leaf) => new NodusView(leaf));

		this.addRibbonIcon('bot', i18n.t('plugin.openNodusAI'), () => {
			void this.activateView();
		});

		this.addCommand({
			id: 'open-view',
			name: i18n.t('plugin.openView'),
			callback: () => {
				void this.activateView();
			},
		});

		this.addSettingTab(new NodusSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<NodusSettings> | null,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async activateView() {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(VIEW_TYPE_NODUS)[0] ?? null;
		if (!leaf) {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: VIEW_TYPE_NODUS, active: true });
		}
		if (leaf) await workspace.revealLeaf(leaf);
	}
}
