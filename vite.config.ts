import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    svgr(),
    nitro({
      preset: 'vercel',
    }),
  ],
  environments: {
    ssr: {},
  },
})

export default config

// Todo:
// Experience on pdf uses profile address as location
// Resume not limited to 1 page
// KanbanBoard items are not responsive(has fixed width)
// Textare default rowCount not working
