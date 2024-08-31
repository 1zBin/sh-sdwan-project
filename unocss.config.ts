import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  safelist: [],
  presets: [
    presetUno(), // UnoCSS 的基本预设
    presetAttributify(), // 属性化模式，允许直接在 HTML 元素中使用样式属性，而无需输入类名。
    presetTypography(), // 提供了一些排版相关的样式预设，用于管理文本样式。
    presetIcons({
      // 提供了图标相关的功能，可以配置图标的缩放比例和警告选项。
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      // 提供了 Web 字体相关的功能，可以配置不同字体族的使用。
      fonts: {
        sans: "DM Sans",
        serif: "DM Serif Display",
        mono: "DM Mono",
      },
    }),
  ],
  // transformerDirectives(): 用于处理 UnoCSS 的指令，可能用于自定义样式处理。
  // transformerVariantGroup(): 用于处理 UnoCSS 的变体组，可能用于自定义样式变体。
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
