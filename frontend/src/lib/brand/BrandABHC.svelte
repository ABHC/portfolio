<script lang="ts">
    import LogoABHC from "./LogoABHC.svelte";

    type Fill = "accent" | "text-accent" | "text" ;
    type Size = "sm" | "md" | "lg";

    interface Props {
        logo_fill?: Fill;
        text_fill?: Fill;
        size?: Size;
    }

    let {
        logo_fill = "accent",
        text_fill = "text",
        size = "md",
    }: Props = $props();

    const logo_fill_class:string = $derived(
        logo_fill === "text" ? "fill-text" :
        logo_fill === "text-accent" ? "fill-text-accent" :
        "fill-accent"
    )

    const text_fill_class:string = $derived(
        text_fill === "accent" ? "fill-accent" :
        text_fill === "text-accent" ? "fill-text-accent" :
        "fill-text"
    )

    const logo_size:number = $derived(
        size === "sm" ? 45 :
        size === "lg" ? 74 :
        64
    )
</script>

<a class="brand-container" href="https://combe.tf/">
    <div class="tagline brand-{size}">
        <div class="brand-name {text_fill_class}">
            <span>ALEXANDRE</span>
            <span>COMBE</span>
        </div>
    </div>
    <span class="pipe {text_fill_class} brand-{size}">|</span>
    <div class="logo-container">
        <LogoABHC size={logo_size} fill={logo_fill}/>
    </div>
</a>

<style>
    .brand-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        padding: 6px;
        cursor: pointer;
        text-decoration: none;
    }

    .brand-container:hover {
        background: var(--spk-accent-ghost-hover);
    }

    .brand-name {
        display: flex;
        flex-direction: column;
        text-align: end;
        font-weight: 700;
        font-family: var(--spk-font-heading);
        line-height: 1.1;
    }

    .brand-sm .brand-name { 
        font-size: 1.25rem; 
    }

    .brand-md .brand-name { 
        font-size: 1.5rem; 
    }

    .brand-lg .brand-name {
        font-size: 2rem;
    }

    .fill-accent span,
    .fill-accent {
        color: var(--spk-accent);
    }

    .fill-text-accent span,
    .fill-text-accent {
        color: var(--spk-text-accent);
    }

    .fill-text span,
    .fill-text {
        color: var(--spk-text);
    }

    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 5;
    }

    .pipe {
        font-weight: 100;
        line-height: 1;
        margin-bottom: 0px;                                                                                                                                                                                         
        margin-top: 2px; 
    }

    .pipe.brand-sm { font-size: 2rem; }
    .pipe.brand-md { font-size: 2.25rem; }
    .pipe.brand-lg { font-size: 3rem; }

</style>