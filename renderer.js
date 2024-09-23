const information = document.getElementById('info')
const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
const btn = document.getElementById('btnfile')
const filePathElement = document.getElementById('filePath')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.electronAPI.setTitle(title)
})
// 打开文件

btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})