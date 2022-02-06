import { copySync } from 'fs-extra'

;(async () => {
  copySync('src/public/', 'dist/public/')
})()
