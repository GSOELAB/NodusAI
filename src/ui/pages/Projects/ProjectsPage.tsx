import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Project, ProjectStorage } from '../../../services/projects/ProjectStorage';
import styles from './ProjectPages.module.css';

export function ProjectsPage({ projectStorage }: { projectStorage: ProjectStorage }) {
	const { t, i18n } = useTranslation();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [confirmingProjectId, setConfirmingProjectId] = useState<string | null>(null);
	const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		void projectStorage
			.list()
			.then((loadedProjects) => {
				if (active) setProjects(loadedProjects);
			})
			.catch((loadError: unknown) => {
				if (active) {
					setError(loadError instanceof Error ? loadError.message : String(loadError));
				}
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, [projectStorage]);

	async function deleteProject(project: Project) {
		setDeletingProjectId(project.id);
		setDeleteError(null);
		try {
			await projectStorage.delete(project.id);
			setProjects((currentProjects) => currentProjects.filter(({ id }) => id !== project.id));
		} catch (deleteError) {
			setDeleteError(
				deleteError instanceof Error ? deleteError.message : String(deleteError),
			);
		} finally {
			setConfirmingProjectId(null);
			setDeletingProjectId(null);
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<h1>{t('pages.projects.title')}</h1>
				<Link className={styles.primaryButton} to="/projects/new">
					{t('pages.projects.add')}
				</Link>
			</div>

			{loading && <p>{t('pages.projects.loading')}</p>}
			{error && <p className={styles.error}>{t('pages.projects.loadError', { error })}</p>}
			{deleteError && (
				<p className={styles.error}>
					{t('pages.projects.deleteError', { error: deleteError })}
				</p>
			)}
			{!loading && !error && projects.length === 0 && (
				<p className={styles.empty}>{t('pages.projects.empty')}</p>
			)}
			{!loading && !error && projects.length > 0 && (
				<ul className={styles.projectList}>
					{projects.map((project) => (
						<li className={styles.projectCard} key={project.id}>
							<div className={styles.projectDetails}>
								<h2>{project.name}</h2>
								{project.description && <p>{project.description}</p>}
								<p>
									{t('pages.projects.llmModel')}:{' '}
									{project.llmModel || t('pages.projects.modelNotSet')}
								</p>
								{project.subjects.length > 0 && (
									<p>
										{t('pages.projects.subjects')}:{' '}
										{project.subjects.join(', ')}
									</p>
								)}
								<time dateTime={project.createdAt}>
									{new Intl.DateTimeFormat(i18n.language, {
										dateStyle: 'medium',
									}).format(new Date(project.createdAt))}
								</time>
							</div>
							<div className={styles.projectActions}>
								<Link
									className={styles.secondaryButton}
									to={`/projects/${project.id}/edit`}
								>
									{t('pages.projects.edit')}
								</Link>
								{confirmingProjectId === project.id && (
									<>
										<span>
											{t('pages.projects.confirmDelete', {
												name: project.name,
											})}
										</span>
										<button
											className={styles.dangerButton}
											disabled={deletingProjectId !== null}
											type="button"
											onClick={() => void deleteProject(project)}
										>
											{deletingProjectId === project.id
												? t('pages.projects.deleting')
												: t('pages.projects.confirmDeleteAction')}
										</button>
										<button
											className={styles.secondaryButton}
											disabled={deletingProjectId !== null}
											type="button"
											onClick={() => setConfirmingProjectId(null)}
										>
											{t('pages.projects.cancel')}
										</button>
									</>
								)}
								{confirmingProjectId !== project.id && (
									<button
										className={styles.dangerButton}
										disabled={deletingProjectId !== null}
										type="button"
										onClick={() => setConfirmingProjectId(project.id)}
									>
										{t('pages.projects.delete')}
									</button>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
