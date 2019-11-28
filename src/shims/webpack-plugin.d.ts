declare module '*-webpack-plugin' {
  import { Plugin } from 'webpack';
  class WebpackPlugin extends Plugin {
    constructor(options?: {});
  }
  export = WebpackPlugin;
}
