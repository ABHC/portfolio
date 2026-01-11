import type { Locale } from "$lib/types/translations";

export const translations = {
    fr: {
        language_name: "Français",
        header: {
            name: "Alexandre 'Épinard' Combe |",
            tagline1: "Développeur",
            tagline2: "Concepteur",
            tagline3: "Manager",
            logo_btn: "Retour à l'accueil"
        },
        menu: {
            hardware: "Design",
            software: "Apps",
            graphic: "Graphisme",
            management: "Clients", 
            about: "Profil",
            lang: "Sélectionner la langue",
            available_languages: "Langues disponibles",
            close_menu: "Fermer le menu"
        },
        projects_gallery: {
            demo_btn: "Voir la démo",
            demo_aria: "Lien vers la démo",
            modal_btn: "En savoir plus",
            modal_aria: "Détails du projet",
            description: "Le projet",  
            team: "Ils ont travaillé avec moi",
            tags: "Technologies & Compétences",
            links: "En savoir plus",
            demo_link: "Démo",
            model_link: "Modèle"
        },
        alerts: {
            loading: "ℹ️ Chargement des projets...",
            loading_error: "❌ Erreur de chargement des projets :"
        },
        footer: {
            license: "Site sous licence GPLv3",
            legal: "",
            git_btn: "Github",
            linked_in_btn: "LinkedIn",
            blog: "Blog"
        },
        seo: {
            meta: "",
            title: ""
        },
    },
    en: {
        language_name: "English",
        header: {
            name: "Alexandre 'Spinach' Combe |",
            tagline1: "Developer",
            tagline2: "Designer", 
            tagline3: "Manager",
            logo_btn: "Back to home"
        },
        menu: {
            hardware: "Design",
            software: "Apps",
            graphic: "Graphic Design",
            management: "Clients", 
            about: "About",
            lang: "Select language",
            available_languages: "Available languages",
            close_menu: "Close menu"
        },
        projects_gallery: {
            demo_btn: "View demo",
            demo_aria: "Link to demo", 
            modal_btn: "Learn more",
            modal_aria: "Project details",
            description: "The project",
            team: "They worked with me",
            tags: "Technologies & Skills",
            links: "Learn More",
            demo_link: "Demo",
            model_link: "Model"
        },
        alerts: {
            loading: "ℹ️ Loading projects...",
            loading_error: "❌ Error loading projects:"
        },
        footer: {
            license: "Website under GPLv3 license",
            legal: "",
            git_btn: "Github",
            linked_in_btn: "LinkedIn",
            blog: "Blog"
        },
        seo: {
            meta: "",
            title: ""
        },
    }
};

export const available_locales = Object.keys(translations) as Locale[];