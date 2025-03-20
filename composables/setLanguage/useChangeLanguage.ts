import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { LANGUAGE_KEY } from '~/constants'

type Languages = 'en' | 'ru'

export function useChangeLanguage() {
  const { locale, setLocale } = useI18n()
  const savedLanguage = useLocalStorage<Languages>(LANGUAGE_KEY, 'en')

  const changeLanguage = (lang: Languages) => {
    setLocale(lang)
    savedLanguage.value = lang
  }

  const initLanguage = () => setLocale(savedLanguage.value)

  return {
    locale,
    changeLanguage,
    initLanguage,
  }
}
