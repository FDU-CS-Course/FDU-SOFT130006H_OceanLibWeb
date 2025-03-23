<style scoped>
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
<template>
  <div>
    <van-cell class="cell" :title="title" @click="$emit('click')">
      <template #right-icon>
        <van-icon class="secondary-darken5-color" size="22px" :name="icon" />
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'moreItem',
  props: {
    title: String,
    icon: String,
  },
  methods: {},
};
</script>

<style scoped>
.secondary-darken5-color {
  color: var(--van-gray-7);
}
</style>