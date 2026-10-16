import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createElement, StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { App } from '../ui/App';
import i18n from '../i18n';

export const VIEW_TYPE_NODUS = 'nodus-ai-view';

export class NodusView extends ItemView {
	private root: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_NODUS;
	}

	getDisplayText(): string {
		return i18n.t('view.displayName');
	}

	getIcon(): string {
		return 'bot';
	}

	async onOpen(): Promise<void> {
		this.root = createRoot(this.contentEl);
		this.root.render(createElement(StrictMode, null, createElement(App)));
	}

	async onClose(): Promise<void> {
		this.root?.unmount();
		this.root = null;
	}
}
