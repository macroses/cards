import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const tooltip = document.createElement('div')
    tooltip.className = 'v-tooltip'

    // Получаем контент и позицию из значения директивы
    const content = typeof binding.value === 'string'
      ? binding.value
      : binding.value?.content
    const position = typeof binding.value === 'string'
      ? 'top'
      : binding.value?.position || 'top'

    tooltip.textContent = content
    tooltip.setAttribute('data-position', position)

    const calculatePosition = () => {
      const rect = el.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      const spacing = 8 // Отступ от элемента

      let top, left

      switch (position) {
        case 'bottom':
          top = rect.bottom + spacing
          left = rect.left + (rect.width - tooltipRect.width) / 2
          break
        case 'left':
          top = rect.top + (rect.height - tooltipRect.height) / 2
          left = rect.left - tooltipRect.width - spacing
          break
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2
          left = rect.right + spacing
          break
        default: // top
          top = rect.top - tooltipRect.height - spacing
          left = rect.left + (rect.width - tooltipRect.width) / 2
      }

      // Проверяем выход за пределы экрана
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      // Корректируем позицию по горизонтали
      if (left < 0)
        left = spacing
      if (left + tooltipRect.width > viewport.width) {
        left = viewport.width - tooltipRect.width - spacing
      }

      // Корректируем позицию по вертикали
      if (top < 0)
        top = spacing
      if (top + tooltipRect.height > viewport.height) {
        top = viewport.height - tooltipRect.height - spacing
      }

      return { top, left }
    }

    el.addEventListener('mouseenter', () => {
      document.body.appendChild(tooltip)

      const { top, left } = calculatePosition()
      tooltip.style.top = `${top}px`
      tooltip.style.left = `${left}px`

      requestAnimationFrame(() => {
        tooltip.classList.add('active')
      })
    })

    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active')
      setTimeout(() => {
        if (tooltip.parentNode) {
          document.body.removeChild(tooltip)
        }
      }, 200)
    })
  },
}
