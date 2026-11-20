// frontend/src/routes/projects/[slug]/+page.ts
import { error } from '@sveltejs/kit';
import { loadProjectsData } from '$lib/utils/projectsLoader';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const { slug } = params;
    const projectsData = await loadProjectsData();

    const project = projectsData.find(p => p.id === slug);

    if (!project) {
        throw error(404, {
            message: 'Project not found'
        });
    }

    return {
        project,
        section: project.category
    };
};
