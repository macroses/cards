import { setupTest } from '@nuxt/test-utils/runtime'

export default async () => {
  await setupTest({
    server: true,
    browser: true,
    setupTimeout: 10000,
  })
}
