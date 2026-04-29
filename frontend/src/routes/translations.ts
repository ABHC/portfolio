import type { Locale } from "$lib/types/translations";

export const translations = {
    fr: {
        language_name: "Français",
        aria: {
            return: "Retour",
            close: "Fermer",
            back_to_top: "Retour en haut de page",
            language: "Langue",
            theme: "Theme",
        },
        header: {
            project: "Portfolio",
            logo_btn: "Retour à l'accueil"
        },
        nav:{
            menu: "Menu",
            index: "Index",
            portfolio: "Portfolio",
            resume: "Parcours",
            blog:"Blog",
            theme: "Thème",
            light: "Clair",
            dark: "Sombre",
        },
        summary: {
            label: "Sommaire",
            hardware: "Hardware",
            software: "Software",
            graphic: "Design Graphique",
            management: "Clients", 
            about: "Profil",
            project: "Projet",
            team: "Équipe",
            links: "Liens",
            tags: "Tags",
        },
        menu: {
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
        profile: {
            about: "À propos",
            contact: "Contact",
            experience: "Expérience",
            education: "Formation",
            skills: "Compétences",
            languages: "Langues",
            tools: "Outils",
            career: "Parcours",
            resume: "Mon CV",
            return: "Retour"
        },
        alerts: {
            loading: "ℹ️ Chargement des projets...",
            loading_error: "❌ Erreur de chargement des projets :"
        },
        footer: {
            license: "Publié sous licence GNU GPLv3",
            github_btn: "Github",
            gitlab_btn: "Gitlab",
            linked_in_btn: "LinkedIn",
            copied: "Copié !",
            clipboard: "L'adresse e-mail a été copiée dans votre presse-papier",
        },
        seo: {
            meta: "",
            title: ""
        },
    },
    en: {
        language_name: "English",
        aria: {
            return: "Return",
            close: "Close",
            back_to_top: "Back to top",
            language: "Language",
            theme: "Theme",
        },
        header: {
            project: "Portfolio",
            logo_btn: "Back to home"
        },
        nav:{
            menu: "Menu",
            index: "Index",
            portfolio: "Portfolio",
            resume: "Resume",
            blog:"Blog",
            theme: "Theme",
            light: "Light",
            dark: "Dark",
        },
        summary: {
            label: "Contents",
            hardware: "Hardware",
            software: "Software",
            graphic: "Graphic Design",
            management: "Clients", 
            about: "About",
            project: "Project",
            team: "Team",
            links: "Links",
            tags: "Tags",
        },
        menu: {
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
        profile: {
            about: "About me",
            contact: "Contact",
            experience: "Experience",
            education: "Education",
            skills: "Skills",
            languages: "Languages",
            tools: "Tools",
            career: "Career",
            resume: "My resume",
            return: "Return"
        },
        alerts: {
            loading: "ℹ️ Loading projects...",
            loading_error: "❌ Error loading projects:"
        },
        footer: {
            license: "Published under GNU GPLv3 license",
            github_btn: "Github",
            gitlab_btn: "Gitlab",
            linked_in_btn: "LinkedIn",
            copied: "Copied !",
            clipboard: "The email address has been copied to your clipboard.",
        },
        seo: {
            meta: "",
            title: ""
        },
    }
};

export const available_locales = Object.keys(translations) as Locale[];