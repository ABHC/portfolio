export const translations = {
    fr: {
        language_name: "Français",
        header: {
            name: "Alexandre 'Épinard' Combe",
            logo_btn: "Retour à l'accueil"
        },
        menu: {
            hardware: "Design",
            software: "Apps",
            management: "Clients", 
            about: "Profil",
            lang: "Sélectionner la langue",
            available_languages: "Langues disponibles",
            close_menu: "Fermer le menu"
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
            name: "Spinach",
            logo_btn: "Back to home"
        },
        menu: {
            hardware: "Design",
            software: "Apps",
            management: "Clients", 
            about: "About",
            lang: "Select language",
            available_languages: "Available languages",
            close_menu: "Close menu"
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

// Types 
export type Translations = typeof translations;
export type Locale = keyof Translations; // "fr" | "en"
export type Translation = Translations[Locale]; // Content from one of the managed languages
export const available_locales = Object.keys(translations) as Locale[];