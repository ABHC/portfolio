<script lang="ts">

    import {
        trans,
        help_modal,
        current_layout,
        error_message,
        catch_error,
    } from "./store";

    import { onMount } from "svelte";

    let open_help_tab = "legend"
    let pics = null;
    let selected_pic = null;
    let report_subject = "";
    let message_body = "";
    let sender_email = "";

    async function collectPics() {
        try {
            const response = await fetch('./json/pics.json');
            const data = await response.json();
            pics = data;
            preloadFullImages(data);
        } catch (error) {
            $error_message = "Error when loading keyboard pictures : " + error;
            $catch_error = true;
        }
    }

    // Preload full pictures in background
    function preloadFullImages(pics) {
        pics.forEach(pic => {
            const img = new Image();
            img.src = pic.url; // Trigger image loading
        });
    }

    onMount(async () =>
    {
        collectPics();
    });
</script>

<div
    class={$help_modal ? "modal-background" : " "}
    aria-label={$trans.help_main.background}
    role="button"
    tabindex="0"
    on:click={() => {
        $help_modal = false;
    }}
    on:keypress={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            $help_modal = false;
        }
    }}
/>

<div class={open_help_tab == "pics" ? "tile scroll-tile" : "tile"}>
    <div id="header">
        
    </div>

    {#if open_help_tab == "legend"}
        
    {:else if open_help_tab == "tips"}
        
    {:else if open_help_tab == "pics"}
        
    {:else if open_help_tab == "faq"}
        
    {:else if open_help_tab == "bugs"}
        
    {/if}

    <div class="return-section">
        <button 
            id="return-to-edition"
            class="btn" 
            on:click={() => {
                $help_modal = !$help_modal;
            }}
        >
            <icon class="material-symbols-outlined" id="info-symbol">chevron_left</icon>
            {$trans.legend.return}
        </button>

        {#if open_help_tab == "bugs"}
            <button 
                id="send-btn"
                class="btn" 
                on:click={() => sendBugReport()}
            >
                <icon class="material-symbols-outlined" id="info-symbol">send</icon>
                {$trans.help_bug_report.send}
            </button>
        {/if}
    </div>
</div>

<style>
    * {
        font-family: Ubuntu;
    }

    .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';
        font-variation-settings:
            'FILL' 1,
            'wght' 400,
            'GRAD' 0,
            'opsz' 48;
        font-size: 24px;
    }

    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        color: var(--text-color-active);
        z-index: 9;
    }
    
    .tile {
        position: fixed;
        left: 50%;
        top: 50%;
        overflow: auto;
        transform: translate(-50%, -50%);
        border: none;
        border-radius: 10px;
        z-index: 10;
        text-align: center;
        background-color: #242424;
        box-shadow: 0px 5px 15px 5px #000000;
        width: 80vw;
        height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }

    .scroll-tile {
        scrollbar-color: #242424 #3f3c3c;
    }

    #header {
        width: 95%;
    }

    .nav {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 25px;
    }

    .nav button {
        cursor: pointer;
        box-shadow: 0 0 10px rgb(0, 0, 0);
        background: transparent;
        color: #fff;
        font-weight: bolder;
        border: none;
        text-decoration: none;
        padding: 8px 10px;
        margin: 0px 10px 1.5em 10px;
        font-size: 12px;
        line-height: 21px;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .nav button:hover {
        background: #078cb4;
    }

    .selected-tab {
        background: #078cb4 !important;
    }

    .help-tab {
        width: 90%;
        background-color: #3f3c3c;
        border-width: 2px;
        border-radius: 8px;
        padding: 0.6em;
        font-size: 16px;
        display: flex;
        flex-direction: column;
    }

    .legend-tab{
        align-items: center;
    }

    #key-legend {
        width: 30%;
    }

    .driver-section {
        background-color: #d45500;
        border-width: 2px;
        border-radius: 4px;
        padding: 0.6em;
        margin: 10px;
        font-weight: bold;
        width: 50%;
    }

    .tips-tab {
        padding: 1em;
        margin: 5px;
        overflow-y: auto;
        scrollbar-color: #242424 #3f3c3c;
        align-items: flex-start;
    }

    #tips-intro {
        margin: 10px 10px 25px 10px ;
    }

    .section-title {
        font-size: 18px;
        text-transform: uppercase;
        margin-bottom: 5px;
    }

    .section-text {
        margin-bottom: 0px;
        text-align: start;
    }

    .end-section {
        margin-bottom: 25px;
    }

    .pics-tab {
        width: 55%;
        margin-top: 15px;
        margin-bottom: 25px;
    }

    #tips-tab li, #faq-tab li {
        margin: 18px 0px 18px 0px;
        text-align: start;
    }

    .gallery {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        padding: 0px 10px;
        scrollbar-color: #3f3c3c #242424;
        width: 80%;
    }

    .item {
        cursor: pointer;
		display: flex;
		flex-direction: column;
        justify-content: space-between;
		align-items: center;
        border-radius: 6px;
        box-shadow: 0 0 10px rgb(0, 0, 0);
        border: 2px solid transparent;
        font-weight: bolder;
        padding: 8px 10px;
        margin: 6px;
        margin-bottom: 10px;
        background-color: transparent;
        color: #fff;
	}

    .selected-item {
        box-shadow: 0 0 10px rgb(7, 140, 180);
        border: 2px solid #078cb4;
    }

    #item-preview {
        width: 200px;
    }

    .return-section {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btn {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        box-shadow: 0 0 10px rgb(0, 0, 0);
        background: #078CB4;
        color: #fff;
        font-weight: bold;
        border: none;
        letter-spacing: 2px;
        padding: 8px 10px;
        text-transform: uppercase;
        cursor: pointer;
        height: 45px;
        margin: 15px 20px 20px 20px;
        align-self: center;
    }

    .btn:hover {
        background: #ACD9E6;
        color: #3f3c3c;
    }

    .report-tab {
        overflow-y: auto;
        scrollbar-color: #242424 #3f3c3c;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .input-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 90%;
    }

    .input-box label {
        padding: 15px 0px;
        font-weight: bold;
    }

    .stylish-input {
        max-width: 100%;
        padding: 12px 15px;
        display: inline-block;
        border: none;
        border-radius: 8px;
        box-sizing: border-box;
        font-size: 0.8em;
        background-color: #242424;
        color: #fff;
    }

    .stylish-text {
        max-width: 100%;
        min-width: 100%;
        min-height: 120px;
        max-height: 600px;
        padding: 12px 15px;
        display: inline-block;
        border: none;
        border-radius: 8px;
        box-sizing: border-box;
        font-size: 0.8em;
        background-color: #242424;
        color: #fff;
    }

    .stylish-input:focus-visible,
    .stylish-text:focus-visible  {
          outline-style: solid;
          outline-color: var(--dark);
         outline-width: medium;
    }

    .stylish-input:not(:placeholder-shown),
    .stylish-text:not(:placeholder-shown) {
        outline-style: solid;
          outline-color: var(--dark);
         outline-width: medium;
    }

    #subject {
        width: 100%;
    }

    #email {
        width: 50%;
        margin-bottom: 20px;
    }

    #send-btn icon {
        margin-right: 8px;
    }

    a:link {
        color: #078cb4;
    }

    a:visited {
        color: #078cb4;
    }
</style>