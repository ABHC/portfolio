<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { onMount } from 'svelte';
    import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import {
		locale,
		trans,
		browser_name,
		window_width,
		window_height,
        theme_color,
        responsive,
        languages_aria_label
	} from './store';
    import { translations } from './translations';
    import type { Locale } from "$lib/types/translations";
    import { profilePromise } from '$lib/utils/projectsLoader';

	// ---------- Props ----------
	let { children }: { children?: Snippet | null } = $props();

	// ---------- Local state ----------
	let timestamp: number = $state(0);
    let locales: Locale[] = Object.keys(translations) as Locale[];
	let width: number = $state(0);
	let height: number = $state(0);
	let show_mobile_menu: boolean = $state(false);
    let open_langs: boolean = $state(false);
    let copied: boolean = $state(false);

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

	function getFlagEmoji(lang: string): string {
		switch (lang.toUpperCase()) {
			case 'EN': return '🇬🇧';
			case 'FR': return '🇫🇷';
			case 'DE': return '🇩🇪';
			case 'ES': return '🇪🇸';
			default: return '🇬🇧';
		}
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

	function toggleLangsMenu(): void {
		open_langs = !open_langs;
	}

	function chooseLang(lang: Locale): void {
		$locale = lang;
		open_langs = false;
	}

    function getInitialTheme(): void {
        if (typeof document !== 'undefined') {
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                $theme_color = "light";
            }
            document.documentElement.setAttribute('data-theme', $theme_color);
        }
    }

    function setTheme(): void {
        if ($theme_color == "dark") {
            $theme_color = "light";
        }
        else {
            $theme_color = "dark";
        }
        document.documentElement.setAttribute('data-theme', $theme_color);
    }

    function scrollTo(target:string) {
        const element = document.getElementById(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
</script>

<!-- Responsive handling -->
<svelte:window on:resize={updateScreenSize} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
	<link rel="stylesheet" href={`/style.css?${timestamp}`} />
    <link rel="preconnect" href="https://fonts.googleapis.com">
</svelte:head>

{#await profilePromise then profile}
    <header class={$responsive.isMobile ? "mobile-header" : ""}>
        <div class="title-container">
            <div class="id">
                {#each profile.me.id as id}
                    {#if id.display}
                        <h3>{id.name.toUpperCase()}</h3>
                    {/if}
                {/each}
            </div>
            <h1>&nbsp;|&nbsp;{$trans?.header.project.toUpperCase()}</h1>
        </div>

        <div id="logo-container">
            <img id="logo" src="Logo_Epinard2.svg" alt={$trans?.header.logo_btn}/>
        </div>
    </header>
{/await}

{#if $responsive.isAbove(1080)}
    <div class="side-nav accent">
        {#if $page.url.pathname.startsWith('/projects/')}
            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.project}
                onclick={() => scrollTo("desc-section")}
            >
                <icon class="material-symbols-outlined">newsmode</icon>
                {$trans?.menu.project}
            </button>

            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.team}
                onclick={() => scrollTo("team-section")}
            >
                <icon class="material-symbols-outlined">code</icon>
                {$trans?.menu.team}
            </button>

            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.links}
                onclick={() => scrollTo("links-section")}
            >
                <icon class="material-symbols-outlined">link_2</icon>
                {$trans?.menu.links}
            </button>

            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.tags}
                onclick={() => scrollTo("tags-section")}
            >
                <icon class="material-symbols-outlined">tag</icon>
                {$trans?.menu.tags}
            </button>
        {:else}
            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.hardware}
                onclick={() => scrollTo("hardware-section")}
            >
                <icon class="material-symbols-outlined">design_services</icon>
                {$trans?.menu.hardware}
            </button>

            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.software}
                onclick={() => scrollTo("software-section")}
            >
                <icon class="material-symbols-outlined">code</icon>
                {$trans?.menu.software}
            </button>

            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.visuals}
                onclick={() => scrollTo("graphic-section")}
            >
                <icon class="material-symbols-outlined">palette</icon>
                {$trans?.menu.visuals}
            </button>

            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.about}
                onclick={() => scrollTo("profile-section")}
            >
                <icon class="material-symbols-outlined">article_person</icon>
                {$trans?.menu.about}
            </button>
        {/if}

        {#if $theme_color == "dark"}
            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.about}
                onclick={setTheme}
            >
                <icon class="material-symbols-outlined">dark_mode</icon>
            </button>
        {:else if $theme_color == "light"}
            <button 
                class="btn side-btn acc-highlight"
                aria-label={$trans?.menu.about}
                onclick={setTheme}
            >
                <icon class="material-symbols-outlined">light_mode</icon>
            </button>
        {/if}

        <div class="lang-container">
            <!-- Display only the current flag -->
            <button
                class="btn side-btn acc-highlight"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open_langs}
                aria-label={$trans?.menu.lang}
                onclick={toggleLangsMenu}
            >
                <span class="flag">{getFlagEmoji($locale)}</span>
            </button>
        
            <!-- Dropdown list visible on click -->
            {#if open_langs}
                <ul 
                    class="lang-list accent" 
                    role="listbox"
                    aria-label={$languages_aria_label}
                >
                    {#each locales as lang}
                        <li
                            role="option"
                            aria-selected={lang === $locale}
                            class="lang-option acc-highlight"
                            onclick={() => chooseLang(lang)}
                            onkeydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    chooseLang(lang);
                                }
                            }}
                            tabindex="0"
                        >
                            <span class="flag">{getFlagEmoji(lang)}</span>
                            <span class="code">{lang.toUpperCase()}</span>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
{/if}

<main>
    {@render children?.()}
</main>

<footer class={$responsive.isBelow(1080) ? "mobile-footer" : ""}>
    {#if $responsive.isBelow(1080)}
        <div class="footer-block">
            <nav class="footer-content">
                {#if $page.url.pathname.startsWith('/projects/')}
                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.project}
                        onclick={() => scrollTo("desc-section")}
                    >
                        <icon class="material-symbols-outlined">newsmode</icon>
                        {$trans?.menu.project}
                    </button>
        
                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.team}
                        onclick={() => scrollTo("team-section")}
                    >
                        <icon class="material-symbols-outlined">group</icon>
                        {$trans?.menu.team}
                    </button>
        
                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.links}
                        onclick={() => scrollTo("links-section")}
                    >
                        <icon class="material-symbols-outlined">link_2</icon>
                        {$trans?.menu.links}
                    </button>
        
                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.tags}
                        onclick={() => scrollTo("tags-section")}
                    >
                        <icon class="material-symbols-outlined">tag</icon>
                        {$trans?.menu.tags}
                    </button>
                {:else}
                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.hardware}
                        onclick={() => scrollTo("hardware-section")}
                    >
                        <icon class="material-symbols-outlined">design_services</icon>
                        {$trans?.menu.hardware}
                    </button>

                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.software}
                        onclick={() => scrollTo("software-section")}
                    >
                        <icon class="material-symbols-outlined">code</icon>
                        {$trans?.menu.software}
                    </button>

                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.visuals}
                        onclick={() => scrollTo("graphic-section")}
                    >
                        <icon class="material-symbols-outlined">palette</icon>
                        {$trans?.menu.visuals}
                    </button>

                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.about}
                        onclick={() => scrollTo("profile-section")}
                    >
                        <icon class="material-symbols-outlined">article_person</icon>
                        {$trans?.menu.about}
                    </button>
                {/if}
            </nav>

            <div class="footer-content">
                {#if $theme_color == "dark"}
                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.about}
                        onclick={setTheme}
                    >
                        <icon class="material-symbols-outlined">dark_mode</icon>
                    </button>
                {:else if $theme_color == "light"}
                    <button 
                        class="btn side-btn acc-highlight"
                        aria-label={$trans?.menu.about}
                        onclick={setTheme}
                    >
                        <icon class="material-symbols-outlined">light_mode</icon>
                    </button>
                {/if}

                <div class="lang-container">
                    <!-- Display only the current flag -->
                    <button
                        class="btn side-btn acc-highlight"
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={open_langs}
                        aria-label={$trans?.menu.lang}
                        onclick={toggleLangsMenu}
                    >
                        <span class="flag">{getFlagEmoji($locale)}</span>
                    </button>
                
                    <!-- Dropdown list visible on click -->
                    {#if open_langs}
                        <ul 
                            class="lang-list accent" 
                            role="listbox"
                            aria-label={$languages_aria_label}
                        >
                            {#each locales as lang}
                                <li
                                    role="option"
                                    aria-selected={lang === $locale}
                                    class="lang-option acc-highlight"
                                    onclick={() => chooseLang(lang)}
                                    onkeydown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            chooseLang(lang);
                                        }
                                    }}
                                    tabindex="0"
                                >
                                    <span class="flag">{getFlagEmoji(lang)}</span>
                                    <span class="code">{lang.toUpperCase()}</span>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
            </div>
        </div>

        <hr class="separation-line">

        <div class="footer-block">
            <div class="social-links social-mobile">
                <a href="https://github.com/ABHC" class="social-link mobile-link" aria-label="GitHub" target="_blank">
                    <svg class="social-icon mobile-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
    
                <a href="https://gitlab.com/ABHC_" class="social-link mobile-link" aria-label="GitLab" target="_blank">
                    <svg class="social-icon mobile-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
                    </svg>
                </a>
                
                <a href="https://linkedin.com/in/abhc" class="social-link mobile-link" aria-label="LinkedIn" target="_blank">
                    <svg class="social-icon mobile-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
    
                <div class="social-link mobile-link email-link">
                    <svg class="social-icon mobile-icon" viewBox="0 0 26 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    
                    {#if copied}
                      <div class="copy-confirmation">
                        <span>✓ Copié !</span>
                      </div>
                    {/if}
                </div>
            </div>

            <div>
                <p id="license">{$trans?.footer.license}</p>
            </div>
        </div>
    {:else}
        <div class="social-links">
            <a href="https://github.com/ABHC" class="social-link" aria-label="GitHub" target="_blank">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>

            <a href="https://gitlab.com/ABHC_" class="social-link" aria-label="GitLab" target="_blank">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
                </svg>
            </a>
            
            <a href="https://linkedin.com/in/abhc" class="social-link" aria-label="LinkedIn" target="_blank">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            </a>

            <div class="social-link email-link">
                <svg class="social-icon" viewBox="0 0 26 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                
                {#if copied}
                  <div class="copy-confirmation">
                    <span>✓ Copié !</span>
                  </div>
                {/if}
              </div>
        </div>
        <p id="license">{$trans?.footer.license}</p>
    {/if}
</footer>

<style>
    .title-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .id {
        text-align: end;
    }

    #logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 5;
        height: 100%;
    }

    #logo {
        height: 100%; 
        width: auto; 
        object-fit: contain;
        transform: rotate(30deg);
        padding: 6px;
    }

    .side-nav {
        position: fixed;
        top: 40%;
        left: calc((var(--side-margin) - (var(--side-nav-btn) + var(--side-nav-padding))) / 2);
        transform: translateY(-40%);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center ;
        border-radius: 10px;
        color: var(--text-accent) !important;
    }

    .btn {
        cursor: pointer;
        border-radius: 6px;
        border: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        text-transform: uppercase;
        font-weight: bold;
        transition: background 0.5s ease;
    }

    .side-btn {
        height: var(--side-nav-btn);
        width: var(--side-nav-btn);
        margin: var(--side-nav-padding);
        flex-direction: column;
        font-family: 'Space Grotesk', sans-serif;
    }

    .lang-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.flag {
		font-size: 20px;
	}

	.lang-list {
		position: absolute;
		top: 0;
        left: 120%;
		list-style: none;
		margin: 0;
		padding: 0.4rem;
		border-radius: 10px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 100;
	}

	.lang-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0.6rem;
		cursor: pointer;
        font-weight: bold;
        border-radius: 6px;
        transition: background 0.5s ease;
	}

    .social-links {
        display: flex;
        gap: 16px;
        justify-content: center;
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
        border-color: var(--accent-light);
        background-color: var(--accent-light);
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

    /* Styles basiques pour le menu mobile */
    .mobile-header {
        padding: 0 25px;
    }

    .mobile-footer {
        position: fixed;
        bottom: 0;
        flex-direction: column;
    }

    .footer-block {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .footer-content {
        display: flex;
    }

    .separation-line {
        width: 90%;
        margin-bottom: 5px;
    }

    .social-mobile {
        gap: 28px;
        margin: 0 12px;
    }

    .mobile-link {
        width: 32px;
        height: 32px;
        margin: 5px;
    }

    .mobile-icon {
        width: 20px;
        height: 20px;
    }

    @media (max-width: 1080px) {
		.side-nav .lang-container {
			display: none;
		}

		.lang-list {
			top: auto;
			left: auto;
			bottom: 120%;
		}
	}
</style>