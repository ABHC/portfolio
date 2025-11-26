let prod_display:boolean = false;

// Load projects data with automatic fallback to sample
export async function loadProjectsData() {
    try {
        if (prod_display) {
            // Try loading production data
            const { default: data } = await import('$lib/data/projects.json', {
                assert: { type: 'json' }
            });
        return data;
        }
        else {
            const { default: data } = await import('$lib/data/projects-sample.json', {
                assert: { type: 'json' }
            });
            return data;
        }
    } catch {
        // Fallback to sample if production doesn't exist
        const { default: data } = await import('$lib/data/projects-sample.json', {
            assert: { type: 'json' }
        });
        return data;
    }
}
