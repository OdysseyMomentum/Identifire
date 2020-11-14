/**
 * Metro Bundler configuration
 * https://facebook.github.io/metro/docs/en/configuration
 *
 * eslint-env node, es6
 */

const blacklist = require('metro-config/src/defaults/blacklist');
const getWorkspaces = require('get-yarn-workspaces');
const path = require('path');

function getConfig(appDir, options = {}) {
  const workspaces = getWorkspaces(appDir);

  // Add additional Yarn workspace package roots to the module map
  // https://bit.ly/2LHHTP0
  const watchFolders = [
    path.resolve(appDir, '..', '..', 'node_modules'),
    ...workspaces.filter((workspaceDir) => !(workspaceDir === appDir)),
  ];
  const extraNodeModules = [
    'react-native',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'reanimated-bottom-sheet',
    'galio-framework',
    'expo-status-bar',
    'react-native-maps',
    'expo-location',
    'expo-application',
    'expo-permissions',
    'expo-notifications',
    'core-js',
    'expo-constants',
    'react-native-maps-directions',
    '@react-navigation/native',
    '@react-navigation/stack',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-screens',
    'react-native-safe-area-context',
    '@react-native-community/masked-view',
    'react-native-dotenv',
    '@react-native-community/async-storage',
  ].reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: path.resolve(appDir, 'node_modules', curr),
    }),
    {}
  );

  return {
    watchFolders,
    resolver: {
      blacklistRE: blacklist([
        // Ignore other resolved react-native installations outside of
        // myapp-native - this prevents a module naming collision when mapped.
        /^((?!mobile-app).)+[\/\\]node_modules[/\\]react-native[/\\].*/,

        // Ignore react-native-svg dependency in myapp-ui, mapped below.
        // react-native-svg must only be included once due to a side-effect. It
        // has not been hoisted as it requires native module linking here.
        // http://bit.ly/2LJ7V4b
        // /myapp-ui[\/\\]node_modules[/\\]react-native-svg[/\\].*/,
      ]),
      extraNodeModules,
    },
  };
}

module.exports = getConfig(__dirname);
