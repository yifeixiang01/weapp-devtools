<template>
  <v-app>
    <v-app-bar  app  color="primary"  dark>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
        <router-view></router-view>
      <!-- <HelloWorld/> -->
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',

  components: {
    // HelloWorld
  },

  data: () => ({
    length: 3,
    window: 0,
  })
}
</script>
