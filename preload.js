const { contextBridge, ipcRenderer } = require("electron");
// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
// const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 除函数之外，我们也可以暴露变量
});
// 设置标题
contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.send("set-title", title),
  //   打开文件
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
});

ipcRenderer.on("asynchronous-reply", (_event, arg) => {
  console.log(30, arg); // 在 DevTools 控制台中打印“pong”
});
ipcRenderer.send("asynchronous-message", "ping");
// 使用预加载脚本中的 contextBridge 和 ipcRenderer 模块向渲染器进程暴露 IPC 功能
contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateCounter: (callback) => ipcRenderer.on("update-counter", callback),
});
