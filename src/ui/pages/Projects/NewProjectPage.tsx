import type { ProjectStorage } from '../../../services/projects/ProjectStorage';
import { ProjectForm } from './ProjectForm';

export function NewProjectPage({ projectStorage }: { projectStorage: ProjectStorage }) {
	return <ProjectForm projectStorage={projectStorage} />;
}
