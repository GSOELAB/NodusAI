import type { DataAdapter, SecretStorage } from 'obsidian';

export interface Project {
	id: string;
	name: string;
	description: string;
	llmModel: string;
	subjects: string[];
	createdAt: string;
}

export class ProjectStorage {
	constructor(
		private readonly adapter: DataAdapter,
		private readonly secretStorage: SecretStorage,
		private readonly projectsDirectory: string,
	) {}

	async list(): Promise<Project[]> {
		await this.ensureDirectory();
		const { files } = await this.adapter.list(this.projectsDirectory);
		const projectFiles = files.filter((file) => file.endsWith('.json'));
		const projects = await Promise.all(
			projectFiles.map(async (file) => {
				const path = `${this.projectsDirectory}/${this.getFileNameFromPath(file)}`;
				try {
					return this.parseProject(await this.adapter.read(path));
				} catch (error) {
					throw new Error(
						`Unable to load project file "${path}": ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}),
		);

		return projects.sort((first, second) => second.createdAt.localeCompare(first.createdAt));
	}

	async get(projectId: string): Promise<Project> {
		this.validateProjectId(projectId);
		const path = `${this.projectsDirectory}/${projectId}.json`;
		try {
			return this.parseProject(await this.adapter.read(path));
		} catch (error) {
			throw new Error(
				`Unable to load project "${projectId}": ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	async create(
		name: string,
		description: string,
		apiKey: string,
		llmModel: string,
		subjects: string[],
	): Promise<Project> {
		await this.ensureDirectory();

		const project: Project = {
			id: crypto.randomUUID(),
			name: name.trim(),
			description: description.trim(),
			llmModel: llmModel.trim(),
			subjects: subjects.map((subject) => subject.trim()).filter(Boolean),
			createdAt: new Date().toISOString(),
		};
		const path = `${this.projectsDirectory}/${project.id}.json`;

		try {
			await this.adapter.write(path, JSON.stringify(project, null, 2));
		} catch (error) {
			throw new Error(
				`Unable to save project "${project.name}": ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		try {
			this.secretStorage.setSecret(this.getApiKeySecretId(project.id), apiKey);
		} catch (error) {
			try {
				await this.adapter.remove(path);
			} catch (cleanupError) {
				throw new Error(
					`Unable to store the project API key, and the project file could not be removed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`,
				);
			}
			throw new Error(
				`Unable to store the API key for project "${project.name}": ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		return project;
	}

	async update(
		projectId: string,
		name: string,
		description: string,
		llmModel: string,
		subjects: string[],
		apiKey?: string,
	): Promise<Project> {
		this.validateProjectId(projectId);

		const path = `${this.projectsDirectory}/${projectId}.json`;
		let previousContent: string;
		let existingProject: Project;
		try {
			previousContent = await this.adapter.read(path);
			existingProject = this.parseProject(previousContent);
		} catch (error) {
			throw new Error(
				`Unable to load project "${projectId}" for update: ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		const project: Project = {
			...existingProject,
			name: name.trim(),
			description: description.trim(),
			llmModel: llmModel.trim(),
			subjects: subjects.map((subject) => subject.trim()).filter(Boolean),
		};

		const secretId = this.getApiKeySecretId(projectId);
		const previousApiKey = apiKey?.trim() ? this.secretStorage.getSecret(secretId) : null;
		if (apiKey?.trim()) {
			try {
				this.secretStorage.setSecret(secretId, apiKey.trim());
			} catch (error) {
				throw new Error(
					`Unable to update the API key for project "${project.name}": ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		}

		try {
			await this.adapter.write(path, JSON.stringify(project, null, 2));
		} catch (error) {
			if (apiKey?.trim()) {
				try {
					this.secretStorage.setSecret(secretId, previousApiKey ?? '');
				} catch (rollbackError) {
					throw new Error(
						`Unable to save project "${project.name}", and the API key could not be restored: ${rollbackError instanceof Error ? rollbackError.message : String(rollbackError)}`,
					);
				}
			}
			throw new Error(
				`Unable to save project "${project.name}": ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		return project;
	}

	async delete(projectId: string): Promise<void> {
		this.validateProjectId(projectId);

		const path = `${this.projectsDirectory}/${projectId}.json`;
		try {
			await this.adapter.remove(path);
		} catch (error) {
			throw new Error(
				`Unable to remove project file "${path}": ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		try {
			this.secretStorage.setSecret(this.getApiKeySecretId(projectId), '');
		} catch (error) {
			throw new Error(
				`Project was removed, but its API key could not be cleared: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	getApiKey(projectId: string): string | null {
		this.validateProjectId(projectId);
		return this.secretStorage.getSecret(this.getApiKeySecretId(projectId));
	}

	private validateProjectId(projectId: string) {
		if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(projectId)) {
			throw new Error('Invalid project ID.');
		}
	}

	private getApiKeySecretId(projectId: string): string {
		return `nodus-ai-project-${projectId}`;
	}

	private async ensureDirectory(): Promise<void> {
		if (!(await this.adapter.exists(this.projectsDirectory))) {
			await this.adapter.mkdir(this.projectsDirectory);
		}
	}

	private parseProject(content: string): Project {
		const value: unknown = JSON.parse(content);
		if (
			typeof value !== 'object' ||
			value === null ||
			!('id' in value) ||
			typeof value.id !== 'string' ||
			!('name' in value) ||
			typeof value.name !== 'string' ||
			!('description' in value) ||
			typeof value.description !== 'string' ||
			!('createdAt' in value) ||
			typeof value.createdAt !== 'string' ||
			('llmModel' in value && typeof value.llmModel !== 'string') ||
			('subjects' in value &&
				(!Array.isArray(value.subjects) ||
					!value.subjects.every((subject) => typeof subject === 'string')))
		) {
			throw new Error('The project file has an invalid format.');
		}

		const llmModel =
			'llmModel' in value && typeof value.llmModel === 'string' ? value.llmModel : '';
		const subjects =
			'subjects' in value &&
			Array.isArray(value.subjects) &&
			value.subjects.every((subject) => typeof subject === 'string')
				? value.subjects
				: [];

		return {
			id: value.id,
			name: value.name,
			description: value.description,
			llmModel,
			subjects,
			createdAt: value.createdAt,
		};
	}

	private getFileNameFromPath(path: string): string {
		const parts = path.split('/');
		return parts[parts.length - 1] || '';
	}
}
