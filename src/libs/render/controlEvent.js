/**
 * 键盘回车事件
 * @param {string} url url地址
 */
const sendEnterURL = (ipcRenderer, url) => ipcRenderer.send("url-enter", url);

/**
 * url改变事件
 * @param {string} url url地址
 */
const sendChangeURL = (ipcRenderer, url) => ipcRenderer.send("url-change", url);

const sendAct = (ipcRenderer, actName) => {
  ipcRenderer.send("act", actName);
};

/**
 * 后退事件
 */
const sendGoBack = ipcRenderer => sendAct(ipcRenderer, "goBack");

/**
 * 向前事件
 */
const sendGoForward = ipcRenderer => sendAct(ipcRenderer, "goForward");

/**
 * 重新加载事件
 * @param {*} ipcRenderer
 */
const sendReload = ipcRenderer => sendAct(ipcRenderer, "reload");

/**
 * 停止加载事件
 * @param {*} ipcRenderer
 */
const sendStop = ipcRenderer => sendAct(ipcRenderer, "stop");

/**
 * 关闭tab事件
 * @param {string} id tab
 */
const sendCloseTab = (ipcRenderer, id) => ipcRenderer.send("close-tab", id);

/**
 * 创建tab事件
 * @param {object} [ipcRenderer]
 * @param {string} [url]
 * @param {object} [references]
 */
const sendNewTab = (ipcRenderer, url, references) =>
  ipcRenderer.send("new-tab", url, references);

/**
 * 切换tab事件
 * @param {string} id
 */
const sendSwitchTab = (ipcRenderer, id) => ipcRenderer.send("switch-tab", id);

export default {
  sendEnterURL,
  sendChangeURL,
  sendGoBack,
  sendGoForward,
  sendReload,
  sendStop,
  sendNewTab,
  sendSwitchTab,
  sendCloseTab
};
