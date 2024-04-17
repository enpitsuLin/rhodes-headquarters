import { devtools } from '@vue/devtools'

if (import.meta.env.ENABLE_DEVTOOL)
  devtools.connect()
