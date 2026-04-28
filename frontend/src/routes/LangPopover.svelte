<script lang="ts">
    import { locale, trans } from './store';
    import { translations } from './translations';
    import type { Locale } from "$lib/types/translations";
    import { 
        Popover, 
        Button 
    } from '@abhc/spektral-ui';

    let lang_open: boolean = $state(false);
    let locales: Locale[] = Object.keys(translations) as Locale[];

    function getFlagEmoji(lang: string): string {
        switch (lang.toUpperCase()) {
            case 'EN': return '🇬🇧';
            case 'FR': return '🇫🇷';
            case 'DE': return '🇩🇪';
            case 'ES': return '🇪🇸';
            default: return '🇬🇧';
        }
    }
</script>

<Popover
    bind:open={lang_open}
    onclose={() => { lang_open = false; }}
    palette="tone"
    rounded={false}
    gap="18px"
    direction="bottom"
    align="end"
>
    {#snippet trigger()}
        <Button
            variant="ghost"
            palette="tone"
            direction="row"
            size="sm"
            aria_label={$trans?.aria.language}
            onclick={() => { lang_open = !lang_open; }}
        >
            <span class="lang-pop-select" aria-hidden="true">
                {getFlagEmoji($locale)}
            </span>
        </Button>
    {/snippet}

    {#snippet children()}
        <div class="pop-lang-menu">
            {#each locales as lang}
                <Button
                    variant="flat"
                    palette="tone"
                    size="md"
                    active={lang === $locale}
                    onclick={() => { $locale = lang; lang_open = false; }}
                >
                    {getFlagEmoji(lang)}&nbsp;&nbsp;{lang.toUpperCase()}
                </Button>
            {/each}
        </div>
    {/snippet}
</Popover>

<style>
    .lang-pop-select {
        font-size: 16px;
        margin: 4px 0;
    }

    .pop-lang-menu {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 10px;
    }
</style>
