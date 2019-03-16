module.exports = {
  type: 'react-component',
  npm: {
    esModules: false
  },
    webpack: {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [ 'style-loader', 'css-loader' ]
                }
            ]
        }
    }
}
