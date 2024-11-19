import { useI18n } from 'vue-i18n'

const LANGUAGE_KEY = 'selectedLanguage'

export function useChangeLanguage() {
  const { locale, setLocale } = useI18n()

  const saveLanguage = (lang: string) => {
    localStorage.setItem(LANGUAGE_KEY, lang)
  }

  const loadLanguage = () => localStorage.getItem(LANGUAGE_KEY) || 'en'

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
