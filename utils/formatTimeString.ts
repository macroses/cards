export default function (timeString: string) {
  const [minutes, seconds] = timeString.split(':').map(Number)
  return minutes * 60 + seconds
}
