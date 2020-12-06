import Vue from 'vue'
import toastCom from './toast.vue'

export default async (options = {}) => {
    // 生成一个Vue的子类
    // 同时这个子类也就是组件
    // 生成一个该子类的实例
    let instance = new (Vue.extend(toastCom))();

    // 将这个实例挂载在创建的div上
    // 并将此div加入全局挂载点内部
    instance.$mount(document.createElement('div'));
    document.body.appendChild(instance.$el)
    instance.open(options)
    const res = await instance.callback();
    return res
}