const config = require("../../config/index");
const { clipboard, Menu } = require("electron");

const contextMenuTemplate = (webContents, e) => {
  let menuData = [
    {
      label: "复制",
      flag: "copy",
      enabled: true,
      accelerator: "Ctrl+C",
      click() {
        console.log("copy", e);
        webContents.copy();
      }
    },
    {
      label: "粘贴",
      flag: "paste",
      enabled: true,
      accelerator: "Ctrl+V",
      click() {
        console.log("paste");
        console.log(clipboard.readText(), "-----");
        webContents.paste();
      }
    },
    {
      type: "separator"
    },
    {
      label: "剪切",
      flag: "cut",
      enabled: true,
      accelerator: "Ctrl+X",
      click() {
        console.log("cut");
        webContents.cut();
      }
    },
    {
      type: "separator"
    },
    {
      label: "刷新",
      flag: "reload",
      enabled: true,
      // accelerator: "CmdOrCtrl+R",
      click() {
        console.log("reload刷新页面!");
        webContents.reload();
      }
    }
    // {
    //   label: "调试",
    //   flag: "devTools",
    //   enabled: true,
    //   // accelerator: 'CmdOrCtrl+R',
    //   click() {
    //     webContents.openDevTools({ mode: "bottom" });
    //   }
    // }
  ];

  if (config.devTools) {
    menuData.push({
      label: "调试",
      flag: "devTools",
      enabled: true,
      // accelerator: 'CmdOrCtrl+R',
      click() {
        webContents.openDevTools({ mode: "bottom" });
      }
    })
  }

  // 判断剪切板是否有数据
  // if (!clipboard.readText()) {
  //   menuData.forEach(item => {
  //     if (item.flag === "paste") {
  //       item.enabled = false;
  //     }
  //   });
  // }

  return menuData;
};

const contextMenu = (webContents, e) => {
  return Menu.buildFromTemplate(contextMenuTemplate(webContents, e));
};

const controlContextMenu = (webContents, e) => {
  return Menu.buildFromTemplate([
    {
      label: "复制",
      flag: "copy",
      enabled: true,
      accelerator: "Ctrl+C",
      click() {
        console.log("copy", e);
        webContents.copy();
      }
    }
  ]);
}

module.exports = {
  contextMenu,
  controlContextMenu
};
