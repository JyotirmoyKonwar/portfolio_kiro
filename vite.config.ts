import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react', 'react-icons'],
          
          // Feature chunks
          'analytics': ['./src/components/Analytics/AnalyticsDashboard.tsx'],
          'projects': ['./src/components/Projects/Projects.tsx'],
          'research': ['./src/components/Research/Research.tsx'],
          'skills': ['./src/components/Skills/Skills.tsx'],
          'contact': ['./src/components/Contact/Contact.tsx']
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true,
    // Minify for production
    minify: 'terser'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'react-helmet-async'
    ]
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false
    }
  }
})
