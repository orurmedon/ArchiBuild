import { StorageService, Project, Diagram, DiagramVersion } from '../types';

const PROJECTS_KEY = 'archibuild_projects';
const DIAGRAMS_KEY = 'archibuild_diagrams';

const getLocalData = <T>(key: string): T[] => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
};

const setLocalData = <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const localStorageService: StorageService = {
    async getProjects(userId: string) {
        const projects = getLocalData<Project>(PROJECTS_KEY);
        // Filter by owner_id in a real app, but for local mock we might just return all or filter if we saved owner_id
        const userProjects = projects.filter(p => p.owner_id === userId);
        return { data: userProjects, error: null };
    },

    async createProject(project) {
        const projects = getLocalData<Project>(PROJECTS_KEY);
        const newProject: Project = {
            ...project,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        projects.push(newProject);
        setLocalData(PROJECTS_KEY, projects);
        return { data: newProject, error: null };
    },

    async getDiagrams(projectId: string) {
        const diagrams = getLocalData<Diagram>(DIAGRAMS_KEY);
        const projectDiagrams = diagrams.filter(d => d.project_id === projectId);
        return { data: projectDiagrams, error: null };
    },

    async getDiagram(diagramId: string) {
        const diagrams = getLocalData<Diagram>(DIAGRAMS_KEY);
        const diagram = diagrams.find(d => d.id === diagramId);
        return { data: diagram || null, error: null };
    },

    async saveDiagram(diagramId: string, content: any) {
        const diagrams = getLocalData<Diagram>(DIAGRAMS_KEY);
        const index = diagrams.findIndex(d => d.id === diagramId);
        if (index === -1) return { error: new Error('Diagram not found') };

        diagrams[index] = {
            ...diagrams[index],
            content,
            updated_at: new Date().toISOString(),
        };
        setLocalData(DIAGRAMS_KEY, diagrams);
        return { error: null };
    },

    createDiagram(diagram) {
        const diagrams = getLocalData<Diagram>(DIAGRAMS_KEY);
        const newDiagram: Diagram = {
            ...diagram,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            thumbnail_url: null
        };
        diagrams.push(newDiagram);
        setLocalData(DIAGRAMS_KEY, diagrams);
        return { data: newDiagram, error: null };
    },

    async getVersions(diagramId: string) {
        // In a real DB this would be a separate table.
        // For local mock, we'll store them in a separate key 'archibuild_versions'
        const versions = getLocalData<DiagramVersion>('archibuild_versions');
        const diagramVersions = versions.filter(v => v.diagram_id === diagramId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { data: diagramVersions, error: null };
    },

    async saveVersion(diagramId: string, content: any, label?: string) {
        const versions = getLocalData<DiagramVersion>('archibuild_versions');
        const newVersion: DiagramVersion = {
            id: crypto.randomUUID(),
            diagram_id: diagramId,
            content,
            label: label || null,
            created_at: new Date().toISOString(),
        };
        versions.push(newVersion);
        setLocalData('archibuild_versions', versions);
        return { data: newVersion, error: null };
    }
};
