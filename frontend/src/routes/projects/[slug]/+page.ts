// frontend/src/routes/projects/[slug]/+page.ts
import { error } from '@sveltejs/kit';
import { loadProjectsData } from '$lib/utils/projectsLoader';
import type { PageLoad } from './$types';
import type { ProjectItem } from '$lib/types/projects';

export const load: PageLoad = async ({ params }) => {
    const { slug } = params;
    const projectsData = await loadProjectsData();
    
    // Search in both hardware and software sections
    const allProjects: ProjectItem[] = [
        ...projectsData.hardware,
        ...projectsData.software
    ];
    
    const project = allProjects.find(p => p.id === slug);
    
    if (!project) {
        throw error(404, {
            message: 'Project not found'
        });
    }
    
    // Determine section for breadcrumb/navigation
    const section = projectsData.hardware.includes(project) 
        ? 'hardware' 
        : 'software';
    
    return {
        project,
        section
    };
};
