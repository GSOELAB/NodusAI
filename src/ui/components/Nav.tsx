import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './Nav.module.css';

export function Nav() {
	const { t } = useTranslation();

	return (
		<nav className={styles.nav}>
			<NavLink to="/chat">{t('navigation.chat')}</NavLink>
			<NavLink to="/settings">{t('navigation.settings')}</NavLink>
		</nav>
	);
}
