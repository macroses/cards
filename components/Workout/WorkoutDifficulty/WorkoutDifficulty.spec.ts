import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import WorkoutDifficulty from './WorkoutDifficulty.vue'

describe('workoutDifficulty', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WorkoutDifficulty, {
      props: {
        'modelValue': DIFFICULT_LEVEL.WARM,
        'onUpdate:modelValue': (e: DIFFICULT_LEVEL) => wrapper.setProps({ modelValue: e }),
      },
    })
  })

  it('рендерит компонент с правильным количеством кнопок', () => {
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(5)
  })

  it('отображает правильные значения сложности на кнопках', () => {
    const buttons = wrapper.findAll('button')
    const expectedLabels = ['1', '2', '3', '4', '5']

    buttons.forEach((button, index) => {
      expect(button.text()).toBe(expectedLabels[index])
    })
  })

  it('применяет класс active к выбранной кнопке', async () => {
    const buttons = wrapper.findAll('button')
    const activeButton = buttons[0] // WARM = 1 (первая кнопка)

    expect(activeButton.classes()).toContain('active')
    expect(buttons[1].classes()).not.toContain('active')
  })

  it('устанавливает правильный data-difficulty атрибут', () => {
    const container = wrapper.find('.difficulty-buttons')
    expect(container.attributes('data-difficulty')).toBe(DIFFICULT_LEVEL.WARM.toString())
  })

  it('эмитит правильное значение при клике на кнопку', async () => {
    const buttons = wrapper.findAll('button')
    await buttons[2].trigger('click') // Клик на MEDIUM (3)

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
  })
})
