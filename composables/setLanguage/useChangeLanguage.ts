import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { LANGUAGE_KEY } from '~/constants'

export function useChangeLanguage() {
  const { locale, setLocale } = useI18n()
  const savedLanguage = useLocalStorage(LANGUAGE_KEY, 'en')

  const changeLanguage = (lang: string) => {
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
