<script lang="ts">
    interface Props {
        items: string[];
        interval?: number;
        transition?: 'fade' | 'slide' | 'flip';
        pause_on_hover?: boolean;
        aria_label?: string | undefined;
        class_name?: string | undefined;
    }

    let {
        items,
        interval = 2500,
        transition = 'fade',
        pause_on_hover = false,
        aria_label = undefined,
        class_name = undefined
    }: Props = $props();

    let index = $state(0);
    let paused = $state(false);

    $effect(() => {
        if (paused || items.length <= 1) return;
        const id = setInterval(() => {
            index = (index + 1) % items.length;
        }, interval);
        return () => clearInterval(id);
    });

    $effect(() => {
        if (index >= items.length) index = 0;
    });
</script>

<div
    class="rotator"
    role="group"
    aria-label={aria_label}
    onmouseenter={() => { if (pause_on_hover) paused = true; }}
    onmouseleave={() => { if (pause_on_hover) paused = false; }}
>
    {#each items as item, i (item + i)}
        <span
            class="rotator-item rotator-{transition} {class_name ?? ''}"
            class:active={i === index}
            aria-hidden={i !== index}
        >
            {item}
        </span>
    {/each}
</div>

<style>
    .rotator {
        display: grid;
        width: fit-content;
        height: 100%;
        overflow: hidden;
    }

    .rotator-item {
        grid-area: 1 / 1;
        display: flex;
        align-items: center;
        opacity: 0;
        pointer-events: none;
        transition-property: opacity, transform;
        transition-duration: 150ms, 350ms;
        transition-timing-function: ease;
        font-size: xx-large;
        font-family: var(--spk-font-heading);
        text-transform: uppercase;
    }

    .rotator-item.active {
        opacity: 1;
        pointer-events: auto;
    }

    /* Fade: opacity transition only, no transform */

    /* Slide: inactive items sit below, active sits in place */
    .rotator-slide {
        transform: translateY(16px);
    }

    .rotator-slide.active {
        transform: translateY(0);
    }

    /* Flip: inactive items are rotated away, active lies flat */
    .rotator-flip {
        transform: rotateX(90deg);
        transform-origin: 50% 0%;
    }

    .rotator-flip.active {
        transform: rotateX(0deg);
    }

    @media (prefers-reduced-motion: reduce) {
        .rotator-item {
            transition: none !important;
        }
    }
</style>
