<template>
  <div class="container">
    <div
      class="box"
      v-for="(item, index) in list"
      :key="item.id"
      :style="{ backgroundColor: item.background }"
    >
      {{ index + 1 }}
    </div>
    <div class="status">{{ message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 1. 定义颜色项接口
interface ColorItem {
  background: string
  id: number
}

// 2. 生成随机rgb字符串
const getRandomRgb = (): string => {
  const r: number = Math.floor(Math.random() * 256)
  const g: number = Math.floor(Math.random() * 256)
  const b: number = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}

// 3. 声明响应式数组，约束类型为ColorItem[]
const list = ref<ColorItem[]>([])
const isLoading = ref(false)
const message = ref('向下滚动加载更多数据')
const nextId = ref(0)
const maxItems = 50
const batchSize = 10
let scrollScheduled = false

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const appendList = (count: number): void => {
  const arr: ColorItem[] = []
  for (let i = 0; i < count; i++) {
    arr.push({
      background: getRandomRgb(),
      id: nextId.value++
    })
  }
  list.value.push(...arr)
}

const generateList = async (count: number = batchSize): Promise<void> => {
  if (isLoading.value || list.value.length >= maxItems) {
    if (list.value.length >= maxItems) {
      message.value = '没有更多数据了'
    }
    return
  }

  isLoading.value = true
  const delayMs: number = Math.floor(Math.random() * 5001)
  message.value = `加载中，预计等待 ${delayMs}ms...`
  await delay(delayMs)

  const nextCount = Math.min(count, maxItems - list.value.length)
  appendList(nextCount)
  isLoading.value = false

  if (list.value.length >= maxItems) {
    message.value = '没有更多数据了'
  } else {
    message.value = `已加载 ${list.value.length} 项，继续滚动以获取更多` 
  }
}

const handleScroll = (): void => {
  if (scrollScheduled) {
    return
  }

  scrollScheduled = true
  requestAnimationFrame(() => {
    scrollScheduled = false
    checkScroll()
  })
}

const checkScroll = (): void => {
  if (isLoading.value || list.value.length >= maxItems) {
    return
  }

  const scrollTop = window.scrollY || window.pageYOffset
  const clientHeight = window.innerHeight
  const scrollHeight = document.documentElement.scrollHeight

  if (scrollTop + clientHeight >= scrollHeight / 2) {
    generateList(batchSize)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  generateList(batchSize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.container {
  overflow-y: auto;
  background: #ffffff;
}

.box {
  text-align: center;
  width: 100%;
  height: 500px;
  color: #111;
  font-size: 18px;
  font-weight: 600;
}

.status {
  text-align: center;
  color: #555;
  font-size: 14px;
}
</style>
