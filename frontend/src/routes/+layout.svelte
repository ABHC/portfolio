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
    <a href="/">
        <BrandABHC size="lg"/>
    </a>
{/snippet}

{#snippet mobile_brand()}
    <a href="/">
        <BrandABHC size="sm"/>
    </a>
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
        <svg class="social-icon" viewBox="0 0 24 24" fill="white">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
    </a>

    <a 
        href="https://gitlab.com/ABHC_" 
        class="social-link" 
        aria-label="GitLab" 
        target="_blank"
    >
        <svg class="social-icon" viewBox="0 0 24 24" fill="white">
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
        </svg>
    </a>

    <a 
        href="https://linkedin.com/in/abhc" 
        class="social-link" 
        aria-label="LinkedIn" 
        target="_blank"
    >
        <svg class="social-icon" viewBox="0 0 24 24" fill="white">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
    </a>

    <div class="social-link email-link">
        <svg 
            class="social-icon" 
            viewBox="0 0 26 24" 
            fill="white"
        >
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
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