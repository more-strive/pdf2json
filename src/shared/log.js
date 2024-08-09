import fs from "fs";
const logPath = "log.txt"

if (fs.existsSync(logPath)) {
  fs.rmSync(logPath)
}
// 创建写入流
let logStream = fs.createWriteStream(logPath, { flags: 'a' });

// const _logFunction = console.log
const isDebug = true
console.log = function (...args) {
  if (isDebug) {
    logStream.write(args.join(' ') + '\n');
  }
}

export function changeLogPath(lp) {
  if (logStream) {
    logStream.on("finish", () => {
      console.warn("log finish")
    })
    logStream.on("error", (err) => {
      console.warn("log err", err)
    })
    logStream.end()
    logStream.close()
  }
  if (fs.existsSync(lp)) {
    fs.rmSync(lp)
  }
  logStream = fs.createWriteStream(lp, { flags: 'a' });
}