import { Plugin, WorkspaceLeaf } from 'obsidian';
import i18n, { i18nReady } from './i18n';
import { NodusView, VIEW_TYPE_NODUS } from './views/ItemView';
import { ProjectStorage } from './services/projects/ProjectStorage';

export default class NodusPlugin extends Plugin {
	async onload() {
		await i18nReady;

		this.registerView(
			VIEW_TYPE_NODUS,
			(leaf) =>
				new NodusView(
					leaf,
					new ProjectStorage(
						this.app.vault.adapter,
						this.app.secretStorage,
						`${this.app.vault.configDir}/plugins/${this.manifest.id}/projects`,
					),
				),
		);

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
