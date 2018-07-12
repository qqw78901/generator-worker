module.exports = ( { file, options, env } ) => ( {
    // parser: file.extname === '.sss' ? 'sugarss' : false,
    plugins: {
      'postcss-assets': {
        loadPaths: ['./src/images'],
        relative: true
      },
      'autoprefixer': {}
    }
  });