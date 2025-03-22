<script setup lang="ts">
import type { RiveAnimationProps } from '~/ts/types/rive.type'
import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas'

const props = withDefaults(defineProps<RiveAnimationProps>(), {
  width: 400,
  height: 400,
  artboard: undefined,
  animations: undefined,
  autoplay: true,
  fit: 'contain',
  alignment: 'center',
})

const emit = defineEmits<{
  riveLoaded: [instance: any]
  riveError: [error: Error]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const riveInstance = ref<any>(null)

const pixelRatio = window?.devicePixelRatio || 1

const fitMap = {
  contain: Fit.Contain,
  cover: Fit.Cover,
  fill: Fit.Fill,
  fitWidth: Fit.FitWidth,
  fitHeight: Fit.FitHeight,
  none: Fit.None,
  scaleDown: Fit.ScaleDown,
}

const alignmentMap = {
  center: Alignment.Center,
  topLeft: Alignment.TopLeft,
  topCenter: Alignment.TopCenter,
  topRight: Alignment.TopRight,
  centerLeft: Alignment.CenterLeft,
  centerRight: Alignment.CenterRight,
  bottomLeft: Alignment.BottomLeft,
  bottomCenter: Alignment.BottomCenter,
  bottomRight: Alignment.BottomRight,
}

onMounted(async () => {
  if (!canvasRef.value) {
    return
  }

  try {
    canvasRef.value.width = props.width * pixelRatio
    canvasRef.value.height = props.height * pixelRatio

    const ctx = canvasRef.value.getContext('2d')

    if (ctx) {
      ctx.scale(pixelRatio, pixelRatio)
    }

    riveInstance.value = new Rive({
      canvas: canvasRef.value,
      src: props.src,
      artboard: props.artboard,
      animations: props.animations,
      autoplay: props.autoplay,
      layout: new Layout({
        fit: fitMap[props.fit],
        alignment: alignmentMap[props.alignment],
      }),
    })

    emit('riveLoaded', riveInstance.value)
  }
  catch (error) {
    console.error('Failed to initialize Rive animation:', error)
    emit('riveError', error as Error)
  }
})

onBeforeUnmount(() => {
  if (riveInstance.value) {
    riveInstance.value.cleanup()
  }
})

// Экспортируем методы для управления анимацией
defineExpose({
  play: (animationName?: string) => riveInstance.value?.play(animationName),
  pause: (animationName?: string) => riveInstance.value?.pause(animationName),
  stop: (animationName?: string) => riveInstance.value?.stop(animationName),
})
</script>

<template>
  <div
    class="rive-animation-container"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
  >
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
    />
  </div>
</template>

<style scoped>
.rive-animation-container {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
