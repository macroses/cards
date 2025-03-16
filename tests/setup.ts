// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import { setupTest } from '@nuxt/test-utils/runtime'

export default async () => {
  await setupTest({
    server: true,
    browser: true,
    setupTimeout: 10000,
  })
}
