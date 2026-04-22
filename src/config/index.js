// config/index.js
import dev from './dev'
import prod from './prod'

const env = import.meta.env.MODE

const configMap = {
    development: dev,
    production: prod
}

export default configMap[env]