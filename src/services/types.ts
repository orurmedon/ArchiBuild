import { Database } from '../types/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Diagram = Database['public']['Tables']['diagrams']['Row'];

export interface User {
    id: string;
    email: string;
}

export interface AuthService {
    signIn(email: string): Promise<{ user: User | null; error: Error | null }>;
    signOut(): Promise<{ error: Error | null }>;
    getUser(): Promise<{ user: User | null; error: Error | null }>;
}

export interface StorageService {
    // Projects
    getProjects(userId: string): Promise<{ data: Project[] | null; error: Error | null }>;
    createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Project | null; error: Error | null }>;

    // Diagrams
    getDiagrams(projectId: string): Promise<{ data: Diagram[] | null; error: Error | null }>;
    getDiagram(diagramId: string): Promise<{ data: Diagram | null; error: Error | null }>;
    saveDiagram(diagramId: string, content: any): Promise<{ error: Error | null }>;
    createDiagram(diagram: Omit<Diagram, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Diagram | null; error: Error | null }>;

    // Versions
    getVersions(diagramId: string): Promise<{ data: DiagramVersion[] | null; error: Error | null }>;
    saveVersion(diagramId: string, content: any, label?: string): Promise<{ data: DiagramVersion | null; error: Error | null }>;
}

export interface DiagramVersion {
    id: string;
    diagram_id: string;
    content: any;
    label: string | null;
    created_at: string;
}
