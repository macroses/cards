export default function (ms: number) {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)

  return [hours, minutes, seconds]
    .map(val => val.toString().padStart(2, '0'))
    .join(':')
}
