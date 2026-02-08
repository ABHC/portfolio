import type { ProjectsData } from '$lib/types/projects';
import type { ProfileData } from '$lib/types/profile';

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

// Load profile data with automatic fallback to sample
export async function loadProfileData(): Promise<ProfileData> {
    try {
        if (prod_display) {
            const { default: data } = await import('$lib/data/profile.json', {
                assert: { type: 'json' }
            });
            return data as ProfileData;
        }
        else {
            const { default: data } = await import('$lib/data/profile-sample.json', {
                assert: { type: 'json' }
            });
            return data as ProfileData;
        }
    } catch {
        // Fallback to sample if production doesn't exist
        const { default: data } = await import('$lib/data/profile-sample.json', {
            assert: { type: 'json' }
        });
        return data as ProfileData;
    }
}

// Shared promises — created once, importable everywhere
export const projectsPromise: Promise<ProjectsData> = loadProjectsData();
export const profilePromise: Promise<ProfileData> = loadProfileData();