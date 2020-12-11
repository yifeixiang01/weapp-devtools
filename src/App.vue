<template>
  <v-app>
    <v-navigation-drawer  dark  mini-variant  mini-variant-width="56" app  permanent>
      <v-list  dense  nav>
        <v-list-item  v-for="item in items"  :key="item.title" :to="item.route">
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on" v-bind="attrs">{{ item.icon }}</v-icon>
              </template>
              <span>{{item.title}}</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>



    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    items: [
      { title: 'Home', route: '/', icon: 'mdi-view-dashboard' },
      { title: '配置', route: 'About', icon: 'mdi-gavel' },
      { title: '投屏', route: 'ApowerMirror', icon: 'mdi-call-split' },
      { title: '设备', route: 'Devices', icon: 'mdi-dialpad' },
      // {title: '终端', route: "Terminal", icon: 'mdi-dialpad'}
    ],
    mini: true,
  })
}
</script>
