import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheIcon from './TheIcon.vue'

describe('theIcon', () => {
  it('рендерит svg с правильными атрибутами', () => {
    const wrapper = mount(TheIcon, {
      props: {
        iconName: 'test-icon',
        width: '24px',
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('24px')
    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
  })

  it('применяет currentColor как fill по умолчанию', () => {
    const wrapper = mount(TheIcon, {
      props: {
        iconName: 'test-icon',
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.attributes('style')).toContain('fill: currentColor')
  })
})
