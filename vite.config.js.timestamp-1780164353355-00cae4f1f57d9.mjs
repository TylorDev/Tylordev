// vite.config.js
import { defineConfig } from "file:///C:/Users/Jimbo/Desktop/Portafolio/Tylordev/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Jimbo/Desktop/Portafolio/Tylordev/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "node:path";
var __vite_injected_original_dirname = "C:\\Users\\Jimbo\\Desktop\\Portafolio\\Tylordev";
function testContentWatcher() {
  var testContentPattern = "public/Test/**/*.{md,json}";
  return {
    name: "test-content-watcher",
    apply: "serve",
    configureServer: function(server) {
      server.watcher.add(testContentPattern);
      var notify = function(filePath) {
        var normalized = filePath.replace(/\\/g, "/");
        if (!normalized.includes("/public/Test/"))
          return;
        if (!/\.(md|json)$/i.test(normalized))
          return;
        server.ws.send({
          type: "custom",
          event: "test-content:update",
          data: { path: normalized }
        });
      };
      server.watcher.on("add", notify);
      server.watcher.on("change", notify);
      server.watcher.on("unlink", notify);
    }
  };
}
var vite_config_default = defineConfig({
  base: "/",
  plugins: [react(), testContentWatcher()],
  resolve: {
    alias: { "@": path.resolve(__vite_injected_original_dirname, "src") }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        additionalData: '@use "@/styles/_tokens.scss" as *;'
      }
    }
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          form: ["react-hook-form"],
          icons: ["react-icons"]
        }
      }
    }
  },
  server: { port: 5173, open: true }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKaW1ib1xcXFxEZXNrdG9wXFxcXFBvcnRhZm9saW9cXFxcVHlsb3JkZXZcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEppbWJvXFxcXERlc2t0b3BcXFxcUG9ydGFmb2xpb1xcXFxUeWxvcmRldlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvSmltYm8vRGVza3RvcC9Qb3J0YWZvbGlvL1R5bG9yZGV2L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5mdW5jdGlvbiB0ZXN0Q29udGVudFdhdGNoZXIoKSB7XG4gICAgdmFyIHRlc3RDb250ZW50UGF0dGVybiA9IFwicHVibGljL1Rlc3QvKiovKi57bWQsanNvbn1cIjtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcInRlc3QtY29udGVudC13YXRjaGVyXCIsXG4gICAgICAgIGFwcGx5OiBcInNlcnZlXCIsXG4gICAgICAgIGNvbmZpZ3VyZVNlcnZlcjogZnVuY3Rpb24gKHNlcnZlcikge1xuICAgICAgICAgICAgc2VydmVyLndhdGNoZXIuYWRkKHRlc3RDb250ZW50UGF0dGVybik7XG4gICAgICAgICAgICB2YXIgbm90aWZ5ID0gZnVuY3Rpb24gKGZpbGVQYXRoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWQgPSBmaWxlUGF0aC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5vcm1hbGl6ZWQuaW5jbHVkZXMoXCIvcHVibGljL1Rlc3QvXCIpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKCEvXFwuKG1kfGpzb24pJC9pLnRlc3Qobm9ybWFsaXplZCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIud3Muc2VuZCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY3VzdG9tXCIsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcInRlc3QtY29udGVudDp1cGRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBwYXRoOiBub3JtYWxpemVkIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc2VydmVyLndhdGNoZXIub24oXCJhZGRcIiwgbm90aWZ5KTtcbiAgICAgICAgICAgIHNlcnZlci53YXRjaGVyLm9uKFwiY2hhbmdlXCIsIG5vdGlmeSk7XG4gICAgICAgICAgICBzZXJ2ZXIud2F0Y2hlci5vbihcInVubGlua1wiLCBub3RpZnkpO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIGJhc2U6IFwiL1wiLFxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCB0ZXN0Q29udGVudFdhdGNoZXIoKV0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczogeyBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIikgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgICAgICAgYXBpOiBcIm1vZGVyblwiLFxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBcIkB1c2UgXFxcIkAvc3R5bGVzL190b2tlbnMuc2Nzc1xcXCIgYXMgKjtcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICAgICAgICAgICByZWFjdDogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJyZWFjdC1yb3V0ZXItZG9tXCJdLFxuICAgICAgICAgICAgICAgICAgICBmb3JtOiBbXCJyZWFjdC1ob29rLWZvcm1cIl0sXG4gICAgICAgICAgICAgICAgICAgIGljb25zOiBbXCJyZWFjdC1pY29uc1wiXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjogeyBwb3J0OiA1MTczLCBvcGVuOiB0cnVlIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsU0FBUyxvQkFBb0I7QUFDelYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUd6QyxTQUFTLHFCQUFxQjtBQUMxQixNQUFJLHFCQUFxQjtBQUN6QixTQUFPO0FBQUEsSUFDSCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxpQkFBaUIsU0FBVSxRQUFRO0FBQy9CLGFBQU8sUUFBUSxJQUFJLGtCQUFrQjtBQUNyQyxVQUFJLFNBQVMsU0FBVSxVQUFVO0FBQzdCLFlBQUksYUFBYSxTQUFTLFFBQVEsT0FBTyxHQUFHO0FBQzVDLFlBQUksQ0FBQyxXQUFXLFNBQVMsZUFBZTtBQUNwQztBQUNKLFlBQUksQ0FBQyxnQkFBZ0IsS0FBSyxVQUFVO0FBQ2hDO0FBQ0osZUFBTyxHQUFHLEtBQUs7QUFBQSxVQUNYLE1BQU07QUFBQSxVQUNOLE9BQU87QUFBQSxVQUNQLE1BQU0sRUFBRSxNQUFNLFdBQVc7QUFBQSxRQUM3QixDQUFDO0FBQUEsTUFDTDtBQUNBLGFBQU8sUUFBUSxHQUFHLE9BQU8sTUFBTTtBQUMvQixhQUFPLFFBQVEsR0FBRyxVQUFVLE1BQU07QUFDbEMsYUFBTyxRQUFRLEdBQUcsVUFBVSxNQUFNO0FBQUEsSUFDdEM7QUFBQSxFQUNKO0FBQ0o7QUFDQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixNQUFNO0FBQUEsRUFDTixTQUFTLENBQUMsTUFBTSxHQUFHLG1CQUFtQixDQUFDO0FBQUEsRUFDdkMsU0FBUztBQUFBLElBQ0wsT0FBTyxFQUFFLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUssRUFBRTtBQUFBLEVBQ2pEO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDRCxxQkFBcUI7QUFBQSxNQUNqQixNQUFNO0FBQUEsUUFDRixLQUFLO0FBQUEsUUFDTCxnQkFBZ0I7QUFBQSxNQUNwQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDWCxRQUFRO0FBQUEsUUFDSixjQUFjO0FBQUEsVUFDVixPQUFPLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ2hELE1BQU0sQ0FBQyxpQkFBaUI7QUFBQSxVQUN4QixPQUFPLENBQUMsYUFBYTtBQUFBLFFBQ3pCO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRLEVBQUUsTUFBTSxNQUFNLE1BQU0sS0FBSztBQUNyQyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
