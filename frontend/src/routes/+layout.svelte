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
        responsive,
        languages_aria_label
	} from './store';
    import { translations } from './translations';
    import type { Locale, Translation } from './translations';

	// ---------- Props ----------
	let { children }: { children?: Snippet | null } = $props();

	// ---------- Local state ----------
	let timestamp: number = $state(0);
    let locales: Locale[] = Object.keys(translations) as Locale[];
	let width: number = $state(0);
	let height: number = $state(0);
	let show_mobile_menu: boolean = $state(false);
    let open_langs: boolean = $state(false);

	// ---------- Lifecycle ----------
	onMount(async (): Promise<void> => {
		timestamp = Date.now();
		await getLocale();
		updateScreenSize();
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
</script>

<!-- Responsive handling -->
<svelte:window on:resize={updateScreenSize} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
	<link rel="stylesheet" href={`/style.css?${timestamp}`} />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
</svelte:head>

<header>
    <h2>{$trans?.header.name.toUpperCase()}</h2>
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

<footer class="accent">
    {#if !$responsive.isMobile}
        <div class="footer-column" id="company">
            <div class="footer-tray">
                <img id="logo-footer" src="logo_cairn.svg" alt="Cairn Devices"/>
                <div class="footer-column" id="address">
                    <span>Cairn Devices SAS</span>
                    <span>11 rue de l'Académie</span>
                    <span>67000 Strasbourg, FRANCE</span>
                </div>
            </div>
            <p>{$trans?.footer.legal}</p>
        </div>
    {/if}

    <div class="footer-column">
        <p>{$trans?.footer.license}</p>
    </div>
</footer>

<style>
    .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';
        font-variation-settings:
            'FILL' 1,
            'wght' 400,
            'GRAD' 0,
            'opsz' 48;
        font-size: 24px;
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
        left: 10px;
        transform: translateY(-40%);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center ;
        border-radius: 10px;
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
        height: 60px;
        width: 60px;
        margin: 4px;
        flex-direction: column;
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

    #logo-footer {
        width: 70px;
        height: 70px;
    }

    .footer-column {
        display: flex;
        flex-direction: column;
        justify-content: flex-start
    }

    .footer-tray {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    #address {
        margin-left: 15px;
    }

    #company {
        margin-top: 12px;
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

	@media (max-width: 1080px) {
		.lang-container {
			display: none;
		}
	}
</style>