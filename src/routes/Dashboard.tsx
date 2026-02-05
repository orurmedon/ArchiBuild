import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { storageService } from '@/services';
import { Project } from '@/services/types';

export default function Dashboard() {
    const { user, signOut, checkSession } = useAuthStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check credentials on mount
        checkSession();
    }, [checkSession]);

    useEffect(() => {
        if (!user) {
            // If checkSession failed or hasn't run, user is null.
            // We might want to listen to isLoading from store to be sure,
            // but if checkSession finishes and user is still null, we redirect.
            // For now, let's just wait for user to be truthy or manual redirect if needed.
            // logic left simple for this stage
        } else {
            loadProjects(user.id);
        }
    }, [user]);

    const loadProjects = async (userId: string) => {
        const { data } = await storageService.getProjects(userId);
        if (data) setProjects(data);
    };

    const handleCreateProject = async () => {
        if (!user) return;
        const name = prompt('Project Name:');
        if (!name) return;

        const { data, error } = await storageService.createProject({
            name,
            description: '',
            owner_id: user.id
        });

        if (error) {
            alert('Error creating project');
        } else if (data) {
            setProjects([...projects, data]);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Link to="/login" className="text-blue-600 hover:underline">Please Log In</Link>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome, {user.email}</p>
                    </div>
                    <div className="space-x-4">
                        <button onClick={handleCreateProject} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            New Project
                        </button>
                        <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link key={project.id} to={`/editor/${project.id}`} className="block">
                            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                                <p className="text-gray-500 text-sm">Last updated: {new Date(project.updated_at).toLocaleDateString()}</p>
                                <div className="mt-4 flex justify-end text-blue-600 text-sm font-medium">
                                    Open Project &rarr;
                                </div>
                            </div>
                        </Link>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No projects yet. Create one to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
