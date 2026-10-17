import { useState, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectInput } from './ProjectInput';
import styles from './ProjectPages.module.css';

export function ProjectSubjectsField({
	subjects,
	onChange,
}: {
	subjects: string[];
	onChange: (subjects: string[]) => void;
}) {
	const { t } = useTranslation();
	const [newSubject, setNewSubject] = useState('');

	function addSubject(newSubject: string) {
		const subject = newSubject.trim();
		if (
			!subject ||
			subjects.some(
				(existing) => existing.toLocaleLowerCase() === subject.toLocaleLowerCase(),
			)
		) {
			return;
		}

		onChange([...subjects, subject]);
		setNewSubject('');
	}

	return (
		<details className={styles.subjects}>
			<summary>{t('pages.projects.subjects')}</summary>
			<div className={styles.subjectForm}>
				<ProjectInput
					ariaLabel={t('pages.projects.subjectName')}
					maxLength={80}
					placeholder={t('pages.projects.subjectPlaceholder')}
					variant="inline"
					value={newSubject}
					onChange={setNewSubject}
				/>
				<button
					className={styles.secondaryButton}
					disabled={!newSubject.trim()}
					type="button"
					onClick={() => addSubject(newSubject)}
				>
					{t('pages.projects.addSubject')}
				</button>
			</div>
			{subjects.length > 0 ? (
				<ul className={styles.subjectList}>
					{subjects.map((subject, index) => (
						<li className={styles.subjectItem} key={`${subject}-${index}`}>
							<span>{subject}</span>
							<button
								aria-label={t('pages.projects.removeSubject', { subject })}
								className={styles.subjectRemove}
								type="button"
								onClick={() =>
									onChange(
										subjects.filter(
											(_, subjectIndex) => subjectIndex !== index,
										),
									)
								}
							>
								{t('pages.projects.remove')}
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className={styles.helpText}>{t('pages.projects.noSubjects')}</p>
			)}
		</details>
	);
}
