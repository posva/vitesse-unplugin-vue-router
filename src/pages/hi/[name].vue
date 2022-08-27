<script lang="ts">
export const useFakeData = defineLoader('/hi/[name]', async (route) => {
  console.log('fetching', route.fullPath)
  return { name: route.params.name }
}, { key: 'fake' })
</script>

<script setup lang="ts">
const router = useRouter()
const user = useUserStore()
const route = useRoute('/hi/[name]')
const { t } = useI18n()

const { data } = useFakeData()

watchEffect(() => {
  user.setNewName(route.params.name)
})
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-pedestrian inline-block />
    </div>
    <p>
      {{ t('intro.hi', { name: route.params.name }) }}
    </p>

    <p text-sm opacity-75>
      <em>{{ t('intro.dynamic-route') }}</em>
    </p>

    <template v-if="user.otherNames.length">
      <p text-sm mt-4>
        <span opacity-75>{{ t('intro.aka') }}:</span>
        <ul>
          <li v-for="otherName in user.otherNames" :key="otherName">
            <router-link :to="`/hi/${otherName}`" replace>
              {{ otherName }}
            </router-link>
          </li>
        </ul>
      </p>
    </template>

    <pre>{{ data }}</pre>

    <div>
      <button
        btn m="3 t6" text-sm
        @click="router.back()"
      >
        {{ t('button.back') }}
      </button>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "custom": "hello"
  },

  "props": true
}
</route>
