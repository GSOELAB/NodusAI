import { MemoryRouter, Navigate, Route, Routes } from 'react-router';
import { Nav } from './components/Nav';
import { ChatPage } from './pages/ChatPage';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { NewProjectPage } from './pages/Projects/NewProjectPage';
import { EditProjectPage } from './pages/Projects/EditProjectPage';
import type { ProjectStorage } from '../services/projects/ProjectStorage';
import styles from './App.module.css';

export function App({ projectStorage }: { projectStorage: ProjectStorage }) {
	return (
		<MemoryRouter initialEntries={['/chat']}>
			<div className={styles.app}>
				<Nav />
				<Routes>
					<Route
						path="/projects"
						element={<ProjectsPage projectStorage={projectStorage} />}
					/>
					<Route
						path="/projects/new"
						element={<NewProjectPage projectStorage={projectStorage} />}
					/>
					<Route
						path="/projects/:projectId/edit"
						element={<EditProjectPage projectStorage={projectStorage} />}
					/>
					<Route path="/chat" element={<ChatPage />} />
					<Route path="*" element={<Navigate to="/chat" replace />} />
				</Routes>
			</div>
		</MemoryRouter>
	);
}
