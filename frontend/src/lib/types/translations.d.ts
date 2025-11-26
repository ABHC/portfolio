/* -----------------------------------------
* TRANSLATIONS.TS TYPES
* ----------------------------------------- */

import { translations } from "../../routes/translations";

export type Translations = typeof translations;
export type Locale = keyof Translations; // "fr" | "en"
export type Translation = Translations[Locale]; // Content from one of the managed languages

  