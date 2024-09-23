// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

// 打开文件
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}
const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    icon: __dirname + "/icon/hanbao.png", // 替换tu
  });
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => mainWindow.webContents.send("update-counter", -1),
          label: "Decrement",
        },
      ],
    },
  ]);
  mainWindow.loadURL("https://github.com");
  const contents = mainWindow.webContents;
  console.log(contents);
  

  Menu.setApplicationMenu(menu);
  // 加载 index.html
  mainWindow.loadFile("index.html");

  // 打开开发工具
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("before-reload", (event) => {
    // 自动刷新项目
    mainWindow.webContents.reload();
  });

  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });
};
function handleSetTitle(event, title) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  ipcMain.on("set-title", handleSetTitle);
  createWindow();
  //   打开文件
  ipcMain.handle("dialog:openFile", handleFileOpen);
  app.on("activate", () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。

ipcMain.on("asynchronous-message", (event, arg) => {
  console.log(78, arg); // 在 Node 控制台中打印“ping”
  // 作用如同 `send`，但返回一个消息
  // 到发送原始消息的渲染器
  event.reply("asynchronous-reply", "pong");
});
