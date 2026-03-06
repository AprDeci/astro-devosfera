import { ui } from './ui';

// 从 URL 获取当前语言
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return 'zh';  // 默认语言
}

// 获取翻译函数
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof lang]) {
    return ui[lang][key] || ui['zh'][key];
  }
}