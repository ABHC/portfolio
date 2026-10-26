<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/ABHC_logo.svg';
	import { onMount } from 'svelte';
    import type { Snippet } from 'svelte';
	import { page } from '$app/state';

    import { translations } from './translations';
    import type { Locale } from "$lib/types/translations";
    import LogoABHC from '$lib/brand/LogoABHC.svelte';
    import BrandABHC from "$lib/brand/BrandABHC.svelte"
    import LangPopover from './LangPopover.svelte';
    import MenuPopover from './MenuPopover.svelte';
    import { getIcon } from '$lib/utils/iconsBank';

    import { 
        Header, 
        Nav, 
        Footer,
        Button,
        Tooltip, 
        Explorer,
        ExplorerGroup,
        ExplorerLink,
        Card,
        Alert
    } from '@abhc/spektral-ui';

    import {
		locale,
		trans,
		browser_name,
		window_width,
		window_height,
        theme_color,
        responsive,
	} from './store';

    // Types ----------
    interface SummaryItem {
        id: string;
        label: string;
    }

	// ---------- Props ----------
	let { children }: { children?: Snippet | null } = $props();

	// ---------- Local state ----------
	let timestamp: number = $state(0);
    let locales: Locale[] = Object.keys(translations) as Locale[];
	let width: number = $state(0);
	let height: number = $state(0);
    let summary_items: SummaryItem[] = $state([]);
    let active_id: string = $state("");
    let open_langs: boolean = $state(false);
    let copied: boolean = $state(false);
    let header_visible: boolean = $state(true);
    let footer_visible: boolean = $state(false);
    let menu_tooltip: boolean = $state(false);
    let scroll_y: number = $state(0);
    const show_back_to_top = $derived(scroll_y > 400);

    // ---------- Observers ----------
    let header_element: HTMLElement | undefined = $state(undefined);
    let footer_element: HTMLElement | undefined = $state(undefined);
    let observer: IntersectionObserver | null = null;

	// ---------- Lifecycle ----------
	onMount(async (): Promise<void> => {
		timestamp = Date.now();
		await getLocale();
		updateScreenSize();
        getInitialTheme();
		$browser_name = detectBrowser();
	});

	// ---------- Reactive translations ----------
	$effect(() => {
		if ($trans == null || $trans !== translations[$locale]) {
			$trans = translations[$locale];
		}
	});

    function isLocale(lang: string): lang is Locale {
        return locales.includes(lang as Locale);
    }

    async function getLocale(): Promise<void> {
		const userLanguage: string = (navigator.language || 'en').split('-')[0];

        const lang = isLocale(userLanguage) ? userLanguage : 'en';
		$locale = lang;
		$trans = translations[lang];
	}

	// ---------- Other Functions ----------

	function detectBrowser(): string {
		const ua: string = navigator.userAgent.toLowerCase();
		if (ua.includes('firefox')) return 'firefox';
		if (ua.includes('edg')) return 'edge';
		if (ua.includes('chrome')) return 'chrome';
		if (ua.includes('safari')) return 'safari';
		return 'unknown';
	}

	function updateScreenSize(): void {
		width = window.innerWidth;
		height = window.innerHeight;
		$window_width = width;
		$window_height = height;
	}

    function getInitialTheme(): void {
        if (typeof document !== 'undefined') {
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                $theme_color = "light";
            }
        }
    }

    function setTheme(): void {
        $theme_color = $theme_color === "dark" ? "light" : "dark";
    }

    // Sync the data-theme attribute whenever the store changes — covers init,
    // the nav toggle, and any popover that mutates $theme_color directly.
    $effect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', $theme_color);
        }
    });

    function scrollTo(target:string) {
        const element = document.getElementById(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: "start" });
        }
    }

    function backToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Re-scan data-summary elements whenever the route changes
    function scan_summaries() {
        observer?.disconnect();

        const anchors = document.querySelectorAll<HTMLElement>("[data-summary]");
        summary_items = Array.from(anchors).map(el => {
            const id = el.getAttribute("data-summary") ?? "";
            const label = el.getAttribute("data-summary-label") ?? id;
            if (!el.id) el.id = id;
            return { id, label };
        });

        if (summary_items.length === 0) return;
        active_id = summary_items[0].id;

        // Track sections currently inside the activation band so we can pick
        // the topmost one rather than whichever entry fired last.
        const visible = new Map<string, IntersectionObserverEntry>();

        observer = new IntersectionObserver(
            entries => {
                for (const e of entries) {
                    const id = e.target.getAttribute("data-summary");
                    if (!id) continue;
                    if (e.isIntersecting) visible.set(id, e);
                    else visible.delete(id);
                }
                if (visible.size === 0) return;
                const top = [...visible.values()]
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                const id = top.target.getAttribute("data-summary");
                if (id) active_id = id;
            },
            { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
        );

        anchors.forEach(anchor => observer!.observe(anchor));
    }

    // Re-scan when the page changes
    $effect(() => {
        // Track slug so this effect re-runs on route change
        const _slug = page.params.slug;
        // Wait for DOM to render the new component
        requestAnimationFrame(() => scan_summaries());
    });
</script>

<!-- Responsive handling -->
<svelte:window on:resize={updateScreenSize} bind:scrollY={scroll_y} />

<!-- Utils Snippets ------------------------------------------------ -->
<svelte:head>
	<link rel="icon" href={favicon} />
    <link 
        rel="stylesheet" 
        href={`/style.css?${timestamp}`} 
    />
    <link 
        rel="stylesheet" 
        href={`/tokens.css?${timestamp}`} 
    />
	<link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
    />
    <link 
        rel="preconnect" 
        href="https://fonts.googleapis.com"
    />
    <link
        rel="stylesheet"
        href="https://unpkg.com/lucide-static@latest/font/lucide.css"
    />
</svelte:head>

<!-- Utils Snippets ----------------------------------------------------------------------- -->

<!-- Header snippets -->
{#snippet desktop_brand()}
    <BrandABHC size="lg"/>
{/snippet}

{#snippet mobile_brand()}
    <BrandABHC size="sm"/>
{/snippet}

<!-- Nav snippets -->
{#snippet empty_nav()}
    <span></span>
{/snippet}

{#snippet logo_in_nav()}
    <a class="return-landing" href="/">
        <LogoABHC size={32}/>
    </a>
{/snippet}

{#snippet nav_trailing()}
    <div class="nav-trailing-group">
        <Button
            variant="ghost"
            palette="tone"
            direction="row"
            size="sm"
            aria_label={$trans?.aria.theme}
            onclick={() => { setTheme() }}
        >
            {#if $theme_color == "dark"}
                <span class="nav-icon" style="font-size: 20px;">
                    <div 
                        class="icon-sun"
                        style="font-size: 20px;"
                    ></div>
                </span>
            {:else if $theme_color == "light"}
                <span class="nav-icon" >
                    <div 
                        class="icon-moon"  
                        style="font-size: 20px;"
                    ></div>
                </span>
            {/if}

        </Button>
        <LangPopover />
    </div>
{/snippet}

{#snippet mobile_lang()}
    <div class="nav-trailing-group">
        <LangPopover />
    </div>
{/snippet}

{#snippet trailing_btt()}
    <div
        class="back-to-top"
        class:visible={show_back_to_top}
        inert={!show_back_to_top}
    >
        <Button
            variant="ghost"
            palette="tone"
            size="md"
            aria_label={$trans?.aria.back_to_top}
            onclick={backToTop}
        >
            <span class="icon-arrow-up" aria-hidden="true"></span>
        </Button>
    </div>
{/snippet}

<!-- Footer snippets -->
{#snippet social_links()}
    <a
        href="https://github.com/ABHC"
        class="social-link"
        aria-label="GitHub"
        target="_blank"
    >
        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d={getIcon('Github')?.path} />
        </svg>
    </a>

    <a
        href="https://gitlab.com/ABHC_"
        class="social-link"
        aria-label="GitLab"
        target="_blank"
    >
        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d={getIcon('Gitlab')?.path} />
        </svg>
    </a>

    <a
        href="https://linkedin.com/in/abhc"
        class="social-link"
        aria-label="LinkedIn"
        target="_blank"
    >
        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d={getIcon('Linkedin')?.path} />
        </svg>
    </a>

    <div class="social-link email-link">
        <svg class="social-icon" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
        </svg>

        {#if copied}
            <div class="copy-confirmation">
            <span>✓ Copié !</span>
            </div>
        {/if}
    </div>
{/snippet}

{#snippet license()}
    <p id="license">{$trans?.footer.license}</p>
{/snippet}

{#snippet brand_ABHC()}
    <BrandABHC 
        logo_fill="text-accent" 
        text_fill="text-accent"
        size="sm"
    />
{/snippet}

<!-- Header --------------------------------------------------------------------------------- -->

<div bind:this={header_element}>
    {#if $responsive.isBelow(1024)}
        <Header
            palette="tone"
            leading={mobile_brand}
            bind:visible={header_visible}
        />
    {:else}
        <Header
            palette="tone"
            leading={desktop_brand}
            bind:visible={header_visible}
        />
    {/if}
</div>

<!-- Nav (desktop) --------------------------------------------------------------------------- -->

{#if !$responsive.isBelow(1024)}
    <Nav
        position="floating"
        direction="top"
        palette="tone"
        elevation="subtle"
        leading={header_visible ? empty_nav : logo_in_nav}
        trailing={nav_trailing}
    >
        <Button
            variant="ghost"
            palette="tone"
            aria_label={$trans?.nav.portfolio}
            active={page.url.pathname === '/'}
            href="/"
        >
            <span class="nav-label">{$trans?.nav.portfolio}</span>
        </Button>

        <Button
            variant="ghost"
            palette="tone"
            aria_label={$trans?.nav.resume}
            active={page.url.pathname.startsWith('/resume')}
            href="/resume"
        >
            <span class="nav-label">{$trans?.nav.resume}</span>
        </Button>

        <Button
            variant="ghost"
            palette="tone"
            aria_label={$trans?.nav.blog}
            active={page.url.pathname.startsWith('/blog')}
            href="/blog"
        >
            <span class="nav-label">{$trans?.nav.blog}</span>
        </Button>
    </Nav>
{/if}

<!-- Content --------------------------------------------------------------------------------- -->

<div class="content">
    <aside class="summary">
        <Card elevation="hard">
            {#snippet leading()}
                <div class="summary-header">
                    <span class="icon-text-align-justify" aria-hidden="true"></span>
                    <span>{$trans?.summary.label}</span>
                </div>
            {/snippet}
            {#if summary_items.length > 0}
                <Explorer palette="tone" aria_label="On this page">
                        {#each summary_items as item}
                            <ExplorerLink
                                label={item.label}
                                onclick={() => scrollTo(item.id)}
                                active={item.id === active_id}
                            />
                        {/each}
                </Explorer>
            {/if}
        </Card>
    </aside>

    <main>
        {@render children?.()}
    </main>
</div>

<!-- Nav (mobile) ---------------------------------------------------------------------------- -->
<!-- Placed after content so sticky-bottom releases when the footer comes into flow -->

{#if $responsive.isBelow(1024)}
    <Nav
        position="floating"
        direction="bottom"
        palette="tone"
        elevation="subtle"
        leading={mobile_lang}
        trailing={trailing_btt}
    >
        <Tooltip
            bind:open={menu_tooltip}
            showDelay={800}
            hideDelay={0}
            palette="tone"
            direction="left"
            align="center"
            maxWidth="120px"
            bordered
            arrow
        >
            {#snippet trigger()}
                <MenuPopover/>
            {/snippet}

            {#snippet children()}
                {$trans?.nav.menu}
            {/snippet}
        </Tooltip>
    </Nav>
{/if}

<!-- Footer --------------------------------------------------------------------------------- -->

<div bind:this={footer_element}>
    <Footer 
        palette="accent" 
        leading={brand_ABHC} 
        trailing={social_links}
        bind:visible={footer_visible}
    >
        {@render license()}
    </Footer>
</div>

<!-- Copy Alert ------------------------------------------------------------------------------ -->

{#if copied}
    <Alert
        variant="success"
        position="top-center"
        animate="bottom"
        duration={4}
        rounded
        dismiss_label="Dismiss"
        ondismiss={() => { copied = false; }}
    >
        {#snippet leading()}
            <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
        {/snippet}
        {#snippet children()}
            <strong>{$trans?.footer.copied}</strong>
            <p>{$trans?.footer.clipboard}</p>
        {/snippet}
    </Alert>
{/if}


<style>
    :global(body) {
        background: var(--spk-tone-bg);
        color: var(--spk-text);
        font-family: var(--spk-font-body);
        font-size: 14px;
    }

    .nav-trailing-group {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 4px;
        width: 100%;
    }

    .content {
        display: grid;
        grid-template-columns: 180px 1fr 180px;
        gap: 0;
        max-width: 1800px;
        margin: 0 auto;
    }

    main {
        flex: 1;
        min-width: 0;
    }

    .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        cursor: pointer;
    }

    .social-icon {
        width: 24px;
        height: 24px;
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
        fill: var(--spk-text-accent);
        color: var(--spk-text-accent);
    }

    .social-link:hover {
        background-color: var(--spk-accent-ghost-hover);
        transform: scale(1.1);
    }

    .return-landing {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        padding: 10px;
        cursor: pointer;
        text-decoration: none;
    }

    .return-landing:hover {
        background: var(--spk-tone-ghost);
        box-shadow: 0 4px 12px var(--spk-shadow-subtle);
    }

    #license {
        margin: 10px 0;
        white-space: normal;
        overflow-wrap: anywhere;
        min-width: 0;
    }

    .summary {
        --nav-height: 135px;
        position: sticky;
        top: var(--nav-height);
        align-self: start;
        height: calc(100dvh - var(--nav-height));
        box-sizing: border-box;
        overflow-y: auto;
        padding: 1rem 0.75rem;
        margin-right: 0.75rem;
        scrollbar-width: thin;
        scrollbar-color: var(--spk-tone-hover) transparent;
    }

    .summary-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        font-family: var(--spk-font-heading);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        opacity: 0.7;
    }

    .summary-header .icon-text-align-justify {
        font-size: 14px;
    }

    .summary :global(.explorer-link-label) {
        white-space: normal;
    }

    .back-to-top {
        display: flex;
        justify-content: flex-end;
        opacity: 0;
        transition: opacity 200ms ease;
    }

    .back-to-top.visible {
        opacity: 1;
    }

    .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .social-link:hover {
        border-color: var(--spk-accent-hover);
        background-color: var(--spk-accent-hover);
        transform: scale(1.1);
    }

    .social-icon {
        width: 24px;
        height: 24px;
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
    }

    #license {
        text-align: end;
    }


    @media (max-width: 1024px) {
        .content {
            grid-template-columns: 1fr;
        }

        .summary {
            display: none;
        }

        .content { padding: 10px 20px 40px; }
    }

    /* Footer responsive collapse ---------------------------------------- */
    /* Spektral Footer flex-wraps but doesn't stack — drive layout by breakpoint. */

    @media (max-width: 768px) {
        :global(footer.footer-base .footer-leading),
        :global(footer.footer-base .footer-content),
        :global(footer.footer-base .footer-trailing) {
            justify-content: center;
            flex: 0 0 auto;
        }
    }

    @media (min-width: 426px) and (max-width: 768px) {
        :global(footer.footer-base) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
                "leading trailing"
                "content content";
            align-items: center;
        }
        :global(footer.footer-base .footer-leading)  { grid-area: leading; justify-content: flex-start; }
        :global(footer.footer-base .footer-trailing) { grid-area: trailing; justify-content: flex-end; }
        :global(footer.footer-base .footer-content)  { grid-area: content; }
    }

    @media (max-width: 425px) {
        :global(footer.footer-base) {
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>