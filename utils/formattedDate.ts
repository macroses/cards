import dayjs from 'dayjs'

export default function (date: Date | null) {
  if (!date) {
    return ''
  }

  return dayjs(date).format('DD.MM.YYYY')
}
