import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const tooltip = document.createElement('div')
    tooltip.className = 'v-tooltip'
    let showTimeout: ReturnType<typeof setTimeout>

    // Сохраняем ссылку на тултип в элементе
    el._tooltip = tooltip
    el._showTimeout = showTimeout

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
      const spacing = 4 // Отступ от элемента

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

    // Функция для удаления тултипа
    function removeTooltip() {
      clearTimeout(showTimeout)
      if (tooltip.parentNode) {
        tooltip.classList.remove('active')
        setTimeout(() => {
          if (tooltip.parentNode) {
            document.body.removeChild(tooltip)
          }
        }, 200)
      }
    }

    // Сохраняем функцию удаления в элементе
    el._removeTooltip = removeTooltip

    el.addEventListener('mouseenter', () => {
      // Добавляем задержку в 500мс перед показом
      showTimeout = setTimeout(() => {
        document.body.appendChild(tooltip)

        const { top, left } = calculatePosition()
        tooltip.style.top = `${top}px`
        tooltip.style.left = `${left}px`

        requestAnimationFrame(() => {
          tooltip.classList.add('active')
        })
      }, 500)
    })

    el.addEventListener('mouseleave', removeTooltip)
    el.addEventListener('click', removeTooltip)
  },

  unmounted(el: HTMLElement) {
    // Очищаем таймер
    if (el._showTimeout) {
      clearTimeout(el._showTimeout)
    }

    // Удаляем тултип из DOM
    if (el._tooltip && el._tooltip.parentNode) {
      document.body.removeChild(el._tooltip)
    }

    // Удаляем обработчики событий
    if (el._removeTooltip) {
      el.removeEventListener('mouseleave', el._removeTooltip)
      el.removeEventListener('click', el._removeTooltip)
    }
  },
}
