import { ui, type TranslationKey } from "./ui";

export type Language = keyof typeof ui;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return "zh";
}

export function useTranslations(lang: Language) {
  return function t(
    key: TranslationKey,
    vars?: Record<string, string | number>
  ) {
    const message = ui[lang][key] ?? ui.zh[key];

    if (!vars) return message;

    return Object.entries(vars).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
      message
    );
  };
}
