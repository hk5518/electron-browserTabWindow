"use strict";

import { app, protocol, Menu, screen, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const config = require("./config/index");
const BrowserTabWindow = require("./libs/main/browserTabWindow");
const { contextMenu, controlContextMenu } = require("./libs/main/contextMenu");

const isDevelopment = process.env.NODE_ENV !== "production";

Menu.setApplicationMenu(null);

let browser;

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  let controlPanel = "";
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    controlPanel = process.env.WEBPACK_DEV_SERVER_URL;
  } else {
    createProtocol("app");
    controlPanel = "app://./index.html";
  }
  let { width, height } = screen.getPrimaryDisplay().workAreaSize;
  browser = new BrowserTabWindow({
    width,
    height,
    controlPanel,
    startPage: config.startPage,
    blankTitle: config.blankTitle
  });

  browser.on("closed", () => {
    browser = null;
  });

  browser.on("contextMenu", ({ win, webContents, params, e }) => {
    contextMenu(webContents, e).popup(win, params.x, params.y);
  });

  browser.on("controlContextMenu", ({ win, webContents, params, e }) => {
    controlContextMenu(webContents, e).popup(win, params.x, params.y);
  });
}

ipcMain.on("window-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (browser === null) {
    createWindow();
  }
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
