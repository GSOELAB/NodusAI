import { MemoryRouter, Navigate, Route, Routes } from 'react-router';
import { Nav } from './components/Nav';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import styles from './App.module.css';

export function App() {
	return (
		<MemoryRouter initialEntries={['/chat']}>
			<div className={styles.app}>
				<Nav />
				<Routes>
					<Route path="/chat" element={<ChatPage />} />
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="*" element={<Navigate to="/chat" replace />} />
				</Routes>
			</div>
		</MemoryRouter>
	);
}
