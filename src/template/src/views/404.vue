<template>
  <div
    style="min-height: calc(100vh - 500px); display: flex; justify-content: center; align-items: center;"
  >
    <div
      style="max-width: 560px; background-color: #fff; padding: 80px 30px; margin: 100px auto; border-radius: 10px; flex: 1;"
    >
      <div style="max-width: 400px; margin: 0 auto;">
        <h1 class="font-size-36 mb-2">Page not found</h1>
        <p class="mb-3">
          The page is deprecated, deleted, or does not exist at all
        </p>
        <h1 class="font-size-80 mb-4 font-weight-bold">404 —</h1>
        <router-link to="/" class="btn"
          >&larr; Go back to the home page</router-link
        >
      </div>
    </div>
  </div>
</template>
