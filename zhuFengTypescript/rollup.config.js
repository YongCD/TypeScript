import typescript from "rollup-plugin-typescript2"
import resolve from "@rollup/plugin-node-resolve"
import serve from "rollup-plugin-serve"

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/bundle.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/bundle.esm.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "dist/bundle.umd.js",
      format: "umd",
      name: "MyLibrary", // 在 UMD 模式下，需要一个全局变量名
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    typescript({
      clean: true,
    }),
    serve({
      open: true,
      contentBase: ["dist", "."], // 服务的根目录
      port: 8080,
    }),
  ],
}
