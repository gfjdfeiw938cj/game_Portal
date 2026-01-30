import { defineConfig } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        rulesGame: path.resolve(__dirname, './src/games/tagGame/pages/rulesGame.html'),
        recordGame: path.resolve(__dirname, './src/games/tagGame/pages/recordGame.html'),
        tagGame: path.resolve(__dirname, './src/games/tagGame/pages/tagGame.html'),
        mainMenu: path.resolve(__dirname, 'src/games/tagGame/mainMenu.html'),
        ticTacToe: path.resolve(__dirname, './src/games/Tic-tac-toe/Tic-tac-toe.html'),
        index: path.resolve(__dirname, './src/index.html'),
        retroGame: path.resolve(__dirname, './src/games/retroGame/retroGame.html'),
        tangram: path.resolve(__dirname, './src/games/tangram/tangram.html'),
        HomePage: path.resolve(__dirname, './src/games/memory/HomePage.html'),
        PlayPage: path.resolve(__dirname, './src/games/memory/PlayPage.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    outDir: 'build',
    emptyOutDir: true,
  },
  server: {
    port: parseInt(process.env.VITE_PORT) || 5173,
    open: 'src/index.html',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@contact': path.resolve(__dirname, 'src/pages/contact')
    },
  },
});