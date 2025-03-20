import en from '~/i18n/locales/en.json'
import ru from '~/i18n/locales/ru.json'

export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    en,
    ru,
  },
}))
