import { useI18n } from 'vue-i18n'

export function useChangeLanguage() {
  const { locale, setLocale } = useI18n()

  const saveLanguage = (lang: string) => {
    localStorage.setItem('selectedLanguage', lang)
  }

  const loadLanguage = () => localStorage.getItem('selectedLanguage') || 'en';

  const changeLanguage = (lang: string) => {
    setLocale(lang)
    saveLanguage(lang)
  }

  const initLanguage = () => {
    const savedLanguage = loadLanguage()
    setLocale(savedLanguage)
  }

  return {
    locale,
    changeLanguage,
    initLanguage,
  }
}
