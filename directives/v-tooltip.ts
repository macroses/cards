import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const tooltip = document.createElement('div')
    tooltip.className = 'v-tooltip'
    tooltip.textContent = binding.value

    el.addEventListener('mouseenter', () => {
      document.body.appendChild(tooltip)
      const rect = el.getBoundingClientRect()

      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`
      tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`

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
