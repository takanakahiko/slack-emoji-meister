const { resolve } = require('path')
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin')

module.exports = {
  webpack: (config ) => {
    // Add typescript loader. supports .ts and .tsx files as entry points
    config.resolve.extensions.push('.ts')
    config.resolve.extensions.push('.tsx')
    config.entry = GlobEntriesPlugin.getEntries(
      [
        resolve('app', '*.{js,mjs,jsx,ts,tsx}'),
        resolve('app', '?(scripts)/*.{js,mjs,jsx,ts,tsx}')
      ]
    )
    config.module.rules.push({
      test: /\.tsx?$/,
      loader: 'ts-loader'
    })

    // Important: return the modified config
    return config;
  },
  copyIgnore: [ '**/*.js', '**/*.json', '**/*.ts', '**/*.tsx' ]
}
