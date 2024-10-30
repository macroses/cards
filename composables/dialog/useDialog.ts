import { ref } from 'vue'

export function useDialog() {
  const dialogRef = ref<HTMLDialogElement | null>(null)

  const openDialog = () => dialogRef.value?.showModal()
  const closeDialog = () => dialogRef.value?.close()

  const handleDialogClick = (e: MouseEvent) => {
    if (e.target === dialogRef.value) {
      const rect = dialogRef.value?.getBoundingClientRect()
      const isInDialog = rect && (
        e.clientY > rect.top
        && e.clientY < rect.bottom
        && e.clientX > rect.left
        && e.clientX < rect.right
      )
      if (!isInDialog)
        closeDialog()
    }
  }

  onMounted(() => {
    dialogRef.value?.addEventListener('click', handleDialogClick)
  })

  onUnmounted(() => {
    dialogRef.value?.removeEventListener('click', handleDialogClick)
  })

  return {
    dialogRef,
    openDialog,
    closeDialog,
  }
}
