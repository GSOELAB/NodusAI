import { NavLink } from 'react-router';
import styles from './Nav.module.css';

export function Nav() {
	return (
		<nav className={styles.nav}>
			<NavLink to="/chat">Chat</NavLink>
			<NavLink to="/settings">Settings</NavLink>
		</nav>
	);
}
