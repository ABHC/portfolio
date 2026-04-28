<script lang="ts">

    interface Props {
        profile: ProfileData;
    }

    let { profile }: Props = $props();

    import { 
        trans,
        locale, 
        window_width,
        responsive
    } from './store';
    
    import { 
        getIcon, 
        getIconColor, 
        getContactIcon 
    } from '$lib/utils/iconsBank'

    import type { 
        ProfileData, 
        Language
    } from '$lib/types/profile';

    let flipped: boolean = $state(false);

    const max_chars = $derived(
        $window_width && $window_width < 500 ? 97 :
        $window_width && $window_width < 620 ? 175 :
        $window_width && $window_width < 670 ? 268 :
        $window_width && $window_width < 820 ? 400 :
        $window_width && $window_width < 1100 ? 500 :
        500
    );

    const truncated_about = $derived(
        truncate(profile.me.about[$locale].join(' '), max_chars)
    );

    const tools_icons = $derived(
        profile.tools.map(tool => {
            const icon = getIcon(tool.name);
            const bgColor = getIconColor(tool.name);
            return { ...tool, icon, bgColor };
        })
    );

    const contacts = $derived(
        profile.contact.map(contact => ({
            ...contact,
            path: getContactPath(contact)
        }))
    );

    function getLangFlag(id: string): string {
		switch (id.toUpperCase()) {
            case 'FR': return '🇫🇷';
			case 'EN': return '🇬🇧';
			case 'DE': return '🇩🇪';
			default: return '';
		}
	}

    function getLangLevel(lang: Language): string {
        if (lang.level === 'C2') {
            return lang.description[$locale];
        }
        return lang.level;
    }

    function truncate(text: string, max: number): string {
        return text.length > max ? text.slice(0, max) + '[...]' : text;
    }

    function getContactPath(contact: { type: string; icon: string | null }) {
        if (contact.icon && contact.icon.trim() !== '') {
            return contact.icon;
        }
        
        if (contact.icon === null) {
            const si_icon = getContactIcon(contact.type);
            return si_icon?.path || '';
        }
        
        return '';
    }

    function getContactUrl(type: string, address: string): string {
        switch (type) {
            case 'phone': return ``;
            case 'mail': return ``;
            default: return address;
        }
    }

    function flipCard(e: MouseEvent): void {
        flipped = !flipped;
    }
</script>

<section class="profile-card">
    <div class="business-card" class:flipped>
        <!-- FRONT CARD -->
        <div class="card-face card-front">
            <!-- Main front content -->
            <div class="front-main">
                <div class="front-identity">
                    <div class="profile-photo">
                        <img 
                            src={profile.me.portrait} 
                            alt="{profile.me.firstname}&nbsp;{profile.me.surname}" 
                            class="avatar" 
                        />
                    </div>

                    <div class="identity-details">
                        <div class="name-block">
                            {#each profile.me.id as id}
                                {#if id.display}
                                    {#if $responsive.isBelow(450)}
                                        <h4 id="name-display">
                                            {id.name.toUpperCase()}
                                        </h4>
                                    {:else}
                                        <h2 id="name-display">
                                            {id.name.toUpperCase()}
                                        </h2>
                                    {/if}
                                {/if}
                            {/each}
                        </div>

                        <div class="taglines-inline">
                            {#each profile.me.tagline[$locale] as tagline, i}
                                <span class="tagline-item">{tagline}</span>
                            {/each}
                        </div>

                        <div class="languages-list">
                            {#each profile.languages as lang}
                                {#if lang.display}
                                    <div class="language-item">
                                        <span id="flag">
                                            {getLangFlag(lang.id)}
                                        </span>
                                        <span id="level">
                                            {getLangLevel(lang)}
                                        </span>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4 id="about-h">{$trans?.profile.about}</h4>
                    <span class="desc">
                        {truncated_about}
                    </span>
                </div>

                <div class="detail-section" id="skills">
                    <h4 id="skills-h">
                        {$trans?.profile.skills} & {$trans?.profile.tools}
                    </h4>
                    <div class="tags-block">
                        <div class="skills-grid">
                            {#each profile.skills[$locale].hardware as skill}
                                <span class="skill-tag">
                                    {skill}
                                </span>
                            {/each}
                            {#each profile.skills[$locale].software as skill}
                                <span class="skill-tag">
                                    {skill}
                                </span>
                            {/each}
                            {#each profile.skills[$locale].management as skill}
                                <span class="skill-tag">
                                    {skill}
                                </span>
                            {/each}
                        </div>

                        <div class="quick-tools">
                            {#each tools_icons as tool}
                                {#if tool.icon && tool.display}
                                    <span class="tool-badge" style="background: var(--spk-accent);">
                                        <svg viewBox="0 0 24 24" width="24" height="24">
                                            <path d={tool.icon.path} fill="#fafafa" />
                                        </svg>
                                    </span>
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4 id="contact-h">{$trans?.profile.contact}</h4>
                    <div class="contact-links">
                        {#each contacts as contact}
                            {#if contact.display && contact.path}
                                <a 
                                    href={getContactUrl(contact.type, contact.address)}
                                    target="_blank"
                                    aria-label="{contact.type}"
                                    class="contact-item"
                                >
                                    <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d={contact.path} fill="currentColor" />
                                    </svg>
                                    <span class="contact-type">{contact.type}</span>
                                </a>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        
            <div class="action-buttons">
                <button class="btn" onclick={flipCard}>
                    <span id="expand-text">
                        {$trans?.profile.career}
                    </span>
                </button>
                <button class="btn btn-secondary">
                    <span class="material-symbols-outlined">
                        download
                    </span>
                    {$trans?.profile.resume}
                </button>
            </div>
        </div>

        <!-- BACK CARD -->
        <div class="card-face card-back">
            <div class="back-content">
                <div class="timeline-section">
                    <h4>{$trans?.profile.experience}</h4>
                    <div class="timeline-list">
                        {#each profile.jobs as job}
                            {#if job.display}
                                <div class="timeline-item">
                                    <div class="period">
                                        {job.start}&nbsp;-&nbsp;{job.end}
                                    </div>
                                    <div class="title">
                                        {job.position[$locale]}
                                    </div>
                                    <div class="org">
                                        {job.company}
                                    </div>
                                    <div class="description">
                                        {#each job.description[$locale] as desc}
                                            <span>
                                                {@html desc}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>

                <div class="timeline-section">
                    <h4>{$trans?.profile.education}</h4>
                    <div class="timeline-list">
                        {#each profile.studies as study}
                            {#if study.display}
                                <div class="timeline-item">
                                    <div class="period">
                                        {study.years}
                                    </div>
                                    <div class="title">
                                        {study.name[$locale]}
                                    </div>
                                    <div class="org">
                                        {study.school}
                                    </div>
                                    <div class="description">
                                        {#each study.description[$locale] as desc}
                                            <span>
                                                {desc}&nbsp;
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn" onclick={flipCard}>
                    <span id="expand-text">
                        {$trans?.profile.return}
                    </span>
                </button>
                <button class="btn btn-secondary">
                    <span class="material-symbols-outlined">
                        download
                    </span>
                    {$trans?.profile.resume}
                </button>
            </div>
        </div>     
    </div>
</section>

<style>
    .profile-card {
        width: 100%;
        color: var(--spk-text);
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .card-container {
        perspective: 2000px;
        width: 100%;
        max-width: 1000px;
    }

    .business-card {
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.8s ease;
    }

    .business-card.flipped {
        transform: rotateY(180deg);
    }

    .card-face {
        backface-visibility: hidden;
        border-radius: 20px;
        background: var(--spk-tone);
        border: 2px solid var(--spk-accent);
        box-shadow: 0 20px 60px rgba(29, 179, 148, 0.2);
        overflow: hidden;
        width: 60vw;
        height: auto; 
        aspect-ratio: 17 / 11;
        background: linear-gradient(135deg, var(--spk-tone) 0%, var(--spk-accent-muted) 100%);
        max-width: 1200px; 
    }

    .card-front {
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
    }

    .card-back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        align-items: center ;
        justify-content: space-between;
        transform: rotateY(180deg);
    }

    /* FRONT CARD STRUCTURE */
    .front-main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
    }


    .front-identity {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        gap: 2rem;
        width: 100%;
    }

    .profile-photo {
        width: 180px;
        height: 180px;
        border-radius: 50%; 
        overflow: hidden; 
        flex-shrink: 0;
    }

    .avatar {
        width: 100%;
        height: 100%;
        object-fit: cover; 
        object-position: center;
    }

    .identity-details {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 0.6rem;
        min-width: 0; 
        flex: 1;
    }

    .name-block {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    #name-display {
        text-transform: uppercase;
        white-space: normal;
        word-wrap: break-word;
        min-width: 0;
        overflow-wrap: break-word;
    }

    #name-display::after {
        content: ' ';
    }

    #name-display:last-child::after {
        content: '';
    }

    .taglines-inline {
        /*color: var(--spk-accent);*/
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .tagline-item::after {
        content: ' • ';
    }

    .tagline-item:last-child::after {
        content: '';
    }

    :global([data-theme="dark"]) .taglines-inline {
        color: var(--spk-accent-hover);
    }

    :global([data-theme="light"]) .taglines-inline {
        color: var(--spk-accent-hover);
    }


    .languages-list {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        min-width: 0;
    }

    .language-item #flag {
        font-size: 1.2rem;
        margin-right: 0.4rem;
    }

    .language-item #level {
        font-size: 1.125rem;
        font-weight: bold;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .quick-tools {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .tool-badge {
        padding: 0.4rem 0.84em;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .action-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0.8rem;
    }

    .btn {
        background: var(--spk-accent);
        color: var(--spk-text-accent);
        border: none;
        padding: 0.8rem 1.2rem;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn:hover {
        background: var(--spk-accent-hover);
        transform: translateY(-2px);
    }

    .btn-secondary {
        background: var(--spk-accent-muted);
        /*color: var(--spk-accent-hover);
        border: 1px solid var(--spk-accent-hover);*/
    }

    :global([data-theme="dark"]) .btn-secondary {
        color: var(--spk-accent-hover);
        border: 1px solid var(--spk-accent-hover);
    }


    :global([data-theme="light"]) .btn-secondary {
        color: var(--spk-accent-hover);
        border: 1px solid var(--spk-accent-hover);
    }

    .btn-secondary:hover {
        background: var(--spk-accent);
        color: var(--spk-text-accent);
    }

    .detail-section h4,
    .timeline-section h4 {
        /*color: var(--spk-accent);*/
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 0.5rem;
    }

    :global([data-theme="dark"]) .detail-section h4,
    .timeline-section h4 {
        color: var(--spk-accent-hover);
    }

    :global([data-theme="light"]) .detail-section h4,
    .timeline-section h4 {
        color: var(--spk-accent-hover);
    }

    .desc {
        font-weight: 500;
        opacity: 0.85;
    }

    .tags-block {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .social-icon {
        width: 24px;
        height: 24px;
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
    }
    
    .skills-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .skill-tag {
        padding: 0.4rem 0.8rem;
        background: var(--spk-accent-muted);
        border-radius: 6px;
        border: 1px solid var(--spk-accent-hover);
    }

    .contact-links {
        display: flex;
        gap: 0.8rem;
    }

    .contact-item {
        width: 130px;
        padding: 0.8rem;
        background: var(--spk-accent-muted);
        border-radius: 8px;
        text-align: center;
        color: var(--spk-text);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 15px;
    }

    .contact-item:hover {
        background: var(--spk-accent);
        color: var(--spk-text-accent);
    }

    /* BACK CARD */
    .back-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem;
    }

    .timeline-list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .timeline-item {
        padding-left: 1.2rem;
        border-left: 3px solid var(--spk-accent);
    }

    .timeline-item .period {
        color: var(--spk-accent);
        font-weight: 600;
        margin-bottom: 0.3rem;
    }

    .timeline-item .title {
        font-weight: 600;
        font-family: 'Space Grotesk', sans-serif;
    }

    .timeline-item .org {
        font-family: 'Space Grotesk', sans-serif;
        opacity: 0.75;
    }

    .timeline-item .description {
        opacity: 0.75;
        margin-top: 0.3rem;
    }

    @media (min-width: 1100px) {
        .desc {
            font-size: 1.125rem;
        }
    }

    @media (max-width: 1800px) {
        .skill-tag:nth-child(n+7) {
            display: none;
        }

        .tool-badge {
            padding: 0.3rem 0.6rem;
        }

        .timeline-item .description {
            display: none;
        }
    }

    @media (max-width: 1700px) {
        .card-face {
            width: 62vw;
        }
    }

    @media (max-width: 1650px) {
        .card-face {
            width: 64vw;
        }
    }

    @media (max-width: 1600px) {
        .card-face {
            width: 66vw;
        }
    }

    @media (max-width: 1550px) {
        .card-face {
            width: 68vw;
        }
    }

    @media (max-width: 1500px) {
        .card-face {
            width: 70vw;
        }
    }

    @media (max-width: 1450px) {
        .quick-tools {
            display: none;
        }
    }

    @media (max-width: 1370px) {
        #skills {
            display: none;
        }

        /*#skills-h {
            display: none;
        }

        .skills-grid {
            display: none;
        }*/
    }

    @media (max-width: 1230px) {
        #contact-h {
            display: none;
        }
    }

    @media (max-width: 1150px) {
        #about-h {
            display: none;
        }
    }

    @media (max-width: 1100px) {
        .btn {
            padding: 0.5rem 0.9rem;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.85rem;
        }

        .contact-item {
            width: 100px;
            padding: 0.5rem;
            font-size: 0.85rem;
            font-weight: 600;
            gap: 10px;
        }
    }

    @media (max-width: 1024px) {
        .card-face{
            width: 100%;
        }

        .card-front{
            padding: 2rem;
        }

        .front-identity {
            gap: 0.8rem;
        }

        .profile-photo {
            width: 140px;
            height: 140px;
        }

        .quick-tools {
            justify-content: center;
        }

        .action-buttons {
            flex-direction: row;
            justify-content: center;
        }

        .back-content {
            grid-template-columns: 1fr;
        }

        .contact-links {
            grid-template-columns: 1fr;
        }

        .language-item #flag {
            font-size: 1.075rem;
        }

        .language-item #level {
            font-size: 1rem;
        }

        #skills {
            display: block;
        }

        #skills-h {
            display: none;
        }

        /*.quick-tools {
            display: flex;
            justify-content: flex-start;
        }*/
    }

    @media (max-width: 930px) {
        .card-front{
            padding: 1.5rem;
        }

        .profile-photo {
            width: 80px;
            height: 80px;
        }

        .identity-details {
            gap: 0.2rem;
        }

        .tagline-item::after {
            content: ' ';
        }

        .language-item #flag {
            font-size: 1rem;
            margin-right: 0.4rem;
        }

        .language-item #level {
            font-size: 0.875rem;
        }
    }

    @media (max-width: 820px) {
        /*.languages-list {
            display: none;
        }*/

        #skills {
            display: none;
        }
    }

    @media (max-width: 768px) {
        .card-front{
            padding: 1rem;
        }

        /*.contact-item  {
            display: none;
        }*/
    }

    @media (max-width: 680px) {
        /*.taglines-inline {
            display: none;
        }*/

        .languages-list {
            display: none;
        }
    }

    @media (max-width: 600px) {
        .profile-card {
            display: block;
        }
    }

    @media (max-width: 575px) {
        .taglines-inline {
            display: none;
        }

        .contact-item  {
            display: none;
        }
    }

    @media (max-width: 450px) {
        .btn {
            padding: 0.2rem 0.6rem;
        }
    }

    @media (max-width: 450px) {
        .front-main {
            gap: 0.5rem;
        }

        .profile-photo {
            width: 60px;
            height: 60px;
        }
    }

    @media (max-width: 400px) {
        .profile-photo {
            width: 40px;
            height: 40px;
        }
    }

    @media (max-width: 350px) {
        .profile-photo {
            width: 30px;
            height: 30px;
        }
    }
</style>