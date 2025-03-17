import exerciseItemMock from '@/mocks/exerciseItemMock.json'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import ExerciseItem from './ExerciseItem.vue'

describe('тестирует ExerciseItem', () => {
  const defaultProps = exerciseItemMock

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(ExerciseItem, {
      props: defaultProps,
      global: {
        stubs: {
          TheIcon: true,
          TheButton: true,
        },
      },
    })
  })

  it('рендерит название упражнения', () => {
    const name = wrapper.find('p')
    expect(name.text()).toContain('Приседания')
  })

  it('добавляет класс added когда упражнение выбрано', async () => {
    await wrapper.setProps({ isSelected: true })
    expect(wrapper.classes()).toContain('added')
  })

  it('эмитит событие select при клике на элемент', async () => {
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([defaultProps.exercise])
  })

  it('эмитит событие openModal при клике на кнопку информации', async () => {
    const infoButton = wrapper.findComponent({ name: 'TheButton' })
    await infoButton.trigger('click')
    expect(wrapper.emitted('openModal')).toBeTruthy()
    expect(wrapper.emitted('openModal')?.[0]).toEqual([defaultProps.exercise])
  })

  it('предотвращает всплытие события click при нажатии на кнопку информации', async () => {
    const infoButton = wrapper.findComponent({ name: 'TheButton' })
    await infoButton.trigger('click')
    expect(wrapper.emitted('select')).toBeFalsy()
  })
})
