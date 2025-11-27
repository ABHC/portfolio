import type { ProjectsData } from '$lib/types/projects';

let prod_display:boolean = true;

// Load projects data with automatic fallback to sample
export async function loadProjectsData(): Promise<ProjectsData> {
    try {
        if (prod_display) {
            // Try loading production data
            const { default: data } = await import('$lib/data/projects.json', {
                assert: { type: 'json' }
            });
        return data as ProjectsData;
        }
        else {
            const { default: data } = await import('$lib/data/projects-sample.json', {
                assert: { type: 'json' }
            });
            return data as ProjectsData;
        }
    } catch {
        // Fallback to sample if production doesn't exist
        const { default: data } = await import('$lib/data/projects-sample.json', {
            assert: { type: 'json' }
        });
        return data as ProjectsData;
    }
}
