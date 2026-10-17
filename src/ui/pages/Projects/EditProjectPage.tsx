import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Project, ProjectStorage } from '../../../services/projects/ProjectStorage';
import styles from './ProjectPages.module.css';
import { ProjectForm } from './ProjectForm';

export function EditProjectPage({ projectStorage }: { projectStorage: ProjectStorage }) {
	const { t } = useTranslation();
	const { projectId } = useParams();
	const [result, setResult] = useState<
		{ projectId: string; project: Project } | { projectId: string; error: string } | null
	>(null);

	useEffect(() => {
		let active = true;
		if (!projectId) {
			return () => {
				active = false;
			};
		}

		void projectStorage
			.get(projectId)
			.then((loadedProject) => {
				if (active) setResult({ projectId, project: loadedProject });
			})
			.catch((loadError: unknown) => {
				if (active) {
					setResult({
						projectId,
						error: loadError instanceof Error ? loadError.message : String(loadError),
					});
				}
			});

		return () => {
			active = false;
		};
	}, [projectId, projectStorage, t]);

	if (!projectId) {
		return <p className={styles.error}>{t('pages.projects.projectIdMissing')}</p>;
	}
	if (!result || result.projectId !== projectId) {
		return <p>{t('pages.projects.loading')}</p>;
	}
	if ('error' in result) {
		return (
			<p className={styles.error}>
				{t('pages.projects.loadProjectError', { error: result.error })}
			</p>
		);
	}

	return (
		<ProjectForm
			key={result.project.id}
			projectStorage={projectStorage}
			project={result.project}
		/>
	);
}
