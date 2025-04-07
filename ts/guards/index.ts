interface ApiError {
  statusCode: number
  message: string
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object'
    && error !== null
    && 'statusCode' in error
    && 'message' in error
  )
}
