import type { ProjectItem, ProjectsData, ProjectsIndexEntry } from '$lib/types/projects';
import type { ResumeData } from '$lib/types/resume';

let prod_display:boolean = true;

// Content files live one-per-project, keyed by id (see index.json / index-sample.json)
async function loadProjectContent(id: string, sample: boolean) {
    if (sample) {
        const { default: content } = await import(`$lib/data/projects-sample/${id}.json`);
        return content;
    }
    const { default: content } = await import(`$lib/data/projects/${id}.json`);
    return content;
}

async function buildProjectsData(sample: boolean): Promise<ProjectsData> {
    const { default: index } = sample
        ? await import('$lib/data/index-sample.json')
        : await import('$lib/data/index.json');

    return Promise.all(
        (index as readonly ProjectsIndexEntry[]).map(async (entry) => {
            const content = await loadProjectContent(entry.id, sample);
            return { ...entry, ...content } as ProjectItem;
        })
    );
}

// Load projects data with automatic fallback to sample
export async function loadProjectsData(): Promise<ProjectsData> {
    try {
        return await buildProjectsData(!prod_display);
    } catch {
        // Fallback to sample if production doesn't exist
        return await buildProjectsData(true);
    }
}

// Load resume data with automatic fallback to sample
export async function loadResumeData(): Promise<ResumeData> {
    try {
        if (prod_display) {
            const { default: data } = await import('$lib/data/resume.json');
            return data as ResumeData;
        }
        else {
            const { default: data } = await import('$lib/data/resume-sample.json');
            return data as ResumeData;
        }
    } catch {
        // Fallback to sample if production doesn't exist
        const { default: data } = await import('$lib/data/resume-sample.json');
        return data as ResumeData;
    }
}

// Shared promises — created once, importable everywhere
export const projectsPromise: Promise<ProjectsData> = loadProjectsData();
export const resumePromise: Promise<ResumeData> = loadResumeData();
