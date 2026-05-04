<script lang="ts">
	import {
		Hero,
		Marquee,
		Timeline,
		TimelineItem,
		Badge,
		Progress,
		Callout,
		Avatar,
		Button,
		Card,
		Headline,
	} from '@abhc/spektral-ui';

    import { 
        getIcon, 
        getIconColor, 
        getContactIcon 
    } from '$lib/utils/iconsBank'

	import { profilePromise } from '$lib/utils/projectsLoader';
	//import { getContactIcon } from '$lib/utils/iconsBank';
	import Prose from '$lib/components/Prose.svelte';

	import type { ProfileData, Job, Language } from '$lib/types/profile';

	import {
		trans,
		locale,
		theme_color,
	} from '../store';

	// Constants ---------------------------------------------------------------

	// CEFR -> percent mapping for the language Progress bars
	const cefr_to_pct: Record<string, number> = {
		A1: 17, A2: 33, B1: 50, B2: 67, C1: 83, C2: 100,
	};

	// TODO: move to translations.ts once the resume layout is locked
	const section_labels = {
		fr: {
			about_eyebrow: 'I — Préambule',
			about_title: 'Civis Romanus, Faber Operum.',
			experience_eyebrow: 'II — Cursus Honorum',
			experience_title: "Là où j'ai bâti.",
			studies_eyebrow: 'III — Studia & Artes',
			studies_title: "Ce que j'ai appris, ce que je sais faire.",
			references_eyebrow: 'IV — Testimonia',
			references_title: 'Ils ont travaillé avec moi.',
			cta_title_a: 'Une commande publique ?',
			cta_title_b: 'Un combat naval ?',
			cta_lede: "Plume, écoute attentive, et stylet bien taillé. Voici comment me joindre.",
			download_cv: 'Télécharger le CV',
			contact_me: 'Me contacter',
			current_job: 'En poste',
			available: 'Disponible pour missions · Roma',
			stat_years: 'Années',
			stat_jobs: 'Postes',
			stat_employers: 'Employeurs',
			stat_cities: 'Villes',
			footer_quote: '« Fortes fortuna iuvat »',
		},
		en: {
			about_eyebrow: 'I — Preamble',
			about_title: 'Civis Romanus, Faber Operum.',
			experience_eyebrow: 'II — Cursus Honorum',
			experience_title: 'Where I built things.',
			studies_eyebrow: 'III — Studia & Artes',
			studies_title: 'What I learned, what I can do.',
			references_eyebrow: 'IV — Testimonia',
			references_title: 'They worked with me.',
			cta_title_a: 'A public commission?',
			cta_title_b: 'A naval battle?',
			cta_lede: 'Sharp pen, sharp ear, sharp stylus. Here is how to reach me.',
			download_cv: 'Download CV',
			contact_me: 'Get in touch',
			current_job: 'Currently',
			available: 'Available for projects · Roma',
			stat_years: 'Years',
			stat_jobs: 'Roles',
			stat_employers: 'Employers',
			stat_cities: 'Cities',
			footer_quote: '« Fortes fortuna iuvat »',
		},
	} as const;

	// Marquee items shown under the hero
	// TODO: source from data once a dedicated field exists in profile.json
	const marquee_items = [
		'Voirie & cloaca', 'Acta diurna', 'Naumachies',
		'Discours forensiques', 'Aqueducs', 'Comitia', 'Munera publica',
	];

	// Helpers -----------------------------------------------------------------

	const ROMAN_VALUES: Record<string, number> = {
		I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
	};

	function romanToInt(r: string): number {
		const s = r.toUpperCase();
		let total = 0;
		for (let i = 0; i < s.length; i++) {
			const cur = ROMAN_VALUES[s[i]];
			const nxt = ROMAN_VALUES[s[i + 1]];
			if (cur === undefined) return NaN;
			if (nxt && cur < nxt) total -= cur;
			else total += cur;
		}
		return total;
	}

	function parseYear(v: string | number | null | undefined): number | null {
		if (v === null || v === undefined) return new Date().getFullYear();
		if (typeof v === 'number') return v;
		if (/^(present|présent|aujourd)/i.test(v)) return new Date().getFullYear();
		if (/^\d+$/.test(v)) return parseInt(v, 10);
		const r = romanToInt(v);
		return isNaN(r) ? null : r;
	}

	function jobDuration(start: Job['start'], end: Job['end'], loc: 'fr' | 'en'): string {
		const e = parseYear(end as unknown as string | number);
		const s = parseYear(start as unknown as string | number);
		if (s === null || e === null) return '';
		const diff = e - s;
		if (diff < 1) return loc === 'fr' ? '<1 an' : '<1 yr';
		const unit = loc === 'fr' ? (diff > 1 ? 'ans' : 'an') : (diff > 1 ? 'yrs' : 'yr');
		return `${diff} ${unit}`;
	}

	function isCurrentJob(end: Job['end']): boolean {
		if (end === null || end === undefined) return true;
		const s = String(end);
		return /present|présent/i.test(s);
	}

	function getFullName(profile: ProfileData): string {
		return profile.me.id
			.filter((p) => p.display && p.type !== 'nickname')
			.map((p) => p.name)
			.join(' ');
	}

	function getNickname(profile: ProfileData): string | null {
		const n = profile.me.id.find((p) => p.type === 'nickname' && p.display);
		return n ? n.name : null;
	}

	function getContactHref(c: { type: string; address: string }): string {
		if (c.type === 'Mail') return `mailto:${c.address}`;
		if (c.type === 'Phone') return `tel:${c.address}`;
		return c.address;
	}

	// State -------------------------------------------------------------------

	let profile = $state<ProfileData | null>(null);
	let load_error = $state<Error | null>(null);

	profilePromise
		.then((p) => (profile = p))
		.catch((e) => (load_error = e));

	// Reactive ----------------------------------------------------------------

	const adapted_color: string = $derived($theme_color === 'dark' ? 'white' : 'black');
	const labels = $derived(section_labels[$locale]);

	const full_name = $derived(profile ? getFullName(profile) : '');
	const nickname = $derived(profile ? getNickname(profile) : null);
    const tagline = $derived(profile?.me.tagline[$locale]?.join(' | ') ?? '');
	const visible_jobs = $derived(profile?.jobs.filter((j) => j.display) ?? []);
	const visible_studies = $derived(profile?.studies.filter((s) => s.display) ?? []);
	const visible_langs = $derived(profile?.languages.filter((l) => l.display) ?? []);
	const visible_refs = $derived(profile?.references.filter((r) => r.display) ?? []);
	const visible_contacts = $derived(profile?.contact.filter((c) => c.display) ?? []);
	const visible_tools = $derived(profile?.tools.filter((t) => t.display) ?? []);

    const tools_icons = $derived(
        profile?.tools.map(tool => {
            const icon = getIcon(tool.name);
            const bgColor = getIconColor(tool.name);
            return { ...tool, icon, bgColor };
        })
    );

</script>

{#if load_error}
	<div class="alert alert-error">
		{$trans?.alerts.loading_error}&nbsp;{load_error.message}
	</div>
{:else if !profile}
	<div class="alert alert-info">{$trans?.alerts.loading}</div>
{:else}

	<div class="cv-page">
        <!-- Hero ---------------------------------------------------------------- -->

        <Hero
            layout="two-cols"
            palette="transparent"
            pattern="sunrise"
            pattern_color={adapted_color}
            pattern_size="150px"
            pattern_opacity={0.03}
            pattern_mask="ellipse"
            pattern_mask_size={1000}
            pattern_mask_direction="left"
            gap="0"
            pattern_effect="glow"
            pattern_effect_opacity={0.5}
            height="50dvh"
        >
            {#snippet cell_2()}
                <div class="cv-hero-text" id="top">
                    <!--<div class="cv-eyebrow">
                        <span class="cv-status-dot" aria-hidden="true"></span>
                        <span>{labels.available}</span>
                    </div>-->

                    <Headline size="lg" uppercase>
                        {full_name}
                    </Headline>

                    <span class="cv-2tagline">{tagline}</span>

                    <!--<div class="cv-tagline">
                        {#each profile.me.tagline[$locale] as t}
                            <Badge variant="outlined" palette="tone" size="sm">{t}</Badge>
                        {/each}
                    </div>-->

                    <div class="cv-hero-bio">
                        <Prose source={profile.me.about[$locale].join('')} />
                    </div>

                    <div class="cv-hero-actions">
                        <Button 
                            variant="flat" 
                            palette="accent" 
                            size="md"
                            elevation="hard"
                            elevation_persist={true}
                        >
                            {labels.download_cv}
                        </Button>
                        <Button
                            variant="outlined" 
                            palette="tone" 
                            size="md"
                            elevation="hard"
                            elevation_persist={true} 
                            href="#contact"
                        >
                            {labels.contact_me}
                        </Button>
                    </div>

                    <!--<div class="cv-hero-quickstats">
                        <div><strong>{visible_jobs.length}</strong><span>{$trans?.profile.experience}</span></div>
                        <div><strong>{visible_studies.length}</strong><span>{$trans?.profile.education}</span></div>
                        <div><strong>{visible_langs.length}</strong><span>{$trans?.profile.languages}</span></div>
                        <div><strong>{visible_tools.length}</strong><span>{$trans?.profile.tools}</span></div>
                    </div>-->
                </div>
            {/snippet}

            {#snippet cell_1()}
                <div class="cv-avatar">
                    <Avatar
                        size="2xl"
                        label="ABHC"
                        shape="square"
                        elevation="hard"
                        src={profile.me.portrait}
                        alt={full_name}
                    />
                    <!--<<div class="cv-hero-portrait">
                        <img src={profile.me.portrait} alt={full_name} />
                    </div>-->
                </div>
            {/snippet}
        </Hero>

        <!-- Marquee ------------------------------------------------------------- -->

        <Marquee>
            {#each marquee_items as it}
                <span class="cv-marquee-item">{it}</span>
            {/each}
        </Marquee>

        <!-- Experience ---------------------------------------------------------- -->

        <Headline size="md">{labels.experience_title}</Headline>

        <section id="experience" class="cv-section cv-section-alt">

            <div class="cv-twocol">
                <Timeline
                    variant="ghost"
                    palette="accent"
                    size="md"
                    connector="dashed"
                    completed={visible_jobs.length}
                >
                    {#each visible_jobs as j}
                        {@const current = isCurrentJob(j.end)}
                        {@const meta_str = `${j.company} · ${j.city} · ${jobDuration(j.start, j.end, $locale)}`}
                        <TimelineItem
                            title={j.position[$locale]}
                            meta={meta_str}
                            wide
                        >
                            {#snippet marker()}
                                <span>{j.start}—{j.end}</span>
                            {/snippet}

                            {#if current}
                                <Badge variant="flat" palette="accent" size="sm">{labels.current_job}</Badge>
                            {/if}

                            <ul class="cv-tl-bullets">
                                {#each j.description[$locale] as d}
                                    <li><Prose source={d} inline /></li>
                                {/each}
                            </ul>
                        </TimelineItem>
                    {/each}
                </Timeline>

                <aside class="cv-aside-stack">
                    <Callout variant="accent" bordered>
                        <strong>{labels.available}</strong>
                    </Callout>

                    <div class="cv-stats-grid">
                        <Card variant="outlined" elevation="subtle">
                            <div class="cv-stat-num">XII</div>
                            <div class="cv-stat-lbl">Lorem</div>
                        </Card>
                        <Card variant="outlined" elevation="subtle">
                            <div class="cv-stat-num">IV</div>
                            <div class="cv-stat-lbl">Ipsum</div>
                        </Card>
                        <Card variant="outlined" elevation="subtle">
                            <div class="cv-stat-num">III</div>
                            <div class="cv-stat-lbl">Dolor</div>
                        </Card>
                        <Card variant="outlined" elevation="subtle">
                            <div class="cv-stat-num">VII</div>
                            <div class="cv-stat-lbl">Sit amet</div>
                        </Card>
                    </div>
                </aside>
            </div>
        </section>

        <!-- Studies & Aside ----------------------------------------------------- -->

        <Headline size="md">{labels.studies_title}</Headline>

        <section id="studies" class="cv-section">
            <div class="cv-twocol">
                <div class="cv-studies-col">
                    <div class="cv-edu-grid">
                        {#each visible_studies as s}
                            <Card variant="flat" elevation="hard">
                                <div class="cv-edu-top">
                                    <Badge
                                        variant="outlined"
                                        palette={s.type === 'diploma' ? 'accent' : 'info'}
                                        size="sm"
                                        uppercase
                                    >
                                        {s.type === 'diploma'
                                            ? ($locale === 'fr' ? 'Diplôme' : 'Diploma')
                                            : ($locale === 'fr' ? 'Certificat' : 'Certificate')}
                                    </Badge>
                                    <span class="cv-edu-year">{s.years}</span>
                                </div>

                                <h4 class="cv-edu-name">{s.name[$locale]}</h4>
                                <div class="cv-edu-school">
                                    <strong>{s.school}</strong>
                                    {#if s.college}<span> · {s.college}</span>{/if}
                                </div>
                                {#if s.description[$locale].length}
                                    <p class="cv-edu-desc">{s.description[$locale].join(' · ')}</p>
                                {/if}
                            </Card>
                        {/each}
                    </div>
                </div>

                <aside class="cv-aside-stack">
                    <Card variant="outlined" elevation="hard">
                        <div class="cv-lang-list">
                            {#each visible_langs as l}
                                {@const pct = cefr_to_pct[l.level] ?? 0}
                                <div class="cv-lang-row">
                                    <div class="cv-lang-head">
                                        <span class="cv-lang-id">{l.id}</span>
                                        <span class="cv-lang-name">
                                            <strong>{l.name[$locale]}</strong>
                                            <span class="cv-lang-desc">{l.description[$locale]}</span>
                                        </span>
                                        <Badge 
                                            variant="outlined" 
                                            palette="accent" 
                                            size="sm"
                                        >
                                            {l.level}
                                        </Badge>
                                    </div>
                                    <Progress 
                                        palette="accent" 
                                        size="sm" 
                                        value={pct} 
                                        show_value={false}
                                    />
                                </div>
                            {/each}
                        </div>
                    </Card>

                    <Card variant="outlined" elevation="hard">
                        <div class="cv-skill-groups">
                            {#each Object.entries(profile.skills[$locale]) as [cat, items]}
                                <div class="cv-skill-group">
                                    <div class="cv-skill-cat">
                                        {$trans?.skills[cat as keyof typeof $trans.skills] ?? cat}
                                    </div>
                                    <div class="cv-badge-cluster">
                                        {#each items as skill}
                                            <Badge 
                                                variant="outlined" 
                                                palette="accent" 
                                                size="sm" 
                                                pill
                                            >
                                                {skill}
                                            </Badge>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </Card>

                    <Card variant="outlined" elevation="hard">
                        <div class="cv-skill-cat">
                            {$trans?.profile.tools}
                        </div>
                        <div class="cv-badge-cluster">
                            {#each tools_icons as tool}
                                {#if tool.display}
                                    <Badge variant="outlined" palette="neutral" size="sm">
                                        {#if tool.icon}
                                            <svg
                                                viewBox="0 0 24 24"
                                                width="14"
                                                height="16"
                                                aria-hidden="true"
                                            >
                                                <path d={tool.icon.path} fill="currentColor" />
                                            </svg>
                                        {/if}
                                        {tool.name}
                                    </Badge>
                                {/if}
                            {/each}
                        </div>
                    </Card>
                </aside>
            </div>
        </section>

        <!-- References ---------------------------------------------------------- -->

        <Headline size="md">{labels.references_title}</Headline>

        <section id="references" class="cv-section cv-section-alt">
            <div class="cv-ref-grid">
                {#each visible_refs as r}
                    <article class="cv-ref-card">
                        <div class="cv-ref-quote" aria-hidden="true">"</div>
                        <p class="cv-ref-content">{r.content[$locale][0]}</p>
                        <div class="cv-ref-attr">
                            <Avatar 
                                size="sm" 
                                src={r.portrait} 
                                alt={r.person} 
                                shape="square" 
                                palette="tone" 
                            />
                            <div>
                                <div class="cv-ref-name">{r.person}</div>
                                <div class="cv-ref-pos">{r.position[$locale]}</div>
                            </div>
                        </div>
                    </article>
                {/each}
            </div>
        </section>

        <!-- CTA ----------------------------------------------------------------- -->

        <section id="contact" class="cv-cta">
            <div class="cv-cta-text">
                <Headline size="md">
                    {labels.cta_title_a}<br />{labels.cta_title_b}
                </Headline>
                <p>{labels.cta_lede}</p>
            </div>

            <div class="cv-cta-channels">
                {#each visible_contacts as c}
                    {@const icon = getContactIcon(c.type)}
                    <a
                        href={getContactHref(c)}
                        target={c.type !== 'Mail' && c.type !== 'Phone' ? '_blank' : undefined}
                        rel="noopener"
                        class="cv-cta-channel"
                    >
                        {#if icon}
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                <path d={icon.path} fill="currentColor" />
                            </svg>
                        {/if}
                        <div class="cv-cta-channel-meta">
                            <span class="cv-cta-channel-type">{c.type}</span>
                            <span class="cv-cta-channel-addr">
                                {c.address.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                            </span>
                        </div>
                    </a>
                {/each}
            </div>
        </section>
	</div>
{/if}

<style>
	/* TODO: port styles from drafts/ (cv.css equivalent) — skeleton only */

	/* Page wrapper: confines content to the layout's main grid cell.
	   The parent .content uses 180px / 1fr / 180px; without min-width: 0 here
	   a wide child (Hero, grids) makes the 1fr column blow past its intent. */
	.cv-page {
		/*width: 100%;
		min-width: 0;
		max-width: 100%;
		box-sizing: border-box;
		overflow-x: clip;*/
        /*max-width: 1400px;*/
        /*margin: 0 auto;*/
        padding: 2rem;
        color: var(--spk-text);
        display: flex;
        flex-direction: column;
	}

	/*.cv-page :global(*) {
		box-sizing: border-box;
	}*/

	/*.cv-section {
		padding: 4rem 1rem;
		color: var(--spk-text);
		max-width: 100%;
	}*/

	.cv-section-alt {
		background: var(--spk-surface-muted, transparent);
	}

	.cv-section-head {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 2rem;
	}

	.cv-section-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.7;
	}

	.cv-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		opacity: 0.8;
		margin-bottom: 1rem;
	}

	.cv-status-dot {
		display: inline-block;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--spk-accent);
	}

	.cv-name-nick {
		font-style: italic;
		opacity: 0.7;
		margin-left: 0.5rem;
	}

	.cv-tagline {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}


	.cv-2tagline {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0 0 1rem 0;
        font-size: 24px;
        font-family: var(--spk-font-heading);
        text-transform: uppercase;
	}

	.cv-hero-bio {
		max-width: 50ch;
		line-height: 1.6;
	}

	.cv-hero-actions {
		display: flex;
		gap: 0.75rem;
		margin: 1.5rem 0;
		flex-wrap: wrap;
	}

	.cv-hero-quickstats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.cv-hero-quickstats div {
		display: flex;
		flex-direction: column;
	}

	.cv-hero-quickstats strong {
		font-size: 1.5rem;
	}

	.cv-hero-quickstats span {
		font-size: 0.75rem;
		opacity: 0.7;
		text-transform: uppercase;
	}

    .cv-avatar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

	.cv-hero-portrait img {
		width: 100%;
		height: auto;
		border-radius: 0.5rem;
		object-fit: cover;
	}

	.cv-marquee-item {
		padding: 0 1.5rem;
		opacity: 0.7;
	}

	.cv-twocol {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: 2rem;
	}

	.cv-edu-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.cv-edu-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cv-edu-year {
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.cv-tools-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	.cv-aside-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.cv-stats-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.cv-stat-num {
		font-size: 1.75rem;
		font-weight: 600;
		line-height: 1;
	}

	.cv-stat-lbl {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.7;
		margin-top: 0.35rem;
	}

	.cv-panel {
		padding: 1rem;
		border: 1px solid var(--spk-border, currentColor);
	}

	.cv-panel-title {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.75rem;
	}

	.cv-lang-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 0.75rem;
	}

	.cv-lang-head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.cv-lang-id {
		font-family: var(--spk-font-mono, monospace);
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.cv-lang-name {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.cv-lang-desc {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.cv-skill-group {
		margin-bottom: 0.75rem;
	}

	.cv-skill-cat {
		font-size: 0.75rem;
		text-transform: uppercase;
		opacity: 0.7;
		margin-bottom: 0.35rem;
	}

	.cv-badge-cluster {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.cv-tl-bullets {
		margin: 0.5rem 0 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.cv-ref-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.cv-ref-card {
		padding: 1.25rem;
		border: 1px solid var(--spk-border, currentColor);
		position: relative;
	}

	.cv-ref-quote {
		font-size: 3rem;
		line-height: 1;
		opacity: 0.2;
	}

	.cv-ref-attr {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.cv-ref-name { font-weight: 600; }
	.cv-ref-pos { font-size: 0.875rem; opacity: 0.7; }

	.cv-cta {
		padding: 4rem 1rem;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 2rem;
		max-width: 100%;
	}

	.cv-cta-channels {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.cv-cta-channel {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border: 1px solid var(--spk-border, currentColor);
		text-decoration: none;
		color: inherit;
	}

	.cv-cta-channel-meta {
		display: flex;
		flex-direction: column;
	}

	.cv-cta-channel-type {
		font-size: 0.75rem;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.cv-pagefoot {
		padding: 2rem 1rem;
		text-align: center;
		opacity: 0.7;
		font-style: italic;
	}

	.alert {
		padding: 15px 20px;
		border-radius: 8px;
		margin: 1rem;
		border-left: 4px solid var(--spk-accent);
	}

	.alert-info {
		background: var(--spk-accent-muted);
		color: var(--spk-text);
	}

	.alert-error {
		background: var(--spk-accent-muted);
		color: var(--spk-text);
		border-color: var(--spk-error);
	}

    .quick-tools {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .tool-badge {
        padding: 0.4rem 0.84em;
        /*border-radius: 6px;*/
        font-size: 0.75rem;
        font-weight: 600;
    }

	@media (max-width: 768px) {
		.cv-twocol,
		.cv-cta {
			grid-template-columns: 1fr;
		}

		.cv-hero-quickstats {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
