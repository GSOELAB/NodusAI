import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './Nav.module.css';

export function Nav() {
	const { t } = useTranslation();

	return (
		<nav className={styles.nav}>
			<NavLink to="/projects">{t('navigation.projects')}</NavLink>
			<NavLink to="/chat">{t('navigation.chat')}</NavLink>
		</nav>
	);
}
