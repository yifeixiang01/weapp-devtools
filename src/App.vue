<template>
  <v-app>
        <v-navigation-drawer  dark  mini-variant  mini-variant-width="56" app  permanent>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <!-- <v-img src="https://randomuser.me/api/portraits/women/75.jpg"></v-img> -->
            </v-list-item-avatar>
          </v-list-item>

          <v-divider></v-divider>

          <v-list  dense  nav>
            <v-list-item  v-for="item in items"  :key="item.title" :to="item.route">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

    <v-app-bar  app  color="#323233"  dark>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>

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
    items: [
      { title: 'Home', route: 'Home', icon: 'mdi-view-dashboard' },
      { title: '配置', route: 'About', icon: 'mdi-forum' },
      { title: '投屏', route: 'ApowerMirror', icon: 'mdi-dialpad' },
    ],
    mini: true,
  })
}
</script>
