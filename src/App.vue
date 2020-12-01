<template>
  <div id="app">
    <div class="container">
      <div class="tabs">
        <div
          class="tab"
          v-for="tabId in tabIDs"
          :key="tabId"
          :class="tabId === activeID ? 'active' : ''"
          @mouseenter="tipsHandler(true, $event)"
          @mouseleave="tipsHandler(false, $event)"
        >
          <span class="loading" v-if="tabs[tabId]['isLoading']">
            <icon-loading style="width: 16px;height:16px;" />
          </span>
          <span class="loading" v-else>
            <img
              v-if="!!tabs[tabId]['favicon']"
              :src="tabs[tabId]['favicon']"
              width="16"
              alt=""
            />
          </span>
          <div class="title" @click="switchTab(tabId)">
            <div class="title-content">{{ tabs[tabId].title }}</div>
          </div>
          <template>
            <div class="close" @click="closeTab($event, tabId)">
              <icon-close />
            </div>
          </template>
        </div>
        <template v-if="!!config.hasPlusBtn">
          <span type="plus" style="margin-left: 10px" @click="newTab">
            <icon-plus />
          </span>
        </template>
      </div>
      <div class="bars">
        <div class="bar address-bar">
          <div class="actions">
            <div
              class="action"
              @click="canGoBack"
              :class="!tabsData.canGoBack ? 'disabled' : ''"
            >
              <icon-left />
            </div>
            <div
              class="action"
              @click="canGoForward"
              :class="!tabsData.canGoForward ? 'disabled' : ''"
            >
              <icon-right />
            </div>
            <div class="action" @click="reloadHandle">
              <icon-close v-if="tabsData.isLoading" />
              <icon-reload v-else />
            </div>
          </div>
          <input
            class="address"
            :disabled="config.disabledInput"
            :value="tabsData.url"
            @change="onUrlChange($event)"
            @keydown="onPressEnter($event)"
          />
        </div>
      </div>
    </div>
    <div
      class="tips"
      v-if="showTip"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      {{ title }}
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import control from "./libs/render/controlEvent";
import iconSvg from "@/components/svg";
import config from "./config";
export default {
  name: "App",
  components: {
    ...iconSvg
  },
  data() {
    return {
      tabIDs: [], // 页签编码数组
      tabs: [], // 页签对象
      activeID: "", // 激活页签编码
      config,
      left: 0,
      top: 0,
      title: "",
      showTip: false
    };
  },
  computed: {
    tabsData() {
      return this.tabs[this.activeID] || {};
    }
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      ipcRenderer.send("control-ready");
      ipcRenderer.on("tabs-update", (e, v) => {
        this.setTabIDs(v.tabs);
        this.setTabs(v.confs);
      });
      ipcRenderer.on("active-update", (e, v) => {
        this.setActiveID(v);
      });
    },
    /**
     * 动态设置tabIDs数组数据
     * @param id tab id编码
     */
    setTabIDs(id) {
      this.tabIDs = id;
    },
    /**
     * 动态设置tabs的数组数据
     * @param data tab的数据
     */
    setTabs(data) {
      this.tabs = data;
    },
    /**
     * 动态设置激活页签编码
     * @param id 激活编码
     */
    setActiveID(id) {
      this.activeID = id;
    },
    /**
     * 切换tab
     * @param id tabid编码
     */
    switchTab(id) {
      control.sendSwitchTab && control.sendSwitchTab(ipcRenderer, id);
    },
    /**
     * 关闭tab
     * @param id tabid编码
     */
    closeTab(e, id) {
      e.stopPropagation();
      if (this.tabIDs.length > 1) {
        control.sendCloseTab && control.sendCloseTab(ipcRenderer, id);
      } else {
        ipcRenderer.send("window-closed");
      }
      this.showTip = false;
    },
    /**
     * 新建tab
     */
    newTab() {
      control.sendNewTab(ipcRenderer);
    },
    /**
     * 监听url变化
     * @param e 事件对象
     */
    onUrlChange(e) {
      const v = e.target.value;
      control.sendChangeURL && control.sendChangeURL(ipcRenderer, v);
    },
    /**
     * 监听输入框按下事件
     * @param e 事件对象
     */
    onPressEnter(e) {
      if (e.keyCode !== 13) return;
      const v = e.target.value.trim();
      if (!v) return;

      let href = v;
      if (!/^.*?:\/\//.test(v)) {
        href = `http://${v}`;
      }
      control.sendEnterURL && control.sendEnterURL(ipcRenderer, href);
    },
    /**
     * 后退动作
     */
    canGoBack() {
      control.sendGoBack && control.sendGoBack(ipcRenderer);
    },
    /**
     * 向前动作
     */
    canGoForward() {
      control.sendGoForward && control.sendGoForward(ipcRenderer);
    },
    /**
     * 刷新/停止刷新动作
     */
    reloadHandle() {
      if (this.tabsData.isLoading) {
        control.sendStop && control.sendStop(ipcRenderer);
      } else {
        control.sendReload && control.sendReload(ipcRenderer);
      }
    },
    tipsHandler(flag, event) {
      console.log(flag, event);
      let { offsetHeight, offsetTop, offsetLeft, offsetWidth } = event.target;
      console.log(
        offsetHeight,
        "-",
        offsetTop,
        "-",
        offsetLeft,
        "-",
        offsetWidth
      );
      this.left = offsetLeft;
      this.top = offsetTop + offsetHeight;
      this.title = event.target.querySelector(".title-content").innerHTML;
      this.showTip = flag;
      console.log(event.target.querySelector(".title-content").innerHTML);
    }
  }
};
</script>
<style>
@import url("./assets/app.css");
</style>
