import { useState, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Project, ProjectStorage } from '../../../services/projects/ProjectStorage';
import styles from './ProjectPages.module.css';
import { ProjectInput } from './ProjectInput';
import { ProjectSubjectsField } from './ProjectSubjectsField';

export function ProjectForm({
	projectStorage,
	project,
}: {
	projectStorage: ProjectStorage;
	project?: Project;
}) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [name, setName] = useState(project?.name ?? '');
	const [description, setDescription] = useState(project?.description ?? '');
	const [apiKey, setApiKey] = useState('');
	const [llmModel, setLlmModel] = useState(project?.llmModel ?? '');
	const [subjects, setSubjects] = useState<string[]>(project?.subjects ?? []);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!project && !apiKey.trim()) {
			setError(t('pages.projects.apiKeyRequired'));
			return;
		}

		setSaving(true);
		setError(null);
		try {
			if (project) {
				await projectStorage.update(
					project.id,
					name,
					description,
					llmModel,
					subjects,
					apiKey.trim() || undefined,
				);
			} else {
				await projectStorage.create(name, description, apiKey.trim(), llmModel, subjects);
			}
			await navigate('/projects');
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : String(saveError));
			setSaving(false);
		}
	}

	return (
		<div className={styles.page}>
			<h1>{t(project ? 'pages.projects.editTitle' : 'pages.projects.createTitle')}</h1>
			<form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
				<ProjectInput
					autoFocus
					label={t('pages.projects.name')}
					maxLength={120}
					required
					value={name}
					onChange={setName}
				/>
				<ProjectInput
					label={t('pages.projects.description')}
					maxLength={2000}
					multiline
					rows={5}
					value={description}
					onChange={setDescription}
				/>
				<ProjectSubjectsField subjects={subjects} onChange={setSubjects} />
				<ProjectInput
					autoComplete="off"
					hint={t('pages.projects.llmModelHelp')}
					label={t('pages.projects.llmModel')}
					placeholder="openai/gpt-4o-mini"
					required
					value={llmModel}
					onChange={setLlmModel}
				/>
				<ProjectInput
					autoComplete="new-password"
					hint={t(
						project ? 'pages.projects.apiKeyEditHelp' : 'pages.projects.apiKeyHelp',
					)}
					label={t(project ? 'pages.projects.apiKeyEdit' : 'pages.projects.apiKey')}
					maxLength={512}
					required={!project}
					type="password"
					value={apiKey}
					onChange={setApiKey}
				/>

				{error && (
					<p className={styles.error}>{t('pages.projects.saveError', { error })}</p>
				)}

				<div className={styles.actions}>
					<Link className={styles.secondaryButton} to="/projects">
						{t('pages.projects.cancel')}
					</Link>
					<button className={styles.primaryButton} disabled={saving} type="submit">
						{saving
							? t('pages.projects.saving')
							: t(project ? 'pages.projects.update' : 'pages.projects.save')}
					</button>
				</div>
			</form>
		</div>
	);
}
