export const files = [...Deno.readDirSync("./")];

const REP1 = `Object.keys(tfjsCore).forEach(function (k) {
    if (k !== 'default') Object.defineProperty(exports, k, {
        enumerable: true,
        get: function () {
            return tfjsCore[k];
        }
    });
});`;
const REP2 = `Object.keys(tfjsLayers).forEach(function (k) {
    if (k !== 'default') Object.defineProperty(exports, k, {
        enumerable: true,
        get: function () {
            return tfjsLayers[k];
        }
    });
});`;
const REP3 = `Object.keys(tfjsConverter).forEach(function (k) {
    if (k !== 'default') Object.defineProperty(exports, k, {
        enumerable: true,
        get: function () {
            return tfjsConverter[k];
        }
    });
});`;
const REP4 = `function env() {
    return exports.ENV;
}
export { null as ENV };
function setEnvironmentGlobal(environment) {
// export { environment as ENV };
}`;

const replaces: [string, string][] = [
  [
    "Object.defineProperty(exports, '__esModule', { value: true });",
    "// Object.defineProperty(exports, '__esModule', { value: true });",
  ],
  [
    "var tfjsCore = require('@tensorflow/tfjs-core');",
    'import * as tfjsCore from "./tf-core.node.js";',
  ],
  [
    "var seedrandom = require('seedrandom');",
    'import seedrandom from "https://esm.sh/seedrandom";',
  ],
  [
    "var tfOps = require('@tensorflow/tfjs-core');",
    'import * as tfOps from "./tf-core.node.js";',
  ],
  [
    "var tf = require('@tensorflow/tfjs-core');",
    'import * as tf from "./tf-core.node.js";',
  ],
  [
    "var tfc = require('@tensorflow/tfjs-core');",
    'import * as tfc from "./tf-core.node.js";',
  ],
  [
    "var LongExports = require('long');",
    'import * as LongExports from "https://esm.sh/long";',
  ],
  [
    "var tfjsLayers = require('@tensorflow/tfjs-layers');",
    'import * as tfjsLayers from "./tf-layers.node.js";',
  ],
  [
    "var tfjsConverter = require('@tensorflow/tfjs-converter');",
    'import * as tfjsConverter from "./tf-converter.node.js";',
  ],
  [
    "var tfjsData = require('@tensorflow/tfjs-data');",
    'import * as tfjsData from "./tf-data.node.js";',
  ],
  [
    "var tfjsBackendCpu = require('@tensorflow/tfjs-backend-cpu');",
    'import * as tfjsBackendCpu from "./tf-backend-cpu.node.js";',
  ],
  [
    "var tfjsBackendWebgl = require('@tensorflow/tfjs-backend-webgl');",
    'import * as tfjsBackendWebgl from "./tf-backend-webgl.node.js";',
  ],
  [
    "function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }",
    "// [[removed _interopDefault]]",
  ],
  [
    "var LongExports__default = _interopDefault(LongExports);",
    'import LongExports__default from "https://esm.sh/long";',
  ],
  [
    REP1,
    "export * from './tf-core.node.js';",
  ],
  [
    REP2,
    "export * from './tf-layers.node.js';",
  ],
  [
    REP3,
    "export * from './tf-converter.node.js';",
  ],
  [
    REP4,
    `let __env;
function env() {
	return __env;
}
export { __env as ENV };
function setEnvironmentGlobal(environment) {
	__env = environment;
}`,
  ],
];

for (const file of files) {
  if (!file.isFile) continue;
  if (!file.name.endsWith(".js")) continue;

  console.log(`Transform ${file.name}`);
  let data = Deno.readTextFileSync(file.name).replaceAll("\r\n", "\n");

  data = data.replaceAll(
    /( +)exports.([a-zA-Z0-9_$]+) = ([a-zA-Z0-9_$]+);/g,
    "// export { $3 as $2 };", // not supported rn
  );

  data = data.replaceAll(
    /exports.([a-zA-Z0-9_$]+) = ([a-zA-Z0-9_$]+);/g,
    "export { $2 as $1 };",
  );

  for (const replace of replaces) {
    data = data.replaceAll(
      replace[0].replaceAll("\r\n", "\n"),
      replace[1].replaceAll("\r\n", "\n"),
    );
  }

  Deno.writeTextFileSync(file.name, data);
}
