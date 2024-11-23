import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import TheButton from '~/components/ui/TheButton/TheButton.vue'

describe('theButton', () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>>

  async function createWrapper(props = {}) {
    return await mountSuspended(TheButton, { props })
  }

  beforeEach(async () => {
    wrapper = await createWrapper()
  })

  it('рендерит кнопку с дефолтными пропсами', () => {
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.classes()).toContain('button')
    expect(wrapper.classes()).toContain('button--primary')
  })

  it('рендерит кнопку с переданным вариантом', async () => {
    wrapper = await createWrapper({ variant: 'ghost' })
    expect(wrapper.classes()).toContain('button--ghost')
  })

  it('рендерит disabled кнопку', async () => {
    wrapper = await createWrapper({ disabled: true })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
