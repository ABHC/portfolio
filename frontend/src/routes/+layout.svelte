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

	function toggleMobileMenu(): void {
		show_mobile_menu = !show_mobile_menu;
	}

	function closeMobileMenu(): void {
		show_mobile_menu = false;
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
</script>

<!-- Responsive handling -->
<svelte:window on:resize={updateScreenSize} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
	<link rel="stylesheet" href={`/style.css?${timestamp}`} />
    <link rel="preconnect" href="https://fonts.googleapis.com">
</svelte:head>

<header>
    <div class="title-container">
        <h1 id="name">{$trans?.header.name.toUpperCase()}</h1>
        <div class="tagline">
            <h4>{$trans?.header.tagline1.toUpperCase()}</h4>
            <h4>{$trans?.header.tagline2.toUpperCase()}</h4>
            <h4>{$trans?.header.tagline3.toUpperCase()}</h4>
        </div>
    </div>
    
    <div id="logo-container">
        <img id="logo" src="Logo_Epinard2.svg" alt={$trans?.header.logo_btn}/>
    </div>
</header>

{#if $responsive.isBelow(1080)}
    <div class="mobile-nav">
        <!-- Mobile Navigation (affichée si isMobile) -->
        <button 
            class="menu-btn"
            aria-label={$trans?.menu.hardware}
        >
            <icon class="material-symbols-outlined">menu</icon>
            {$trans?.menu.hardware}
        </button>

        <button 
            class="menu-btn"
            aria-label={$trans?.menu.software}
        >
            <icon class="material-symbols-outlined">menu</icon>
            {$trans?.menu.hardware}
        </button>

        <!-- Menu icon button -->
        <button 
            aria-label="Open menu"
            class="header-btn"
            onclick={toggleMobileMenu}
        >
            <icon class="material-symbols-outlined">menu</icon>
        </button>

        <!-- Dropdown menu overlay -->
        {#if show_mobile_menu}
            <!-- Semi-transparent backdrop -->
            <button
                class="mobile-menu-overlay"
                onclick={closeMobileMenu}
                aria-label={$trans?.menu.close_menu}
            ></button>

            <!-- Dropdown content -->
            <nav class="mobile-menu">
                <button 
                    aria-label={$trans?.menu.management}
                    onclick={() => {
                        closeMobileMenu();
                    }}
                >
                    {$trans?.menu.management}
                </button>

                <button 
                    aria-label={$trans?.menu.about}
                    onclick={() => {
                        closeMobileMenu();
                    }}
                >
                    {$trans?.menu.about}
                </button>

                <select 
                    aria-label="Select language"
                    class="local-select"
                    id="dropdown-menu-lang"
                    bind:value={$locale}
                    onchange={closeMobileMenu}
                >
                    {#each locales as lang}
                        <option value={lang}>{getFlagEmoji(lang)} {lang.toUpperCase()}</option>
                    {/each}
                </select>
            </nav>
        {/if}
    </div>
{:else}
    <div class="side-nav accent">
        <button 
            class="btn side-btn acc-highlight"
            aria-label={$trans?.menu.hardware}
        >
            <icon class="material-symbols-outlined">design_services</icon>
            {$trans?.menu.hardware}
        </button>

        <button 
            class="btn side-btn acc-highlight"
            aria-label={$trans?.menu.software}
        >
            <icon class="material-symbols-outlined">code</icon>
            {$trans?.menu.software}
        </button>

        <button 
            class="btn side-btn acc-highlight"
            aria-label={$trans?.menu.management}
        >
            <icon class="material-symbols-outlined">work</icon>
            {$trans?.menu.management}
        </button>

        <button 
            class="btn side-btn acc-highlight"
            aria-label={$trans?.menu.about}
        >
            <icon class="material-symbols-outlined">article_person</icon>
            {$trans?.menu.about}
        </button>

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

<footer>
    {#if !$responsive.isMobile}
        {$trans?.footer.legal}

        <div class="social-links">
            <a href="https://github.com/ABHC" class="social-link" aria-label="GitHub" target="_blank">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>

            <a href="https://gitlab.com/your-profile" class="social-link" aria-label="GitLab" target="_blank">
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
    {/if}

    <div class="footer-column">
        <p>{$trans?.footer.license}</p>
    </div>
</footer>

<style>
    .title-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .tagline {
        display: flex;
        flex-direction: column;
        margin-left: 20px;
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

    .header-btn {
        cursor: pointer;
        border-radius: 6px;
        border: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 10px;
        padding: 6px 6px;
        text-transform: uppercase;
        text-align: center;
        font-weight: bold;
        z-index: 6;
    }

    .header-btn:hover {
        background-color: #444;
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
        /*z-index: 6;*/
        transition: background 0.5s ease;
    }

    .side-btn {
        height: var(--side-nav-btn);
        width: var(--side-nav-btn);
        margin: var(--side-nav-padding);
        flex-direction: column;
        font-family: 'Space Grotesk', sans-serif;
    }

    .local-select {
        cursor: pointer;
        border: none;
        border-radius: 6px;
        background-color: transparent;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
    }

    .local-select:hover {
        background-color: #444;
    }

    .footer-column {
        display: flex;
        flex-direction: column;
        justify-content: flex-start
    }

    @media (max-width: 768px) {
        .footer-column {
            margin: 0px 10px;
        }

        .local-select {
            height: auto;
            width: 90px !important;
            margin-left: 1rem;
            margin-bottom: 0.5rem;
            padding: 0.5rem 5px 0.5rem 0px !important;
        }
    }

    /* Styles basiques pour le menu mobile */
    .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: 4;
    }

    .mobile-menu {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: #242424;
        display: flex;
        flex-direction: column;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 5;
    }

    .mobile-menu button,
    .mobile-menu select {
        padding: 1rem;
        border: none;
        background: none;
        text-align: left;
        text-transform: uppercase;
        text-align: justify;
        font-weight: bold;
        width: 100%;
        cursor: pointer;
    }

    .mobile-menu button:hover,
    .mobile-menu select:hover {
        background-color: #444;
    }

    .mobile-nav {
        display: flex;
        align-items: center;
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
        /*padding: 10px 0;*/
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


    .social-icon {
        width: 24px;
        height: 24px;
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
    }

    .social-link:hover {
        border-color: var(--accent-light);
        background-color: var(--accent-light);
        transform: scale(1.1);
    }

    @media (max-width: 1080px) {
		.lang-container {
			display: none;
		}
	}
</style>