module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: {},
    "postcss-preset-env": {
      features: { "nesting-rules": false },
    },
    autoprefixer: {},
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        "mantine-breakpoint-xs": "36em",
        "mantine-breakpoint-sm": "48em",
        "mantine-breakpoint-md": "62em",
        "mantine-breakpoint-lg": "75em",
        "mantine-breakpoint-xl": "88em",
      },
    },
  },
};
