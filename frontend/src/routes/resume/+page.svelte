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
		ListItem,
		CopyButton
	} from '@abhc/spektral-ui';

    import {
        getIcon,
        getIconColor,
        isValidIconKey
    } from '$lib/utils/iconsBank'

	import { profilePromise } from '$lib/utils/projectsLoader';
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

	// State -------------------------------------------------------------------

	let profile = $state<ProfileData | null>(null);
	let load_error = $state<Error | null>(null);

	profilePromise
		.then((p) => (profile = p))
		.catch((e) => (load_error = e));

	// Reactive ----------------------------------------------------------------

	const adapted_color: string = $derived($theme_color === 'dark' ? 'white' : 'black');
	const full_name = $derived(profile ? getFullName(profile) : '');
    const tagline = $derived(profile?.me.tagline[$locale]?.join(' | ') ?? '');
	const visible_jobs = $derived(profile?.jobs.filter((j) => j.display) ?? []);
	const visible_studies = $derived(profile?.studies.filter((s) => s.display) ?? []);
	const visible_langs = $derived(profile?.languages.filter((l) => l.display) ?? []);
	const visible_refs = $derived(profile?.references.filter((r) => r.display) ?? []);
	const visible_contacts = $derived(profile?.contact.filter((c) => c.display) ?? []);
	const visible_key_figures = $derived(profile?.keyFigures.filter((k) => k.display) ?? []);

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

		<div
			data-summary="bio"
			data-summary-label={$trans?.summary.bio}
		></div>

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
                        <Prose source={profile!.me.about[$locale].join('')} />
                    </div>

                    <div class="cv-hero-actions">
                        <Button 
                            variant="flat" 
                            palette="accent" 
                            size="md"
                            elevation="hard"
                            elevation_persist={true}
                        >
                            {$trans?.resume.download_cv}
                        </Button>
                        <Button
                            variant="outlined"
                            palette="tone"
                            size="md"
                            elevation="hard"
                            elevation_persist={true}
                            href="#contact"
                        >
                            {$trans?.resume.contact_me}
                        </Button>
                    </div>
                </div>
            {/snippet}

            {#snippet cell_1()}
                <div class="cv-avatar">
                    <Avatar
                        size="2xl"
                        label="ABHC"
                        shape="square"
                        elevation="hard"
                        src={profile!.me.portrait}
                        alt={full_name}
                    />
                </div>
            {/snippet}
        </Hero>

        <!-- Marquee ------------------------------------------------------------- -->

        <Marquee>
            {#each profile.marquee[$locale] as it}
                <span class="cv-marquee-item">{it}</span>
            {/each}
        </Marquee>

        <!-- Experience ---------------------------------------------------------- -->

		<div
			data-summary="experience"
			data-summary-label={$trans?.summary.experience}
		>
        	<Headline size="md">{$trans?.resume.experience_title}</Headline>
		</div>

        <section id="experience-section" class="cv-section">

            <div class="cv-twocol">
                <Timeline
                    variant="ghost"
                    palette="accent"
                    size="md"
                    connector="solid"
                    completed={visible_jobs.length}
                >
                    {#each visible_jobs as job}
                        {@const current = isCurrentJob(job.end)}
                        {@const meta_str = `${job.company} · ${job.city} · ${jobDuration(job.start, job.end, $locale)}`}
                        <TimelineItem
                            title={job.position[$locale]}
                            meta={meta_str}
                            wide
                        >
                            {#snippet marker()}
                                <span>{job.start} - {job.end}</span>
                            {/snippet}

                            {#if current}
                                <Badge variant="flat" palette="accent" size="sm">{$trans?.resume.current_job}</Badge>
                            {/if}

                            <div class="cv-tl-desc">
                                <Prose source={job.description[$locale].join('')} />
                            </div>
                        </TimelineItem>
                    {/each}
                </Timeline>

                <aside class="cv-aside-stack">
                    <div class="cv-stats-grid">
                        {#each visible_key_figures as k}
                            <Card variant="outlined" elevation="hard">
                                <div class="cv-stat-num">{k.numeral}</div>
                                <div class="cv-stat-lbl">{k.label[$locale]}</div>
                            </Card>
                        {/each}
                    </div>
                </aside>
            </div>
        </section>

        <!-- Studies & Aside ----------------------------------------------------- -->

		<div
			data-summary="studies"
			data-summary-label={$trans?.summary.studies}
		>
        	<Headline size="md">{$trans?.resume.studies_title}</Headline>
		</div>

        <section id="studies-section" class="cv-section">
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
										pill={false}
                                        uppercase
                                    >
                                        {s.type === 'diploma' ? $trans?.profile.diploma : $trans?.profile.certificate}
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
											pill={false}
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
                                                pill={false}
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
                                    <Badge 
										variant="outlined" 
										palette="neutral" 
										size="sm"
										pill={false}
									>
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

		<div
			data-summary="references"
			data-summary-label={$trans?.summary.references}
		>
        	<Headline size="md">{$trans?.resume.references_title}</Headline>
		</div>

        <section id="references-section" class="cv-section cv-section-alt">
            <div class="cv-ref-grid">
                {#each visible_refs as r}
					<Card variant="flat" elevation="hard">
						{#snippet leading()}
							<div class="cv-ref-quote-wrap">
								<p class="cv-ref-content">{r.quote[$locale][0]}</p>
							</div>
						{/snippet}

						{#snippet children()}
							<div class="cv-ref-attr">
								<Avatar 
									size="sm" 
									src={r.portrait} 
									alt={r.person} 
									label={r.person}
									shape="square" 
									palette="accent" 
								/>
								<div>
									<div class="cv-ref-name">{r.person}</div>
									<div class="cv-ref-pos">{r.position[$locale]}</div>
								</div>
                        	</div>
						{/snippet}
					</Card>

                    <!--<article class="cv-ref-card">
                        <div class="cv-ref-quote" aria-hidden="true">"</div>
                        <p class="cv-ref-content">{r.quote[$locale][0]}</p>
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
                    </article>-->
                {/each}
            </div>
        </section>

        <!-- CTA ----------------------------------------------------------------- -->

		<div
			data-summary="contact"
			data-summary-label={$trans?.summary.contact}
		>
			<Headline size="md">
				{$trans?.resume.cta_title_a}
			</Headline>
		</div>

        <section id="contact-section">

			<div class="cv-cta">
				{#each visible_contacts as c}
                    {@const icon = isValidIconKey(c.type) ? getIcon(c.type) : null}
					<Callout
						variant="accent"
						align="start"
						bordered
					>
						{#snippet leading()}
							{#if icon}
								<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
									<path d={icon.path} fill="var(--spk-text)" opacity="0.6" />
								</svg>
							{:else if c.type === 'Mail'}
								<svg 
									viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true">
									<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" fill="var(--spk-text)" opacity="0.6" />
								</svg>
							{/if}
						{/snippet}

						{#snippet trailing()}
								{#if c.type !== 'Mail' && c.type !== 'Phone'}
									<Button
										variant="ghost"
										palette="tone"
										size="sm"
										onclick={() => window.open(c.address, '_blank')}
									>
										<span class="material-symbols-outlined">open_in_new</span>
									</Button>
								{:else}
									<CopyButton 
										variant="ghost" 
										palette="tone" 
										size="md"
										to_copy={c.address}
									>
									</CopyButton>
								{/if}
						{/snippet}

                        <div class="cv-cta-channel-meta">
                            <span class="cv-cta-channel-type">{c.type}</span>
                            <span class="cv-cta-channel-addr">
                                {c.address.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                            </span>
                        </div>
					</Callout>
				{/each}
			</div>
        </section>
	</div>
{/if}

<style>
	.cv-page {
        padding: 2rem;
        color: var(--spk-text);
        display: flex;
        flex-direction: column;
	}

	.cv-section-alt {
		background: var(--spk-surface-muted, transparent);
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

    .cv-avatar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
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

	.cv-tl-desc {
		margin: 0.5rem 0 0;
	}

	.cv-ref-grid {
		padding: 1rem 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 340px));
		justify-content: center;
		gap: 2rem;
		max-width: 100%;
	}

	.cv-ref-quote-wrap {
		position: relative;
		padding: 1.5rem 1.25rem 0.5rem;
	}

	.cv-ref-quote-wrap::before {
		content: '"';
		position: absolute;
		top: 0.1rem;
		left: 0.75rem;
		font-size: 3rem;
		font-family: var(--spk-font-heading);
		color: var(--spk-accent);
		opacity: 0.5;
		line-height: 1;
		pointer-events: none;
	}

	.cv-ref-content {
		position: relative;
		margin: 6px 10px;
		padding-left: 0.25rem;
	}

	.cv-ref-attr {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.cv-ref-name { font-weight: 600; }
	.cv-ref-pos { font-size: 0.875rem; opacity: 0.7; }

	.cv-cta {
		padding: 1rem 1rem;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 2rem;
		max-width: 100%;
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

	@media (max-width: 768px) {
		.cv-twocol,
		.cv-cta {
			grid-template-columns: 1fr;
		}
	}
</style>
