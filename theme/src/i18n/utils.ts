import { getRelativeLocaleUrl } from "astro:i18n";
import { ui, type TranslationKey } from "./ui";
import { getPath } from "@/utils/getPath";

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

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] in ui) {
    segments.shift();
  }

  return segments;
}

export function toLocalizedPath(lang: Language, path = "/") {
  const normalizedPath = path === "/" ? "" : path.replace(/^\/+|\/+$/g, "");
  return getRelativeLocaleUrl(lang, normalizedPath);
}

export function getLocalizedPostPath(
  lang: Language,
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  return toLocalizedPath(lang, getPath(id, filePath, includeBase));
}
