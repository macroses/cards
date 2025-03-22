type RiveFit = 'contain' | 'cover' | 'fill' | 'fitWidth' | 'fitHeight' | 'none' | 'scaleDown'
type RiveAlignment = 'center' | 'topLeft' | 'topCenter' | 'topRight' | 'centerLeft' | 'centerRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight'

export interface RiveAnimationProps {
  src: string
  artboard?: string
  animations?: string[]
  width?: number
  height?: number
  autoplay?: boolean
  fit?: RiveFit
  alignment?: RiveAlignment
}

export interface RiveInstance {
  cleanup: () => void
  play: (animationName?: string) => void
  pause: (animationName?: string) => void
  stop: (animationName?: string) => void
}
