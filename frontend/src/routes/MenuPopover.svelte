<script lang="ts">
    import { tick } from 'svelte';
    import { page } from '$app/state';
    import {
        Popover,
        Button,
        Headline
    } from '@abhc/spektral-ui';

    import {
        trans,
        theme_color
    } from './store';

    let style_open: boolean = $state(false);
    let menu_el: HTMLDivElement | undefined = $state();
    let trigger_wrapper: HTMLSpanElement | undefined = $state();

    // Tracks whether the popover was open on the previous run, so we only
    // return focus to the trigger on a real close (not the initial mount).
    let was_open: boolean = false;

    $effect(() => {
        if (style_open) {
            was_open = true;
            tick().then(() => {
                const first = menu_el?.querySelector<HTMLElement>(
                    '.pop-styling-menu a, .pop-styling-menu button'
                );
                first?.focus();
            });
        } else if (was_open) {
            was_open = false;
            trigger_wrapper?.querySelector<HTMLElement>('button')?.focus();
        }
    });

    function handleKeydown(e: KeyboardEvent): void {
        if (!menu_el) return;
        const items = Array.from(
            menu_el.querySelectorAll<HTMLElement>('a, button')
        );
        if (items.length === 0) return;
        const idx = items.indexOf(document.activeElement as HTMLElement);

        let next = -1;
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                next = idx < 0 ? 0 : (idx + 1) % items.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                next = idx <= 0 ? items.length - 1 : idx - 1;
                break;
            case 'Home':
                next = 0;
                break;
            case 'End':
                next = items.length - 1;
                break;
            default:
                return;
        }
        e.preventDefault();
        items[next]?.focus();
    }
</script>

<Popover
    bind:open={style_open}
    onclose={() => { style_open = false; }}
    palette="tone"
    rounded={false}
    maxHeight="800px"
    gap="18px"
    direction="top"
    align="center"
>
    {#snippet trigger()}
        <span bind:this={trigger_wrapper} class="trigger-wrap">
            <Button
                variant="ghost"
                palette="tone"
                direction="row"
                size="sm"
                aria_label={$trans?.nav.theme}
                onclick={() => { style_open = !style_open; }}
            >
                <div class="icon-menu" style="font-size: 20px;"></div>
            </Button>
        </span>
    {/snippet}

    {#snippet children()}
        <div
            bind:this={menu_el}
            role="menu"
            aria-label={$trans?.nav.index}
            tabindex="-1"
            onkeydown={handleKeydown}
        >
            <div class="pop-styling-row">
                <Button
                    size="sm"
                    variant="ghost"
                    palette="tone"
                    direction="row"
                    onclick={() => { style_open = false; }}
                >
                    <span class="nav-icon" aria-hidden="true">
                        <div
                            class="icon-x"
                            style="font-size: 20px;"
                        ></div>
                    </span>
                </Button>
            </div>

            <div class="pop-styling-menu">
                <div class="pop-section">
                    <Headline size="xs" uppercase>{$trans?.nav.index}</Headline>
                    <div class="pop-styling-grid">
                        <Button
                            size="sm"
                            variant="ghost"
                            palette="tone"
                            direction="row"
                            active={page.url.pathname.startsWith('/')}
                            href="/"
                        >
                            <span class="nav-icon" aria-hidden="true">
                                <div
                                    class="icon-book"
                                    style="font-size: 20px;"
                                ></div>
                            </span>
                            <span class="nav-label">{$trans?.nav.portfolio}</span>
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            palette="tone"
                            direction="row"
                            active={page.url.pathname.startsWith('/resume')}
                            href="/resume"
                        >
                            <span class="nav-icon" aria-hidden="true">
                                <div
                                    class="icon-file-user"
                                    style="font-size: 20px;"
                                ></div>
                            </span>
                            <span class="nav-label">{$trans?.nav.resume}</span>
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            palette="tone"
                            direction="row"
                            active={page.url.pathname.startsWith('/blog')}
                            href="/blog"
                        >
                            <span class="nav-icon" aria-hidden="true">
                                <div
                                    class="icon-rss"
                                    style="font-size: 20px;"
                                ></div>
                            </span>
                            <span class="nav-label">{$trans?.nav.blog}</span>
                        </Button>
                    </div>
                </div>

                <div class="pop-section">
                    <Headline size="xs" uppercase>{$trans?.nav.theme}</Headline>
                    <div class="pop-styling-grid">
                        <Button
                            size="sm"
                            variant="ghost"
                            palette="tone"
                            direction="row"
                            active={$theme_color === "light"}
                            onclick={() => { $theme_color = "light"; }}
                        >
                            <span class="nav-icon" aria-hidden="true">
                                <div
                                    class="icon-sun"
                                    style="font-size: 20px;"
                                ></div>
                            </span>
                            <span class="nav-label">{$trans?.nav.light}</span>
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            palette="tone"
                            direction="row"
                            active={$theme_color === "dark"}
                            onclick={() => { $theme_color = "dark"; }}
                        >
                            <span class="nav-icon" aria-hidden="true">
                                <div
                                    class="icon-moon"
                                    style="font-size: 20px;"
                                ></div>
                            </span>
                            <span class="nav-label">{$trans?.nav.dark}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    {/snippet}
</Popover>

<style>
    .trigger-wrap {
        display: inline-flex;
    }

    .pop-styling-row {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
        padding: 10px 10px 0px 10px;
    }

    .pop-styling-menu {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 0px 10px 20px 10px;
    }

    .pop-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .pop-styling-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
    }
</style>
