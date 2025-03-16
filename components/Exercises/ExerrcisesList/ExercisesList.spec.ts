import exercisesListMock from '@/mocks/exercisesListMock.json'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import ExercisesList from './ExercisesList.vue'

vi.mock('@/composables/exercisesList/useFetchExercisesList', () => ({
  useFetchExercisesList: () => ({
    exercisesList: ref([exercisesListMock]),
  }),
}))

describe('тестирует ExercisesList', () => {
  const defaultProps = {
    selectedExercises: [],
    exercisesList: exercisesListMock,
  }

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    // Создаем div для телепорта
    const el = document.createElement('div')
    el.id = 'modal'
    document.body.appendChild(el)

    wrapper = mount(ExercisesList, {
      props: defaultProps,
      global: {
        stubs: {
          TheIcon: true,
          TheButton: true,
          TheModal: {
            template: '<div class="modal"><slot name="content" /></div>',
            methods: {
              openModal: vi.fn(),
              closeModal: vi.fn(),
            },
          },
          BodySvg: true,
          ExerciseDetails: true,
        },
      },
      attachTo: document.body,
    })
  })

  afterEach(() => {
    // Удаляем элемент после каждого теста
    document.body.innerHTML = ''
  })

  it('рендерит список групп мышц', () => {
    const muscleGroups = wrapper.findAll('.muscle-item')
    expect(muscleGroups).toHaveLength(1)
    expect(muscleGroups[0].find('.muscle-name').text()).toBe('Neck')
  })

  it('отображает количество упражнений в группе', () => {
    const exercisesCount = wrapper.find('.exercises-count')
    expect(exercisesCount.text()).toBe('2')
  })

  it('разворачивает/сворачивает группу при клике', async () => {
    const muscleGroup = wrapper.find('.muscle-item__title')

    await muscleGroup.trigger('click')
    expect(wrapper.find('.exercises-list').exists()).toBe(true)

    await muscleGroup.trigger('click')
    expect(wrapper.find('.exercises-list').exists()).toBe(false)
  })

  it('эмитит событие selectExercise при выборе упражнения', async () => {
    const muscleGroup = wrapper.find('.muscle-item__title')
    await muscleGroup.trigger('click')

    const exerciseItem = wrapper.findComponent({ name: 'ExerciseItem' })
    await exerciseItem.vm.$emit('select', {
      id: '1',
      name: 'Поднятие диска',
    })

    expect(wrapper.emitted('selectExercise')).toBeTruthy()
    expect(wrapper.emitted('selectExercise')?.[0]).toEqual([{
      id: '1',
      name: 'Поднятие диска',
    }])
  })

  it('открывает модальное окно с деталями упражнения', async () => {
    const muscleGroup = wrapper.find('.muscle-item__title')
    await muscleGroup.trigger('click')

    const exerciseItem = wrapper.findComponent({ name: 'ExerciseItem' })
    await exerciseItem.vm.$emit('openModal', {
      id: '1',
      name: 'Поднятие диска',
      muscleId: 1,
      primary: 'Neck',
      secondary: [],
      category: 'strength',
      equipment: 'machines',
      force: 'pull',
      level: 'beginner',
    })

    const modal = document.querySelector('.modal')
    expect(modal).toBeTruthy()
    expect(modal?.querySelector('.exercise-details__wrapper')).toBeTruthy()
  })

  it('отмечает упражнение как выбранное', async () => {
    await wrapper.setProps({
      selectedExercises: [{ id: '1', name: 'Поднятие диска' }],
    })

    const muscleGroup = wrapper.find('.muscle-item__title')
    await muscleGroup.trigger('click')

    const exerciseItem = wrapper.findComponent({ name: 'ExerciseItem' })
    expect(exerciseItem.props('isSelected')).toBe(true)
  })
})
