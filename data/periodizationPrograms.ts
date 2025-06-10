import ProgramTypeBlock from '@/components/Programs/ProgramTypeSvg/ProgramTypeBlock.vue'
import ProgramTypeLinear from '@/components/Programs/ProgramTypeSvg/ProgramTypeLinear.vue'
import ProgramTypeUndulating from '@/components/Programs/ProgramTypeSvg/ProgramTypeUndulating.vue'

export const periodizationPrograms = [
  {
    title: 'Линейная',
    path: '/programs/linear',
    component: ProgramTypeLinear,
    theses: [
      'Увеличение интенсивности при одновременном снижении объёма',
      'Простая и предсказуемая структура, подходящая для начинающих',
      'Подходит для подготовки к соревнованиям с фиксированной датой',
      'Возможно плато из-за отсутствия разнообразия',
    ],
  },
  {
    title: 'Волновая',
    path: '/programs/undulating',
    component: ProgramTypeUndulating,
    theses: [
      'Частые изменения интенсивности и объёма тренировок',
      'Развитие нескольких физических качеств.',
      'Больше прогресса и мотивации',
      'Возможно переутомления',
    ],
  },
  {
    title: 'Блочная',
    path: '/programs/block',
    component: ProgramTypeBlock,
    theses: [
      'Разделение тренировочного процесса на специализированные блоки (например, гипертрофия, сила, мощность)',
      'Каждый блок фокусируется на развитии определённого качества',
      'Подходит для опытных атлетов и тех, кто стремится к пику формы в определённый период.',
      'Требует тщательного планирования и может быть сложной в реализации',
    ],
  },
]
