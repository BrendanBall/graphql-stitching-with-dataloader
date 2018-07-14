module.exports = {
  extends: 'standard',
  plugins: [
    'babel',
    'standard',
    'promise',
    'graphql'
  ],
  env: {
    jest: true,
    node: true
  }
}
