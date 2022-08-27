import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto/routes'
import { _setupDataFetchingGuard } from 'unplugin-vue-router/runtime'
import App from './App.vue'
import type { UserModule } from './types'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes: setupLayouts(routes),
    base: import.meta.env.BASE_URL,
  },
  async (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))

    const fetchedData = _setupDataFetchingGuard(ctx.router, ctx.isClient ? ctx.initialState.vueRouter : undefined)

    if (!ctx.isClient)
      ctx.initialState.vueRouter = fetchedData

    ctx.router.isReady().then(() => {
      console.log('READY', fetchedData)
    })
    // ctx.initialState.vueRouter = fetchedData
  },
)
