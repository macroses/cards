import { useI18n } from 'vue-i18n'

export function useChangeLanguage() {
  const { locale, setLocale } = useI18n()

  function saveLanguage(lang: string) {
    localStorage.setItem('selectedLanguage', lang)
  }

  function loadLanguage() {
    return localStorage.getItem('selectedLanguage') || 'en'
  }

  function changeLanguage(lang: string) {
    setLocale(lang)
    saveLanguage(lang)
  }

  function initLanguage() {
    const savedLanguage = loadLanguage()
    setLocale(savedLanguage)
  }

  return {
    locale,
    changeLanguage,
    initLanguage,
  }
}
