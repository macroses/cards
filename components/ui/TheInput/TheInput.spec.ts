import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import TheInput from './TheInput.vue'

describe('theInput', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(TheInput, {
      props: {
        placeholder: 'Default placeholder',
      },
      modelValue: '',
    })
  })

  it('рендерит инпут с дефолтными пропсами', () => {
    const input = wrapper.find('input')

    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Default placeholder')
    expect(input.attributes('type')).toBe('text')
  })

  it('обновляет placeholder при изменении пропса', async () => {
    await wrapper.setProps({ placeholder: 'New placeholder' })

    const input = wrapper.find('input')

    expect(input.attributes('placeholder')).toBe('New placeholder')
  })

  it('обновляет value при вводе', async () => {
    const input = wrapper.find('input')

    await input.setValue('test value')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test value'])
  })
})
