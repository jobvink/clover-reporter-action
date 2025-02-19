'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var fs__default = _interopDefault(fs);
var os = _interopDefault(require('os'));
var path = _interopDefault(require('path'));
var Stream = _interopDefault(require('stream'));
var http = _interopDefault(require('http'));
var Url = _interopDefault(require('url'));
var https = _interopDefault(require('https'));
var zlib = _interopDefault(require('zlib'));
var child_process = _interopDefault(require('child_process'));
var assert = _interopDefault(require('assert'));
var events = _interopDefault(require('events'));
var util = _interopDefault(require('util'));
var string_decoder = _interopDefault(require('string_decoder'));
var timers = _interopDefault(require('timers'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var utils = createCommonjsModule(function (module, exports) {
// We use any as a valid input type
	/* eslint-disable @typescript-eslint/no-explicit-any */
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Sanitizes an input into a string so it can be passed into issueCommand safely
	 * @param input input to sanitize into a string
	 */
	function toCommandValue(input) {
		if (input === null || input === undefined) {
			return '';
		}
		else if (typeof input === 'string' || input instanceof String) {
			return input;
		}
		return JSON.stringify(input);
	}
	exports.toCommandValue = toCommandValue;

});

unwrapExports(utils);
var utils_1 = utils.toCommandValue;

var command = createCommonjsModule(function (module, exports) {
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
		result["default"] = mod;
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	const os$1 = __importStar(os);

	/**
	 * Commands
	 *
	 * Command Format:
	 *   ::name key=value,key=value::message
	 *
	 * Examples:
	 *   ::warning::This is the message
	 *   ::set-env name=MY_VAR::some value
	 */
	function issueCommand(command, properties, message) {
		const cmd = new Command(command, properties, message);
		process.stdout.write(cmd.toString() + os$1.EOL);
	}
	exports.issueCommand = issueCommand;
	function issue(name, message = '') {
		issueCommand(name, {}, message);
	}
	exports.issue = issue;
	const CMD_STRING = '::';
	class Command {
		constructor(command, properties, message) {
			if (!command) {
				command = 'missing.command';
			}
			this.command = command;
			this.properties = properties;
			this.message = message;
		}
		toString() {
			let cmdStr = CMD_STRING + this.command;
			if (this.properties && Object.keys(this.properties).length > 0) {
				cmdStr += ' ';
				let first = true;
				for (const key in this.properties) {
					if (this.properties.hasOwnProperty(key)) {
						const val = this.properties[key];
						if (val) {
							if (first) {
								first = false;
							}
							else {
								cmdStr += ',';
							}
							cmdStr += `${key}=${escapeProperty(val)}`;
						}
					}
				}
			}
			cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
			return cmdStr;
		}
	}
	function escapeData(s) {
		return utils.toCommandValue(s)
			.replace(/%/g, '%25')
			.replace(/\r/g, '%0D')
			.replace(/\n/g, '%0A');
	}
	function escapeProperty(s) {
		return utils.toCommandValue(s)
			.replace(/%/g, '%25')
			.replace(/\r/g, '%0D')
			.replace(/\n/g, '%0A')
			.replace(/:/g, '%3A')
			.replace(/,/g, '%2C');
	}

});

unwrapExports(command);
var command_1 = command.issueCommand;
var command_2 = command.issue;

var fileCommand = createCommonjsModule(function (module, exports) {
// For internal use, subject to change.
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
		result["default"] = mod;
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
// We use any as a valid input type
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const fs = __importStar(fs__default);
	const os$1 = __importStar(os);

	function issueCommand(command, message) {
		const filePath = process.env[`GITHUB_${command}`];
		if (!filePath) {
			throw new Error(`Unable to find environment variable for file command ${command}`);
		}
		if (!fs.existsSync(filePath)) {
			throw new Error(`Missing file at path: ${filePath}`);
		}
		fs.appendFileSync(filePath, `${utils.toCommandValue(message)}${os$1.EOL}`, {
			encoding: 'utf8'
		});
	}
	exports.issueCommand = issueCommand;

});

unwrapExports(fileCommand);
var fileCommand_1 = fileCommand.issueCommand;

var core = createCommonjsModule(function (module, exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
		function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
			function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
			function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
		result["default"] = mod;
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	const os$1 = __importStar(os);
	const path$1 = __importStar(path);
	/**
	 * The code to exit an action
	 */
	var ExitCode;
	(function (ExitCode) {
		/**
		 * A code indicating that the action was successful
		 */
		ExitCode[ExitCode["Success"] = 0] = "Success";
		/**
		 * A code indicating that the action was a failure
		 */
		ExitCode[ExitCode["Failure"] = 1] = "Failure";
	})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
	/**
	 * Sets env variable for this action and future actions in the job
	 * @param name the name of the variable to set
	 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
	 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function exportVariable(name, val) {
		const convertedVal = utils.toCommandValue(val);
		process.env[name] = convertedVal;
		const filePath = process.env['GITHUB_ENV'] || '';
		if (filePath) {
			const delimiter = '_GitHubActionsFileCommandDelimeter_';
			const commandValue = `${name}<<${delimiter}${os$1.EOL}${convertedVal}${os$1.EOL}${delimiter}`;
			fileCommand.issueCommand('ENV', commandValue);
		}
		else {
			command.issueCommand('set-env', { name }, convertedVal);
		}
	}
	exports.exportVariable = exportVariable;
	/**
	 * Registers a secret which will get masked from logs
	 * @param secret value of the secret
	 */
	function setSecret(secret) {
		command.issueCommand('add-mask', {}, secret);
	}
	exports.setSecret = setSecret;
	/**
	 * Prepends inputPath to the PATH (for this action and future actions)
	 * @param inputPath
	 */
	function addPath(inputPath) {
		const filePath = process.env['GITHUB_PATH'] || '';
		if (filePath) {
			fileCommand.issueCommand('PATH', inputPath);
		}
		else {
			command.issueCommand('add-path', {}, inputPath);
		}
		process.env['PATH'] = `${inputPath}${path$1.delimiter}${process.env['PATH']}`;
	}
	exports.addPath = addPath;
	/**
	 * Gets the value of an input.  The value is also trimmed.
	 *
	 * @param     name     name of the input to get
	 * @param     options  optional. See InputOptions.
	 * @returns   string
	 */
	function getInput(name, options) {
		const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
		if (options && options.required && !val) {
			throw new Error(`Input required and not supplied: ${name}`);
		}
		return val.trim();
	}
	exports.getInput = getInput;
	/**
	 * Sets the value of an output.
	 *
	 * @param     name     name of the output to set
	 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
	 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function setOutput(name, value) {
		command.issueCommand('set-output', { name }, value);
	}
	exports.setOutput = setOutput;
	/**
	 * Enables or disables the echoing of commands into stdout for the rest of the step.
	 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
	 *
	 */
	function setCommandEcho(enabled) {
		command.issue('echo', enabled ? 'on' : 'off');
	}
	exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
	/**
	 * Sets the action status to failed.
	 * When the action exits it will be with an exit code of 1
	 * @param message add error issue message
	 */
	function setFailed(message) {
		process.exitCode = ExitCode.Failure;
		error(message);
	}
	exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
	/**
	 * Gets whether Actions Step Debug is on or not
	 */
	function isDebug() {
		return process.env['RUNNER_DEBUG'] === '1';
	}
	exports.isDebug = isDebug;
	/**
	 * Writes debug message to user log
	 * @param message debug message
	 */
	function debug(message) {
		command.issueCommand('debug', {}, message);
	}
	exports.debug = debug;
	/**
	 * Adds an error issue
	 * @param message error issue message. Errors will be converted to string via toString()
	 */
	function error(message) {
		command.issue('error', message instanceof Error ? message.toString() : message);
	}
	exports.error = error;
	/**
	 * Adds an warning issue
	 * @param message warning issue message. Errors will be converted to string via toString()
	 */
	function warning(message) {
		command.issue('warning', message instanceof Error ? message.toString() : message);
	}
	exports.warning = warning;
	/**
	 * Writes info to log with console.log.
	 * @param message info message
	 */
	function info(message) {
		process.stdout.write(message + os$1.EOL);
	}
	exports.info = info;
	/**
	 * Begin an output group.
	 *
	 * Output until the next `groupEnd` will be foldable in this group
	 *
	 * @param name The name of the output group
	 */
	function startGroup(name) {
		command.issue('group', name);
	}
	exports.startGroup = startGroup;
	/**
	 * End an output group.
	 */
	function endGroup() {
		command.issue('endgroup');
	}
	exports.endGroup = endGroup;
	/**
	 * Wrap an asynchronous function call in a group.
	 *
	 * Returns the same type as the function itself.
	 *
	 * @param name The name of the group
	 * @param fn The function to wrap in the group
	 */
	function group(name, fn) {
		return __awaiter(this, void 0, void 0, function* () {
			startGroup(name);
			let result;
			try {
				result = yield fn();
			}
			finally {
				endGroup();
			}
			return result;
		});
	}
	exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
	/**
	 * Saves state for current action, the state can only be retrieved by this action's post job execution.
	 *
	 * @param     name     name of the state to store
	 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
	 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function saveState(name, value) {
		command.issueCommand('save-state', { name }, value);
	}
	exports.saveState = saveState;
	/**
	 * Gets the value of an state set by this action's main execution.
	 *
	 * @param     name     name of the state to get
	 * @returns   string
	 */
	function getState(name) {
		return process.env[`STATE_${name}`] || '';
	}
	exports.getState = getState;

});

var core$1 = unwrapExports(core);
var core_1 = core.ExitCode;
var core_2 = core.exportVariable;
var core_3 = core.setSecret;
var core_4 = core.addPath;
var core_5 = core.getInput;
var core_6 = core.setOutput;
var core_7 = core.setCommandEcho;
var core_8 = core.setFailed;
var core_9 = core.isDebug;
var core_10 = core.debug;
var core_11 = core.error;
var core_12 = core.warning;
var core_13 = core.info;
var core_14 = core.startGroup;
var core_15 = core.endGroup;
var core_16 = core.group;
var core_17 = core.saveState;
var core_18 = core.getState;

var isPlainObject_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

	function isObject(o) {
		return Object.prototype.toString.call(o) === '[object Object]';
	}

	function isPlainObject(o) {
		var ctor,prot;

		if (isObject(o) === false) return false;

		// If has modified constructor
		ctor = o.constructor;
		if (ctor === undefined) return true;

		// If has modified prototype
		prot = ctor.prototype;
		if (isObject(prot) === false) return false;

		// If constructor does not have an Object-specific method
		if (prot.hasOwnProperty('isPrototypeOf') === false) {
			return false;
		}

		// Most likely a plain Object
		return true;
	}

	exports.isPlainObject = isPlainObject;
});

unwrapExports(isPlainObject_1);
var isPlainObject_2 = isPlainObject_1.isPlainObject;

var distNode = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function getUserAgent() {
		if (typeof navigator === "object" && "userAgent" in navigator) {
			return navigator.userAgent;
		}

		if (typeof process === "object" && "version" in process) {
			return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
		}

		return "<environment undetectable>";
	}

	exports.getUserAgent = getUserAgent;

});

unwrapExports(distNode);
var distNode_1 = distNode.getUserAgent;

var distNode$1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });




	function lowercaseKeys(object) {
		if (!object) {
			return {};
		}

		return Object.keys(object).reduce((newObj, key) => {
			newObj[key.toLowerCase()] = object[key];
			return newObj;
		}, {});
	}

	function mergeDeep(defaults, options) {
		const result = Object.assign({}, defaults);
		Object.keys(options).forEach(key => {
			if (isPlainObject_1.isPlainObject(options[key])) {
				if (!(key in defaults)) Object.assign(result, {
					[key]: options[key]
				});else result[key] = mergeDeep(defaults[key], options[key]);
			} else {
				Object.assign(result, {
					[key]: options[key]
				});
			}
		});
		return result;
	}

	function removeUndefinedProperties(obj) {
		for (const key in obj) {
			if (obj[key] === undefined) {
				delete obj[key];
			}
		}

		return obj;
	}

	function merge(defaults, route, options) {
		if (typeof route === "string") {
			let [method, url] = route.split(" ");
			options = Object.assign(url ? {
				method,
				url
			} : {
				url: method
			}, options);
		} else {
			options = Object.assign({}, route);
		} // lowercase header names before merging with defaults to avoid duplicates


		options.headers = lowercaseKeys(options.headers); // remove properties with undefined values before merging

		removeUndefinedProperties(options);
		removeUndefinedProperties(options.headers);
		const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

		if (defaults && defaults.mediaType.previews.length) {
			mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
		}

		mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
		return mergedOptions;
	}

	function addQueryParameters(url, parameters) {
		const separator = /\?/.test(url) ? "&" : "?";
		const names = Object.keys(parameters);

		if (names.length === 0) {
			return url;
		}

		return url + separator + names.map(name => {
			if (name === "q") {
				return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
			}

			return `${name}=${encodeURIComponent(parameters[name])}`;
		}).join("&");
	}

	const urlVariableRegex = /\{[^}]+\}/g;

	function removeNonChars(variableName) {
		return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
	}

	function extractUrlVariableNames(url) {
		const matches = url.match(urlVariableRegex);

		if (!matches) {
			return [];
		}

		return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
	}

	function omit(object, keysToOmit) {
		return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
			obj[key] = object[key];
			return obj;
		}, {});
	}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

	/* istanbul ignore file */
	function encodeReserved(str) {
		return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
			if (!/%[0-9A-Fa-f]/.test(part)) {
				part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
			}

			return part;
		}).join("");
	}

	function encodeUnreserved(str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return "%" + c.charCodeAt(0).toString(16).toUpperCase();
		});
	}

	function encodeValue(operator, value, key) {
		value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

		if (key) {
			return encodeUnreserved(key) + "=" + value;
		} else {
			return value;
		}
	}

	function isDefined(value) {
		return value !== undefined && value !== null;
	}

	function isKeyOperator(operator) {
		return operator === ";" || operator === "&" || operator === "?";
	}

	function getValues(context, operator, key, modifier) {
		var value = context[key],
			result = [];

		if (isDefined(value) && value !== "") {
			if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
				value = value.toString();

				if (modifier && modifier !== "*") {
					value = value.substring(0, parseInt(modifier, 10));
				}

				result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
			} else {
				if (modifier === "*") {
					if (Array.isArray(value)) {
						value.filter(isDefined).forEach(function (value) {
							result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
						});
					} else {
						Object.keys(value).forEach(function (k) {
							if (isDefined(value[k])) {
								result.push(encodeValue(operator, value[k], k));
							}
						});
					}
				} else {
					const tmp = [];

					if (Array.isArray(value)) {
						value.filter(isDefined).forEach(function (value) {
							tmp.push(encodeValue(operator, value));
						});
					} else {
						Object.keys(value).forEach(function (k) {
							if (isDefined(value[k])) {
								tmp.push(encodeUnreserved(k));
								tmp.push(encodeValue(operator, value[k].toString()));
							}
						});
					}

					if (isKeyOperator(operator)) {
						result.push(encodeUnreserved(key) + "=" + tmp.join(","));
					} else if (tmp.length !== 0) {
						result.push(tmp.join(","));
					}
				}
			}
		} else {
			if (operator === ";") {
				if (isDefined(value)) {
					result.push(encodeUnreserved(key));
				}
			} else if (value === "" && (operator === "&" || operator === "?")) {
				result.push(encodeUnreserved(key) + "=");
			} else if (value === "") {
				result.push("");
			}
		}

		return result;
	}

	function parseUrl(template) {
		return {
			expand: expand.bind(null, template)
		};
	}

	function expand(template, context) {
		var operators = ["+", "#", ".", "/", ";", "?", "&"];
		return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
			if (expression) {
				let operator = "";
				const values = [];

				if (operators.indexOf(expression.charAt(0)) !== -1) {
					operator = expression.charAt(0);
					expression = expression.substr(1);
				}

				expression.split(/,/g).forEach(function (variable) {
					var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
					values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
				});

				if (operator && operator !== "+") {
					var separator = ",";

					if (operator === "?") {
						separator = "&";
					} else if (operator !== "#") {
						separator = operator;
					}

					return (values.length !== 0 ? operator : "") + values.join(separator);
				} else {
					return values.join(",");
				}
			} else {
				return encodeReserved(literal);
			}
		});
	}

	function parse(options) {
		// https://fetch.spec.whatwg.org/#methods
		let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

		let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
		let headers = Object.assign({}, options.headers);
		let body;
		let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

		const urlVariableNames = extractUrlVariableNames(url);
		url = parseUrl(url).expand(parameters);

		if (!/^http/.test(url)) {
			url = options.baseUrl + url;
		}

		const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
		const remainingParameters = omit(parameters, omittedParameters);
		const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

		if (!isBinaryRequest) {
			if (options.mediaType.format) {
				// e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
				headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
			}

			if (options.mediaType.previews.length) {
				const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
				headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
					const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
					return `application/vnd.github.${preview}-preview${format}`;
				}).join(",");
			}
		} // for GET/HEAD requests, set URL query parameters from remaining parameters
		// for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


		if (["GET", "HEAD"].includes(method)) {
			url = addQueryParameters(url, remainingParameters);
		} else {
			if ("data" in remainingParameters) {
				body = remainingParameters.data;
			} else {
				if (Object.keys(remainingParameters).length) {
					body = remainingParameters;
				} else {
					headers["content-length"] = 0;
				}
			}
		} // default content-type for JSON if body is set


		if (!headers["content-type"] && typeof body !== "undefined") {
			headers["content-type"] = "application/json; charset=utf-8";
		} // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
		// fetch does not allow to set `content-length` header, but we can set body to an empty string


		if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
			body = "";
		} // Only return body/request keys if present


		return Object.assign({
			method,
			url,
			headers
		}, typeof body !== "undefined" ? {
			body
		} : null, options.request ? {
			request: options.request
		} : null);
	}

	function endpointWithDefaults(defaults, route, options) {
		return parse(merge(defaults, route, options));
	}

	function withDefaults(oldDefaults, newDefaults) {
		const DEFAULTS = merge(oldDefaults, newDefaults);
		const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
		return Object.assign(endpoint, {
			DEFAULTS,
			defaults: withDefaults.bind(null, DEFAULTS),
			merge: merge.bind(null, DEFAULTS),
			parse
		});
	}

	const VERSION = "6.0.8";

	const userAgent = `octokit-endpoint.js/${VERSION} ${distNode.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

	const DEFAULTS = {
		method: "GET",
		baseUrl: "https://api.github.com",
		headers: {
			accept: "application/vnd.github.v3+json",
			"user-agent": userAgent
		},
		mediaType: {
			format: "",
			previews: []
		}
	};

	const endpoint = withDefaults(null, DEFAULTS);

	exports.endpoint = endpoint;

});

unwrapExports(distNode$1);
var distNode_1$1 = distNode$1.endpoint;

var distNode$2 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function getUserAgent() {
		if (typeof navigator === "object" && "userAgent" in navigator) {
			return navigator.userAgent;
		}

		if (typeof process === "object" && "version" in process) {
			return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
		}

		return "<environment undetectable>";
	}

	exports.getUserAgent = getUserAgent;

});

unwrapExports(distNode$2);
var distNode_1$2 = distNode$2.getUserAgent;

var isPlainObject_1$1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

	function isObject(o) {
		return Object.prototype.toString.call(o) === '[object Object]';
	}

	function isPlainObject(o) {
		var ctor,prot;

		if (isObject(o) === false) return false;

		// If has modified constructor
		ctor = o.constructor;
		if (ctor === undefined) return true;

		// If has modified prototype
		prot = ctor.prototype;
		if (isObject(prot) === false) return false;

		// If constructor does not have an Object-specific method
		if (prot.hasOwnProperty('isPrototypeOf') === false) {
			return false;
		}

		// Most likely a plain Object
		return true;
	}

	exports.isPlainObject = isPlainObject;
});

unwrapExports(isPlainObject_1$1);
var isPlainObject_2$1 = isPlainObject_1$1.isPlainObject;

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
	Error.call(this, message);

	this.message = message;
	this.type = type;

	// when err.type is `system`, err.code contains system error code
	if (systemError) {
		this.code = this.errno = systemError.code;
	}

	// hide custom error implementation details from end-users
	Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		_ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
	 * Decode response as ArrayBuffer
	 *
	 * @return  Promise
	 */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
	 * Return raw response as Blob
	 *
	 * @return Promise
	 */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
				// Prevent copying
				new Blob([], {
					type: ct.toLowerCase()
				}), {
					[BUFFER]: buf
				});
		});
	},

	/**
	 * Decode response as json
	 *
	 * @return  Promise
	 */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
	 * Decode response as text
	 *
	 * @return  Promise
	 */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
	 * Decode response as buffer (non-spec api)
	 *
	 * @return  Promise
	 */
	buffer() {
		return consumeBody.call(this);
	},

	/**
	 * Decode response as text, while automatically detecting the encoding and
	 * trying to decode to UTF-8 (non-spec api)
	 *
	 * @return  Promise
	 */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
			body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
	 * Headers class
	 *
	 * @param   Object  headers  Response headers
	 * @return  Void
	 */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
	 * Return combined header value given name
	 *
	 * @param   String  name  Header name
	 * @return  Mixed
	 */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
	 * Iterate over all headers
	 *
	 * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
	 * @param   Boolean   thisArg   `this` context for callback function
	 * @return  Void
	 */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
				value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
	 * Overwrite header values given name
	 *
	 * @param   String  name   Header name
	 * @param   String  value  Header value
	 * @return  Void
	 */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
	 * Append a value onto existing header
	 *
	 * @param   String  name   Header name
	 * @param   String  value  Header value
	 * @return  Void
	 */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
	 * Check for header name existence
	 *
	 * @param   String   name  Header name
	 * @return  Boolean
	 */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
	 * Delete all header values given name
	 *
	 * @param   String  name  Header name
	 * @return  Void
	 */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
	 * Return raw headers (non-spec api)
	 *
	 * @return  Object
	 */
	raw() {
		return this[MAP];
	}

	/**
	 * Get an iterator on keys.
	 *
	 * @return  Iterator
	 */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
	 * Get an iterator on values.
	 *
	 * @return  Iterator
	 */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
	 * Get an iterator on entries.
	 *
	 * This is the default iterator of the Headers object.
	 *
	 * @return  Iterator
	 */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
			kind = _INTERNAL.kind,
			index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
	 * Convenience property representing if the request ended normally
	 */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
	 * Clone this response
	 *
	 * @return  Response
	 */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
	 * Clone this request
	 *
	 * @return  Request
	 */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
	Error.call(this, message);

	this.type = 'aborted';
	this.message = message;

	// hide custom error implementation details from end-users
	Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

var lib = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': fetch,
	Headers: Headers,
	Request: Request,
	Response: Response,
	FetchError: FetchError
});

var distNode$3 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	class Deprecation extends Error {
		constructor(message) {
			super(message); // Maintains proper stack trace (only available on V8)

			/* istanbul ignore next */

			if (Error.captureStackTrace) {
				Error.captureStackTrace(this, this.constructor);
			}

			this.name = 'Deprecation';
		}

	}

	exports.Deprecation = Deprecation;
});

unwrapExports(distNode$3);
var distNode_1$3 = distNode$3.Deprecation;

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;
function wrappy (fn, cb) {
	if (fn && cb) return wrappy(fn)(cb)

	if (typeof fn !== 'function')
		throw new TypeError('need wrapper function')

	Object.keys(fn).forEach(function (k) {
		wrapper[k] = fn[k];
	});

	return wrapper

	function wrapper() {
		var args = new Array(arguments.length);
		for (var i = 0; i < args.length; i++) {
			args[i] = arguments[i];
		}
		var ret = fn.apply(this, args);
		var cb = args[args.length-1];
		if (typeof ret === 'function' && ret !== cb) {
			Object.keys(cb).forEach(function (k) {
				ret[k] = cb[k];
			});
		}
		return ret
	}
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);

once.proto = once(function () {
	Object.defineProperty(Function.prototype, 'once', {
		value: function () {
			return once(this)
		},
		configurable: true
	});

	Object.defineProperty(Function.prototype, 'onceStrict', {
		value: function () {
			return onceStrict(this)
		},
		configurable: true
	});
});

function once (fn) {
	var f = function () {
		if (f.called) return f.value
		f.called = true;
		return f.value = fn.apply(this, arguments)
	};
	f.called = false;
	return f
}

function onceStrict (fn) {
	var f = function () {
		if (f.called)
			throw new Error(f.onceError)
		f.called = true;
		return f.value = fn.apply(this, arguments)
	};
	var name = fn.name || 'Function wrapped with `once`';
	f.onceError = name + " shouldn't be called more than once";
	f.called = false;
	return f
}
once_1.strict = strict;

var distNode$4 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }


	var once = _interopDefault(once_1);

	const logOnce = once(deprecation => console.warn(deprecation));
	/**
	 * Error with extra properties to help with debugging
	 */

	class RequestError extends Error {
		constructor(message, statusCode, options) {
			super(message); // Maintains proper stack trace (only available on V8)

			/* istanbul ignore next */

			if (Error.captureStackTrace) {
				Error.captureStackTrace(this, this.constructor);
			}

			this.name = "HttpError";
			this.status = statusCode;
			Object.defineProperty(this, "code", {
				get() {
					logOnce(new distNode$3.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
					return statusCode;
				}

			});
			this.headers = options.headers || {}; // redact request credentials without mutating original request options

			const requestCopy = Object.assign({}, options.request);

			if (options.request.headers.authorization) {
				requestCopy.headers = Object.assign({}, options.request.headers, {
					authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
				});
			}

			requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
				// see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
				.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
				// see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
				.replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
			this.request = requestCopy;
		}

	}

	exports.RequestError = RequestError;

});

unwrapExports(distNode$4);
var distNode_1$4 = distNode$4.RequestError;

var require$$0 = getCjsExportFromNamespace(lib);

var distNode$5 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }




	var nodeFetch = _interopDefault(require$$0);


	const VERSION = "5.4.9";

	function getBufferResponse(response) {
		return response.arrayBuffer();
	}

	function fetchWrapper(requestOptions) {
		if (isPlainObject_1$1.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
			requestOptions.body = JSON.stringify(requestOptions.body);
		}

		let headers = {};
		let status;
		let url;
		const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
		return fetch(requestOptions.url, Object.assign({
			method: requestOptions.method,
			body: requestOptions.body,
			headers: requestOptions.headers,
			redirect: requestOptions.redirect
		}, requestOptions.request)).then(response => {
			url = response.url;
			status = response.status;

			for (const keyAndValue of response.headers) {
				headers[keyAndValue[0]] = keyAndValue[1];
			}

			if (status === 204 || status === 205) {
				return;
			} // GitHub API returns 200 for HEAD requests


			if (requestOptions.method === "HEAD") {
				if (status < 400) {
					return;
				}

				throw new distNode$4.RequestError(response.statusText, status, {
					headers,
					request: requestOptions
				});
			}

			if (status === 304) {
				throw new distNode$4.RequestError("Not modified", status, {
					headers,
					request: requestOptions
				});
			}

			if (status >= 400) {
				return response.text().then(message => {
					const error = new distNode$4.RequestError(message, status, {
						headers,
						request: requestOptions
					});

					try {
						let responseBody = JSON.parse(error.message);
						Object.assign(error, responseBody);
						let errors = responseBody.errors; // Assumption `errors` would always be in Array format

						error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
					} catch (e) {// ignore, see octokit/rest.js#684
					}

					throw error;
				});
			}

			const contentType = response.headers.get("content-type");

			if (/application\/json/.test(contentType)) {
				return response.json();
			}

			if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
				return response.text();
			}

			return getBufferResponse(response);
		}).then(data => {
			return {
				status,
				url,
				headers,
				data
			};
		}).catch(error => {
			if (error instanceof distNode$4.RequestError) {
				throw error;
			}

			throw new distNode$4.RequestError(error.message, 500, {
				headers,
				request: requestOptions
			});
		});
	}

	function withDefaults(oldEndpoint, newDefaults) {
		const endpoint = oldEndpoint.defaults(newDefaults);

		const newApi = function (route, parameters) {
			const endpointOptions = endpoint.merge(route, parameters);

			if (!endpointOptions.request || !endpointOptions.request.hook) {
				return fetchWrapper(endpoint.parse(endpointOptions));
			}

			const request = (route, parameters) => {
				return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
			};

			Object.assign(request, {
				endpoint,
				defaults: withDefaults.bind(null, endpoint)
			});
			return endpointOptions.request.hook(request, endpointOptions);
		};

		return Object.assign(newApi, {
			endpoint,
			defaults: withDefaults.bind(null, endpoint)
		});
	}

	const request = withDefaults(distNode$1.endpoint, {
		headers: {
			"user-agent": `octokit-request.js/${VERSION} ${distNode$2.getUserAgent()}`
		}
	});

	exports.request = request;

});

unwrapExports(distNode$5);
var distNode_1$5 = distNode$5.request;

const nameMap = new Map([
	[20, ['Big Sur', '11']],
	[19, ['Catalina', '10.15']],
	[18, ['Mojave', '10.14']],
	[17, ['High Sierra', '10.13']],
	[16, ['Sierra', '10.12']],
	[15, ['El Capitan', '10.11']],
	[14, ['Yosemite', '10.10']],
	[13, ['Mavericks', '10.9']],
	[12, ['Mountain Lion', '10.8']],
	[11, ['Lion', '10.7']],
	[10, ['Snow Leopard', '10.6']],
	[9, ['Leopard', '10.5']],
	[8, ['Tiger', '10.4']],
	[7, ['Panther', '10.3']],
	[6, ['Jaguar', '10.2']],
	[5, ['Puma', '10.1']]
]);

const macosRelease = release => {
	release = Number((release || os.release()).split('.')[0]);

	const [name, version] = nameMap.get(release);

	return {
		name,
		version
	};
};

var macosRelease_1 = macosRelease;
// TODO: remove this in the next major version
var _default = macosRelease;
macosRelease_1.default = _default;

/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */
var src = function(fn) {

	try { return fn() } catch (e) {}

};

var windows = isexe;
isexe.sync = sync;



function checkPathExt (path, options) {
	var pathext = options.pathExt !== undefined ?
		options.pathExt : process.env.PATHEXT;

	if (!pathext) {
		return true
	}

	pathext = pathext.split(';');
	if (pathext.indexOf('') !== -1) {
		return true
	}
	for (var i = 0; i < pathext.length; i++) {
		var p = pathext[i].toLowerCase();
		if (p && path.substr(-p.length).toLowerCase() === p) {
			return true
		}
	}
	return false
}

function checkStat (stat, path, options) {
	if (!stat.isSymbolicLink() && !stat.isFile()) {
		return false
	}
	return checkPathExt(path, options)
}

function isexe (path, options, cb) {
	fs__default.stat(path, function (er, stat) {
		cb(er, er ? false : checkStat(stat, path, options));
	});
}

function sync (path, options) {
	return checkStat(fs__default.statSync(path), path, options)
}

var mode = isexe$1;
isexe$1.sync = sync$1;



function isexe$1 (path, options, cb) {
	fs__default.stat(path, function (er, stat) {
		cb(er, er ? false : checkStat$1(stat, options));
	});
}

function sync$1 (path, options) {
	return checkStat$1(fs__default.statSync(path), options)
}

function checkStat$1 (stat, options) {
	return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
	var mod = stat.mode;
	var uid = stat.uid;
	var gid = stat.gid;

	var myUid = options.uid !== undefined ?
		options.uid : process.getuid && process.getuid();
	var myGid = options.gid !== undefined ?
		options.gid : process.getgid && process.getgid();

	var u = parseInt('100', 8);
	var g = parseInt('010', 8);
	var o = parseInt('001', 8);
	var ug = u | g;

	var ret = (mod & o) ||
		(mod & g) && gid === myGid ||
		(mod & u) && uid === myUid ||
		(mod & ug) && myUid === 0;

	return ret
}

var core$2;
if (process.platform === 'win32' || commonjsGlobal.TESTING_WINDOWS) {
	core$2 = windows;
} else {
	core$2 = mode;
}

var isexe_1 = isexe$2;
isexe$2.sync = sync$2;

function isexe$2 (path, options, cb) {
	if (typeof options === 'function') {
		cb = options;
		options = {};
	}

	if (!cb) {
		if (typeof Promise !== 'function') {
			throw new TypeError('callback not provided')
		}

		return new Promise(function (resolve, reject) {
			isexe$2(path, options || {}, function (er, is) {
				if (er) {
					reject(er);
				} else {
					resolve(is);
				}
			});
		})
	}

	core$2(path, options || {}, function (er, is) {
		// ignore EACCES because that just means we aren't allowed to run it
		if (er) {
			if (er.code === 'EACCES' || options && options.ignoreErrors) {
				er = null;
				is = false;
			}
		}
		cb(er, is);
	});
}

function sync$2 (path, options) {
	// my kingdom for a filtered catch
	try {
		return core$2.sync(path, options || {})
	} catch (er) {
		if (options && options.ignoreErrors || er.code === 'EACCES') {
			return false
		} else {
			throw er
		}
	}
}

var which_1 = which;
which.sync = whichSync;

var isWindows = process.platform === 'win32' ||
	process.env.OSTYPE === 'cygwin' ||
	process.env.OSTYPE === 'msys';


var COLON = isWindows ? ';' : ':';


function getNotFoundError (cmd) {
	var er = new Error('not found: ' + cmd);
	er.code = 'ENOENT';

	return er
}

function getPathInfo (cmd, opt) {
	var colon = opt.colon || COLON;
	var pathEnv = opt.path || process.env.PATH || '';
	var pathExt = [''];

	pathEnv = pathEnv.split(colon);

	var pathExtExe = '';
	if (isWindows) {
		pathEnv.unshift(process.cwd());
		pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM');
		pathExt = pathExtExe.split(colon);


		// Always test the cmd itself first.  isexe will check to make sure
		// it's found in the pathExt set.
		if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
			pathExt.unshift('');
	}

	// If it has a slash, then we don't bother searching the pathenv.
	// just check the file itself, and that's it.
	if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
		pathEnv = [''];

	return {
		env: pathEnv,
		ext: pathExt,
		extExe: pathExtExe
	}
}

function which (cmd, opt, cb) {
	if (typeof opt === 'function') {
		cb = opt;
		opt = {};
	}

	var info = getPathInfo(cmd, opt);
	var pathEnv = info.env;
	var pathExt = info.ext;
	var pathExtExe = info.extExe;
	var found = []

	;(function F (i, l) {
		if (i === l) {
			if (opt.all && found.length)
				return cb(null, found)
			else
				return cb(getNotFoundError(cmd))
		}

		var pathPart = pathEnv[i];
		if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
			pathPart = pathPart.slice(1, -1);

		var p = path.join(pathPart, cmd);
		if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
			p = cmd.slice(0, 2) + p;
		}
		(function E (ii, ll) {
			if (ii === ll) return F(i + 1, l)
			var ext = pathExt[ii];
			isexe_1(p + ext, { pathExt: pathExtExe }, function (er, is) {
				if (!er && is) {
					if (opt.all)
						found.push(p + ext);
					else
						return cb(null, p + ext)
				}
				return E(ii + 1, ll)
			});
		})(0, pathExt.length);
	})(0, pathEnv.length);
}

function whichSync (cmd, opt) {
	opt = opt || {};

	var info = getPathInfo(cmd, opt);
	var pathEnv = info.env;
	var pathExt = info.ext;
	var pathExtExe = info.extExe;
	var found = [];

	for (var i = 0, l = pathEnv.length; i < l; i ++) {
		var pathPart = pathEnv[i];
		if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
			pathPart = pathPart.slice(1, -1);

		var p = path.join(pathPart, cmd);
		if (!pathPart && /^\.[\\\/]/.test(cmd)) {
			p = cmd.slice(0, 2) + p;
		}
		for (var j = 0, ll = pathExt.length; j < ll; j ++) {
			var cur = p + pathExt[j];
			var is;
			try {
				is = isexe_1.sync(cur, { pathExt: pathExtExe });
				if (is) {
					if (opt.all)
						found.push(cur);
					else
						return cur
				}
			} catch (ex) {}
		}
	}

	if (opt.all && found.length)
		return found

	if (opt.nothrow)
		return null

	throw getNotFoundError(cmd)
}

var pathKey = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};

const pathKey$1 = pathKey();

function resolveCommandAttempt(parsed, withoutPathExt) {
	const cwd = process.cwd();
	const hasCustomCwd = parsed.options.cwd != null;

	// If a custom `cwd` was specified, we need to change the process cwd
	// because `which` will do stat calls but does not support a custom cwd
	if (hasCustomCwd) {
		try {
			process.chdir(parsed.options.cwd);
		} catch (err) {
			/* Empty */
		}
	}

	let resolved;

	try {
		resolved = which_1.sync(parsed.command, {
			path: (parsed.options.env || process.env)[pathKey$1],
			pathExt: withoutPathExt ? path.delimiter : undefined,
		});
	} catch (e) {
		/* Empty */
	} finally {
		process.chdir(cwd);
	}

	// If we successfully resolved, ensure that an absolute path is returned
	// Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
	if (resolved) {
		resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
	}

	return resolved;
}

function resolveCommand(parsed) {
	return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

var resolveCommand_1 = resolveCommand;

// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
	// Escape meta chars
	arg = arg.replace(metaCharsRegExp, '^$1');

	return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
	// Convert to string
	arg = `${arg}`;

	// Algorithm below is based on https://qntm.org/cmd

	// Sequence of backslashes followed by a double quote:
	// double up all the backslashes and escape the double quote
	arg = arg.replace(/(\\*)"/g, '$1$1\\"');

	// Sequence of backslashes followed by the end of the string
	// (which will become a double quote later):
	// double up all the backslashes
	arg = arg.replace(/(\\*)$/, '$1$1');

	// All other backslashes occur literally

	// Quote the whole thing:
	arg = `"${arg}"`;

	// Escape meta chars
	arg = arg.replace(metaCharsRegExp, '^$1');

	// Double escape meta chars if necessary
	if (doubleEscapeMetaChars) {
		arg = arg.replace(metaCharsRegExp, '^$1');
	}

	return arg;
}

var command$1 = escapeCommand;
var argument = escapeArgument;

var _escape = {
	command: command$1,
	argument: argument
};

var shebangRegex = /^#!.*/;

var shebangCommand = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
			arg :
			bin + (arg ? ' ' + arg : '')
	);
};

function readShebang(command) {
	// Read the first 150 bytes from the file
	const size = 150;
	let buffer;

	if (Buffer.alloc) {
		// Node.js v4.5+ / v5.10+
		buffer = Buffer.alloc(size);
	} else {
		// Old Node.js API
		buffer = new Buffer(size);
		buffer.fill(0); // zero-fill
	}

	let fd;

	try {
		fd = fs__default.openSync(command, 'r');
		fs__default.readSync(fd, buffer, 0, size, 0);
		fs__default.closeSync(fd);
	} catch (e) { /* Empty */ }

	// Attempt to extract shebang (null is returned if not a shebang)
	return shebangCommand(buffer.toString());
}

var readShebang_1 = readShebang;

var semver = createCommonjsModule(function (module, exports) {
	exports = module.exports = SemVer;

	var debug;
	/* istanbul ignore next */
	if (typeof process === 'object' &&
		process.env &&
		process.env.NODE_DEBUG &&
		/\bsemver\b/i.test(process.env.NODE_DEBUG)) {
		debug = function () {
			var args = Array.prototype.slice.call(arguments, 0);
			args.unshift('SEMVER');
			console.log.apply(console, args);
		};
	} else {
		debug = function () {};
	}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
	exports.SEMVER_SPEC_VERSION = '2.0.0';

	var MAX_LENGTH = 256;
	var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
		/* istanbul ignore next */ 9007199254740991;

// Max safe segment length for coercion.
	var MAX_SAFE_COMPONENT_LENGTH = 16;

// The actual regexps go on exports.re
	var re = exports.re = [];
	var src = exports.src = [];
	var R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

	var NUMERICIDENTIFIER = R++;
	src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
	var NUMERICIDENTIFIERLOOSE = R++;
	src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

	var NONNUMERICIDENTIFIER = R++;
	src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';

// ## Main Version
// Three dot-separated numeric identifiers.

	var MAINVERSION = R++;
	src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
		'(' + src[NUMERICIDENTIFIER] + ')\\.' +
		'(' + src[NUMERICIDENTIFIER] + ')';

	var MAINVERSIONLOOSE = R++;
	src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
		'(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
		'(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

	var PRERELEASEIDENTIFIER = R++;
	src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
		'|' + src[NONNUMERICIDENTIFIER] + ')';

	var PRERELEASEIDENTIFIERLOOSE = R++;
	src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
		'|' + src[NONNUMERICIDENTIFIER] + ')';

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

	var PRERELEASE = R++;
	src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
		'(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

	var PRERELEASELOOSE = R++;
	src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
		'(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

	var BUILDIDENTIFIER = R++;
	src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

	var BUILD = R++;
	src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
		'(?:\\.' + src[BUILDIDENTIFIER] + ')*))';

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

	var FULL = R++;
	var FULLPLAIN = 'v?' + src[MAINVERSION] +
		src[PRERELEASE] + '?' +
		src[BUILD] + '?';

	src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
	var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
		src[PRERELEASELOOSE] + '?' +
		src[BUILD] + '?';

	var LOOSE = R++;
	src[LOOSE] = '^' + LOOSEPLAIN + '$';

	var GTLT = R++;
	src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
	var XRANGEIDENTIFIERLOOSE = R++;
	src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
	var XRANGEIDENTIFIER = R++;
	src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

	var XRANGEPLAIN = R++;
	src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
		'(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
		'(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
		'(?:' + src[PRERELEASE] + ')?' +
		src[BUILD] + '?' +
		')?)?';

	var XRANGEPLAINLOOSE = R++;
	src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
		'(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
		'(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
		'(?:' + src[PRERELEASELOOSE] + ')?' +
		src[BUILD] + '?' +
		')?)?';

	var XRANGE = R++;
	src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
	var XRANGELOOSE = R++;
	src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
	var COERCE = R++;
	src[COERCE] = '(?:^|[^\\d])' +
		'(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
		'(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
		'(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
		'(?:$|[^\\d])';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
	var LONETILDE = R++;
	src[LONETILDE] = '(?:~>?)';

	var TILDETRIM = R++;
	src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
	re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
	var tildeTrimReplace = '$1~';

	var TILDE = R++;
	src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
	var TILDELOOSE = R++;
	src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
	var LONECARET = R++;
	src[LONECARET] = '(?:\\^)';

	var CARETTRIM = R++;
	src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
	re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
	var caretTrimReplace = '$1^';

	var CARET = R++;
	src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
	var CARETLOOSE = R++;
	src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
	var COMPARATORLOOSE = R++;
	src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
	var COMPARATOR = R++;
	src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
	var COMPARATORTRIM = R++;
	src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
		'\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
	re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
	var comparatorTrimReplace = '$1$2$3';

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
	var HYPHENRANGE = R++;
	src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
		'\\s+-\\s+' +
		'(' + src[XRANGEPLAIN] + ')' +
		'\\s*$';

	var HYPHENRANGELOOSE = R++;
	src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
		'\\s+-\\s+' +
		'(' + src[XRANGEPLAINLOOSE] + ')' +
		'\\s*$';

// Star ranges basically just allow anything at all.
	var STAR = R++;
	src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
	for (var i = 0; i < R; i++) {
		debug(i, src[i]);
		if (!re[i]) {
			re[i] = new RegExp(src[i]);
		}
	}

	exports.parse = parse;
	function parse (version, options) {
		if (!options || typeof options !== 'object') {
			options = {
				loose: !!options,
				includePrerelease: false
			};
		}

		if (version instanceof SemVer) {
			return version
		}

		if (typeof version !== 'string') {
			return null
		}

		if (version.length > MAX_LENGTH) {
			return null
		}

		var r = options.loose ? re[LOOSE] : re[FULL];
		if (!r.test(version)) {
			return null
		}

		try {
			return new SemVer(version, options)
		} catch (er) {
			return null
		}
	}

	exports.valid = valid;
	function valid (version, options) {
		var v = parse(version, options);
		return v ? v.version : null
	}

	exports.clean = clean;
	function clean (version, options) {
		var s = parse(version.trim().replace(/^[=v]+/, ''), options);
		return s ? s.version : null
	}

	exports.SemVer = SemVer;

	function SemVer (version, options) {
		if (!options || typeof options !== 'object') {
			options = {
				loose: !!options,
				includePrerelease: false
			};
		}
		if (version instanceof SemVer) {
			if (version.loose === options.loose) {
				return version
			} else {
				version = version.version;
			}
		} else if (typeof version !== 'string') {
			throw new TypeError('Invalid Version: ' + version)
		}

		if (version.length > MAX_LENGTH) {
			throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
		}

		if (!(this instanceof SemVer)) {
			return new SemVer(version, options)
		}

		debug('SemVer', version, options);
		this.options = options;
		this.loose = !!options.loose;

		var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL]);

		if (!m) {
			throw new TypeError('Invalid Version: ' + version)
		}

		this.raw = version;

		// these are actually numbers
		this.major = +m[1];
		this.minor = +m[2];
		this.patch = +m[3];

		if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
			throw new TypeError('Invalid major version')
		}

		if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
			throw new TypeError('Invalid minor version')
		}

		if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
			throw new TypeError('Invalid patch version')
		}

		// numberify any prerelease numeric ids
		if (!m[4]) {
			this.prerelease = [];
		} else {
			this.prerelease = m[4].split('.').map(function (id) {
				if (/^[0-9]+$/.test(id)) {
					var num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) {
						return num
					}
				}
				return id
			});
		}

		this.build = m[5] ? m[5].split('.') : [];
		this.format();
	}

	SemVer.prototype.format = function () {
		this.version = this.major + '.' + this.minor + '.' + this.patch;
		if (this.prerelease.length) {
			this.version += '-' + this.prerelease.join('.');
		}
		return this.version
	};

	SemVer.prototype.toString = function () {
		return this.version
	};

	SemVer.prototype.compare = function (other) {
		debug('SemVer.compare', this.version, this.options, other);
		if (!(other instanceof SemVer)) {
			other = new SemVer(other, this.options);
		}

		return this.compareMain(other) || this.comparePre(other)
	};

	SemVer.prototype.compareMain = function (other) {
		if (!(other instanceof SemVer)) {
			other = new SemVer(other, this.options);
		}

		return compareIdentifiers(this.major, other.major) ||
			compareIdentifiers(this.minor, other.minor) ||
			compareIdentifiers(this.patch, other.patch)
	};

	SemVer.prototype.comparePre = function (other) {
		if (!(other instanceof SemVer)) {
			other = new SemVer(other, this.options);
		}

		// NOT having a prerelease is > having one
		if (this.prerelease.length && !other.prerelease.length) {
			return -1
		} else if (!this.prerelease.length && other.prerelease.length) {
			return 1
		} else if (!this.prerelease.length && !other.prerelease.length) {
			return 0
		}

		var i = 0;
		do {
			var a = this.prerelease[i];
			var b = other.prerelease[i];
			debug('prerelease compare', i, a, b);
			if (a === undefined && b === undefined) {
				return 0
			} else if (b === undefined) {
				return 1
			} else if (a === undefined) {
				return -1
			} else if (a === b) {
				continue
			} else {
				return compareIdentifiers(a, b)
			}
		} while (++i)
	};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
	SemVer.prototype.inc = function (release, identifier) {
		switch (release) {
			case 'premajor':
				this.prerelease.length = 0;
				this.patch = 0;
				this.minor = 0;
				this.major++;
				this.inc('pre', identifier);
				break
			case 'preminor':
				this.prerelease.length = 0;
				this.patch = 0;
				this.minor++;
				this.inc('pre', identifier);
				break
			case 'prepatch':
				// If this is already a prerelease, it will bump to the next version
				// drop any prereleases that might already exist, since they are not
				// relevant at this point.
				this.prerelease.length = 0;
				this.inc('patch', identifier);
				this.inc('pre', identifier);
				break
			// If the input is a non-prerelease version, this acts the same as
			// prepatch.
			case 'prerelease':
				if (this.prerelease.length === 0) {
					this.inc('patch', identifier);
				}
				this.inc('pre', identifier);
				break

			case 'major':
				// If this is a pre-major version, bump up to the same major version.
				// Otherwise increment major.
				// 1.0.0-5 bumps to 1.0.0
				// 1.1.0 bumps to 2.0.0
				if (this.minor !== 0 ||
					this.patch !== 0 ||
					this.prerelease.length === 0) {
					this.major++;
				}
				this.minor = 0;
				this.patch = 0;
				this.prerelease = [];
				break
			case 'minor':
				// If this is a pre-minor version, bump up to the same minor version.
				// Otherwise increment minor.
				// 1.2.0-5 bumps to 1.2.0
				// 1.2.1 bumps to 1.3.0
				if (this.patch !== 0 || this.prerelease.length === 0) {
					this.minor++;
				}
				this.patch = 0;
				this.prerelease = [];
				break
			case 'patch':
				// If this is not a pre-release version, it will increment the patch.
				// If it is a pre-release it will bump up to the same patch version.
				// 1.2.0-5 patches to 1.2.0
				// 1.2.0 patches to 1.2.1
				if (this.prerelease.length === 0) {
					this.patch++;
				}
				this.prerelease = [];
				break
			// This probably shouldn't be used publicly.
			// 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
			case 'pre':
				if (this.prerelease.length === 0) {
					this.prerelease = [0];
				} else {
					var i = this.prerelease.length;
					while (--i >= 0) {
						if (typeof this.prerelease[i] === 'number') {
							this.prerelease[i]++;
							i = -2;
						}
					}
					if (i === -1) {
						// didn't increment anything
						this.prerelease.push(0);
					}
				}
				if (identifier) {
					// 1.2.0-beta.1 bumps to 1.2.0-beta.2,
					// 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
					if (this.prerelease[0] === identifier) {
						if (isNaN(this.prerelease[1])) {
							this.prerelease = [identifier, 0];
						}
					} else {
						this.prerelease = [identifier, 0];
					}
				}
				break

			default:
				throw new Error('invalid increment argument: ' + release)
		}
		this.format();
		this.raw = this.version;
		return this
	};

	exports.inc = inc;
	function inc (version, release, loose, identifier) {
		if (typeof (loose) === 'string') {
			identifier = loose;
			loose = undefined;
		}

		try {
			return new SemVer(version, loose).inc(release, identifier).version
		} catch (er) {
			return null
		}
	}

	exports.diff = diff;
	function diff (version1, version2) {
		if (eq(version1, version2)) {
			return null
		} else {
			var v1 = parse(version1);
			var v2 = parse(version2);
			var prefix = '';
			if (v1.prerelease.length || v2.prerelease.length) {
				prefix = 'pre';
				var defaultResult = 'prerelease';
			}
			for (var key in v1) {
				if (key === 'major' || key === 'minor' || key === 'patch') {
					if (v1[key] !== v2[key]) {
						return prefix + key
					}
				}
			}
			return defaultResult // may be undefined
		}
	}

	exports.compareIdentifiers = compareIdentifiers;

	var numeric = /^[0-9]+$/;
	function compareIdentifiers (a, b) {
		var anum = numeric.test(a);
		var bnum = numeric.test(b);

		if (anum && bnum) {
			a = +a;
			b = +b;
		}

		return a === b ? 0
			: (anum && !bnum) ? -1
				: (bnum && !anum) ? 1
					: a < b ? -1
						: 1
	}

	exports.rcompareIdentifiers = rcompareIdentifiers;
	function rcompareIdentifiers (a, b) {
		return compareIdentifiers(b, a)
	}

	exports.major = major;
	function major (a, loose) {
		return new SemVer(a, loose).major
	}

	exports.minor = minor;
	function minor (a, loose) {
		return new SemVer(a, loose).minor
	}

	exports.patch = patch;
	function patch (a, loose) {
		return new SemVer(a, loose).patch
	}

	exports.compare = compare;
	function compare (a, b, loose) {
		return new SemVer(a, loose).compare(new SemVer(b, loose))
	}

	exports.compareLoose = compareLoose;
	function compareLoose (a, b) {
		return compare(a, b, true)
	}

	exports.rcompare = rcompare;
	function rcompare (a, b, loose) {
		return compare(b, a, loose)
	}

	exports.sort = sort;
	function sort (list, loose) {
		return list.sort(function (a, b) {
			return exports.compare(a, b, loose)
		})
	}

	exports.rsort = rsort;
	function rsort (list, loose) {
		return list.sort(function (a, b) {
			return exports.rcompare(a, b, loose)
		})
	}

	exports.gt = gt;
	function gt (a, b, loose) {
		return compare(a, b, loose) > 0
	}

	exports.lt = lt;
	function lt (a, b, loose) {
		return compare(a, b, loose) < 0
	}

	exports.eq = eq;
	function eq (a, b, loose) {
		return compare(a, b, loose) === 0
	}

	exports.neq = neq;
	function neq (a, b, loose) {
		return compare(a, b, loose) !== 0
	}

	exports.gte = gte;
	function gte (a, b, loose) {
		return compare(a, b, loose) >= 0
	}

	exports.lte = lte;
	function lte (a, b, loose) {
		return compare(a, b, loose) <= 0
	}

	exports.cmp = cmp;
	function cmp (a, op, b, loose) {
		switch (op) {
			case '===':
				if (typeof a === 'object')
					a = a.version;
				if (typeof b === 'object')
					b = b.version;
				return a === b

			case '!==':
				if (typeof a === 'object')
					a = a.version;
				if (typeof b === 'object')
					b = b.version;
				return a !== b

			case '':
			case '=':
			case '==':
				return eq(a, b, loose)

			case '!=':
				return neq(a, b, loose)

			case '>':
				return gt(a, b, loose)

			case '>=':
				return gte(a, b, loose)

			case '<':
				return lt(a, b, loose)

			case '<=':
				return lte(a, b, loose)

			default:
				throw new TypeError('Invalid operator: ' + op)
		}
	}

	exports.Comparator = Comparator;
	function Comparator (comp, options) {
		if (!options || typeof options !== 'object') {
			options = {
				loose: !!options,
				includePrerelease: false
			};
		}

		if (comp instanceof Comparator) {
			if (comp.loose === !!options.loose) {
				return comp
			} else {
				comp = comp.value;
			}
		}

		if (!(this instanceof Comparator)) {
			return new Comparator(comp, options)
		}

		debug('comparator', comp, options);
		this.options = options;
		this.loose = !!options.loose;
		this.parse(comp);

		if (this.semver === ANY) {
			this.value = '';
		} else {
			this.value = this.operator + this.semver.version;
		}

		debug('comp', this);
	}

	var ANY = {};
	Comparator.prototype.parse = function (comp) {
		var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
		var m = comp.match(r);

		if (!m) {
			throw new TypeError('Invalid comparator: ' + comp)
		}

		this.operator = m[1];
		if (this.operator === '=') {
			this.operator = '';
		}

		// if it literally is just '>' or '' then allow anything.
		if (!m[2]) {
			this.semver = ANY;
		} else {
			this.semver = new SemVer(m[2], this.options.loose);
		}
	};

	Comparator.prototype.toString = function () {
		return this.value
	};

	Comparator.prototype.test = function (version) {
		debug('Comparator.test', version, this.options.loose);

		if (this.semver === ANY) {
			return true
		}

		if (typeof version === 'string') {
			version = new SemVer(version, this.options);
		}

		return cmp(version, this.operator, this.semver, this.options)
	};

	Comparator.prototype.intersects = function (comp, options) {
		if (!(comp instanceof Comparator)) {
			throw new TypeError('a Comparator is required')
		}

		if (!options || typeof options !== 'object') {
			options = {
				loose: !!options,
				includePrerelease: false
			};
		}

		var rangeTmp;

		if (this.operator === '') {
			rangeTmp = new Range(comp.value, options);
			return satisfies(this.value, rangeTmp, options)
		} else if (comp.operator === '') {
			rangeTmp = new Range(this.value, options);
			return satisfies(comp.semver, rangeTmp, options)
		}

		var sameDirectionIncreasing =
			(this.operator === '>=' || this.operator === '>') &&
			(comp.operator === '>=' || comp.operator === '>');
		var sameDirectionDecreasing =
			(this.operator === '<=' || this.operator === '<') &&
			(comp.operator === '<=' || comp.operator === '<');
		var sameSemVer = this.semver.version === comp.semver.version;
		var differentDirectionsInclusive =
			(this.operator === '>=' || this.operator === '<=') &&
			(comp.operator === '>=' || comp.operator === '<=');
		var oppositeDirectionsLessThan =
			cmp(this.semver, '<', comp.semver, options) &&
			((this.operator === '>=' || this.operator === '>') &&
				(comp.operator === '<=' || comp.operator === '<'));
		var oppositeDirectionsGreaterThan =
			cmp(this.semver, '>', comp.semver, options) &&
			((this.operator === '<=' || this.operator === '<') &&
				(comp.operator === '>=' || comp.operator === '>'));

		return sameDirectionIncreasing || sameDirectionDecreasing ||
			(sameSemVer && differentDirectionsInclusive) ||
			oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
	};

	exports.Range = Range;
	function Range (range, options) {
		if (!options || typeof options !== 'object') {
			options = {
				loose: !!options,
				includePrerelease: false
			};
		}

		if (range instanceof Range) {
			if (range.loose === !!options.loose &&
				range.includePrerelease === !!options.includePrerelease) {
				return range
			} else {
				return new Range(range.raw, options)
			}
		}

		if (range instanceof Comparator) {
			return new Range(range.value, options)
		}

		if (!(this instanceof Range)) {
			return new Range(range, options)
		}

		this.options = options;
		this.loose = !!options.loose;
		this.includePrerelease = !!options.includePrerelease;

		// First, split based on boolean or ||
		this.raw = range;
		this.set = range.split(/\s*\|\|\s*/).map(function (range) {
			return this.parseRange(range.trim())
		}, this).filter(function (c) {
			// throw out any that are not relevant for whatever reason
			return c.length
		});

		if (!this.set.length) {
			throw new TypeError('Invalid SemVer Range: ' + range)
		}

		this.format();
	}

	Range.prototype.format = function () {
		this.range = this.set.map(function (comps) {
			return comps.join(' ').trim()
		}).join('||').trim();
		return this.range
	};

	Range.prototype.toString = function () {
		return this.range
	};

	Range.prototype.parseRange = function (range) {
		var loose = this.options.loose;
		range = range.trim();
		// `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
		var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
		range = range.replace(hr, hyphenReplace);
		debug('hyphen replace', range);
		// `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
		range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
		debug('comparator trim', range, re[COMPARATORTRIM]);

		// `~ 1.2.3` => `~1.2.3`
		range = range.replace(re[TILDETRIM], tildeTrimReplace);

		// `^ 1.2.3` => `^1.2.3`
		range = range.replace(re[CARETTRIM], caretTrimReplace);

		// normalize spaces
		range = range.split(/\s+/).join(' ');

		// At this point, the range is completely trimmed and
		// ready to be split into comparators.

		var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
		var set = range.split(' ').map(function (comp) {
			return parseComparator(comp, this.options)
		}, this).join(' ').split(/\s+/);
		if (this.options.loose) {
			// in loose mode, throw out any that are not valid comparators
			set = set.filter(function (comp) {
				return !!comp.match(compRe)
			});
		}
		set = set.map(function (comp) {
			return new Comparator(comp, this.options)
		}, this);

		return set
	};

	Range.prototype.intersects = function (range, options) {
		if (!(range instanceof Range)) {
			throw new TypeError('a Range is required')
		}

		return this.set.some(function (thisComparators) {
			return thisComparators.every(function (thisComparator) {
				return range.set.some(function (rangeComparators) {
					return rangeComparators.every(function (rangeComparator) {
						return thisComparator.intersects(rangeComparator, options)
					})
				})
			})
		})
	};

// Mostly just for testing and legacy API reasons
	exports.toComparators = toComparators;
	function toComparators (range, options) {
		return new Range(range, options).set.map(function (comp) {
			return comp.map(function (c) {
				return c.value
			}).join(' ').trim().split(' ')
		})
	}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
	function parseComparator (comp, options) {
		debug('comp', comp, options);
		comp = replaceCarets(comp, options);
		debug('caret', comp);
		comp = replaceTildes(comp, options);
		debug('tildes', comp);
		comp = replaceXRanges(comp, options);
		debug('xrange', comp);
		comp = replaceStars(comp, options);
		debug('stars', comp);
		return comp
	}

	function isX (id) {
		return !id || id.toLowerCase() === 'x' || id === '*'
	}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
	function replaceTildes (comp, options) {
		return comp.trim().split(/\s+/).map(function (comp) {
			return replaceTilde(comp, options)
		}).join(' ')
	}

	function replaceTilde (comp, options) {
		var r = options.loose ? re[TILDELOOSE] : re[TILDE];
		return comp.replace(r, function (_, M, m, p, pr) {
			debug('tilde', comp, _, M, m, p, pr);
			var ret;

			if (isX(M)) {
				ret = '';
			} else if (isX(m)) {
				ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
			} else if (isX(p)) {
				// ~1.2 == >=1.2.0 <1.3.0
				ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
			} else if (pr) {
				debug('replaceTilde pr', pr);
				ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
					' <' + M + '.' + (+m + 1) + '.0';
			} else {
				// ~1.2.3 == >=1.2.3 <1.3.0
				ret = '>=' + M + '.' + m + '.' + p +
					' <' + M + '.' + (+m + 1) + '.0';
			}

			debug('tilde return', ret);
			return ret
		})
	}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
	function replaceCarets (comp, options) {
		return comp.trim().split(/\s+/).map(function (comp) {
			return replaceCaret(comp, options)
		}).join(' ')
	}

	function replaceCaret (comp, options) {
		debug('caret', comp, options);
		var r = options.loose ? re[CARETLOOSE] : re[CARET];
		return comp.replace(r, function (_, M, m, p, pr) {
			debug('caret', comp, _, M, m, p, pr);
			var ret;

			if (isX(M)) {
				ret = '';
			} else if (isX(m)) {
				ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
			} else if (isX(p)) {
				if (M === '0') {
					ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
				} else {
					ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
				}
			} else if (pr) {
				debug('replaceCaret pr', pr);
				if (M === '0') {
					if (m === '0') {
						ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
							' <' + M + '.' + m + '.' + (+p + 1);
					} else {
						ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
							' <' + M + '.' + (+m + 1) + '.0';
					}
				} else {
					ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
						' <' + (+M + 1) + '.0.0';
				}
			} else {
				debug('no pr');
				if (M === '0') {
					if (m === '0') {
						ret = '>=' + M + '.' + m + '.' + p +
							' <' + M + '.' + m + '.' + (+p + 1);
					} else {
						ret = '>=' + M + '.' + m + '.' + p +
							' <' + M + '.' + (+m + 1) + '.0';
					}
				} else {
					ret = '>=' + M + '.' + m + '.' + p +
						' <' + (+M + 1) + '.0.0';
				}
			}

			debug('caret return', ret);
			return ret
		})
	}

	function replaceXRanges (comp, options) {
		debug('replaceXRanges', comp, options);
		return comp.split(/\s+/).map(function (comp) {
			return replaceXRange(comp, options)
		}).join(' ')
	}

	function replaceXRange (comp, options) {
		comp = comp.trim();
		var r = options.loose ? re[XRANGELOOSE] : re[XRANGE];
		return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
			debug('xRange', comp, ret, gtlt, M, m, p, pr);
			var xM = isX(M);
			var xm = xM || isX(m);
			var xp = xm || isX(p);
			var anyX = xp;

			if (gtlt === '=' && anyX) {
				gtlt = '';
			}

			if (xM) {
				if (gtlt === '>' || gtlt === '<') {
					// nothing is allowed
					ret = '<0.0.0';
				} else {
					// nothing is forbidden
					ret = '*';
				}
			} else if (gtlt && anyX) {
				// we know patch is an x, because we have any x at all.
				// replace X with 0
				if (xm) {
					m = 0;
				}
				p = 0;

				if (gtlt === '>') {
					// >1 => >=2.0.0
					// >1.2 => >=1.3.0
					// >1.2.3 => >= 1.2.4
					gtlt = '>=';
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === '<=') {
					// <=0.7.x is actually <0.8.0, since any 0.7.x should
					// pass.  Similarly, <=7.x is actually <8.0.0, etc.
					gtlt = '<';
					if (xm) {
						M = +M + 1;
					} else {
						m = +m + 1;
					}
				}

				ret = gtlt + M + '.' + m + '.' + p;
			} else if (xm) {
				ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
			} else if (xp) {
				ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
			}

			debug('xRange return', ret);

			return ret
		})
	}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
	function replaceStars (comp, options) {
		debug('replaceStars', comp, options);
		// Looseness is ignored here.  star is always as loose as it gets!
		return comp.trim().replace(re[STAR], '')
	}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
	function hyphenReplace ($0,
													from, fM, fm, fp, fpr, fb,
													to, tM, tm, tp, tpr, tb) {
		if (isX(fM)) {
			from = '';
		} else if (isX(fm)) {
			from = '>=' + fM + '.0.0';
		} else if (isX(fp)) {
			from = '>=' + fM + '.' + fm + '.0';
		} else {
			from = '>=' + from;
		}

		if (isX(tM)) {
			to = '';
		} else if (isX(tm)) {
			to = '<' + (+tM + 1) + '.0.0';
		} else if (isX(tp)) {
			to = '<' + tM + '.' + (+tm + 1) + '.0';
		} else if (tpr) {
			to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
		} else {
			to = '<=' + to;
		}

		return (from + ' ' + to).trim()
	}

// if ANY of the sets match ALL of its comparators, then pass
	Range.prototype.test = function (version) {
		if (!version) {
			return false
		}

		if (typeof version === 'string') {
			version = new SemVer(version, this.options);
		}

		for (var i = 0; i < this.set.length; i++) {
			if (testSet(this.set[i], version, this.options)) {
				return true
			}
		}
		return false
	};

	function testSet (set, version, options) {
		for (var i = 0; i < set.length; i++) {
			if (!set[i].test(version)) {
				return false
			}
		}

		if (version.prerelease.length && !options.includePrerelease) {
			// Find the set of versions that are allowed to have prereleases
			// For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
			// That should allow `1.2.3-pr.2` to pass.
			// However, `1.2.4-alpha.notready` should NOT be allowed,
			// even though it's within the range set by the comparators.
			for (i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === ANY) {
					continue
				}

				if (set[i].semver.prerelease.length > 0) {
					var allowed = set[i].semver;
					if (allowed.major === version.major &&
						allowed.minor === version.minor &&
						allowed.patch === version.patch) {
						return true
					}
				}
			}

			// Version has a -pre, but it's not one of the ones we like.
			return false
		}

		return true
	}

	exports.satisfies = satisfies;
	function satisfies (version, range, options) {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false
		}
		return range.test(version)
	}

	exports.maxSatisfying = maxSatisfying;
	function maxSatisfying (versions, range, options) {
		var max = null;
		var maxSV = null;
		try {
			var rangeObj = new Range(range, options);
		} catch (er) {
			return null
		}
		versions.forEach(function (v) {
			if (rangeObj.test(v)) {
				// satisfies(v, range, options)
				if (!max || maxSV.compare(v) === -1) {
					// compare(max, v, true)
					max = v;
					maxSV = new SemVer(max, options);
				}
			}
		});
		return max
	}

	exports.minSatisfying = minSatisfying;
	function minSatisfying (versions, range, options) {
		var min = null;
		var minSV = null;
		try {
			var rangeObj = new Range(range, options);
		} catch (er) {
			return null
		}
		versions.forEach(function (v) {
			if (rangeObj.test(v)) {
				// satisfies(v, range, options)
				if (!min || minSV.compare(v) === 1) {
					// compare(min, v, true)
					min = v;
					minSV = new SemVer(min, options);
				}
			}
		});
		return min
	}

	exports.minVersion = minVersion;
	function minVersion (range, loose) {
		range = new Range(range, loose);

		var minver = new SemVer('0.0.0');
		if (range.test(minver)) {
			return minver
		}

		minver = new SemVer('0.0.0-0');
		if (range.test(minver)) {
			return minver
		}

		minver = null;
		for (var i = 0; i < range.set.length; ++i) {
			var comparators = range.set[i];

			comparators.forEach(function (comparator) {
				// Clone to avoid manipulating the comparator's semver object.
				var compver = new SemVer(comparator.semver.version);
				switch (comparator.operator) {
					case '>':
						if (compver.prerelease.length === 0) {
							compver.patch++;
						} else {
							compver.prerelease.push(0);
						}
						compver.raw = compver.format();
					/* fallthrough */
					case '':
					case '>=':
						if (!minver || gt(minver, compver)) {
							minver = compver;
						}
						break
					case '<':
					case '<=':
						/* Ignore maximum versions */
						break
					/* istanbul ignore next */
					default:
						throw new Error('Unexpected operation: ' + comparator.operator)
				}
			});
		}

		if (minver && range.test(minver)) {
			return minver
		}

		return null
	}

	exports.validRange = validRange;
	function validRange (range, options) {
		try {
			// Return '*' instead of '' so that truthiness works.
			// This will throw if it's invalid anyway
			return new Range(range, options).range || '*'
		} catch (er) {
			return null
		}
	}

// Determine if version is less than all the versions possible in the range
	exports.ltr = ltr;
	function ltr (version, range, options) {
		return outside(version, range, '<', options)
	}

// Determine if version is greater than all the versions possible in the range.
	exports.gtr = gtr;
	function gtr (version, range, options) {
		return outside(version, range, '>', options)
	}

	exports.outside = outside;
	function outside (version, range, hilo, options) {
		version = new SemVer(version, options);
		range = new Range(range, options);

		var gtfn, ltefn, ltfn, comp, ecomp;
		switch (hilo) {
			case '>':
				gtfn = gt;
				ltefn = lte;
				ltfn = lt;
				comp = '>';
				ecomp = '>=';
				break
			case '<':
				gtfn = lt;
				ltefn = gte;
				ltfn = gt;
				comp = '<';
				ecomp = '<=';
				break
			default:
				throw new TypeError('Must provide a hilo val of "<" or ">"')
		}

		// If it satisifes the range it is not outside
		if (satisfies(version, range, options)) {
			return false
		}

		// From now on, variable terms are as if we're in "gtr" mode.
		// but note that everything is flipped for the "ltr" function.

		for (var i = 0; i < range.set.length; ++i) {
			var comparators = range.set[i];

			var high = null;
			var low = null;

			comparators.forEach(function (comparator) {
				if (comparator.semver === ANY) {
					comparator = new Comparator('>=0.0.0');
				}
				high = high || comparator;
				low = low || comparator;
				if (gtfn(comparator.semver, high.semver, options)) {
					high = comparator;
				} else if (ltfn(comparator.semver, low.semver, options)) {
					low = comparator;
				}
			});

			// If the edge version comparator has a operator then our version
			// isn't outside it
			if (high.operator === comp || high.operator === ecomp) {
				return false
			}

			// If the lowest version comparator has an operator and our version
			// is less than it then it isn't higher than the range
			if ((!low.operator || low.operator === comp) &&
				ltefn(version, low.semver)) {
				return false
			} else if (low.operator === ecomp && ltfn(version, low.semver)) {
				return false
			}
		}
		return true
	}

	exports.prerelease = prerelease;
	function prerelease (version, options) {
		var parsed = parse(version, options);
		return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
	}

	exports.intersects = intersects;
	function intersects (r1, r2, options) {
		r1 = new Range(r1, options);
		r2 = new Range(r2, options);
		return r1.intersects(r2)
	}

	exports.coerce = coerce;
	function coerce (version) {
		if (version instanceof SemVer) {
			return version
		}

		if (typeof version !== 'string') {
			return null
		}

		var match = version.match(re[COERCE]);

		if (match == null) {
			return null
		}

		return parse(match[1] +
			'.' + (match[2] || '0') +
			'.' + (match[3] || '0'))
	}
});
var semver_1 = semver.SEMVER_SPEC_VERSION;
var semver_2 = semver.re;
var semver_3 = semver.src;
var semver_4 = semver.parse;
var semver_5 = semver.valid;
var semver_6 = semver.clean;
var semver_7 = semver.SemVer;
var semver_8 = semver.inc;
var semver_9 = semver.diff;
var semver_10 = semver.compareIdentifiers;
var semver_11 = semver.rcompareIdentifiers;
var semver_12 = semver.major;
var semver_13 = semver.minor;
var semver_14 = semver.patch;
var semver_15 = semver.compare;
var semver_16 = semver.compareLoose;
var semver_17 = semver.rcompare;
var semver_18 = semver.sort;
var semver_19 = semver.rsort;
var semver_20 = semver.gt;
var semver_21 = semver.lt;
var semver_22 = semver.eq;
var semver_23 = semver.neq;
var semver_24 = semver.gte;
var semver_25 = semver.lte;
var semver_26 = semver.cmp;
var semver_27 = semver.Comparator;
var semver_28 = semver.Range;
var semver_29 = semver.toComparators;
var semver_30 = semver.satisfies;
var semver_31 = semver.maxSatisfying;
var semver_32 = semver.minSatisfying;
var semver_33 = semver.minVersion;
var semver_34 = semver.validRange;
var semver_35 = semver.ltr;
var semver_36 = semver.gtr;
var semver_37 = semver.outside;
var semver_38 = semver.prerelease;
var semver_39 = semver.intersects;
var semver_40 = semver.coerce;

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
const supportsShellOption = src(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

function detectShebang(parsed) {
	parsed.file = resolveCommand_1(parsed);

	const shebang = parsed.file && readShebang_1(parsed.file);

	if (shebang) {
		parsed.args.unshift(parsed.file);
		parsed.command = shebang;

		return resolveCommand_1(parsed);
	}

	return parsed.file;
}

function parseNonShell(parsed) {
	if (!isWin) {
		return parsed;
	}

	// Detect & add support for shebangs
	const commandFile = detectShebang(parsed);

	// We don't need a shell if the command filename is an executable
	const needsShell = !isExecutableRegExp.test(commandFile);

	// If a shell is required, use cmd.exe and take care of escaping everything correctly
	// Note that `forceShell` is an hidden option used only in tests
	if (parsed.options.forceShell || needsShell) {
		// Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
		// The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
		// Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
		// we need to double escape them
		const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

		// Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
		// This is necessary otherwise it will always fail with ENOENT in those cases
		parsed.command = path.normalize(parsed.command);

		// Escape command & arguments
		parsed.command = _escape.command(parsed.command);
		parsed.args = parsed.args.map((arg) => _escape.argument(arg, needsDoubleEscapeMetaChars));

		const shellCommand = [parsed.command].concat(parsed.args).join(' ');

		parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
		parsed.command = process.env.comspec || 'cmd.exe';
		parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
	}

	return parsed;
}

function parseShell(parsed) {
	// If node supports the shell option, there's no need to mimic its behavior
	if (supportsShellOption) {
		return parsed;
	}

	// Mimic node shell option
	// See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
	const shellCommand = [parsed.command].concat(parsed.args).join(' ');

	if (isWin) {
		parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
		parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
		parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
	} else {
		if (typeof parsed.options.shell === 'string') {
			parsed.command = parsed.options.shell;
		} else if (process.platform === 'android') {
			parsed.command = '/system/bin/sh';
		} else {
			parsed.command = '/bin/sh';
		}

		parsed.args = ['-c', shellCommand];
	}

	return parsed;
}

function parse(command, args, options) {
	// Normalize arguments, similar to nodejs
	if (args && !Array.isArray(args)) {
		options = args;
		args = null;
	}

	args = args ? args.slice(0) : []; // Clone array to avoid changing the original
	options = Object.assign({}, options); // Clone object to avoid changing the original

	// Build our parsed object
	const parsed = {
		command,
		args,
		options,
		file: undefined,
		original: {
			command,
			args,
		},
	};

	// Delegate further parsing to shell or non-shell
	return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

var parse_1 = parse;

const isWin$1 = process.platform === 'win32';

function notFoundError(original, syscall) {
	return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
		code: 'ENOENT',
		errno: 'ENOENT',
		syscall: `${syscall} ${original.command}`,
		path: original.command,
		spawnargs: original.args,
	});
}

function hookChildProcess(cp, parsed) {
	if (!isWin$1) {
		return;
	}

	const originalEmit = cp.emit;

	cp.emit = function (name, arg1) {
		// If emitting "exit" event and exit code is 1, we need to check if
		// the command exists and emit an "error" instead
		// See https://github.com/IndigoUnited/node-cross-spawn/issues/16
		if (name === 'exit') {
			const err = verifyENOENT(arg1, parsed);

			if (err) {
				return originalEmit.call(cp, 'error', err);
			}
		}

		return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
	};
}

function verifyENOENT(status, parsed) {
	if (isWin$1 && status === 1 && !parsed.file) {
		return notFoundError(parsed.original, 'spawn');
	}

	return null;
}

function verifyENOENTSync(status, parsed) {
	if (isWin$1 && status === 1 && !parsed.file) {
		return notFoundError(parsed.original, 'spawnSync');
	}

	return null;
}

var enoent = {
	hookChildProcess,
	verifyENOENT,
	verifyENOENTSync,
	notFoundError,
};

function spawn(command, args, options) {
	// Parse the arguments
	const parsed = parse_1(command, args, options);

	// Spawn the child process
	const spawned = child_process.spawn(parsed.command, parsed.args, parsed.options);

	// Hook into child process "exit" event to emit an error if the command
	// does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
	enoent.hookChildProcess(spawned, parsed);

	return spawned;
}

function spawnSync(command, args, options) {
	// Parse the arguments
	const parsed = parse_1(command, args, options);

	// Spawn the child process
	const result = child_process.spawnSync(parsed.command, parsed.args, parsed.options);

	// Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
	result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

	return result;
}

var crossSpawn = spawn;
var spawn_1 = spawn;
var sync$3 = spawnSync;

var _parse = parse_1;
var _enoent = enoent;
crossSpawn.spawn = spawn_1;
crossSpawn.sync = sync$3;
crossSpawn._parse = _parse;
crossSpawn._enoent = _enoent;

var stripEof = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};

var npmRunPath = createCommonjsModule(function (module) {



	module.exports = opts => {
		opts = Object.assign({
			cwd: process.cwd(),
			path: process.env[pathKey()]
		}, opts);

		let prev;
		let pth = path.resolve(opts.cwd);
		const ret = [];

		while (prev !== pth) {
			ret.push(path.join(pth, 'node_modules/.bin'));
			prev = pth;
			pth = path.resolve(pth, '..');
		}

		// ensure the running `node` binary is used
		ret.push(path.dirname(process.execPath));

		return ret.concat(opts.path).join(path.delimiter);
	};

	module.exports.env = opts => {
		opts = Object.assign({
			env: process.env
		}, opts);

		const env = Object.assign({}, opts.env);
		const path = pathKey({env});

		opts.path = env[path];
		env[path] = module.exports(opts);

		return env;
	};
});
var npmRunPath_1 = npmRunPath.env;

var isStream_1 = createCommonjsModule(function (module) {

	var isStream = module.exports = function (stream) {
		return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
	};

	isStream.writable = function (stream) {
		return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
	};

	isStream.readable = function (stream) {
		return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
	};

	isStream.duplex = function (stream) {
		return isStream.writable(stream) && isStream.readable(stream);
	};

	isStream.transform = function (stream) {
		return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
	};
});

var noop = function() {};

var isRequest$1 = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once_1(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest$1(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

var endOfStream = eos;

// we only need fs to get the ReadStream and WriteStream prototypes

var noop$1 = function () {};
var ancient = /^v?\.0/.test(process.version);

var isFn = function (fn) {
	return typeof fn === 'function'
};

var isFS = function (stream) {
	if (!ancient) return false // newer node version do not need to care about fs is a special way
	if (!fs__default) return false // browser
	return (stream instanceof (fs__default.ReadStream || noop$1) || stream instanceof (fs__default.WriteStream || noop$1)) && isFn(stream.close)
};

var isRequest$2 = function (stream) {
	return stream.setHeader && isFn(stream.abort)
};

var destroyer = function (stream, reading, writing, callback) {
	callback = once_1(callback);

	var closed = false;
	stream.on('close', function () {
		closed = true;
	});

	endOfStream(stream, {readable: reading, writable: writing}, function (err) {
		if (err) return callback(err)
		closed = true;
		callback();
	});

	var destroyed = false;
	return function (err) {
		if (closed) return
		if (destroyed) return
		destroyed = true;

		if (isFS(stream)) return stream.close(noop$1) // use close for fs streams to avoid fd leaks
		if (isRequest$2(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

		if (isFn(stream.destroy)) return stream.destroy()

		callback(err || new Error('stream was destroyed'));
	}
};

var call = function (fn) {
	fn();
};

var pipe = function (from, to) {
	return from.pipe(to)
};

var pump = function () {
	var streams = Array.prototype.slice.call(arguments);
	var callback = isFn(streams[streams.length - 1] || noop$1) && streams.pop() || noop$1;

	if (Array.isArray(streams[0])) streams = streams[0];
	if (streams.length < 2) throw new Error('pump requires two streams per minimum')

	var error;
	var destroys = streams.map(function (stream, i) {
		var reading = i < streams.length - 1;
		var writing = i > 0;
		return destroyer(stream, reading, writing, function (err) {
			if (!error) error = err;
			if (err) destroys.forEach(call);
			if (reading) return
			destroys.forEach(call);
			callback(error);
		})
	});

	return streams.reduce(pipe)
};

var pump_1 = pump;

const {PassThrough: PassThrough$2} = Stream;

var bufferStream = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough$2({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump_1(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

var getStream_1 = getStream;
var buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
var array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
var MaxBufferError_1 = MaxBufferError;
getStream_1.buffer = buffer;
getStream_1.array = array;
getStream_1.MaxBufferError = MaxBufferError_1;

var pFinally = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};

var signals = createCommonjsModule(function (module) {
// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
	module.exports = [
		'SIGABRT',
		'SIGALRM',
		'SIGHUP',
		'SIGINT',
		'SIGTERM'
	];

	if (process.platform !== 'win32') {
		module.exports.push(
			'SIGVTALRM',
			'SIGXCPU',
			'SIGXFSZ',
			'SIGUSR2',
			'SIGTRAP',
			'SIGSYS',
			'SIGQUIT',
			'SIGIOT'
			// should detect profiler and enable/disable accordingly.
			// see #21
			// 'SIGPROF'
		);
	}

	if (process.platform === 'linux') {
		module.exports.push(
			'SIGIO',
			'SIGPOLL',
			'SIGPWR',
			'SIGSTKFLT',
			'SIGUNUSED'
		);
	}
});

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.

var signals$1 = signals;
var isWin$2 = /^win/i.test(process.platform);

var EE = events;
/* istanbul ignore if */
if (typeof EE !== 'function') {
	EE = EE.EventEmitter;
}

var emitter;
if (process.__signal_exit_emitter__) {
	emitter = process.__signal_exit_emitter__;
} else {
	emitter = process.__signal_exit_emitter__ = new EE();
	emitter.count = 0;
	emitter.emitted = {};
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
	emitter.setMaxListeners(Infinity);
	emitter.infinite = true;
}

var signalExit = function (cb, opts) {
	assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler');

	if (loaded === false) {
		load();
	}

	var ev = 'exit';
	if (opts && opts.alwaysLast) {
		ev = 'afterexit';
	}

	var remove = function () {
		emitter.removeListener(ev, cb);
		if (emitter.listeners('exit').length === 0 &&
			emitter.listeners('afterexit').length === 0) {
			unload();
		}
	};
	emitter.on(ev, cb);

	return remove
};

var unload_1 = unload;
function unload () {
	if (!loaded) {
		return
	}
	loaded = false;

	signals$1.forEach(function (sig) {
		try {
			process.removeListener(sig, sigListeners[sig]);
		} catch (er) {}
	});
	process.emit = originalProcessEmit;
	process.reallyExit = originalProcessReallyExit;
	emitter.count -= 1;
}

function emit (event, code, signal) {
	if (emitter.emitted[event]) {
		return
	}
	emitter.emitted[event] = true;
	emitter.emit(event, code, signal);
}

// { <signal>: <listener fn>, ... }
var sigListeners = {};
signals$1.forEach(function (sig) {
	sigListeners[sig] = function listener () {
		// If there are no other listeners, an exit is coming!
		// Simplest way: remove us and then re-send the signal.
		// We know that this will kill the process, so we can
		// safely emit now.
		var listeners = process.listeners(sig);
		if (listeners.length === emitter.count) {
			unload();
			emit('exit', null, sig);
			/* istanbul ignore next */
			emit('afterexit', null, sig);
			/* istanbul ignore next */
			if (isWin$2 && sig === 'SIGHUP') {
				// "SIGHUP" throws an `ENOSYS` error on Windows,
				// so use a supported signal instead
				sig = 'SIGINT';
			}
			process.kill(process.pid, sig);
		}
	};
});

var signals_1 = function () {
	return signals$1
};

var load_1 = load;

var loaded = false;

function load () {
	if (loaded) {
		return
	}
	loaded = true;

	// This is the number of onSignalExit's that are in play.
	// It's important so that we can count the correct number of
	// listeners on signals, and don't wait for the other one to
	// handle it instead of us.
	emitter.count += 1;

	signals$1 = signals$1.filter(function (sig) {
		try {
			process.on(sig, sigListeners[sig]);
			return true
		} catch (er) {
			return false
		}
	});

	process.emit = processEmit;
	process.reallyExit = processReallyExit;
}

var originalProcessReallyExit = process.reallyExit;
function processReallyExit (code) {
	process.exitCode = code || 0;
	emit('exit', process.exitCode, null);
	/* istanbul ignore next */
	emit('afterexit', process.exitCode, null);
	/* istanbul ignore next */
	originalProcessReallyExit.call(process, process.exitCode);
}

var originalProcessEmit = process.emit;
function processEmit (ev, arg) {
	if (ev === 'exit') {
		if (arg !== undefined) {
			process.exitCode = arg;
		}
		var ret = originalProcessEmit.apply(this, arguments);
		emit('exit', process.exitCode, null);
		/* istanbul ignore next */
		emit('afterexit', process.exitCode, null);
		return ret
	} else {
		return originalProcessEmit.apply(this, arguments)
	}
}
signalExit.unload = unload_1;
signalExit.signals = signals_1;
signalExit.load = load_1;

var errname_1 = createCommonjsModule(function (module) {
// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.


	let uv;

	if (typeof util.getSystemErrorName === 'function') {
		module.exports = util.getSystemErrorName;
	} else {
		try {
			uv = process.binding('uv');

			if (typeof uv.errname !== 'function') {
				throw new TypeError('uv.errname is not a function');
			}
		} catch (err) {
			console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
			uv = null;
		}

		module.exports = code => errname(uv, code);
	}

// Used for testing the fallback behavior
	module.exports.__test__ = errname;

	function errname(uv, code) {
		if (uv) {
			return uv.errname(code);
		}

		if (!(code < 0)) {
			throw new Error('err >= 0');
		}

		return `Unknown system error ${code}`;
	}
});
var errname_2 = errname_1.__test__;

const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

var stdio = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};

var execa = createCommonjsModule(function (module) {












	const TEN_MEGABYTES = 1000 * 1000 * 10;

	function handleArgs(cmd, args, opts) {
		let parsed;

		opts = Object.assign({
			extendEnv: true,
			env: {}
		}, opts);

		if (opts.extendEnv) {
			opts.env = Object.assign({}, process.env, opts.env);
		}

		if (opts.__winShell === true) {
			delete opts.__winShell;
			parsed = {
				command: cmd,
				args,
				options: opts,
				file: cmd,
				original: {
					cmd,
					args
				}
			};
		} else {
			parsed = crossSpawn._parse(cmd, args, opts);
		}

		opts = Object.assign({
			maxBuffer: TEN_MEGABYTES,
			buffer: true,
			stripEof: true,
			preferLocal: true,
			localDir: parsed.options.cwd || process.cwd(),
			encoding: 'utf8',
			reject: true,
			cleanup: true
		}, parsed.options);

		opts.stdio = stdio(opts);

		if (opts.preferLocal) {
			opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
		}

		if (opts.detached) {
			// #115
			opts.cleanup = false;
		}

		if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
			// #116
			parsed.args.unshift('/q');
		}

		return {
			cmd: parsed.command,
			args: parsed.args,
			opts,
			parsed
		};
	}

	function handleInput(spawned, input) {
		if (input === null || input === undefined) {
			return;
		}

		if (isStream_1(input)) {
			input.pipe(spawned.stdin);
		} else {
			spawned.stdin.end(input);
		}
	}

	function handleOutput(opts, val) {
		if (val && opts.stripEof) {
			val = stripEof(val);
		}

		return val;
	}

	function handleShell(fn, cmd, opts) {
		let file = '/bin/sh';
		let args = ['-c', cmd];

		opts = Object.assign({}, opts);

		if (process.platform === 'win32') {
			opts.__winShell = true;
			file = process.env.comspec || 'cmd.exe';
			args = ['/s', '/c', `"${cmd}"`];
			opts.windowsVerbatimArguments = true;
		}

		if (opts.shell) {
			file = opts.shell;
			delete opts.shell;
		}

		return fn(file, args, opts);
	}

	function getStream(process, stream, {encoding, buffer, maxBuffer}) {
		if (!process[stream]) {
			return null;
		}

		let ret;

		if (!buffer) {
			// TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
			ret = new Promise((resolve, reject) => {
				process[stream]
					.once('end', resolve)
					.once('error', reject);
			});
		} else if (encoding) {
			ret = getStream_1(process[stream], {
				encoding,
				maxBuffer
			});
		} else {
			ret = getStream_1.buffer(process[stream], {maxBuffer});
		}

		return ret.catch(err => {
			err.stream = stream;
			err.message = `${stream} ${err.message}`;
			throw err;
		});
	}

	function makeError(result, options) {
		const {stdout, stderr} = result;

		let err = result.error;
		const {code, signal} = result;

		const {parsed, joinedCmd} = options;
		const timedOut = options.timedOut || false;

		if (!err) {
			let output = '';

			if (Array.isArray(parsed.opts.stdio)) {
				if (parsed.opts.stdio[2] !== 'inherit') {
					output += output.length > 0 ? stderr : `\n${stderr}`;
				}

				if (parsed.opts.stdio[1] !== 'inherit') {
					output += `\n${stdout}`;
				}
			} else if (parsed.opts.stdio !== 'inherit') {
				output = `\n${stderr}${stdout}`;
			}

			err = new Error(`Command failed: ${joinedCmd}${output}`);
			err.code = code < 0 ? errname_1(code) : code;
		}

		err.stdout = stdout;
		err.stderr = stderr;
		err.failed = true;
		err.signal = signal || null;
		err.cmd = joinedCmd;
		err.timedOut = timedOut;

		return err;
	}

	function joinCmd(cmd, args) {
		let joinedCmd = cmd;

		if (Array.isArray(args) && args.length > 0) {
			joinedCmd += ' ' + args.join(' ');
		}

		return joinedCmd;
	}

	module.exports = (cmd, args, opts) => {
		const parsed = handleArgs(cmd, args, opts);
		const {encoding, buffer, maxBuffer} = parsed.opts;
		const joinedCmd = joinCmd(cmd, args);

		let spawned;
		try {
			spawned = child_process.spawn(parsed.cmd, parsed.args, parsed.opts);
		} catch (err) {
			return Promise.reject(err);
		}

		let removeExitHandler;
		if (parsed.opts.cleanup) {
			removeExitHandler = signalExit(() => {
				spawned.kill();
			});
		}

		let timeoutId = null;
		let timedOut = false;

		const cleanup = () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}

			if (removeExitHandler) {
				removeExitHandler();
			}
		};

		if (parsed.opts.timeout > 0) {
			timeoutId = setTimeout(() => {
				timeoutId = null;
				timedOut = true;
				spawned.kill(parsed.opts.killSignal);
			}, parsed.opts.timeout);
		}

		const processDone = new Promise(resolve => {
			spawned.on('exit', (code, signal) => {
				cleanup();
				resolve({code, signal});
			});

			spawned.on('error', err => {
				cleanup();
				resolve({error: err});
			});

			if (spawned.stdin) {
				spawned.stdin.on('error', err => {
					cleanup();
					resolve({error: err});
				});
			}
		});

		function destroy() {
			if (spawned.stdout) {
				spawned.stdout.destroy();
			}

			if (spawned.stderr) {
				spawned.stderr.destroy();
			}
		}

		const handlePromise = () => pFinally(Promise.all([
			processDone,
			getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
			getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
		]).then(arr => {
			const result = arr[0];
			result.stdout = arr[1];
			result.stderr = arr[2];

			if (result.error || result.code !== 0 || result.signal !== null) {
				const err = makeError(result, {
					joinedCmd,
					parsed,
					timedOut
				});

				// TODO: missing some timeout logic for killed
				// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
				// err.killed = spawned.killed || killed;
				err.killed = err.killed || spawned.killed;

				if (!parsed.opts.reject) {
					return err;
				}

				throw err;
			}

			return {
				stdout: handleOutput(parsed.opts, result.stdout),
				stderr: handleOutput(parsed.opts, result.stderr),
				code: 0,
				failed: false,
				killed: false,
				signal: null,
				cmd: joinedCmd,
				timedOut: false
			};
		}), destroy);

		crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

		handleInput(spawned, parsed.opts.input);

		spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
		spawned.catch = onrejected => handlePromise().catch(onrejected);

		return spawned;
	};

// TODO: set `stderr: 'ignore'` when that option is implemented
	module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
	module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

	module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

	module.exports.sync = (cmd, args, opts) => {
		const parsed = handleArgs(cmd, args, opts);
		const joinedCmd = joinCmd(cmd, args);

		if (isStream_1(parsed.opts.input)) {
			throw new TypeError('The `input` option cannot be a stream in sync mode');
		}

		const result = child_process.spawnSync(parsed.cmd, parsed.args, parsed.opts);
		result.code = result.status;

		if (result.error || result.status !== 0 || result.signal !== null) {
			const err = makeError(result, {
				joinedCmd,
				parsed
			});

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, result.stdout),
			stderr: handleOutput(parsed.opts, result.stderr),
			code: 0,
			failed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	};

	module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);
});
var execa_1 = execa.stdout;
var execa_2 = execa.stderr;
var execa_3 = execa.shell;
var execa_4 = execa.sync;
var execa_5 = execa.shellSync;

// Reference: https://www.gaijin.at/en/lstwinver.php
const names = new Map([
	['10.0', '10'],
	['6.3', '8.1'],
	['6.2', '8'],
	['6.1', '7'],
	['6.0', 'Vista'],
	['5.2', 'Server 2003'],
	['5.1', 'XP'],
	['5.0', '2000'],
	['4.9', 'ME'],
	['4.1', '98'],
	['4.0', '95']
]);

const windowsRelease = release => {
	const version = /\d+\.\d/.exec(release || os.release());

	if (release && !version) {
		throw new Error('`release` argument doesn\'t match `n.n`');
	}

	const ver = (version || [])[0];

	// Server 2008, 2012, 2016, and 2019 versions are ambiguous with desktop versions and must be detected at runtime.
	// If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
	// then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
	// If `wmic` is obsoloete (later versions of Windows 10), use PowerShell instead.
	// If the resulting caption contains the year 2008, 2012, 2016 or 2019, it is a server version, so return a server OS name.
	if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
		let stdout;
		try {
			stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
		} catch (_) {
			stdout = execa.sync('powershell', ['(Get-CimInstance -ClassName Win32_OperatingSystem).caption']).stdout || '';
		}

		const year = (stdout.match(/2008|2012|2016|2019/) || [])[0];

		if (year) {
			return `Server ${year}`;
		}
	}

	return names.get(ver);
};

var windowsRelease_1 = windowsRelease;

const osName = (platform, release) => {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os.platform() === 'darwin') {
			release = os.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
		id = release ? macosRelease_1(release).name : '';
		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os.platform() === 'linux') {
			release = os.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os.platform() === 'win32') {
			release = os.release();
		}

		id = release ? windowsRelease_1(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};

var osName_1 = osName;

var universalUserAgent = getUserAgentNode;



function getUserAgentNode () {
	try {
		return `Node.js/${process.version.substr(1)} (${osName_1()}; ${process.arch})`
	} catch (error) {
		if (/wmic os get Caption/.test(error.message)) {
			return 'Windows <version undetectable>'
		}

		throw error
	}
}

var _args = [
	[
		"@octokit/graphql@2.1.3",
		"/home/dan/git/binarycocoa/clover-reporter-action"
	]
];
var _from = "@octokit/graphql@2.1.3";
var _id = "@octokit/graphql@2.1.3";
var _inBundle = false;
var _integrity = "sha512-XoXJqL2ondwdnMIW3wtqJWEwcBfKk37jO/rYkoxNPEVeLBDGsGO1TCWggrAlq3keGt/O+C/7VepXnukUxwt5vA==";
var _location = "/@octokit/graphql";
var _phantomChildren = {
};
var _requested = {
	type: "version",
	registry: true,
	raw: "@octokit/graphql@2.1.3",
	name: "@octokit/graphql",
	escapedName: "@octokit%2fgraphql",
	scope: "@octokit",
	rawSpec: "2.1.3",
	saveSpec: null,
	fetchSpec: "2.1.3"
};
var _requiredBy = [
	"/@actions/github"
];
var _resolved = "https://registry.npmjs.org/@octokit/graphql/-/graphql-2.1.3.tgz";
var _spec = "2.1.3";
var _where = "/home/dan/git/binarycocoa/clover-reporter-action";
var author = {
	name: "Gregor Martynus",
	url: "https://github.com/gr2m"
};
var bugs = {
	url: "https://github.com/octokit/graphql.js/issues"
};
var bundlesize = [
	{
		path: "./dist/octokit-graphql.min.js.gz",
		maxSize: "5KB"
	}
];
var dependencies = {
	"@octokit/request": "^5.0.0",
	"universal-user-agent": "^2.0.3"
};
var description = "GitHub GraphQL API client for browsers and Node";
var devDependencies = {
	chai: "^4.2.0",
	"compression-webpack-plugin": "^2.0.0",
	coveralls: "^3.0.3",
	cypress: "^3.1.5",
	"fetch-mock": "^7.3.1",
	mkdirp: "^0.5.1",
	mocha: "^6.0.0",
	"npm-run-all": "^4.1.3",
	nyc: "^14.0.0",
	"semantic-release": "^15.13.3",
	"simple-mock": "^0.8.0",
	standard: "^12.0.1",
	webpack: "^4.29.6",
	"webpack-bundle-analyzer": "^3.1.0",
	"webpack-cli": "^3.2.3"
};
var files = [
	"lib"
];
var homepage = "https://github.com/octokit/graphql.js#readme";
var keywords = [
	"octokit",
	"github",
	"api",
	"graphql"
];
var license = "MIT";
var main = "index.js";
var name = "@octokit/graphql";
var publishConfig = {
	access: "public"
};
var release = {
	publish: [
		"@semantic-release/npm",
		{
			path: "@semantic-release/github",
			assets: [
				"dist/*",
				"!dist/*.map.gz"
			]
		}
	]
};
var repository = {
	type: "git",
	url: "git+https://github.com/octokit/graphql.js.git"
};
var scripts = {
	build: "npm-run-all build:*",
	"build:development": "webpack --mode development --entry . --output-library=octokitGraphql --output=./dist/octokit-graphql.js --profile --json > dist/bundle-stats.json",
	"build:production": "webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=octokitGraphql --output-path=./dist --output-filename=octokit-graphql.min.js --devtool source-map",
	"bundle-report": "webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html",
	coverage: "nyc report --reporter=html && open coverage/index.html",
	"coverage:upload": "nyc report --reporter=text-lcov | coveralls",
	prebuild: "mkdirp dist/",
	pretest: "standard",
	test: "nyc mocha test/*-test.js",
	"test:browser": "cypress run --browser chrome"
};
var standard = {
	globals: [
		"describe",
		"before",
		"beforeEach",
		"afterEach",
		"after",
		"it",
		"expect"
	]
};
var version = "2.1.3";
var _package = {
	_args: _args,
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_spec: _spec,
	_where: _where,
	author: author,
	bugs: bugs,
	bundlesize: bundlesize,
	dependencies: dependencies,
	description: description,
	devDependencies: devDependencies,
	files: files,
	homepage: homepage,
	keywords: keywords,
	license: license,
	main: main,
	name: name,
	publishConfig: publishConfig,
	release: release,
	repository: repository,
	scripts: scripts,
	standard: standard,
	version: version
};

var _package$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	_args: _args,
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_spec: _spec,
	_where: _where,
	author: author,
	bugs: bugs,
	bundlesize: bundlesize,
	dependencies: dependencies,
	description: description,
	devDependencies: devDependencies,
	files: files,
	homepage: homepage,
	keywords: keywords,
	license: license,
	main: main,
	name: name,
	publishConfig: publishConfig,
	release: release,
	repository: repository,
	scripts: scripts,
	standard: standard,
	version: version,
	'default': _package
});

var error = class GraphqlError extends Error {
	constructor (request, response) {
		const message = response.data.errors[0].message;
		super(message);

		Object.assign(this, response.data);
		this.name = 'GraphqlError';
		this.request = request;

		// Maintains proper stack trace (only available on V8)
		/* istanbul ignore next */
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
};

var graphql_1 = graphql;



const NON_VARIABLE_OPTIONS = ['method', 'baseUrl', 'url', 'headers', 'request', 'query'];

function graphql (request, query, options) {
	if (typeof query === 'string') {
		options = Object.assign({ query }, options);
	} else {
		options = query;
	}

	const requestOptions = Object.keys(options).reduce((result, key) => {
		if (NON_VARIABLE_OPTIONS.includes(key)) {
			result[key] = options[key];
			return result
		}

		if (!result.variables) {
			result.variables = {};
		}

		result.variables[key] = options[key];
		return result
	}, {});

	return request(requestOptions)
		.then(response => {
			if (response.data.errors) {
				throw new error(requestOptions, response)
			}

			return response.data.data
		})
}

var withDefaults_1 = withDefaults;



function withDefaults (request, newDefaults) {
	const newRequest = request.defaults(newDefaults);
	const newApi = function (query, options) {
		return graphql_1(newRequest, query, options)
	};

	newApi.defaults = withDefaults.bind(null, newRequest);
	return newApi
}

var require$$1 = getCjsExportFromNamespace(_package$1);

const { request } = distNode$5;


const version$1 = require$$1.version;
const userAgent = `octokit-graphql.js/${version$1} ${universalUserAgent()}`;



var graphql$1 = withDefaults_1(request, {
	method: 'POST',
	url: '/graphql',
	headers: {
		'user-agent': userAgent
	}
});

var distNode$6 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	const VERSION = "1.0.0";

	/**
	 * @param octokit Octokit instance
	 * @param options Options passed to Octokit constructor
	 */

	function requestLog(octokit) {
		octokit.hook.wrap("request", (request, options) => {
			octokit.log.debug("request", options);
			const start = Date.now();
			const requestOptions = octokit.request.endpoint.parse(options);
			const path = requestOptions.url.replace(options.baseUrl, "");
			return request(options).then(response => {
				octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
				return response;
			}).catch(error => {
				octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`);
				throw error;
			});
		});
	}
	requestLog.VERSION = VERSION;

	exports.requestLog = requestLog;

});

unwrapExports(distNode$6);
var distNode_1$6 = distNode$6.requestLog;

var distNode$7 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });



	var endpointsByScope = {
		actions: {
			cancelWorkflowRun: {
				method: "POST",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					run_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/runs/:run_id/cancel"
			},
			createOrUpdateSecretForRepo: {
				method: "PUT",
				params: {
					encrypted_value: {
						type: "string"
					},
					key_id: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/secrets/:name"
			},
			createRegistrationToken: {
				method: "POST",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/runners/registration-token"
			},
			createRemoveToken: {
				method: "POST",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/runners/remove-token"
			},
			deleteArtifact: {
				method: "DELETE",
				params: {
					artifact_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
			},
			deleteSecretFromRepo: {
				method: "DELETE",
				params: {
					name: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/secrets/:name"
			},
			downloadArtifact: {
				method: "GET",
				params: {
					archive_format: {
						required: true,
						type: "string"
					},
					artifact_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/artifacts/:artifact_id/:archive_format"
			},
			getArtifact: {
				method: "GET",
				params: {
					artifact_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
			},
			getPublicKey: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/secrets/public-key"
			},
			getSecret: {
				method: "GET",
				params: {
					name: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/secrets/:name"
			},
			getSelfHostedRunner: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					runner_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/runners/:runner_id"
			},
			getWorkflow: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					workflow_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/workflows/:workflow_id"
			},
			getWorkflowJob: {
				method: "GET",
				params: {
					job_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/jobs/:job_id"
			},
			getWorkflowRun: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					run_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/runs/:run_id"
			},
			listDownloadsForSelfHostedRunnerApplication: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/runners/downloads"
			},
			listJobsForWorkflowRun: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					run_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/runs/:run_id/jobs"
			},
			listRepoWorkflowRuns: {
				method: "GET",
				params: {
					actor: {
						type: "string"
					},
					branch: {
						type: "string"
					},
					event: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					status: {
						enum: ["completed", "status", "conclusion"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/runs"
			},
			listRepoWorkflows: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/workflows"
			},
			listSecretsForRepo: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/secrets"
			},
			listSelfHostedRunnersForRepo: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/runners"
			},
			listWorkflowJobLogs: {
				method: "GET",
				params: {
					job_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/actions/jobs/:job_id/logs"
			},
			listWorkflowRunArtifacts: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					run_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/runs/:run_id/artifacts"
			},
			listWorkflowRunLogs: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					run_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/runs/:run_id/logs"
			},
			listWorkflowRuns: {
				method: "GET",
				params: {
					actor: {
						type: "string"
					},
					branch: {
						type: "string"
					},
					event: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					status: {
						enum: ["completed", "status", "conclusion"],
						type: "string"
					},
					workflow_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/workflows/:workflow_id/runs"
			},
			reRunWorkflow: {
				method: "POST",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					run_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/runs/:run_id/rerun"
			},
			removeSelfHostedRunner: {
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					runner_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/actions/runners/:runner_id"
			}
		},
		activity: {
			checkStarringRepo: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/user/starred/:owner/:repo"
			},
			deleteRepoSubscription: {
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/subscription"
			},
			deleteThreadSubscription: {
				method: "DELETE",
				params: {
					thread_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/notifications/threads/:thread_id/subscription"
			},
			getRepoSubscription: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/subscription"
			},
			getThread: {
				method: "GET",
				params: {
					thread_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/notifications/threads/:thread_id"
			},
			getThreadSubscription: {
				method: "GET",
				params: {
					thread_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/notifications/threads/:thread_id/subscription"
			},
			listEventsForOrg: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/events/orgs/:org"
			},
			listEventsForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/events"
			},
			listFeeds: {
				method: "GET",
				params: {},
				url: "/feeds"
			},
			listNotifications: {
				method: "GET",
				params: {
					all: {
						type: "boolean"
					},
					before: {
						type: "string"
					},
					page: {
						type: "integer"
					},
					participating: {
						type: "boolean"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					}
				},
				url: "/notifications"
			},
			listNotificationsForRepo: {
				method: "GET",
				params: {
					all: {
						type: "boolean"
					},
					before: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					participating: {
						type: "boolean"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					since: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/notifications"
			},
			listPublicEvents: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/events"
			},
			listPublicEventsForOrg: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/events"
			},
			listPublicEventsForRepoNetwork: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/networks/:owner/:repo/events"
			},
			listPublicEventsForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/events/public"
			},
			listReceivedEventsForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/received_events"
			},
			listReceivedPublicEventsForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/received_events/public"
			},
			listRepoEvents: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/events"
			},
			listReposStarredByAuthenticatedUser: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					sort: {
						enum: ["created", "updated"],
						type: "string"
					}
				},
				url: "/user/starred"
			},
			listReposStarredByUser: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					sort: {
						enum: ["created", "updated"],
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/starred"
			},
			listReposWatchedByUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/subscriptions"
			},
			listStargazersForRepo: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/stargazers"
			},
			listWatchedReposForAuthenticatedUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/subscriptions"
			},
			listWatchersForRepo: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/subscribers"
			},
			markAsRead: {
				method: "PUT",
				params: {
					last_read_at: {
						type: "string"
					}
				},
				url: "/notifications"
			},
			markNotificationsAsReadForRepo: {
				method: "PUT",
				params: {
					last_read_at: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/notifications"
			},
			markThreadAsRead: {
				method: "PATCH",
				params: {
					thread_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/notifications/threads/:thread_id"
			},
			setRepoSubscription: {
				method: "PUT",
				params: {
					ignored: {
						type: "boolean"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					subscribed: {
						type: "boolean"
					}
				},
				url: "/repos/:owner/:repo/subscription"
			},
			setThreadSubscription: {
				method: "PUT",
				params: {
					ignored: {
						type: "boolean"
					},
					thread_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/notifications/threads/:thread_id/subscription"
			},
			starRepo: {
				method: "PUT",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/user/starred/:owner/:repo"
			},
			unstarRepo: {
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/user/starred/:owner/:repo"
			}
		},
		apps: {
			addRepoToInstallation: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "PUT",
				params: {
					installation_id: {
						required: true,
						type: "integer"
					},
					repository_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/installations/:installation_id/repositories/:repository_id"
			},
			checkAccountIsAssociatedWithAny: {
				method: "GET",
				params: {
					account_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/marketplace_listing/accounts/:account_id"
			},
			checkAccountIsAssociatedWithAnyStubbed: {
				method: "GET",
				params: {
					account_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/marketplace_listing/stubbed/accounts/:account_id"
			},
			checkAuthorization: {
				deprecated: "octokit.apps.checkAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#check-an-authorization",
				method: "GET",
				params: {
					access_token: {
						required: true,
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/tokens/:access_token"
			},
			checkToken: {
				headers: {
					accept: "application/vnd.github.doctor-strange-preview+json"
				},
				method: "POST",
				params: {
					access_token: {
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/token"
			},
			createContentAttachment: {
				headers: {
					accept: "application/vnd.github.corsair-preview+json"
				},
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					content_reference_id: {
						required: true,
						type: "integer"
					},
					title: {
						required: true,
						type: "string"
					}
				},
				url: "/content_references/:content_reference_id/attachments"
			},
			createFromManifest: {
				headers: {
					accept: "application/vnd.github.fury-preview+json"
				},
				method: "POST",
				params: {
					code: {
						required: true,
						type: "string"
					}
				},
				url: "/app-manifests/:code/conversions"
			},
			createInstallationToken: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "POST",
				params: {
					installation_id: {
						required: true,
						type: "integer"
					},
					permissions: {
						type: "object"
					},
					repository_ids: {
						type: "integer[]"
					}
				},
				url: "/app/installations/:installation_id/access_tokens"
			},
			deleteAuthorization: {
				headers: {
					accept: "application/vnd.github.doctor-strange-preview+json"
				},
				method: "DELETE",
				params: {
					access_token: {
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/grant"
			},
			deleteInstallation: {
				headers: {
					accept: "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
				},
				method: "DELETE",
				params: {
					installation_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/app/installations/:installation_id"
			},
			deleteToken: {
				headers: {
					accept: "application/vnd.github.doctor-strange-preview+json"
				},
				method: "DELETE",
				params: {
					access_token: {
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/token"
			},
			findOrgInstallation: {
				deprecated: "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/installation"
			},
			findRepoInstallation: {
				deprecated: "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/installation"
			},
			findUserInstallation: {
				deprecated: "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/installation"
			},
			getAuthenticated: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {},
				url: "/app"
			},
			getBySlug: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					app_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/apps/:app_slug"
			},
			getInstallation: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					installation_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/app/installations/:installation_id"
			},
			getOrgInstallation: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/installation"
			},
			getRepoInstallation: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/installation"
			},
			getUserInstallation: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/installation"
			},
			listAccountsUserOrOrgOnPlan: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					plan_id: {
						required: true,
						type: "integer"
					},
					sort: {
						enum: ["created", "updated"],
						type: "string"
					}
				},
				url: "/marketplace_listing/plans/:plan_id/accounts"
			},
			listAccountsUserOrOrgOnPlanStubbed: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					plan_id: {
						required: true,
						type: "integer"
					},
					sort: {
						enum: ["created", "updated"],
						type: "string"
					}
				},
				url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
			},
			listInstallationReposForAuthenticatedUser: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					installation_id: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/installations/:installation_id/repositories"
			},
			listInstallations: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/app/installations"
			},
			listInstallationsForAuthenticatedUser: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/installations"
			},
			listMarketplacePurchasesForAuthenticatedUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/marketplace_purchases"
			},
			listMarketplacePurchasesForAuthenticatedUserStubbed: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/marketplace_purchases/stubbed"
			},
			listPlans: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/marketplace_listing/plans"
			},
			listPlansStubbed: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/marketplace_listing/stubbed/plans"
			},
			listRepos: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/installation/repositories"
			},
			removeRepoFromInstallation: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "DELETE",
				params: {
					installation_id: {
						required: true,
						type: "integer"
					},
					repository_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/installations/:installation_id/repositories/:repository_id"
			},
			resetAuthorization: {
				deprecated: "octokit.apps.resetAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#reset-an-authorization",
				method: "POST",
				params: {
					access_token: {
						required: true,
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/tokens/:access_token"
			},
			resetToken: {
				headers: {
					accept: "application/vnd.github.doctor-strange-preview+json"
				},
				method: "PATCH",
				params: {
					access_token: {
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/token"
			},
			revokeAuthorizationForApplication: {
				deprecated: "octokit.apps.revokeAuthorizationForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-an-authorization-for-an-application",
				method: "DELETE",
				params: {
					access_token: {
						required: true,
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/tokens/:access_token"
			},
			revokeGrantForApplication: {
				deprecated: "octokit.apps.revokeGrantForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-a-grant-for-an-application",
				method: "DELETE",
				params: {
					access_token: {
						required: true,
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/grants/:access_token"
			},
			revokeInstallationToken: {
				headers: {
					accept: "application/vnd.github.gambit-preview+json"
				},
				method: "DELETE",
				params: {},
				url: "/installation/token"
			}
		},
		checks: {
			create: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "POST",
				params: {
					actions: {
						type: "object[]"
					},
					"actions[].description": {
						required: true,
						type: "string"
					},
					"actions[].identifier": {
						required: true,
						type: "string"
					},
					"actions[].label": {
						required: true,
						type: "string"
					},
					completed_at: {
						type: "string"
					},
					conclusion: {
						enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
						type: "string"
					},
					details_url: {
						type: "string"
					},
					external_id: {
						type: "string"
					},
					head_sha: {
						required: true,
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					output: {
						type: "object"
					},
					"output.annotations": {
						type: "object[]"
					},
					"output.annotations[].annotation_level": {
						enum: ["notice", "warning", "failure"],
						required: true,
						type: "string"
					},
					"output.annotations[].end_column": {
						type: "integer"
					},
					"output.annotations[].end_line": {
						required: true,
						type: "integer"
					},
					"output.annotations[].message": {
						required: true,
						type: "string"
					},
					"output.annotations[].path": {
						required: true,
						type: "string"
					},
					"output.annotations[].raw_details": {
						type: "string"
					},
					"output.annotations[].start_column": {
						type: "integer"
					},
					"output.annotations[].start_line": {
						required: true,
						type: "integer"
					},
					"output.annotations[].title": {
						type: "string"
					},
					"output.images": {
						type: "object[]"
					},
					"output.images[].alt": {
						required: true,
						type: "string"
					},
					"output.images[].caption": {
						type: "string"
					},
					"output.images[].image_url": {
						required: true,
						type: "string"
					},
					"output.summary": {
						required: true,
						type: "string"
					},
					"output.text": {
						type: "string"
					},
					"output.title": {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					started_at: {
						type: "string"
					},
					status: {
						enum: ["queued", "in_progress", "completed"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-runs"
			},
			createSuite: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "POST",
				params: {
					head_sha: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-suites"
			},
			get: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "GET",
				params: {
					check_run_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-runs/:check_run_id"
			},
			getSuite: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "GET",
				params: {
					check_suite_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-suites/:check_suite_id"
			},
			listAnnotations: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "GET",
				params: {
					check_run_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
			},
			listForRef: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "GET",
				params: {
					check_name: {
						type: "string"
					},
					filter: {
						enum: ["latest", "all"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					status: {
						enum: ["queued", "in_progress", "completed"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:ref/check-runs"
			},
			listForSuite: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "GET",
				params: {
					check_name: {
						type: "string"
					},
					check_suite_id: {
						required: true,
						type: "integer"
					},
					filter: {
						enum: ["latest", "all"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					status: {
						enum: ["queued", "in_progress", "completed"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
			},
			listSuitesForRef: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "GET",
				params: {
					app_id: {
						type: "integer"
					},
					check_name: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:ref/check-suites"
			},
			rerequestSuite: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "POST",
				params: {
					check_suite_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
			},
			setSuitesPreferences: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "PATCH",
				params: {
					auto_trigger_checks: {
						type: "object[]"
					},
					"auto_trigger_checks[].app_id": {
						required: true,
						type: "integer"
					},
					"auto_trigger_checks[].setting": {
						required: true,
						type: "boolean"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-suites/preferences"
			},
			update: {
				headers: {
					accept: "application/vnd.github.antiope-preview+json"
				},
				method: "PATCH",
				params: {
					actions: {
						type: "object[]"
					},
					"actions[].description": {
						required: true,
						type: "string"
					},
					"actions[].identifier": {
						required: true,
						type: "string"
					},
					"actions[].label": {
						required: true,
						type: "string"
					},
					check_run_id: {
						required: true,
						type: "integer"
					},
					completed_at: {
						type: "string"
					},
					conclusion: {
						enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
						type: "string"
					},
					details_url: {
						type: "string"
					},
					external_id: {
						type: "string"
					},
					name: {
						type: "string"
					},
					output: {
						type: "object"
					},
					"output.annotations": {
						type: "object[]"
					},
					"output.annotations[].annotation_level": {
						enum: ["notice", "warning", "failure"],
						required: true,
						type: "string"
					},
					"output.annotations[].end_column": {
						type: "integer"
					},
					"output.annotations[].end_line": {
						required: true,
						type: "integer"
					},
					"output.annotations[].message": {
						required: true,
						type: "string"
					},
					"output.annotations[].path": {
						required: true,
						type: "string"
					},
					"output.annotations[].raw_details": {
						type: "string"
					},
					"output.annotations[].start_column": {
						type: "integer"
					},
					"output.annotations[].start_line": {
						required: true,
						type: "integer"
					},
					"output.annotations[].title": {
						type: "string"
					},
					"output.images": {
						type: "object[]"
					},
					"output.images[].alt": {
						required: true,
						type: "string"
					},
					"output.images[].caption": {
						type: "string"
					},
					"output.images[].image_url": {
						required: true,
						type: "string"
					},
					"output.summary": {
						required: true,
						type: "string"
					},
					"output.text": {
						type: "string"
					},
					"output.title": {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					started_at: {
						type: "string"
					},
					status: {
						enum: ["queued", "in_progress", "completed"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/check-runs/:check_run_id"
			}
		},
		codesOfConduct: {
			getConductCode: {
				headers: {
					accept: "application/vnd.github.scarlet-witch-preview+json"
				},
				method: "GET",
				params: {
					key: {
						required: true,
						type: "string"
					}
				},
				url: "/codes_of_conduct/:key"
			},
			getForRepo: {
				headers: {
					accept: "application/vnd.github.scarlet-witch-preview+json"
				},
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/community/code_of_conduct"
			},
			listConductCodes: {
				headers: {
					accept: "application/vnd.github.scarlet-witch-preview+json"
				},
				method: "GET",
				params: {},
				url: "/codes_of_conduct"
			}
		},
		emojis: {
			get: {
				method: "GET",
				params: {},
				url: "/emojis"
			}
		},
		gists: {
			checkIsStarred: {
				method: "GET",
				params: {
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/star"
			},
			create: {
				method: "POST",
				params: {
					description: {
						type: "string"
					},
					files: {
						required: true,
						type: "object"
					},
					"files.content": {
						type: "string"
					},
					public: {
						type: "boolean"
					}
				},
				url: "/gists"
			},
			createComment: {
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/comments"
			},
			delete: {
				method: "DELETE",
				params: {
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id"
			},
			deleteComment: {
				method: "DELETE",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/comments/:comment_id"
			},
			fork: {
				method: "POST",
				params: {
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/forks"
			},
			get: {
				method: "GET",
				params: {
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id"
			},
			getComment: {
				method: "GET",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/comments/:comment_id"
			},
			getRevision: {
				method: "GET",
				params: {
					gist_id: {
						required: true,
						type: "string"
					},
					sha: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/:sha"
			},
			list: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					}
				},
				url: "/gists"
			},
			listComments: {
				method: "GET",
				params: {
					gist_id: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/gists/:gist_id/comments"
			},
			listCommits: {
				method: "GET",
				params: {
					gist_id: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/gists/:gist_id/commits"
			},
			listForks: {
				method: "GET",
				params: {
					gist_id: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/gists/:gist_id/forks"
			},
			listPublic: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					}
				},
				url: "/gists/public"
			},
			listPublicForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/gists"
			},
			listStarred: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					}
				},
				url: "/gists/starred"
			},
			star: {
				method: "PUT",
				params: {
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/star"
			},
			unstar: {
				method: "DELETE",
				params: {
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/star"
			},
			update: {
				method: "PATCH",
				params: {
					description: {
						type: "string"
					},
					files: {
						type: "object"
					},
					"files.content": {
						type: "string"
					},
					"files.filename": {
						type: "string"
					},
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id"
			},
			updateComment: {
				method: "PATCH",
				params: {
					body: {
						required: true,
						type: "string"
					},
					comment_id: {
						required: true,
						type: "integer"
					},
					gist_id: {
						required: true,
						type: "string"
					}
				},
				url: "/gists/:gist_id/comments/:comment_id"
			}
		},
		git: {
			createBlob: {
				method: "POST",
				params: {
					content: {
						required: true,
						type: "string"
					},
					encoding: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/blobs"
			},
			createCommit: {
				method: "POST",
				params: {
					author: {
						type: "object"
					},
					"author.date": {
						type: "string"
					},
					"author.email": {
						type: "string"
					},
					"author.name": {
						type: "string"
					},
					committer: {
						type: "object"
					},
					"committer.date": {
						type: "string"
					},
					"committer.email": {
						type: "string"
					},
					"committer.name": {
						type: "string"
					},
					message: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					parents: {
						required: true,
						type: "string[]"
					},
					repo: {
						required: true,
						type: "string"
					},
					signature: {
						type: "string"
					},
					tree: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/commits"
			},
			createRef: {
				method: "POST",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/refs"
			},
			createTag: {
				method: "POST",
				params: {
					message: {
						required: true,
						type: "string"
					},
					object: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					tag: {
						required: true,
						type: "string"
					},
					tagger: {
						type: "object"
					},
					"tagger.date": {
						type: "string"
					},
					"tagger.email": {
						type: "string"
					},
					"tagger.name": {
						type: "string"
					},
					type: {
						enum: ["commit", "tree", "blob"],
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/tags"
			},
			createTree: {
				method: "POST",
				params: {
					base_tree: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					tree: {
						required: true,
						type: "object[]"
					},
					"tree[].content": {
						type: "string"
					},
					"tree[].mode": {
						enum: ["100644", "100755", "040000", "160000", "120000"],
						type: "string"
					},
					"tree[].path": {
						type: "string"
					},
					"tree[].sha": {
						allowNull: true,
						type: "string"
					},
					"tree[].type": {
						enum: ["blob", "tree", "commit"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/trees"
			},
			deleteRef: {
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/refs/:ref"
			},
			getBlob: {
				method: "GET",
				params: {
					file_sha: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/blobs/:file_sha"
			},
			getCommit: {
				method: "GET",
				params: {
					commit_sha: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/commits/:commit_sha"
			},
			getRef: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/ref/:ref"
			},
			getTag: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					tag_sha: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/tags/:tag_sha"
			},
			getTree: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					recursive: {
						enum: ["1"],
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					tree_sha: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/trees/:tree_sha"
			},
			listMatchingRefs: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/matching-refs/:ref"
			},
			listRefs: {
				method: "GET",
				params: {
					namespace: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/refs/:namespace"
			},
			updateRef: {
				method: "PATCH",
				params: {
					force: {
						type: "boolean"
					},
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/git/refs/:ref"
			}
		},
		gitignore: {
			getTemplate: {
				method: "GET",
				params: {
					name: {
						required: true,
						type: "string"
					}
				},
				url: "/gitignore/templates/:name"
			},
			listTemplates: {
				method: "GET",
				params: {},
				url: "/gitignore/templates"
			}
		},
		interactions: {
			addOrUpdateRestrictionsForOrg: {
				headers: {
					accept: "application/vnd.github.sombra-preview+json"
				},
				method: "PUT",
				params: {
					limit: {
						enum: ["existing_users", "contributors_only", "collaborators_only"],
						required: true,
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/interaction-limits"
			},
			addOrUpdateRestrictionsForRepo: {
				headers: {
					accept: "application/vnd.github.sombra-preview+json"
				},
				method: "PUT",
				params: {
					limit: {
						enum: ["existing_users", "contributors_only", "collaborators_only"],
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/interaction-limits"
			},
			getRestrictionsForOrg: {
				headers: {
					accept: "application/vnd.github.sombra-preview+json"
				},
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/interaction-limits"
			},
			getRestrictionsForRepo: {
				headers: {
					accept: "application/vnd.github.sombra-preview+json"
				},
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/interaction-limits"
			},
			removeRestrictionsForOrg: {
				headers: {
					accept: "application/vnd.github.sombra-preview+json"
				},
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/interaction-limits"
			},
			removeRestrictionsForRepo: {
				headers: {
					accept: "application/vnd.github.sombra-preview+json"
				},
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/interaction-limits"
			}
		},
		issues: {
			addAssignees: {
				method: "POST",
				params: {
					assignees: {
						type: "string[]"
					},
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/assignees"
			},
			addLabels: {
				method: "POST",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					labels: {
						required: true,
						type: "string[]"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/labels"
			},
			checkAssignee: {
				method: "GET",
				params: {
					assignee: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/assignees/:assignee"
			},
			create: {
				method: "POST",
				params: {
					assignee: {
						type: "string"
					},
					assignees: {
						type: "string[]"
					},
					body: {
						type: "string"
					},
					labels: {
						type: "string[]"
					},
					milestone: {
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					title: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues"
			},
			createComment: {
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/comments"
			},
			createLabel: {
				method: "POST",
				params: {
					color: {
						required: true,
						type: "string"
					},
					description: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/labels"
			},
			createMilestone: {
				method: "POST",
				params: {
					description: {
						type: "string"
					},
					due_on: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					state: {
						enum: ["open", "closed"],
						type: "string"
					},
					title: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/milestones"
			},
			deleteComment: {
				method: "DELETE",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/comments/:comment_id"
			},
			deleteLabel: {
				method: "DELETE",
				params: {
					name: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/labels/:name"
			},
			deleteMilestone: {
				method: "DELETE",
				params: {
					milestone_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "milestone_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/milestones/:milestone_number"
			},
			get: {
				method: "GET",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number"
			},
			getComment: {
				method: "GET",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/comments/:comment_id"
			},
			getEvent: {
				method: "GET",
				params: {
					event_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/events/:event_id"
			},
			getLabel: {
				method: "GET",
				params: {
					name: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/labels/:name"
			},
			getMilestone: {
				method: "GET",
				params: {
					milestone_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "milestone_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/milestones/:milestone_number"
			},
			list: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					filter: {
						enum: ["assigned", "created", "mentioned", "subscribed", "all"],
						type: "string"
					},
					labels: {
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					},
					sort: {
						enum: ["created", "updated", "comments"],
						type: "string"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					}
				},
				url: "/issues"
			},
			listAssignees: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/assignees"
			},
			listComments: {
				method: "GET",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					since: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/comments"
			},
			listCommentsForRepo: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					since: {
						type: "string"
					},
					sort: {
						enum: ["created", "updated"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/comments"
			},
			listEvents: {
				method: "GET",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/events"
			},
			listEventsForRepo: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/events"
			},
			listEventsForTimeline: {
				headers: {
					accept: "application/vnd.github.mockingbird-preview+json"
				},
				method: "GET",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/timeline"
			},
			listForAuthenticatedUser: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					filter: {
						enum: ["assigned", "created", "mentioned", "subscribed", "all"],
						type: "string"
					},
					labels: {
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					},
					sort: {
						enum: ["created", "updated", "comments"],
						type: "string"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					}
				},
				url: "/user/issues"
			},
			listForOrg: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					filter: {
						enum: ["assigned", "created", "mentioned", "subscribed", "all"],
						type: "string"
					},
					labels: {
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					},
					sort: {
						enum: ["created", "updated", "comments"],
						type: "string"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					}
				},
				url: "/orgs/:org/issues"
			},
			listForRepo: {
				method: "GET",
				params: {
					assignee: {
						type: "string"
					},
					creator: {
						type: "string"
					},
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					labels: {
						type: "string"
					},
					mentioned: {
						type: "string"
					},
					milestone: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					since: {
						type: "string"
					},
					sort: {
						enum: ["created", "updated", "comments"],
						type: "string"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues"
			},
			listLabelsForMilestone: {
				method: "GET",
				params: {
					milestone_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "milestone_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
			},
			listLabelsForRepo: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/labels"
			},
			listLabelsOnIssue: {
				method: "GET",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/labels"
			},
			listMilestonesForRepo: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["due_on", "completeness"],
						type: "string"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/milestones"
			},
			lock: {
				method: "PUT",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					lock_reason: {
						enum: ["off-topic", "too heated", "resolved", "spam"],
						type: "string"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/lock"
			},
			removeAssignees: {
				method: "DELETE",
				params: {
					assignees: {
						type: "string[]"
					},
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/assignees"
			},
			removeLabel: {
				method: "DELETE",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					name: {
						required: true,
						type: "string"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
			},
			removeLabels: {
				method: "DELETE",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/labels"
			},
			replaceLabels: {
				method: "PUT",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					labels: {
						type: "string[]"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/labels"
			},
			unlock: {
				method: "DELETE",
				params: {
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/lock"
			},
			update: {
				method: "PATCH",
				params: {
					assignee: {
						type: "string"
					},
					assignees: {
						type: "string[]"
					},
					body: {
						type: "string"
					},
					issue_number: {
						required: true,
						type: "integer"
					},
					labels: {
						type: "string[]"
					},
					milestone: {
						allowNull: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					state: {
						enum: ["open", "closed"],
						type: "string"
					},
					title: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number"
			},
			updateComment: {
				method: "PATCH",
				params: {
					body: {
						required: true,
						type: "string"
					},
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/comments/:comment_id"
			},
			updateLabel: {
				method: "PATCH",
				params: {
					color: {
						type: "string"
					},
					current_name: {
						required: true,
						type: "string"
					},
					description: {
						type: "string"
					},
					name: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/labels/:current_name"
			},
			updateMilestone: {
				method: "PATCH",
				params: {
					description: {
						type: "string"
					},
					due_on: {
						type: "string"
					},
					milestone_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "milestone_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					state: {
						enum: ["open", "closed"],
						type: "string"
					},
					title: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/milestones/:milestone_number"
			}
		},
		licenses: {
			get: {
				method: "GET",
				params: {
					license: {
						required: true,
						type: "string"
					}
				},
				url: "/licenses/:license"
			},
			getForRepo: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/license"
			},
			list: {
				deprecated: "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
				method: "GET",
				params: {},
				url: "/licenses"
			},
			listCommonlyUsed: {
				method: "GET",
				params: {},
				url: "/licenses"
			}
		},
		markdown: {
			render: {
				method: "POST",
				params: {
					context: {
						type: "string"
					},
					mode: {
						enum: ["markdown", "gfm"],
						type: "string"
					},
					text: {
						required: true,
						type: "string"
					}
				},
				url: "/markdown"
			},
			renderRaw: {
				headers: {
					"content-type": "text/plain; charset=utf-8"
				},
				method: "POST",
				params: {
					data: {
						mapTo: "data",
						required: true,
						type: "string"
					}
				},
				url: "/markdown/raw"
			}
		},
		meta: {
			get: {
				method: "GET",
				params: {},
				url: "/meta"
			}
		},
		migrations: {
			cancelImport: {
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/import"
			},
			deleteArchiveForAuthenticatedUser: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "DELETE",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/migrations/:migration_id/archive"
			},
			deleteArchiveForOrg: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "DELETE",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/migrations/:migration_id/archive"
			},
			downloadArchiveForOrg: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/migrations/:migration_id/archive"
			},
			getArchiveForAuthenticatedUser: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/migrations/:migration_id/archive"
			},
			getArchiveForOrg: {
				deprecated: "octokit.migrations.getArchiveForOrg() has been renamed to octokit.migrations.downloadArchiveForOrg() (2020-01-27)",
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/migrations/:migration_id/archive"
			},
			getCommitAuthors: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					since: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/import/authors"
			},
			getImportProgress: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/import"
			},
			getLargeFiles: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/import/large_files"
			},
			getStatusForAuthenticatedUser: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/migrations/:migration_id"
			},
			getStatusForOrg: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/migrations/:migration_id"
			},
			listForAuthenticatedUser: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/migrations"
			},
			listForOrg: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/migrations"
			},
			listReposForOrg: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/migrations/:migration_id/repositories"
			},
			listReposForUser: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "GET",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/:migration_id/repositories"
			},
			mapCommitAuthor: {
				method: "PATCH",
				params: {
					author_id: {
						required: true,
						type: "integer"
					},
					email: {
						type: "string"
					},
					name: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/import/authors/:author_id"
			},
			setLfsPreference: {
				method: "PATCH",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					use_lfs: {
						enum: ["opt_in", "opt_out"],
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/import/lfs"
			},
			startForAuthenticatedUser: {
				method: "POST",
				params: {
					exclude_attachments: {
						type: "boolean"
					},
					lock_repositories: {
						type: "boolean"
					},
					repositories: {
						required: true,
						type: "string[]"
					}
				},
				url: "/user/migrations"
			},
			startForOrg: {
				method: "POST",
				params: {
					exclude_attachments: {
						type: "boolean"
					},
					lock_repositories: {
						type: "boolean"
					},
					org: {
						required: true,
						type: "string"
					},
					repositories: {
						required: true,
						type: "string[]"
					}
				},
				url: "/orgs/:org/migrations"
			},
			startImport: {
				method: "PUT",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					tfvc_project: {
						type: "string"
					},
					vcs: {
						enum: ["subversion", "git", "mercurial", "tfvc"],
						type: "string"
					},
					vcs_password: {
						type: "string"
					},
					vcs_url: {
						required: true,
						type: "string"
					},
					vcs_username: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/import"
			},
			unlockRepoForAuthenticatedUser: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "DELETE",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					},
					repo_name: {
						required: true,
						type: "string"
					}
				},
				url: "/user/migrations/:migration_id/repos/:repo_name/lock"
			},
			unlockRepoForOrg: {
				headers: {
					accept: "application/vnd.github.wyandotte-preview+json"
				},
				method: "DELETE",
				params: {
					migration_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					repo_name: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
			},
			updateImport: {
				method: "PATCH",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					vcs_password: {
						type: "string"
					},
					vcs_username: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/import"
			}
		},
		oauthAuthorizations: {
			checkAuthorization: {
				deprecated: "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
				method: "GET",
				params: {
					access_token: {
						required: true,
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/tokens/:access_token"
			},
			createAuthorization: {
				deprecated: "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
				method: "POST",
				params: {
					client_id: {
						type: "string"
					},
					client_secret: {
						type: "string"
					},
					fingerprint: {
						type: "string"
					},
					note: {
						required: true,
						type: "string"
					},
					note_url: {
						type: "string"
					},
					scopes: {
						type: "string[]"
					}
				},
				url: "/authorizations"
			},
			deleteAuthorization: {
				deprecated: "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
				method: "DELETE",
				params: {
					authorization_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/authorizations/:authorization_id"
			},
			deleteGrant: {
				deprecated: "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
				method: "DELETE",
				params: {
					grant_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/applications/grants/:grant_id"
			},
			getAuthorization: {
				deprecated: "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
				method: "GET",
				params: {
					authorization_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/authorizations/:authorization_id"
			},
			getGrant: {
				deprecated: "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
				method: "GET",
				params: {
					grant_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/applications/grants/:grant_id"
			},
			getOrCreateAuthorizationForApp: {
				deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
				method: "PUT",
				params: {
					client_id: {
						required: true,
						type: "string"
					},
					client_secret: {
						required: true,
						type: "string"
					},
					fingerprint: {
						type: "string"
					},
					note: {
						type: "string"
					},
					note_url: {
						type: "string"
					},
					scopes: {
						type: "string[]"
					}
				},
				url: "/authorizations/clients/:client_id"
			},
			getOrCreateAuthorizationForAppAndFingerprint: {
				deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
				method: "PUT",
				params: {
					client_id: {
						required: true,
						type: "string"
					},
					client_secret: {
						required: true,
						type: "string"
					},
					fingerprint: {
						required: true,
						type: "string"
					},
					note: {
						type: "string"
					},
					note_url: {
						type: "string"
					},
					scopes: {
						type: "string[]"
					}
				},
				url: "/authorizations/clients/:client_id/:fingerprint"
			},
			getOrCreateAuthorizationForAppFingerprint: {
				deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
				method: "PUT",
				params: {
					client_id: {
						required: true,
						type: "string"
					},
					client_secret: {
						required: true,
						type: "string"
					},
					fingerprint: {
						required: true,
						type: "string"
					},
					note: {
						type: "string"
					},
					note_url: {
						type: "string"
					},
					scopes: {
						type: "string[]"
					}
				},
				url: "/authorizations/clients/:client_id/:fingerprint"
			},
			listAuthorizations: {
				deprecated: "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/authorizations"
			},
			listGrants: {
				deprecated: "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/applications/grants"
			},
			resetAuthorization: {
				deprecated: "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
				method: "POST",
				params: {
					access_token: {
						required: true,
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/tokens/:access_token"
			},
			revokeAuthorizationForApplication: {
				deprecated: "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
				method: "DELETE",
				params: {
					access_token: {
						required: true,
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/tokens/:access_token"
			},
			revokeGrantForApplication: {
				deprecated: "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
				method: "DELETE",
				params: {
					access_token: {
						required: true,
						type: "string"
					},
					client_id: {
						required: true,
						type: "string"
					}
				},
				url: "/applications/:client_id/grants/:access_token"
			},
			updateAuthorization: {
				deprecated: "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
				method: "PATCH",
				params: {
					add_scopes: {
						type: "string[]"
					},
					authorization_id: {
						required: true,
						type: "integer"
					},
					fingerprint: {
						type: "string"
					},
					note: {
						type: "string"
					},
					note_url: {
						type: "string"
					},
					remove_scopes: {
						type: "string[]"
					},
					scopes: {
						type: "string[]"
					}
				},
				url: "/authorizations/:authorization_id"
			}
		},
		orgs: {
			addOrUpdateMembership: {
				method: "PUT",
				params: {
					org: {
						required: true,
						type: "string"
					},
					role: {
						enum: ["admin", "member"],
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/memberships/:username"
			},
			blockUser: {
				method: "PUT",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/blocks/:username"
			},
			checkBlockedUser: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/blocks/:username"
			},
			checkMembership: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/members/:username"
			},
			checkPublicMembership: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/public_members/:username"
			},
			concealMembership: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/public_members/:username"
			},
			convertMemberToOutsideCollaborator: {
				method: "PUT",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/outside_collaborators/:username"
			},
			createHook: {
				method: "POST",
				params: {
					active: {
						type: "boolean"
					},
					config: {
						required: true,
						type: "object"
					},
					"config.content_type": {
						type: "string"
					},
					"config.insecure_ssl": {
						type: "string"
					},
					"config.secret": {
						type: "string"
					},
					"config.url": {
						required: true,
						type: "string"
					},
					events: {
						type: "string[]"
					},
					name: {
						required: true,
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/hooks"
			},
			createInvitation: {
				method: "POST",
				params: {
					email: {
						type: "string"
					},
					invitee_id: {
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					role: {
						enum: ["admin", "direct_member", "billing_manager"],
						type: "string"
					},
					team_ids: {
						type: "integer[]"
					}
				},
				url: "/orgs/:org/invitations"
			},
			deleteHook: {
				method: "DELETE",
				params: {
					hook_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/hooks/:hook_id"
			},
			get: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org"
			},
			getHook: {
				method: "GET",
				params: {
					hook_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/hooks/:hook_id"
			},
			getMembership: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/memberships/:username"
			},
			getMembershipForAuthenticatedUser: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/user/memberships/orgs/:org"
			},
			list: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "integer"
					}
				},
				url: "/organizations"
			},
			listBlockedUsers: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/blocks"
			},
			listForAuthenticatedUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/orgs"
			},
			listForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/orgs"
			},
			listHooks: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/hooks"
			},
			listInstallations: {
				headers: {
					accept: "application/vnd.github.machine-man-preview+json"
				},
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/installations"
			},
			listInvitationTeams: {
				method: "GET",
				params: {
					invitation_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/invitations/:invitation_id/teams"
			},
			listMembers: {
				method: "GET",
				params: {
					filter: {
						enum: ["2fa_disabled", "all"],
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					role: {
						enum: ["all", "admin", "member"],
						type: "string"
					}
				},
				url: "/orgs/:org/members"
			},
			listMemberships: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					state: {
						enum: ["active", "pending"],
						type: "string"
					}
				},
				url: "/user/memberships/orgs"
			},
			listOutsideCollaborators: {
				method: "GET",
				params: {
					filter: {
						enum: ["2fa_disabled", "all"],
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/outside_collaborators"
			},
			listPendingInvitations: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/invitations"
			},
			listPublicMembers: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/public_members"
			},
			pingHook: {
				method: "POST",
				params: {
					hook_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/hooks/:hook_id/pings"
			},
			publicizeMembership: {
				method: "PUT",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/public_members/:username"
			},
			removeMember: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/members/:username"
			},
			removeMembership: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/memberships/:username"
			},
			removeOutsideCollaborator: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/outside_collaborators/:username"
			},
			unblockUser: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/blocks/:username"
			},
			update: {
				method: "PATCH",
				params: {
					billing_email: {
						type: "string"
					},
					company: {
						type: "string"
					},
					default_repository_permission: {
						enum: ["read", "write", "admin", "none"],
						type: "string"
					},
					description: {
						type: "string"
					},
					email: {
						type: "string"
					},
					has_organization_projects: {
						type: "boolean"
					},
					has_repository_projects: {
						type: "boolean"
					},
					location: {
						type: "string"
					},
					members_allowed_repository_creation_type: {
						enum: ["all", "private", "none"],
						type: "string"
					},
					members_can_create_internal_repositories: {
						type: "boolean"
					},
					members_can_create_private_repositories: {
						type: "boolean"
					},
					members_can_create_public_repositories: {
						type: "boolean"
					},
					members_can_create_repositories: {
						type: "boolean"
					},
					name: {
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org"
			},
			updateHook: {
				method: "PATCH",
				params: {
					active: {
						type: "boolean"
					},
					config: {
						type: "object"
					},
					"config.content_type": {
						type: "string"
					},
					"config.insecure_ssl": {
						type: "string"
					},
					"config.secret": {
						type: "string"
					},
					"config.url": {
						required: true,
						type: "string"
					},
					events: {
						type: "string[]"
					},
					hook_id: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/hooks/:hook_id"
			},
			updateMembership: {
				method: "PATCH",
				params: {
					org: {
						required: true,
						type: "string"
					},
					state: {
						enum: ["active"],
						required: true,
						type: "string"
					}
				},
				url: "/user/memberships/orgs/:org"
			}
		},
		projects: {
			addCollaborator: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "PUT",
				params: {
					permission: {
						enum: ["read", "write", "admin"],
						type: "string"
					},
					project_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/projects/:project_id/collaborators/:username"
			},
			createCard: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "POST",
				params: {
					column_id: {
						required: true,
						type: "integer"
					},
					content_id: {
						type: "integer"
					},
					content_type: {
						type: "string"
					},
					note: {
						type: "string"
					}
				},
				url: "/projects/columns/:column_id/cards"
			},
			createColumn: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "POST",
				params: {
					name: {
						required: true,
						type: "string"
					},
					project_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/:project_id/columns"
			},
			createForAuthenticatedUser: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "POST",
				params: {
					body: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					}
				},
				url: "/user/projects"
			},
			createForOrg: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "POST",
				params: {
					body: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/projects"
			},
			createForRepo: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "POST",
				params: {
					body: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/projects"
			},
			delete: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "DELETE",
				params: {
					project_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/:project_id"
			},
			deleteCard: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "DELETE",
				params: {
					card_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/columns/cards/:card_id"
			},
			deleteColumn: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "DELETE",
				params: {
					column_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/columns/:column_id"
			},
			get: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					project_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/:project_id"
			},
			getCard: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					card_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/columns/cards/:card_id"
			},
			getColumn: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					column_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/columns/:column_id"
			},
			listCards: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					archived_state: {
						enum: ["all", "archived", "not_archived"],
						type: "string"
					},
					column_id: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/projects/columns/:column_id/cards"
			},
			listCollaborators: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					affiliation: {
						enum: ["outside", "direct", "all"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					project_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/:project_id/collaborators"
			},
			listColumns: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					project_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/projects/:project_id/columns"
			},
			listForOrg: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					}
				},
				url: "/orgs/:org/projects"
			},
			listForRepo: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/projects"
			},
			listForUser: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/projects"
			},
			moveCard: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "POST",
				params: {
					card_id: {
						required: true,
						type: "integer"
					},
					column_id: {
						type: "integer"
					},
					position: {
						required: true,
						type: "string",
						validation: "^(top|bottom|after:\\d+)$"
					}
				},
				url: "/projects/columns/cards/:card_id/moves"
			},
			moveColumn: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "POST",
				params: {
					column_id: {
						required: true,
						type: "integer"
					},
					position: {
						required: true,
						type: "string",
						validation: "^(first|last|after:\\d+)$"
					}
				},
				url: "/projects/columns/:column_id/moves"
			},
			removeCollaborator: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "DELETE",
				params: {
					project_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/projects/:project_id/collaborators/:username"
			},
			reviewUserPermissionLevel: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					project_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/projects/:project_id/collaborators/:username/permission"
			},
			update: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "PATCH",
				params: {
					body: {
						type: "string"
					},
					name: {
						type: "string"
					},
					organization_permission: {
						type: "string"
					},
					private: {
						type: "boolean"
					},
					project_id: {
						required: true,
						type: "integer"
					},
					state: {
						enum: ["open", "closed"],
						type: "string"
					}
				},
				url: "/projects/:project_id"
			},
			updateCard: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "PATCH",
				params: {
					archived: {
						type: "boolean"
					},
					card_id: {
						required: true,
						type: "integer"
					},
					note: {
						type: "string"
					}
				},
				url: "/projects/columns/cards/:card_id"
			},
			updateColumn: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "PATCH",
				params: {
					column_id: {
						required: true,
						type: "integer"
					},
					name: {
						required: true,
						type: "string"
					}
				},
				url: "/projects/columns/:column_id"
			}
		},
		pulls: {
			checkIfMerged: {
				method: "GET",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/merge"
			},
			create: {
				method: "POST",
				params: {
					base: {
						required: true,
						type: "string"
					},
					body: {
						type: "string"
					},
					draft: {
						type: "boolean"
					},
					head: {
						required: true,
						type: "string"
					},
					maintainer_can_modify: {
						type: "boolean"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					title: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls"
			},
			createComment: {
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					commit_id: {
						required: true,
						type: "string"
					},
					in_reply_to: {
						deprecated: true,
						description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
						type: "integer"
					},
					line: {
						type: "integer"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					path: {
						required: true,
						type: "string"
					},
					position: {
						type: "integer"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					side: {
						enum: ["LEFT", "RIGHT"],
						type: "string"
					},
					start_line: {
						type: "integer"
					},
					start_side: {
						enum: ["LEFT", "RIGHT", "side"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/comments"
			},
			createCommentReply: {
				deprecated: "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					commit_id: {
						required: true,
						type: "string"
					},
					in_reply_to: {
						deprecated: true,
						description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
						type: "integer"
					},
					line: {
						type: "integer"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					path: {
						required: true,
						type: "string"
					},
					position: {
						type: "integer"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					side: {
						enum: ["LEFT", "RIGHT"],
						type: "string"
					},
					start_line: {
						type: "integer"
					},
					start_side: {
						enum: ["LEFT", "RIGHT", "side"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/comments"
			},
			createFromIssue: {
				deprecated: "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
				method: "POST",
				params: {
					base: {
						required: true,
						type: "string"
					},
					draft: {
						type: "boolean"
					},
					head: {
						required: true,
						type: "string"
					},
					issue: {
						required: true,
						type: "integer"
					},
					maintainer_can_modify: {
						type: "boolean"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls"
			},
			createReview: {
				method: "POST",
				params: {
					body: {
						type: "string"
					},
					comments: {
						type: "object[]"
					},
					"comments[].body": {
						required: true,
						type: "string"
					},
					"comments[].path": {
						required: true,
						type: "string"
					},
					"comments[].position": {
						required: true,
						type: "integer"
					},
					commit_id: {
						type: "string"
					},
					event: {
						enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
						type: "string"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
			},
			createReviewCommentReply: {
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
			},
			createReviewRequest: {
				method: "POST",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					reviewers: {
						type: "string[]"
					},
					team_reviewers: {
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
			},
			deleteComment: {
				method: "DELETE",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/comments/:comment_id"
			},
			deletePendingReview: {
				method: "DELETE",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					review_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
			},
			deleteReviewRequest: {
				method: "DELETE",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					reviewers: {
						type: "string[]"
					},
					team_reviewers: {
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
			},
			dismissReview: {
				method: "PUT",
				params: {
					message: {
						required: true,
						type: "string"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					review_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
			},
			get: {
				method: "GET",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number"
			},
			getComment: {
				method: "GET",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/comments/:comment_id"
			},
			getCommentsForReview: {
				method: "GET",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					review_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
			},
			getReview: {
				method: "GET",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					review_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
			},
			list: {
				method: "GET",
				params: {
					base: {
						type: "string"
					},
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					head: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["created", "updated", "popularity", "long-running"],
						type: "string"
					},
					state: {
						enum: ["open", "closed", "all"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls"
			},
			listComments: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					since: {
						type: "string"
					},
					sort: {
						enum: ["created", "updated"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/comments"
			},
			listCommentsForRepo: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					since: {
						type: "string"
					},
					sort: {
						enum: ["created", "updated"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/comments"
			},
			listCommits: {
				method: "GET",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/commits"
			},
			listFiles: {
				method: "GET",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/files"
			},
			listReviewRequests: {
				method: "GET",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
			},
			listReviews: {
				method: "GET",
				params: {
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
			},
			merge: {
				method: "PUT",
				params: {
					commit_message: {
						type: "string"
					},
					commit_title: {
						type: "string"
					},
					merge_method: {
						enum: ["merge", "squash", "rebase"],
						type: "string"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/merge"
			},
			submitReview: {
				method: "POST",
				params: {
					body: {
						type: "string"
					},
					event: {
						enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
						required: true,
						type: "string"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					review_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
			},
			update: {
				method: "PATCH",
				params: {
					base: {
						type: "string"
					},
					body: {
						type: "string"
					},
					maintainer_can_modify: {
						type: "boolean"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					state: {
						enum: ["open", "closed"],
						type: "string"
					},
					title: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number"
			},
			updateBranch: {
				headers: {
					accept: "application/vnd.github.lydian-preview+json"
				},
				method: "PUT",
				params: {
					expected_head_sha: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
			},
			updateComment: {
				method: "PATCH",
				params: {
					body: {
						required: true,
						type: "string"
					},
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/comments/:comment_id"
			},
			updateReview: {
				method: "PUT",
				params: {
					body: {
						required: true,
						type: "string"
					},
					number: {
						alias: "pull_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					pull_number: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					review_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
			}
		},
		rateLimit: {
			get: {
				method: "GET",
				params: {},
				url: "/rate_limit"
			}
		},
		reactions: {
			createForCommitComment: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/comments/:comment_id/reactions"
			},
			createForIssue: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/reactions"
			},
			createForIssueComment: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
			},
			createForPullRequestReviewComment: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
			},
			createForTeamDiscussion: {
				deprecated: "octokit.reactions.createForTeamDiscussion() has been renamed to octokit.reactions.createForTeamDiscussionLegacy() (2020-01-16)",
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/reactions"
			},
			createForTeamDiscussionComment: {
				deprecated: "octokit.reactions.createForTeamDiscussionComment() has been renamed to octokit.reactions.createForTeamDiscussionCommentLegacy() (2020-01-16)",
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
			},
			createForTeamDiscussionCommentInOrg: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
			},
			createForTeamDiscussionCommentLegacy: {
				deprecated: "octokit.reactions.createForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-comment-legacy",
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
			},
			createForTeamDiscussionInOrg: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
			},
			createForTeamDiscussionLegacy: {
				deprecated: "octokit.reactions.createForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-legacy",
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "POST",
				params: {
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/reactions"
			},
			delete: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "DELETE",
				params: {
					reaction_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/reactions/:reaction_id"
			},
			listForCommitComment: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/comments/:comment_id/reactions"
			},
			listForIssue: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					issue_number: {
						required: true,
						type: "integer"
					},
					number: {
						alias: "issue_number",
						deprecated: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/:issue_number/reactions"
			},
			listForIssueComment: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
			},
			listForPullRequestReviewComment: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
			},
			listForTeamDiscussion: {
				deprecated: "octokit.reactions.listForTeamDiscussion() has been renamed to octokit.reactions.listForTeamDiscussionLegacy() (2020-01-16)",
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/reactions"
			},
			listForTeamDiscussionComment: {
				deprecated: "octokit.reactions.listForTeamDiscussionComment() has been renamed to octokit.reactions.listForTeamDiscussionCommentLegacy() (2020-01-16)",
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
			},
			listForTeamDiscussionCommentInOrg: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
			},
			listForTeamDiscussionCommentLegacy: {
				deprecated: "octokit.reactions.listForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy",
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
			},
			listForTeamDiscussionInOrg: {
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
			},
			listForTeamDiscussionLegacy: {
				deprecated: "octokit.reactions.listForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy",
				headers: {
					accept: "application/vnd.github.squirrel-girl-preview+json"
				},
				method: "GET",
				params: {
					content: {
						enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/reactions"
			}
		},
		repos: {
			acceptInvitation: {
				method: "PATCH",
				params: {
					invitation_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/repository_invitations/:invitation_id"
			},
			addCollaborator: {
				method: "PUT",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					permission: {
						enum: ["pull", "push", "admin"],
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/collaborators/:username"
			},
			addDeployKey: {
				method: "POST",
				params: {
					key: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					read_only: {
						type: "boolean"
					},
					repo: {
						required: true,
						type: "string"
					},
					title: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/keys"
			},
			addProtectedBranchAdminEnforcement: {
				method: "POST",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
			},
			addProtectedBranchAppRestrictions: {
				method: "POST",
				params: {
					apps: {
						mapTo: "data",
						required: true,
						type: "string[]"
					},
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
			},
			addProtectedBranchRequiredSignatures: {
				headers: {
					accept: "application/vnd.github.zzzax-preview+json"
				},
				method: "POST",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
			},
			addProtectedBranchRequiredStatusChecksContexts: {
				method: "POST",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					contexts: {
						mapTo: "data",
						required: true,
						type: "string[]"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
			},
			addProtectedBranchTeamRestrictions: {
				method: "POST",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					teams: {
						mapTo: "data",
						required: true,
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
			},
			addProtectedBranchUserRestrictions: {
				method: "POST",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					users: {
						mapTo: "data",
						required: true,
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
			},
			checkCollaborator: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/collaborators/:username"
			},
			checkVulnerabilityAlerts: {
				headers: {
					accept: "application/vnd.github.dorian-preview+json"
				},
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/vulnerability-alerts"
			},
			compareCommits: {
				method: "GET",
				params: {
					base: {
						required: true,
						type: "string"
					},
					head: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/compare/:base...:head"
			},
			createCommitComment: {
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					commit_sha: {
						required: true,
						type: "string"
					},
					line: {
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					path: {
						type: "string"
					},
					position: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						alias: "commit_sha",
						deprecated: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:commit_sha/comments"
			},
			createDeployment: {
				method: "POST",
				params: {
					auto_merge: {
						type: "boolean"
					},
					description: {
						type: "string"
					},
					environment: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					payload: {
						type: "string"
					},
					production_environment: {
						type: "boolean"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					required_contexts: {
						type: "string[]"
					},
					task: {
						type: "string"
					},
					transient_environment: {
						type: "boolean"
					}
				},
				url: "/repos/:owner/:repo/deployments"
			},
			createDeploymentStatus: {
				method: "POST",
				params: {
					auto_inactive: {
						type: "boolean"
					},
					deployment_id: {
						required: true,
						type: "integer"
					},
					description: {
						type: "string"
					},
					environment: {
						enum: ["production", "staging", "qa"],
						type: "string"
					},
					environment_url: {
						type: "string"
					},
					log_url: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					state: {
						enum: ["error", "failure", "inactive", "in_progress", "queued", "pending", "success"],
						required: true,
						type: "string"
					},
					target_url: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
			},
			createDispatchEvent: {
				method: "POST",
				params: {
					client_payload: {
						type: "object"
					},
					event_type: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/dispatches"
			},
			createFile: {
				deprecated: "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
				method: "PUT",
				params: {
					author: {
						type: "object"
					},
					"author.email": {
						required: true,
						type: "string"
					},
					"author.name": {
						required: true,
						type: "string"
					},
					branch: {
						type: "string"
					},
					committer: {
						type: "object"
					},
					"committer.email": {
						required: true,
						type: "string"
					},
					"committer.name": {
						required: true,
						type: "string"
					},
					content: {
						required: true,
						type: "string"
					},
					message: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					path: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/contents/:path"
			},
			createForAuthenticatedUser: {
				method: "POST",
				params: {
					allow_merge_commit: {
						type: "boolean"
					},
					allow_rebase_merge: {
						type: "boolean"
					},
					allow_squash_merge: {
						type: "boolean"
					},
					auto_init: {
						type: "boolean"
					},
					delete_branch_on_merge: {
						type: "boolean"
					},
					description: {
						type: "string"
					},
					gitignore_template: {
						type: "string"
					},
					has_issues: {
						type: "boolean"
					},
					has_projects: {
						type: "boolean"
					},
					has_wiki: {
						type: "boolean"
					},
					homepage: {
						type: "string"
					},
					is_template: {
						type: "boolean"
					},
					license_template: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					private: {
						type: "boolean"
					},
					team_id: {
						type: "integer"
					},
					visibility: {
						enum: ["public", "private", "visibility", "internal"],
						type: "string"
					}
				},
				url: "/user/repos"
			},
			createFork: {
				method: "POST",
				params: {
					organization: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/forks"
			},
			createHook: {
				method: "POST",
				params: {
					active: {
						type: "boolean"
					},
					config: {
						required: true,
						type: "object"
					},
					"config.content_type": {
						type: "string"
					},
					"config.insecure_ssl": {
						type: "string"
					},
					"config.secret": {
						type: "string"
					},
					"config.url": {
						required: true,
						type: "string"
					},
					events: {
						type: "string[]"
					},
					name: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/hooks"
			},
			createInOrg: {
				method: "POST",
				params: {
					allow_merge_commit: {
						type: "boolean"
					},
					allow_rebase_merge: {
						type: "boolean"
					},
					allow_squash_merge: {
						type: "boolean"
					},
					auto_init: {
						type: "boolean"
					},
					delete_branch_on_merge: {
						type: "boolean"
					},
					description: {
						type: "string"
					},
					gitignore_template: {
						type: "string"
					},
					has_issues: {
						type: "boolean"
					},
					has_projects: {
						type: "boolean"
					},
					has_wiki: {
						type: "boolean"
					},
					homepage: {
						type: "string"
					},
					is_template: {
						type: "boolean"
					},
					license_template: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					private: {
						type: "boolean"
					},
					team_id: {
						type: "integer"
					},
					visibility: {
						enum: ["public", "private", "visibility", "internal"],
						type: "string"
					}
				},
				url: "/orgs/:org/repos"
			},
			createOrUpdateFile: {
				method: "PUT",
				params: {
					author: {
						type: "object"
					},
					"author.email": {
						required: true,
						type: "string"
					},
					"author.name": {
						required: true,
						type: "string"
					},
					branch: {
						type: "string"
					},
					committer: {
						type: "object"
					},
					"committer.email": {
						required: true,
						type: "string"
					},
					"committer.name": {
						required: true,
						type: "string"
					},
					content: {
						required: true,
						type: "string"
					},
					message: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					path: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/contents/:path"
			},
			createRelease: {
				method: "POST",
				params: {
					body: {
						type: "string"
					},
					draft: {
						type: "boolean"
					},
					name: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					prerelease: {
						type: "boolean"
					},
					repo: {
						required: true,
						type: "string"
					},
					tag_name: {
						required: true,
						type: "string"
					},
					target_commitish: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases"
			},
			createStatus: {
				method: "POST",
				params: {
					context: {
						type: "string"
					},
					description: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						required: true,
						type: "string"
					},
					state: {
						enum: ["error", "failure", "pending", "success"],
						required: true,
						type: "string"
					},
					target_url: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/statuses/:sha"
			},
			createUsingTemplate: {
				headers: {
					accept: "application/vnd.github.baptiste-preview+json"
				},
				method: "POST",
				params: {
					description: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					owner: {
						type: "string"
					},
					private: {
						type: "boolean"
					},
					template_owner: {
						required: true,
						type: "string"
					},
					template_repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:template_owner/:template_repo/generate"
			},
			declineInvitation: {
				method: "DELETE",
				params: {
					invitation_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/repository_invitations/:invitation_id"
			},
			delete: {
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo"
			},
			deleteCommitComment: {
				method: "DELETE",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/comments/:comment_id"
			},
			deleteDownload: {
				method: "DELETE",
				params: {
					download_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/downloads/:download_id"
			},
			deleteFile: {
				method: "DELETE",
				params: {
					author: {
						type: "object"
					},
					"author.email": {
						type: "string"
					},
					"author.name": {
						type: "string"
					},
					branch: {
						type: "string"
					},
					committer: {
						type: "object"
					},
					"committer.email": {
						type: "string"
					},
					"committer.name": {
						type: "string"
					},
					message: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					path: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/contents/:path"
			},
			deleteHook: {
				method: "DELETE",
				params: {
					hook_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/hooks/:hook_id"
			},
			deleteInvitation: {
				method: "DELETE",
				params: {
					invitation_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/invitations/:invitation_id"
			},
			deleteRelease: {
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					release_id: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/:release_id"
			},
			deleteReleaseAsset: {
				method: "DELETE",
				params: {
					asset_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/assets/:asset_id"
			},
			disableAutomatedSecurityFixes: {
				headers: {
					accept: "application/vnd.github.london-preview+json"
				},
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/automated-security-fixes"
			},
			disablePagesSite: {
				headers: {
					accept: "application/vnd.github.switcheroo-preview+json"
				},
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pages"
			},
			disableVulnerabilityAlerts: {
				headers: {
					accept: "application/vnd.github.dorian-preview+json"
				},
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/vulnerability-alerts"
			},
			enableAutomatedSecurityFixes: {
				headers: {
					accept: "application/vnd.github.london-preview+json"
				},
				method: "PUT",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/automated-security-fixes"
			},
			enablePagesSite: {
				headers: {
					accept: "application/vnd.github.switcheroo-preview+json"
				},
				method: "POST",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					source: {
						type: "object"
					},
					"source.branch": {
						enum: ["master", "gh-pages"],
						type: "string"
					},
					"source.path": {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pages"
			},
			enableVulnerabilityAlerts: {
				headers: {
					accept: "application/vnd.github.dorian-preview+json"
				},
				method: "PUT",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/vulnerability-alerts"
			},
			get: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo"
			},
			getAppsWithAccessToProtectedBranch: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
			},
			getArchiveLink: {
				method: "GET",
				params: {
					archive_format: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/:archive_format/:ref"
			},
			getBranch: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch"
			},
			getBranchProtection: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection"
			},
			getClones: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					per: {
						enum: ["day", "week"],
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/traffic/clones"
			},
			getCodeFrequencyStats: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/stats/code_frequency"
			},
			getCollaboratorPermissionLevel: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/collaborators/:username/permission"
			},
			getCombinedStatusForRef: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:ref/status"
			},
			getCommit: {
				method: "GET",
				params: {
					commit_sha: {
						alias: "ref",
						deprecated: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						alias: "ref",
						deprecated: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:ref"
			},
			getCommitActivityStats: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/stats/commit_activity"
			},
			getCommitComment: {
				method: "GET",
				params: {
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/comments/:comment_id"
			},
			getCommitRefSha: {
				deprecated: "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
				headers: {
					accept: "application/vnd.github.v3.sha"
				},
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:ref"
			},
			getContents: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					path: {
						required: true,
						type: "string"
					},
					ref: {
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/contents/:path"
			},
			getContributorsStats: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/stats/contributors"
			},
			getDeployKey: {
				method: "GET",
				params: {
					key_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/keys/:key_id"
			},
			getDeployment: {
				method: "GET",
				params: {
					deployment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/deployments/:deployment_id"
			},
			getDeploymentStatus: {
				method: "GET",
				params: {
					deployment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					status_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
			},
			getDownload: {
				method: "GET",
				params: {
					download_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/downloads/:download_id"
			},
			getHook: {
				method: "GET",
				params: {
					hook_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/hooks/:hook_id"
			},
			getLatestPagesBuild: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pages/builds/latest"
			},
			getLatestRelease: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/latest"
			},
			getPages: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pages"
			},
			getPagesBuild: {
				method: "GET",
				params: {
					build_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pages/builds/:build_id"
			},
			getParticipationStats: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/stats/participation"
			},
			getProtectedBranchAdminEnforcement: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
			},
			getProtectedBranchPullRequestReviewEnforcement: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
			},
			getProtectedBranchRequiredSignatures: {
				headers: {
					accept: "application/vnd.github.zzzax-preview+json"
				},
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
			},
			getProtectedBranchRequiredStatusChecks: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
			},
			getProtectedBranchRestrictions: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
			},
			getPunchCardStats: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/stats/punch_card"
			},
			getReadme: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					ref: {
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/readme"
			},
			getRelease: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					release_id: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/:release_id"
			},
			getReleaseAsset: {
				method: "GET",
				params: {
					asset_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/assets/:asset_id"
			},
			getReleaseByTag: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					tag: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/tags/:tag"
			},
			getTeamsWithAccessToProtectedBranch: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
			},
			getTopPaths: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/traffic/popular/paths"
			},
			getTopReferrers: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/traffic/popular/referrers"
			},
			getUsersWithAccessToProtectedBranch: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
			},
			getViews: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					per: {
						enum: ["day", "week"],
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/traffic/views"
			},
			list: {
				method: "GET",
				params: {
					affiliation: {
						type: "string"
					},
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					sort: {
						enum: ["created", "updated", "pushed", "full_name"],
						type: "string"
					},
					type: {
						enum: ["all", "owner", "public", "private", "member"],
						type: "string"
					},
					visibility: {
						enum: ["all", "public", "private"],
						type: "string"
					}
				},
				url: "/user/repos"
			},
			listAppsWithAccessToProtectedBranch: {
				deprecated: "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
			},
			listAssetsForRelease: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					release_id: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/:release_id/assets"
			},
			listBranches: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					protected: {
						type: "boolean"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches"
			},
			listBranchesForHeadCommit: {
				headers: {
					accept: "application/vnd.github.groot-preview+json"
				},
				method: "GET",
				params: {
					commit_sha: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
			},
			listCollaborators: {
				method: "GET",
				params: {
					affiliation: {
						enum: ["outside", "direct", "all"],
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/collaborators"
			},
			listCommentsForCommit: {
				method: "GET",
				params: {
					commit_sha: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					ref: {
						alias: "commit_sha",
						deprecated: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:commit_sha/comments"
			},
			listCommitComments: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/comments"
			},
			listCommits: {
				method: "GET",
				params: {
					author: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					path: {
						type: "string"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						type: "string"
					},
					since: {
						type: "string"
					},
					until: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits"
			},
			listContributors: {
				method: "GET",
				params: {
					anon: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/contributors"
			},
			listDeployKeys: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/keys"
			},
			listDeploymentStatuses: {
				method: "GET",
				params: {
					deployment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
			},
			listDeployments: {
				method: "GET",
				params: {
					environment: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					ref: {
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						type: "string"
					},
					task: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/deployments"
			},
			listDownloads: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/downloads"
			},
			listForOrg: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					sort: {
						enum: ["created", "updated", "pushed", "full_name"],
						type: "string"
					},
					type: {
						enum: ["all", "public", "private", "forks", "sources", "member", "internal"],
						type: "string"
					}
				},
				url: "/orgs/:org/repos"
			},
			listForUser: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					sort: {
						enum: ["created", "updated", "pushed", "full_name"],
						type: "string"
					},
					type: {
						enum: ["all", "owner", "member"],
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/repos"
			},
			listForks: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["newest", "oldest", "stargazers"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/forks"
			},
			listHooks: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/hooks"
			},
			listInvitations: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/invitations"
			},
			listInvitationsForAuthenticatedUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/repository_invitations"
			},
			listLanguages: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/languages"
			},
			listPagesBuilds: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pages/builds"
			},
			listProtectedBranchRequiredStatusChecksContexts: {
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
			},
			listProtectedBranchTeamRestrictions: {
				deprecated: "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
			},
			listProtectedBranchUserRestrictions: {
				deprecated: "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
			},
			listPublic: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "integer"
					}
				},
				url: "/repositories"
			},
			listPullRequestsAssociatedWithCommit: {
				headers: {
					accept: "application/vnd.github.groot-preview+json"
				},
				method: "GET",
				params: {
					commit_sha: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
			},
			listReleases: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases"
			},
			listStatusesForRef: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					ref: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/commits/:ref/statuses"
			},
			listTags: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/tags"
			},
			listTeams: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/teams"
			},
			listTeamsWithAccessToProtectedBranch: {
				deprecated: "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
			},
			listTopics: {
				headers: {
					accept: "application/vnd.github.mercy-preview+json"
				},
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/topics"
			},
			listUsersWithAccessToProtectedBranch: {
				deprecated: "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
				method: "GET",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
			},
			merge: {
				method: "POST",
				params: {
					base: {
						required: true,
						type: "string"
					},
					commit_message: {
						type: "string"
					},
					head: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/merges"
			},
			pingHook: {
				method: "POST",
				params: {
					hook_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/hooks/:hook_id/pings"
			},
			removeBranchProtection: {
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection"
			},
			removeCollaborator: {
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/collaborators/:username"
			},
			removeDeployKey: {
				method: "DELETE",
				params: {
					key_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/keys/:key_id"
			},
			removeProtectedBranchAdminEnforcement: {
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
			},
			removeProtectedBranchAppRestrictions: {
				method: "DELETE",
				params: {
					apps: {
						mapTo: "data",
						required: true,
						type: "string[]"
					},
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
			},
			removeProtectedBranchPullRequestReviewEnforcement: {
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
			},
			removeProtectedBranchRequiredSignatures: {
				headers: {
					accept: "application/vnd.github.zzzax-preview+json"
				},
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
			},
			removeProtectedBranchRequiredStatusChecks: {
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
			},
			removeProtectedBranchRequiredStatusChecksContexts: {
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					contexts: {
						mapTo: "data",
						required: true,
						type: "string[]"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
			},
			removeProtectedBranchRestrictions: {
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
			},
			removeProtectedBranchTeamRestrictions: {
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					teams: {
						mapTo: "data",
						required: true,
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
			},
			removeProtectedBranchUserRestrictions: {
				method: "DELETE",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					users: {
						mapTo: "data",
						required: true,
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
			},
			replaceProtectedBranchAppRestrictions: {
				method: "PUT",
				params: {
					apps: {
						mapTo: "data",
						required: true,
						type: "string[]"
					},
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
			},
			replaceProtectedBranchRequiredStatusChecksContexts: {
				method: "PUT",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					contexts: {
						mapTo: "data",
						required: true,
						type: "string[]"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
			},
			replaceProtectedBranchTeamRestrictions: {
				method: "PUT",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					teams: {
						mapTo: "data",
						required: true,
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
			},
			replaceProtectedBranchUserRestrictions: {
				method: "PUT",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					users: {
						mapTo: "data",
						required: true,
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
			},
			replaceTopics: {
				headers: {
					accept: "application/vnd.github.mercy-preview+json"
				},
				method: "PUT",
				params: {
					names: {
						required: true,
						type: "string[]"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/topics"
			},
			requestPageBuild: {
				method: "POST",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pages/builds"
			},
			retrieveCommunityProfileMetrics: {
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/community/profile"
			},
			testPushHook: {
				method: "POST",
				params: {
					hook_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/hooks/:hook_id/tests"
			},
			transfer: {
				method: "POST",
				params: {
					new_owner: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_ids: {
						type: "integer[]"
					}
				},
				url: "/repos/:owner/:repo/transfer"
			},
			update: {
				method: "PATCH",
				params: {
					allow_merge_commit: {
						type: "boolean"
					},
					allow_rebase_merge: {
						type: "boolean"
					},
					allow_squash_merge: {
						type: "boolean"
					},
					archived: {
						type: "boolean"
					},
					default_branch: {
						type: "string"
					},
					delete_branch_on_merge: {
						type: "boolean"
					},
					description: {
						type: "string"
					},
					has_issues: {
						type: "boolean"
					},
					has_projects: {
						type: "boolean"
					},
					has_wiki: {
						type: "boolean"
					},
					homepage: {
						type: "string"
					},
					is_template: {
						type: "boolean"
					},
					name: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					private: {
						type: "boolean"
					},
					repo: {
						required: true,
						type: "string"
					},
					visibility: {
						enum: ["public", "private", "visibility", "internal"],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo"
			},
			updateBranchProtection: {
				method: "PUT",
				params: {
					allow_deletions: {
						type: "boolean"
					},
					allow_force_pushes: {
						allowNull: true,
						type: "boolean"
					},
					branch: {
						required: true,
						type: "string"
					},
					enforce_admins: {
						allowNull: true,
						required: true,
						type: "boolean"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					required_linear_history: {
						type: "boolean"
					},
					required_pull_request_reviews: {
						allowNull: true,
						required: true,
						type: "object"
					},
					"required_pull_request_reviews.dismiss_stale_reviews": {
						type: "boolean"
					},
					"required_pull_request_reviews.dismissal_restrictions": {
						type: "object"
					},
					"required_pull_request_reviews.dismissal_restrictions.teams": {
						type: "string[]"
					},
					"required_pull_request_reviews.dismissal_restrictions.users": {
						type: "string[]"
					},
					"required_pull_request_reviews.require_code_owner_reviews": {
						type: "boolean"
					},
					"required_pull_request_reviews.required_approving_review_count": {
						type: "integer"
					},
					required_status_checks: {
						allowNull: true,
						required: true,
						type: "object"
					},
					"required_status_checks.contexts": {
						required: true,
						type: "string[]"
					},
					"required_status_checks.strict": {
						required: true,
						type: "boolean"
					},
					restrictions: {
						allowNull: true,
						required: true,
						type: "object"
					},
					"restrictions.apps": {
						type: "string[]"
					},
					"restrictions.teams": {
						required: true,
						type: "string[]"
					},
					"restrictions.users": {
						required: true,
						type: "string[]"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection"
			},
			updateCommitComment: {
				method: "PATCH",
				params: {
					body: {
						required: true,
						type: "string"
					},
					comment_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/comments/:comment_id"
			},
			updateFile: {
				deprecated: "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
				method: "PUT",
				params: {
					author: {
						type: "object"
					},
					"author.email": {
						required: true,
						type: "string"
					},
					"author.name": {
						required: true,
						type: "string"
					},
					branch: {
						type: "string"
					},
					committer: {
						type: "object"
					},
					"committer.email": {
						required: true,
						type: "string"
					},
					"committer.name": {
						required: true,
						type: "string"
					},
					content: {
						required: true,
						type: "string"
					},
					message: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					path: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					sha: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/contents/:path"
			},
			updateHook: {
				method: "PATCH",
				params: {
					active: {
						type: "boolean"
					},
					add_events: {
						type: "string[]"
					},
					config: {
						type: "object"
					},
					"config.content_type": {
						type: "string"
					},
					"config.insecure_ssl": {
						type: "string"
					},
					"config.secret": {
						type: "string"
					},
					"config.url": {
						required: true,
						type: "string"
					},
					events: {
						type: "string[]"
					},
					hook_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					remove_events: {
						type: "string[]"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/hooks/:hook_id"
			},
			updateInformationAboutPagesSite: {
				method: "PUT",
				params: {
					cname: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					source: {
						enum: ['"gh-pages"', '"master"', '"master /docs"'],
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/pages"
			},
			updateInvitation: {
				method: "PATCH",
				params: {
					invitation_id: {
						required: true,
						type: "integer"
					},
					owner: {
						required: true,
						type: "string"
					},
					permissions: {
						enum: ["read", "write", "admin"],
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/invitations/:invitation_id"
			},
			updateProtectedBranchPullRequestReviewEnforcement: {
				method: "PATCH",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					dismiss_stale_reviews: {
						type: "boolean"
					},
					dismissal_restrictions: {
						type: "object"
					},
					"dismissal_restrictions.teams": {
						type: "string[]"
					},
					"dismissal_restrictions.users": {
						type: "string[]"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					require_code_owner_reviews: {
						type: "boolean"
					},
					required_approving_review_count: {
						type: "integer"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
			},
			updateProtectedBranchRequiredStatusChecks: {
				method: "PATCH",
				params: {
					branch: {
						required: true,
						type: "string"
					},
					contexts: {
						type: "string[]"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					strict: {
						type: "boolean"
					}
				},
				url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
			},
			updateRelease: {
				method: "PATCH",
				params: {
					body: {
						type: "string"
					},
					draft: {
						type: "boolean"
					},
					name: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					prerelease: {
						type: "boolean"
					},
					release_id: {
						required: true,
						type: "integer"
					},
					repo: {
						required: true,
						type: "string"
					},
					tag_name: {
						type: "string"
					},
					target_commitish: {
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/:release_id"
			},
			updateReleaseAsset: {
				method: "PATCH",
				params: {
					asset_id: {
						required: true,
						type: "integer"
					},
					label: {
						type: "string"
					},
					name: {
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					}
				},
				url: "/repos/:owner/:repo/releases/assets/:asset_id"
			},
			uploadReleaseAsset: {
				method: "POST",
				params: {
					data: {
						mapTo: "data",
						required: true,
						type: "string | object"
					},
					file: {
						alias: "data",
						deprecated: true,
						type: "string | object"
					},
					headers: {
						required: true,
						type: "object"
					},
					"headers.content-length": {
						required: true,
						type: "integer"
					},
					"headers.content-type": {
						required: true,
						type: "string"
					},
					label: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					url: {
						required: true,
						type: "string"
					}
				},
				url: ":url"
			}
		},
		search: {
			code: {
				method: "GET",
				params: {
					order: {
						enum: ["desc", "asc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					q: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["indexed"],
						type: "string"
					}
				},
				url: "/search/code"
			},
			commits: {
				headers: {
					accept: "application/vnd.github.cloak-preview+json"
				},
				method: "GET",
				params: {
					order: {
						enum: ["desc", "asc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					q: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["author-date", "committer-date"],
						type: "string"
					}
				},
				url: "/search/commits"
			},
			issues: {
				deprecated: "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
				method: "GET",
				params: {
					order: {
						enum: ["desc", "asc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					q: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
						type: "string"
					}
				},
				url: "/search/issues"
			},
			issuesAndPullRequests: {
				method: "GET",
				params: {
					order: {
						enum: ["desc", "asc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					q: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
						type: "string"
					}
				},
				url: "/search/issues"
			},
			labels: {
				method: "GET",
				params: {
					order: {
						enum: ["desc", "asc"],
						type: "string"
					},
					q: {
						required: true,
						type: "string"
					},
					repository_id: {
						required: true,
						type: "integer"
					},
					sort: {
						enum: ["created", "updated"],
						type: "string"
					}
				},
				url: "/search/labels"
			},
			repos: {
				method: "GET",
				params: {
					order: {
						enum: ["desc", "asc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					q: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["stars", "forks", "help-wanted-issues", "updated"],
						type: "string"
					}
				},
				url: "/search/repositories"
			},
			topics: {
				method: "GET",
				params: {
					q: {
						required: true,
						type: "string"
					}
				},
				url: "/search/topics"
			},
			users: {
				method: "GET",
				params: {
					order: {
						enum: ["desc", "asc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					q: {
						required: true,
						type: "string"
					},
					sort: {
						enum: ["followers", "repositories", "joined"],
						type: "string"
					}
				},
				url: "/search/users"
			}
		},
		teams: {
			addMember: {
				deprecated: "octokit.teams.addMember() has been renamed to octokit.teams.addMemberLegacy() (2020-01-16)",
				method: "PUT",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/members/:username"
			},
			addMemberLegacy: {
				deprecated: "octokit.teams.addMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member-legacy",
				method: "PUT",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/members/:username"
			},
			addOrUpdateMembership: {
				deprecated: "octokit.teams.addOrUpdateMembership() has been renamed to octokit.teams.addOrUpdateMembershipLegacy() (2020-01-16)",
				method: "PUT",
				params: {
					role: {
						enum: ["member", "maintainer"],
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/memberships/:username"
			},
			addOrUpdateMembershipInOrg: {
				method: "PUT",
				params: {
					org: {
						required: true,
						type: "string"
					},
					role: {
						enum: ["member", "maintainer"],
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/memberships/:username"
			},
			addOrUpdateMembershipLegacy: {
				deprecated: "octokit.teams.addOrUpdateMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-or-update-team-membership-legacy",
				method: "PUT",
				params: {
					role: {
						enum: ["member", "maintainer"],
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/memberships/:username"
			},
			addOrUpdateProject: {
				deprecated: "octokit.teams.addOrUpdateProject() has been renamed to octokit.teams.addOrUpdateProjectLegacy() (2020-01-16)",
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "PUT",
				params: {
					permission: {
						enum: ["read", "write", "admin"],
						type: "string"
					},
					project_id: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/projects/:project_id"
			},
			addOrUpdateProjectInOrg: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "PUT",
				params: {
					org: {
						required: true,
						type: "string"
					},
					permission: {
						enum: ["read", "write", "admin"],
						type: "string"
					},
					project_id: {
						required: true,
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/projects/:project_id"
			},
			addOrUpdateProjectLegacy: {
				deprecated: "octokit.teams.addOrUpdateProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-project-legacy",
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "PUT",
				params: {
					permission: {
						enum: ["read", "write", "admin"],
						type: "string"
					},
					project_id: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/projects/:project_id"
			},
			addOrUpdateRepo: {
				deprecated: "octokit.teams.addOrUpdateRepo() has been renamed to octokit.teams.addOrUpdateRepoLegacy() (2020-01-16)",
				method: "PUT",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					permission: {
						enum: ["pull", "push", "admin"],
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/repos/:owner/:repo"
			},
			addOrUpdateRepoInOrg: {
				method: "PUT",
				params: {
					org: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					permission: {
						enum: ["pull", "push", "admin"],
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
			},
			addOrUpdateRepoLegacy: {
				deprecated: "octokit.teams.addOrUpdateRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-repository-legacy",
				method: "PUT",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					permission: {
						enum: ["pull", "push", "admin"],
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/repos/:owner/:repo"
			},
			checkManagesRepo: {
				deprecated: "octokit.teams.checkManagesRepo() has been renamed to octokit.teams.checkManagesRepoLegacy() (2020-01-16)",
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/repos/:owner/:repo"
			},
			checkManagesRepoInOrg: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
			},
			checkManagesRepoLegacy: {
				deprecated: "octokit.teams.checkManagesRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#check-if-a-team-manages-a-repository-legacy",
				method: "GET",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/repos/:owner/:repo"
			},
			create: {
				method: "POST",
				params: {
					description: {
						type: "string"
					},
					maintainers: {
						type: "string[]"
					},
					name: {
						required: true,
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					parent_team_id: {
						type: "integer"
					},
					permission: {
						enum: ["pull", "push", "admin"],
						type: "string"
					},
					privacy: {
						enum: ["secret", "closed"],
						type: "string"
					},
					repo_names: {
						type: "string[]"
					}
				},
				url: "/orgs/:org/teams"
			},
			createDiscussion: {
				deprecated: "octokit.teams.createDiscussion() has been renamed to octokit.teams.createDiscussionLegacy() (2020-01-16)",
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					private: {
						type: "boolean"
					},
					team_id: {
						required: true,
						type: "integer"
					},
					title: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/discussions"
			},
			createDiscussionComment: {
				deprecated: "octokit.teams.createDiscussionComment() has been renamed to octokit.teams.createDiscussionCommentLegacy() (2020-01-16)",
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments"
			},
			createDiscussionCommentInOrg: {
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
			},
			createDiscussionCommentLegacy: {
				deprecated: "octokit.teams.createDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#create-a-comment-legacy",
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments"
			},
			createDiscussionInOrg: {
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					private: {
						type: "boolean"
					},
					team_slug: {
						required: true,
						type: "string"
					},
					title: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions"
			},
			createDiscussionLegacy: {
				deprecated: "octokit.teams.createDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#create-a-discussion-legacy",
				method: "POST",
				params: {
					body: {
						required: true,
						type: "string"
					},
					private: {
						type: "boolean"
					},
					team_id: {
						required: true,
						type: "integer"
					},
					title: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/discussions"
			},
			delete: {
				deprecated: "octokit.teams.delete() has been renamed to octokit.teams.deleteLegacy() (2020-01-16)",
				method: "DELETE",
				params: {
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id"
			},
			deleteDiscussion: {
				deprecated: "octokit.teams.deleteDiscussion() has been renamed to octokit.teams.deleteDiscussionLegacy() (2020-01-16)",
				method: "DELETE",
				params: {
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number"
			},
			deleteDiscussionComment: {
				deprecated: "octokit.teams.deleteDiscussionComment() has been renamed to octokit.teams.deleteDiscussionCommentLegacy() (2020-01-16)",
				method: "DELETE",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
			},
			deleteDiscussionCommentInOrg: {
				method: "DELETE",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
			},
			deleteDiscussionCommentLegacy: {
				deprecated: "octokit.teams.deleteDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#delete-a-comment-legacy",
				method: "DELETE",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
			},
			deleteDiscussionInOrg: {
				method: "DELETE",
				params: {
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
			},
			deleteDiscussionLegacy: {
				deprecated: "octokit.teams.deleteDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#delete-a-discussion-legacy",
				method: "DELETE",
				params: {
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number"
			},
			deleteInOrg: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug"
			},
			deleteLegacy: {
				deprecated: "octokit.teams.deleteLegacy() is deprecated, see https://developer.github.com/v3/teams/#delete-team-legacy",
				method: "DELETE",
				params: {
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id"
			},
			get: {
				deprecated: "octokit.teams.get() has been renamed to octokit.teams.getLegacy() (2020-01-16)",
				method: "GET",
				params: {
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id"
			},
			getByName: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug"
			},
			getDiscussion: {
				deprecated: "octokit.teams.getDiscussion() has been renamed to octokit.teams.getDiscussionLegacy() (2020-01-16)",
				method: "GET",
				params: {
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number"
			},
			getDiscussionComment: {
				deprecated: "octokit.teams.getDiscussionComment() has been renamed to octokit.teams.getDiscussionCommentLegacy() (2020-01-16)",
				method: "GET",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
			},
			getDiscussionCommentInOrg: {
				method: "GET",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
			},
			getDiscussionCommentLegacy: {
				deprecated: "octokit.teams.getDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#get-a-single-comment-legacy",
				method: "GET",
				params: {
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
			},
			getDiscussionInOrg: {
				method: "GET",
				params: {
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
			},
			getDiscussionLegacy: {
				deprecated: "octokit.teams.getDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#get-a-single-discussion-legacy",
				method: "GET",
				params: {
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number"
			},
			getLegacy: {
				deprecated: "octokit.teams.getLegacy() is deprecated, see https://developer.github.com/v3/teams/#get-team-legacy",
				method: "GET",
				params: {
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id"
			},
			getMember: {
				deprecated: "octokit.teams.getMember() has been renamed to octokit.teams.getMemberLegacy() (2020-01-16)",
				method: "GET",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/members/:username"
			},
			getMemberLegacy: {
				deprecated: "octokit.teams.getMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member-legacy",
				method: "GET",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/members/:username"
			},
			getMembership: {
				deprecated: "octokit.teams.getMembership() has been renamed to octokit.teams.getMembershipLegacy() (2020-01-16)",
				method: "GET",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/memberships/:username"
			},
			getMembershipInOrg: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/memberships/:username"
			},
			getMembershipLegacy: {
				deprecated: "octokit.teams.getMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-membership-legacy",
				method: "GET",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/memberships/:username"
			},
			list: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/orgs/:org/teams"
			},
			listChild: {
				deprecated: "octokit.teams.listChild() has been renamed to octokit.teams.listChildLegacy() (2020-01-16)",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/teams"
			},
			listChildInOrg: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/teams"
			},
			listChildLegacy: {
				deprecated: "octokit.teams.listChildLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-child-teams-legacy",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/teams"
			},
			listDiscussionComments: {
				deprecated: "octokit.teams.listDiscussionComments() has been renamed to octokit.teams.listDiscussionCommentsLegacy() (2020-01-16)",
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments"
			},
			listDiscussionCommentsInOrg: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
			},
			listDiscussionCommentsLegacy: {
				deprecated: "octokit.teams.listDiscussionCommentsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#list-comments-legacy",
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments"
			},
			listDiscussions: {
				deprecated: "octokit.teams.listDiscussions() has been renamed to octokit.teams.listDiscussionsLegacy() (2020-01-16)",
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions"
			},
			listDiscussionsInOrg: {
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions"
			},
			listDiscussionsLegacy: {
				deprecated: "octokit.teams.listDiscussionsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy",
				method: "GET",
				params: {
					direction: {
						enum: ["asc", "desc"],
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions"
			},
			listForAuthenticatedUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/teams"
			},
			listMembers: {
				deprecated: "octokit.teams.listMembers() has been renamed to octokit.teams.listMembersLegacy() (2020-01-16)",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					role: {
						enum: ["member", "maintainer", "all"],
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/members"
			},
			listMembersInOrg: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					role: {
						enum: ["member", "maintainer", "all"],
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/members"
			},
			listMembersLegacy: {
				deprecated: "octokit.teams.listMembersLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-team-members-legacy",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					role: {
						enum: ["member", "maintainer", "all"],
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/members"
			},
			listPendingInvitations: {
				deprecated: "octokit.teams.listPendingInvitations() has been renamed to octokit.teams.listPendingInvitationsLegacy() (2020-01-16)",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/invitations"
			},
			listPendingInvitationsInOrg: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/invitations"
			},
			listPendingInvitationsLegacy: {
				deprecated: "octokit.teams.listPendingInvitationsLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/invitations"
			},
			listProjects: {
				deprecated: "octokit.teams.listProjects() has been renamed to octokit.teams.listProjectsLegacy() (2020-01-16)",
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/projects"
			},
			listProjectsInOrg: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/projects"
			},
			listProjectsLegacy: {
				deprecated: "octokit.teams.listProjectsLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-projects-legacy",
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/projects"
			},
			listRepos: {
				deprecated: "octokit.teams.listRepos() has been renamed to octokit.teams.listReposLegacy() (2020-01-16)",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/repos"
			},
			listReposInOrg: {
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/repos"
			},
			listReposLegacy: {
				deprecated: "octokit.teams.listReposLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-repos-legacy",
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/repos"
			},
			removeMember: {
				deprecated: "octokit.teams.removeMember() has been renamed to octokit.teams.removeMemberLegacy() (2020-01-16)",
				method: "DELETE",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/members/:username"
			},
			removeMemberLegacy: {
				deprecated: "octokit.teams.removeMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member-legacy",
				method: "DELETE",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/members/:username"
			},
			removeMembership: {
				deprecated: "octokit.teams.removeMembership() has been renamed to octokit.teams.removeMembershipLegacy() (2020-01-16)",
				method: "DELETE",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/memberships/:username"
			},
			removeMembershipInOrg: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/memberships/:username"
			},
			removeMembershipLegacy: {
				deprecated: "octokit.teams.removeMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-membership-legacy",
				method: "DELETE",
				params: {
					team_id: {
						required: true,
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/teams/:team_id/memberships/:username"
			},
			removeProject: {
				deprecated: "octokit.teams.removeProject() has been renamed to octokit.teams.removeProjectLegacy() (2020-01-16)",
				method: "DELETE",
				params: {
					project_id: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/projects/:project_id"
			},
			removeProjectInOrg: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					project_id: {
						required: true,
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/projects/:project_id"
			},
			removeProjectLegacy: {
				deprecated: "octokit.teams.removeProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-project-legacy",
				method: "DELETE",
				params: {
					project_id: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/projects/:project_id"
			},
			removeRepo: {
				deprecated: "octokit.teams.removeRepo() has been renamed to octokit.teams.removeRepoLegacy() (2020-01-16)",
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/repos/:owner/:repo"
			},
			removeRepoInOrg: {
				method: "DELETE",
				params: {
					org: {
						required: true,
						type: "string"
					},
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
			},
			removeRepoLegacy: {
				deprecated: "octokit.teams.removeRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-repository-legacy",
				method: "DELETE",
				params: {
					owner: {
						required: true,
						type: "string"
					},
					repo: {
						required: true,
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/repos/:owner/:repo"
			},
			reviewProject: {
				deprecated: "octokit.teams.reviewProject() has been renamed to octokit.teams.reviewProjectLegacy() (2020-01-16)",
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					project_id: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/projects/:project_id"
			},
			reviewProjectInOrg: {
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					org: {
						required: true,
						type: "string"
					},
					project_id: {
						required: true,
						type: "integer"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/projects/:project_id"
			},
			reviewProjectLegacy: {
				deprecated: "octokit.teams.reviewProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#review-a-team-project-legacy",
				headers: {
					accept: "application/vnd.github.inertia-preview+json"
				},
				method: "GET",
				params: {
					project_id: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/projects/:project_id"
			},
			update: {
				deprecated: "octokit.teams.update() has been renamed to octokit.teams.updateLegacy() (2020-01-16)",
				method: "PATCH",
				params: {
					description: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					parent_team_id: {
						type: "integer"
					},
					permission: {
						enum: ["pull", "push", "admin"],
						type: "string"
					},
					privacy: {
						enum: ["secret", "closed"],
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id"
			},
			updateDiscussion: {
				deprecated: "octokit.teams.updateDiscussion() has been renamed to octokit.teams.updateDiscussionLegacy() (2020-01-16)",
				method: "PATCH",
				params: {
					body: {
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					},
					title: {
						type: "string"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number"
			},
			updateDiscussionComment: {
				deprecated: "octokit.teams.updateDiscussionComment() has been renamed to octokit.teams.updateDiscussionCommentLegacy() (2020-01-16)",
				method: "PATCH",
				params: {
					body: {
						required: true,
						type: "string"
					},
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
			},
			updateDiscussionCommentInOrg: {
				method: "PATCH",
				params: {
					body: {
						required: true,
						type: "string"
					},
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
			},
			updateDiscussionCommentLegacy: {
				deprecated: "octokit.teams.updateDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#edit-a-comment-legacy",
				method: "PATCH",
				params: {
					body: {
						required: true,
						type: "string"
					},
					comment_number: {
						required: true,
						type: "integer"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
			},
			updateDiscussionInOrg: {
				method: "PATCH",
				params: {
					body: {
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					org: {
						required: true,
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					},
					title: {
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
			},
			updateDiscussionLegacy: {
				deprecated: "octokit.teams.updateDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#edit-a-discussion-legacy",
				method: "PATCH",
				params: {
					body: {
						type: "string"
					},
					discussion_number: {
						required: true,
						type: "integer"
					},
					team_id: {
						required: true,
						type: "integer"
					},
					title: {
						type: "string"
					}
				},
				url: "/teams/:team_id/discussions/:discussion_number"
			},
			updateInOrg: {
				method: "PATCH",
				params: {
					description: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					org: {
						required: true,
						type: "string"
					},
					parent_team_id: {
						type: "integer"
					},
					permission: {
						enum: ["pull", "push", "admin"],
						type: "string"
					},
					privacy: {
						enum: ["secret", "closed"],
						type: "string"
					},
					team_slug: {
						required: true,
						type: "string"
					}
				},
				url: "/orgs/:org/teams/:team_slug"
			},
			updateLegacy: {
				deprecated: "octokit.teams.updateLegacy() is deprecated, see https://developer.github.com/v3/teams/#edit-team-legacy",
				method: "PATCH",
				params: {
					description: {
						type: "string"
					},
					name: {
						required: true,
						type: "string"
					},
					parent_team_id: {
						type: "integer"
					},
					permission: {
						enum: ["pull", "push", "admin"],
						type: "string"
					},
					privacy: {
						enum: ["secret", "closed"],
						type: "string"
					},
					team_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/teams/:team_id"
			}
		},
		users: {
			addEmails: {
				method: "POST",
				params: {
					emails: {
						required: true,
						type: "string[]"
					}
				},
				url: "/user/emails"
			},
			block: {
				method: "PUT",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/user/blocks/:username"
			},
			checkBlocked: {
				method: "GET",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/user/blocks/:username"
			},
			checkFollowing: {
				method: "GET",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/user/following/:username"
			},
			checkFollowingForUser: {
				method: "GET",
				params: {
					target_user: {
						required: true,
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/following/:target_user"
			},
			createGpgKey: {
				method: "POST",
				params: {
					armored_public_key: {
						type: "string"
					}
				},
				url: "/user/gpg_keys"
			},
			createPublicKey: {
				method: "POST",
				params: {
					key: {
						type: "string"
					},
					title: {
						type: "string"
					}
				},
				url: "/user/keys"
			},
			deleteEmails: {
				method: "DELETE",
				params: {
					emails: {
						required: true,
						type: "string[]"
					}
				},
				url: "/user/emails"
			},
			deleteGpgKey: {
				method: "DELETE",
				params: {
					gpg_key_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/gpg_keys/:gpg_key_id"
			},
			deletePublicKey: {
				method: "DELETE",
				params: {
					key_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/keys/:key_id"
			},
			follow: {
				method: "PUT",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/user/following/:username"
			},
			getAuthenticated: {
				method: "GET",
				params: {},
				url: "/user"
			},
			getByUsername: {
				method: "GET",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username"
			},
			getContextForUser: {
				method: "GET",
				params: {
					subject_id: {
						type: "string"
					},
					subject_type: {
						enum: ["organization", "repository", "issue", "pull_request"],
						type: "string"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/hovercard"
			},
			getGpgKey: {
				method: "GET",
				params: {
					gpg_key_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/gpg_keys/:gpg_key_id"
			},
			getPublicKey: {
				method: "GET",
				params: {
					key_id: {
						required: true,
						type: "integer"
					}
				},
				url: "/user/keys/:key_id"
			},
			list: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					since: {
						type: "string"
					}
				},
				url: "/users"
			},
			listBlocked: {
				method: "GET",
				params: {},
				url: "/user/blocks"
			},
			listEmails: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/emails"
			},
			listFollowersForAuthenticatedUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/followers"
			},
			listFollowersForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/followers"
			},
			listFollowingForAuthenticatedUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/following"
			},
			listFollowingForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/following"
			},
			listGpgKeys: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/gpg_keys"
			},
			listGpgKeysForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/gpg_keys"
			},
			listPublicEmails: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/public_emails"
			},
			listPublicKeys: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					}
				},
				url: "/user/keys"
			},
			listPublicKeysForUser: {
				method: "GET",
				params: {
					page: {
						type: "integer"
					},
					per_page: {
						type: "integer"
					},
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/users/:username/keys"
			},
			togglePrimaryEmailVisibility: {
				method: "PATCH",
				params: {
					email: {
						required: true,
						type: "string"
					},
					visibility: {
						required: true,
						type: "string"
					}
				},
				url: "/user/email/visibility"
			},
			unblock: {
				method: "DELETE",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/user/blocks/:username"
			},
			unfollow: {
				method: "DELETE",
				params: {
					username: {
						required: true,
						type: "string"
					}
				},
				url: "/user/following/:username"
			},
			updateAuthenticated: {
				method: "PATCH",
				params: {
					bio: {
						type: "string"
					},
					blog: {
						type: "string"
					},
					company: {
						type: "string"
					},
					email: {
						type: "string"
					},
					hireable: {
						type: "boolean"
					},
					location: {
						type: "string"
					},
					name: {
						type: "string"
					}
				},
				url: "/user"
			}
		}
	};

	const VERSION = "2.4.0";

	function registerEndpoints(octokit, routes) {
		Object.keys(routes).forEach(namespaceName => {
			if (!octokit[namespaceName]) {
				octokit[namespaceName] = {};
			}

			Object.keys(routes[namespaceName]).forEach(apiName => {
				const apiOptions = routes[namespaceName][apiName];
				const endpointDefaults = ["method", "url", "headers"].reduce((map, key) => {
					if (typeof apiOptions[key] !== "undefined") {
						map[key] = apiOptions[key];
					}

					return map;
				}, {});
				endpointDefaults.request = {
					validate: apiOptions.params
				};
				let request = octokit.request.defaults(endpointDefaults); // patch request & endpoint methods to support deprecated parameters.
				// Not the most elegant solution, but we don’t want to move deprecation
				// logic into octokit/endpoint.js as it’s out of scope

				const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated);

				if (hasDeprecatedParam) {
					const patch = patchForDeprecation.bind(null, octokit, apiOptions);
					request = patch(octokit.request.defaults(endpointDefaults), `.${namespaceName}.${apiName}()`);
					request.endpoint = patch(request.endpoint, `.${namespaceName}.${apiName}.endpoint()`);
					request.endpoint.merge = patch(request.endpoint.merge, `.${namespaceName}.${apiName}.endpoint.merge()`);
				}

				if (apiOptions.deprecated) {
					octokit[namespaceName][apiName] = Object.assign(function deprecatedEndpointMethod() {
						octokit.log.warn(new distNode$3.Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`));
						octokit[namespaceName][apiName] = request;
						return request.apply(null, arguments);
					}, request);
					return;
				}

				octokit[namespaceName][apiName] = request;
			});
		});
	}

	function patchForDeprecation(octokit, apiOptions, method, methodName) {
		const patchedMethod = options => {
			options = Object.assign({}, options);
			Object.keys(options).forEach(key => {
				if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
					const aliasKey = apiOptions.params[key].alias;
					octokit.log.warn(new distNode$3.Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`));

					if (!(aliasKey in options)) {
						options[aliasKey] = options[key];
					}

					delete options[key];
				}
			});
			return method(options);
		};

		Object.keys(method).forEach(key => {
			patchedMethod[key] = method[key];
		});
		return patchedMethod;
	}

	/**
	 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
	 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
	 * done, we will remove the registerEndpoints methods and return the methods
	 * directly as with the other plugins. At that point we will also remove the
	 * legacy workarounds and deprecations.
	 *
	 * See the plan at
	 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
	 */

	function restEndpointMethods(octokit) {
		// @ts-ignore
		octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
		registerEndpoints(octokit, endpointsByScope); // Aliasing scopes for backward compatibility
		// See https://github.com/octokit/rest.js/pull/1134

		[["gitdata", "git"], ["authorization", "oauthAuthorizations"], ["pullRequests", "pulls"]].forEach(([deprecatedScope, scope]) => {
			Object.defineProperty(octokit, deprecatedScope, {
				get() {
					octokit.log.warn( // @ts-ignore
						new distNode$3.Deprecation(`[@octokit/plugin-rest-endpoint-methods] "octokit.${deprecatedScope}.*" methods are deprecated, use "octokit.${scope}.*" instead`)); // @ts-ignore

					return octokit[scope];
				}

			});
		});
		return {};
	}
	restEndpointMethods.VERSION = VERSION;

	exports.restEndpointMethods = restEndpointMethods;

});

unwrapExports(distNode$7);
var distNode_1$7 = distNode$7.restEndpointMethods;

var register_1 = register;

function register (state, name, method, options) {
	if (typeof method !== 'function') {
		throw new Error('method for before hook must be a function')
	}

	if (!options) {
		options = {};
	}

	if (Array.isArray(name)) {
		return name.reverse().reduce(function (callback, name) {
			return register.bind(null, state, name, callback, options)
		}, method)()
	}

	return Promise.resolve()
		.then(function () {
			if (!state.registry[name]) {
				return method(options)
			}

			return (state.registry[name]).reduce(function (method, registered) {
				return registered.hook.bind(null, method, options)
			}, method)()
		})
}

var add = addHook;

function addHook (state, kind, name, hook) {
	var orig = hook;
	if (!state.registry[name]) {
		state.registry[name] = [];
	}

	if (kind === 'before') {
		hook = function (method, options) {
			return Promise.resolve()
				.then(orig.bind(null, options))
				.then(method.bind(null, options))
		};
	}

	if (kind === 'after') {
		hook = function (method, options) {
			var result;
			return Promise.resolve()
				.then(method.bind(null, options))
				.then(function (result_) {
					result = result_;
					return orig(result, options)
				})
				.then(function () {
					return result
				})
		};
	}

	if (kind === 'error') {
		hook = function (method, options) {
			return Promise.resolve()
				.then(method.bind(null, options))
				.catch(function (error) {
					return orig(error, options)
				})
		};
	}

	state.registry[name].push({
		hook: hook,
		orig: orig
	});
}

var remove = removeHook;

function removeHook (state, name, method) {
	if (!state.registry[name]) {
		return
	}

	var index = state.registry[name]
		.map(function (registered) { return registered.orig })
		.indexOf(method);

	if (index === -1) {
		return
	}

	state.registry[name].splice(index, 1);
}

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind;
var bindable = bind.bind(bind);

function bindApi (hook, state, name) {
	var removeHookRef = bindable(remove, null).apply(null, name ? [state, name] : [state]);
	hook.api = { remove: removeHookRef };
	hook.remove = removeHookRef

	;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
		var args = name ? [state, kind, name] : [state, kind];
		hook[kind] = hook.api[kind] = bindable(add, null).apply(null, args);
	});
}

function HookSingular () {
	var singularHookName = 'h';
	var singularHookState = {
		registry: {}
	};
	var singularHook = register_1.bind(null, singularHookState, singularHookName);
	bindApi(singularHook, singularHookState, singularHookName);
	return singularHook
}

function HookCollection () {
	var state = {
		registry: {}
	};

	var hook = register_1.bind(null, state);
	bindApi(hook, state);

	return hook
}

var collectionHookDeprecationMessageDisplayed = false;
function Hook () {
	if (!collectionHookDeprecationMessageDisplayed) {
		console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
		collectionHookDeprecationMessageDisplayed = true;
	}
	return HookCollection()
}

Hook.Singular = HookSingular.bind();
Hook.Collection = HookCollection.bind();

var beforeAfterHook = Hook;
// expose constructors as a named property for TypeScript
var Hook_1 = Hook;
var Singular = Hook.Singular;
var Collection = Hook.Collection;
beforeAfterHook.Hook = Hook_1;
beforeAfterHook.Singular = Singular;
beforeAfterHook.Collection = Collection;

var distNode$8 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

	var osName = _interopDefault(osName_1);

	function getUserAgent() {
		try {
			return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
		} catch (error) {
			if (/wmic os get Caption/.test(error.message)) {
				return "Windows <version undetectable>";
			}

			throw error;
		}
	}

	exports.getUserAgent = getUserAgent;

});

unwrapExports(distNode$8);
var distNode_1$8 = distNode$8.getUserAgent;

var _args$1 = [
	[
		"@octokit/rest@16.43.2",
		"/home/dan/git/binarycocoa/clover-reporter-action"
	]
];
var _from$1 = "@octokit/rest@16.43.2";
var _id$1 = "@octokit/rest@16.43.2";
var _inBundle$1 = false;
var _integrity$1 = "sha512-ngDBevLbBTFfrHZeiS7SAMAZ6ssuVmXuya+F/7RaVvlysgGa1JKJkKWY+jV6TCJYcW0OALfJ7nTIGXcBXzycfQ==";
var _location$1 = "/@octokit/rest";
var _phantomChildren$1 = {
	"@types/node": "14.11.4",
	deprecation: "2.3.1",
	once: "1.4.0",
	"os-name": "3.1.0"
};
var _requested$1 = {
	type: "version",
	registry: true,
	raw: "@octokit/rest@16.43.2",
	name: "@octokit/rest",
	escapedName: "@octokit%2frest",
	scope: "@octokit",
	rawSpec: "16.43.2",
	saveSpec: null,
	fetchSpec: "16.43.2"
};
var _requiredBy$1 = [
	"/@actions/github"
];
var _resolved$1 = "https://registry.npmjs.org/@octokit/rest/-/rest-16.43.2.tgz";
var _spec$1 = "16.43.2";
var _where$1 = "/home/dan/git/binarycocoa/clover-reporter-action";
var author$1 = {
	name: "Gregor Martynus",
	url: "https://github.com/gr2m"
};
var bugs$1 = {
	url: "https://github.com/octokit/rest.js/issues"
};
var bundlesize$1 = [
	{
		path: "./dist/octokit-rest.min.js.gz",
		maxSize: "33 kB"
	}
];
var contributors = [
	{
		name: "Mike de Boer",
		email: "info@mikedeboer.nl"
	},
	{
		name: "Fabian Jakobs",
		email: "fabian@c9.io"
	},
	{
		name: "Joe Gallo",
		email: "joe@brassafrax.com"
	},
	{
		name: "Gregor Martynus",
		url: "https://github.com/gr2m"
	}
];
var dependencies$1 = {
	"@octokit/auth-token": "^2.4.0",
	"@octokit/plugin-paginate-rest": "^1.1.1",
	"@octokit/plugin-request-log": "^1.0.0",
	"@octokit/plugin-rest-endpoint-methods": "2.4.0",
	"@octokit/request": "^5.2.0",
	"@octokit/request-error": "^1.0.2",
	"atob-lite": "^2.0.0",
	"before-after-hook": "^2.0.0",
	"btoa-lite": "^1.0.0",
	deprecation: "^2.0.0",
	"lodash.get": "^4.4.2",
	"lodash.set": "^4.3.2",
	"lodash.uniq": "^4.5.0",
	"octokit-pagination-methods": "^1.1.0",
	once: "^1.4.0",
	"universal-user-agent": "^4.0.0"
};
var description$1 = "GitHub REST API client for Node.js";
var devDependencies$1 = {
	"@gimenete/type-writer": "^0.1.3",
	"@octokit/auth": "^1.1.1",
	"@octokit/fixtures-server": "^5.0.6",
	"@octokit/graphql": "^4.2.0",
	"@types/node": "^13.1.0",
	bundlesize: "^0.18.0",
	chai: "^4.1.2",
	"compression-webpack-plugin": "^3.1.0",
	cypress: "^4.0.0",
	glob: "^7.1.2",
	"http-proxy-agent": "^4.0.0",
	"lodash.camelcase": "^4.3.0",
	"lodash.merge": "^4.6.1",
	"lodash.upperfirst": "^4.3.1",
	lolex: "^6.0.0",
	mkdirp: "^1.0.0",
	mocha: "^7.0.1",
	mustache: "^4.0.0",
	nock: "^11.3.3",
	"npm-run-all": "^4.1.2",
	nyc: "^15.0.0",
	prettier: "^1.14.2",
	proxy: "^1.0.0",
	"semantic-release": "^17.0.0",
	sinon: "^8.0.0",
	"sinon-chai": "^3.0.0",
	"sort-keys": "^4.0.0",
	"string-to-arraybuffer": "^1.0.0",
	"string-to-jsdoc-comment": "^1.0.0",
	typescript: "^3.3.1",
	webpack: "^4.0.0",
	"webpack-bundle-analyzer": "^3.0.0",
	"webpack-cli": "^3.0.0"
};
var files$1 = [
	"index.js",
	"index.d.ts",
	"lib",
	"plugins"
];
var homepage$1 = "https://github.com/octokit/rest.js#readme";
var keywords$1 = [
	"octokit",
	"github",
	"rest",
	"api-client"
];
var license$1 = "MIT";
var name$1 = "@octokit/rest";
var nyc = {
	ignore: [
		"test"
	]
};
var publishConfig$1 = {
	access: "public"
};
var release$1 = {
	publish: [
		"@semantic-release/npm",
		{
			path: "@semantic-release/github",
			assets: [
				"dist/*",
				"!dist/*.map.gz"
			]
		}
	]
};
var repository$1 = {
	type: "git",
	url: "git+https://github.com/octokit/rest.js.git"
};
var scripts$1 = {
	build: "npm-run-all build:*",
	"build:browser": "npm-run-all build:browser:*",
	"build:browser:development": "webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json",
	"build:browser:production": "webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map",
	"build:ts": "npm run -s update-endpoints:typescript",
	coverage: "nyc report --reporter=html && open coverage/index.html",
	"generate-bundle-report": "webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html",
	lint: "prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
	"lint:fix": "prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
	"postvalidate:ts": "tsc --noEmit --target es6 test/typescript-validate.ts",
	"prebuild:browser": "mkdirp dist/",
	pretest: "npm run -s lint",
	"prevalidate:ts": "npm run -s build:ts",
	"start-fixtures-server": "octokit-fixtures-server",
	test: "nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"",
	"test:browser": "cypress run --browser chrome",
	"update-endpoints": "npm-run-all update-endpoints:*",
	"update-endpoints:fetch-json": "node scripts/update-endpoints/fetch-json",
	"update-endpoints:typescript": "node scripts/update-endpoints/typescript",
	"validate:ts": "tsc --target es6 --noImplicitAny index.d.ts"
};
var types = "index.d.ts";
var version$2 = "16.43.2";
var _package$2 = {
	_args: _args$1,
	_from: _from$1,
	_id: _id$1,
	_inBundle: _inBundle$1,
	_integrity: _integrity$1,
	_location: _location$1,
	_phantomChildren: _phantomChildren$1,
	_requested: _requested$1,
	_requiredBy: _requiredBy$1,
	_resolved: _resolved$1,
	_spec: _spec$1,
	_where: _where$1,
	author: author$1,
	bugs: bugs$1,
	bundlesize: bundlesize$1,
	contributors: contributors,
	dependencies: dependencies$1,
	description: description$1,
	devDependencies: devDependencies$1,
	files: files$1,
	homepage: homepage$1,
	keywords: keywords$1,
	license: license$1,
	name: name$1,
	nyc: nyc,
	publishConfig: publishConfig$1,
	release: release$1,
	repository: repository$1,
	scripts: scripts$1,
	types: types,
	version: version$2
};

var _package$3 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	_args: _args$1,
	_from: _from$1,
	_id: _id$1,
	_inBundle: _inBundle$1,
	_integrity: _integrity$1,
	_location: _location$1,
	_phantomChildren: _phantomChildren$1,
	_requested: _requested$1,
	_requiredBy: _requiredBy$1,
	_resolved: _resolved$1,
	_spec: _spec$1,
	_where: _where$1,
	author: author$1,
	bugs: bugs$1,
	bundlesize: bundlesize$1,
	contributors: contributors,
	dependencies: dependencies$1,
	description: description$1,
	devDependencies: devDependencies$1,
	files: files$1,
	homepage: homepage$1,
	keywords: keywords$1,
	license: license$1,
	name: name$1,
	nyc: nyc,
	publishConfig: publishConfig$1,
	release: release$1,
	repository: repository$1,
	scripts: scripts$1,
	types: types,
	version: version$2,
	'default': _package$2
});

var pkg = getCjsExportFromNamespace(_package$3);

var parseClientOptions = parseOptions;

const { Deprecation } = distNode$3;
const { getUserAgent } = distNode$8;




const deprecateOptionsTimeout = once_1((log, deprecation) =>
	log.warn(deprecation)
);
const deprecateOptionsAgent = once_1((log, deprecation) => log.warn(deprecation));
const deprecateOptionsHeaders = once_1((log, deprecation) =>
	log.warn(deprecation)
);

function parseOptions(options, log, hook) {
	if (options.headers) {
		options.headers = Object.keys(options.headers).reduce((newObj, key) => {
			newObj[key.toLowerCase()] = options.headers[key];
			return newObj;
		}, {});
	}

	const clientDefaults = {
		headers: options.headers || {},
		request: options.request || {},
		mediaType: {
			previews: [],
			format: ""
		}
	};

	if (options.baseUrl) {
		clientDefaults.baseUrl = options.baseUrl;
	}

	if (options.userAgent) {
		clientDefaults.headers["user-agent"] = options.userAgent;
	}

	if (options.previews) {
		clientDefaults.mediaType.previews = options.previews;
	}

	if (options.timeZone) {
		clientDefaults.headers["time-zone"] = options.timeZone;
	}

	if (options.timeout) {
		deprecateOptionsTimeout(
			log,
			new Deprecation(
				"[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
			)
		);
		clientDefaults.request.timeout = options.timeout;
	}

	if (options.agent) {
		deprecateOptionsAgent(
			log,
			new Deprecation(
				"[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
			)
		);
		clientDefaults.request.agent = options.agent;
	}

	if (options.headers) {
		deprecateOptionsHeaders(
			log,
			new Deprecation(
				"[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
			)
		);
	}

	const userAgentOption = clientDefaults.headers["user-agent"];
	const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`;

	clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent]
		.filter(Boolean)
		.join(" ");

	clientDefaults.request.hook = hook.bind(null, "request");

	return clientDefaults;
}

var constructor_1 = Octokit;

const { request: request$1 } = distNode$5;




function Octokit(plugins, options) {
	options = options || {};
	const hook = new beforeAfterHook.Collection();
	const log = Object.assign(
		{
			debug: () => {},
			info: () => {},
			warn: console.warn,
			error: console.error
		},
		options && options.log
	);
	const api = {
		hook,
		log,
		request: request$1.defaults(parseClientOptions(options, log, hook))
	};

	plugins.forEach(pluginFunction => pluginFunction(api, options));

	return api;
}

var registerPlugin_1 = registerPlugin;



function registerPlugin(plugins, pluginFunction) {
	return factory_1(
		plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction)
	);
}

var factory_1 = factory;




function factory(plugins) {
	const Api = constructor_1.bind(null, plugins || []);
	Api.plugin = registerPlugin_1.bind(null, plugins || []);
	return Api;
}

var core$3 = factory_1();

var distNode$9 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	async function auth(token) {
		const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
		return {
			type: "token",
			token: token,
			tokenType
		};
	}

	/**
	 * Prefix token for usage in the Authorization header
	 *
	 * @param token OAuth token or JSON Web Token
	 */
	function withAuthorizationPrefix(token) {
		if (token.split(/\./).length === 3) {
			return `bearer ${token}`;
		}

		return `token ${token}`;
	}

	async function hook(token, request, route, parameters) {
		const endpoint = request.endpoint.merge(route, parameters);
		endpoint.headers.authorization = withAuthorizationPrefix(token);
		return request(endpoint);
	}

	const createTokenAuth = function createTokenAuth(token) {
		if (!token) {
			throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
		}

		if (typeof token !== "string") {
			throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
		}

		token = token.replace(/^(token|bearer) +/i, "");
		return Object.assign(auth.bind(null, token), {
			hook: hook.bind(null, token)
		});
	};

	exports.createTokenAuth = createTokenAuth;

});

unwrapExports(distNode$9);
var distNode_1$9 = distNode$9.createTokenAuth;

var btoaNode = function btoa(str) {
	return new Buffer(str).toString('base64')
};

var atobNode = function atob(str) {
	return Buffer.from(str, 'base64').toString('binary')
};

var withAuthorizationPrefix_1 = withAuthorizationPrefix;



const REGEX_IS_BASIC_AUTH = /^[\w-]+:/;

function withAuthorizationPrefix(authorization) {
	if (/^(basic|bearer|token) /i.test(authorization)) {
		return authorization;
	}

	try {
		if (REGEX_IS_BASIC_AUTH.test(atobNode(authorization))) {
			return `basic ${authorization}`;
		}
	} catch (error) {}

	if (authorization.split(/\./).length === 3) {
		return `bearer ${authorization}`;
	}

	return `token ${authorization}`;
}

var beforeRequest = authenticationBeforeRequest;





function authenticationBeforeRequest(state, options) {
	if (typeof state.auth === "string") {
		options.headers.authorization = withAuthorizationPrefix_1(state.auth);
		return;
	}

	if (state.auth.username) {
		const hash = btoaNode(`${state.auth.username}:${state.auth.password}`);
		options.headers.authorization = `Basic ${hash}`;
		if (state.otp) {
			options.headers["x-github-otp"] = state.otp;
		}
		return;
	}

	if (state.auth.clientId) {
		// There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
		// Basic Authorization instead of query parameters. The only routes where that applies share the same
		// URL though: `/applications/:client_id/tokens/:access_token`.
		//
		//  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
		//  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
		//  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
		//
		// We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
		// as well as "/applications/123/tokens/token456"
		if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
			const hash = btoaNode(`${state.auth.clientId}:${state.auth.clientSecret}`);
			options.headers.authorization = `Basic ${hash}`;
			return;
		}

		options.url += options.url.indexOf("?") === -1 ? "?" : "&";
		options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
		return;
	}

	return Promise.resolve()

		.then(() => {
			return state.auth();
		})

		.then(authorization => {
			options.headers.authorization = withAuthorizationPrefix_1(authorization);
		});
}

var distNode$a = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }


	var once = _interopDefault(once_1);

	const logOnce = once(deprecation => console.warn(deprecation));
	/**
	 * Error with extra properties to help with debugging
	 */

	class RequestError extends Error {
		constructor(message, statusCode, options) {
			super(message); // Maintains proper stack trace (only available on V8)

			/* istanbul ignore next */

			if (Error.captureStackTrace) {
				Error.captureStackTrace(this, this.constructor);
			}

			this.name = "HttpError";
			this.status = statusCode;
			Object.defineProperty(this, "code", {
				get() {
					logOnce(new distNode$3.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
					return statusCode;
				}

			});
			this.headers = options.headers || {}; // redact request credentials without mutating original request options

			const requestCopy = Object.assign({}, options.request);

			if (options.request.headers.authorization) {
				requestCopy.headers = Object.assign({}, options.request.headers, {
					authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
				});
			}

			requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
				// see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
				.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
				// see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
				.replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
			this.request = requestCopy;
		}

	}

	exports.RequestError = RequestError;

});

unwrapExports(distNode$a);
var distNode_1$a = distNode$a.RequestError;

var requestError = authenticationRequestError;

const { RequestError } = distNode$a;

function authenticationRequestError(state, error, options) {
	if (!error.headers) throw error;

	const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
	// handle "2FA required" error only
	if (error.status !== 401 || !otpRequired) {
		throw error;
	}

	if (
		error.status === 401 &&
		otpRequired &&
		error.request &&
		error.request.headers["x-github-otp"]
	) {
		if (state.otp) {
			delete state.otp; // no longer valid, request again
		} else {
			throw new RequestError(
				"Invalid one-time password for two-factor authentication",
				401,
				{
					headers: error.headers,
					request: options
				}
			);
		}
	}

	if (typeof state.auth.on2fa !== "function") {
		throw new RequestError(
			"2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
			401,
			{
				headers: error.headers,
				request: options
			}
		);
	}

	return Promise.resolve()
		.then(() => {
			return state.auth.on2fa();
		})
		.then(oneTimePassword => {
			const newOptions = Object.assign(options, {
				headers: Object.assign(options.headers, {
					"x-github-otp": oneTimePassword
				})
			});
			return state.octokit.request(newOptions).then(response => {
				// If OTP still valid, then persist it for following requests
				state.otp = oneTimePassword;
				return response;
			});
		});
}

var validate = validateAuth;

function validateAuth(auth) {
	if (typeof auth === "string") {
		return;
	}

	if (typeof auth === "function") {
		return;
	}

	if (auth.username && auth.password) {
		return;
	}

	if (auth.clientId && auth.clientSecret) {
		return;
	}

	throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
}

var authentication = authenticationPlugin;

const { createTokenAuth } = distNode$9;
const { Deprecation: Deprecation$1 } = distNode$3;







const deprecateAuthBasic = once_1((log, deprecation) => log.warn(deprecation));
const deprecateAuthObject = once_1((log, deprecation) => log.warn(deprecation));

function authenticationPlugin(octokit, options) {
	// If `options.authStrategy` is set then use it and pass in `options.auth`
	if (options.authStrategy) {
		const auth = options.authStrategy(options.auth);
		octokit.hook.wrap("request", auth.hook);
		octokit.auth = auth;
		return;
	}

	// If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
	// is unauthenticated. The `octokit.auth()` method is a no-op and no request hook is registred.
	if (!options.auth) {
		octokit.auth = () =>
			Promise.resolve({
				type: "unauthenticated"
			});
		return;
	}

	const isBasicAuthString =
		typeof options.auth === "string" &&
		/^basic/.test(withAuthorizationPrefix_1(options.auth));

	// If only `options.auth` is set to a string, use the default token authentication strategy.
	if (typeof options.auth === "string" && !isBasicAuthString) {
		const auth = createTokenAuth(options.auth);
		octokit.hook.wrap("request", auth.hook);
		octokit.auth = auth;
		return;
	}

	// Otherwise log a deprecation message
	const [deprecationMethod, deprecationMessapge] = isBasicAuthString
		? [
			deprecateAuthBasic,
			'Setting the "new Octokit({ auth })" option to a Basic Auth string is deprecated. Use https://github.com/octokit/auth-basic.js instead. See (https://octokit.github.io/rest.js/#authentication)'
		]
		: [
			deprecateAuthObject,
			'Setting the "new Octokit({ auth })" option to an object without also setting the "authStrategy" option is deprecated and will be removed in v17. See (https://octokit.github.io/rest.js/#authentication)'
		];
	deprecationMethod(
		octokit.log,
		new Deprecation$1("[@octokit/rest] " + deprecationMessapge)
	);

	octokit.auth = () =>
		Promise.resolve({
			type: "deprecated",
			message: deprecationMessapge
		});

	validate(options.auth);

	const state = {
		octokit,
		auth: options.auth
	};

	octokit.hook.before("request", beforeRequest.bind(null, state));
	octokit.hook.error("request", requestError.bind(null, state));
}

var authenticate_1 = authenticate;

const { Deprecation: Deprecation$2 } = distNode$3;


const deprecateAuthenticate = once_1((log, deprecation) => log.warn(deprecation));

function authenticate(state, options) {
	deprecateAuthenticate(
		state.octokit.log,
		new Deprecation$2(
			'[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
		)
	);

	if (!options) {
		state.auth = false;
		return;
	}

	switch (options.type) {
		case "basic":
			if (!options.username || !options.password) {
				throw new Error(
					"Basic authentication requires both a username and password to be set"
				);
			}
			break;

		case "oauth":
			if (!options.token && !(options.key && options.secret)) {
				throw new Error(
					"OAuth2 authentication requires a token or key & secret to be set"
				);
			}
			break;

		case "token":
		case "app":
			if (!options.token) {
				throw new Error("Token authentication requires a token to be set");
			}
			break;

		default:
			throw new Error(
				"Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
			);
	}

	state.auth = options;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
	genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
	var length = array ? array.length : 0;
	return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
	var index = -1,
		length = array ? array.length : 0;

	while (++index < length) {
		if (comparator(value, array[index])) {
			return true;
		}
	}
	return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
	var length = array.length,
		index = fromIndex + (fromRight ? 1 : -1);

	while ((fromRight ? index-- : ++index < length)) {
		if (predicate(array[index], index, array)) {
			return index;
		}
	}
	return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
	if (value !== value) {
		return baseFindIndex(array, baseIsNaN, fromIndex);
	}
	var index = fromIndex - 1,
		length = array.length;

	while (++index < length) {
		if (array[index] === value) {
			return index;
		}
	}
	return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
	return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
	return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
	return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
	// Many host objects are `Object` objects that can coerce to strings
	// despite having improperly defined `toString` methods.
	var result = false;
	if (value != null && typeof value.toString != 'function') {
		try {
			result = !!(value + '');
		} catch (e) {}
	}
	return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
	var index = -1,
		result = Array(set.size);

	set.forEach(function(value) {
		result[++index] = value;
	});
	return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
	funcProto = Function.prototype,
	objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
	var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
	funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
		.replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root, 'Map'),
	Set = getNative(root, 'Set'),
	nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
	this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
	return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
	var data = this.__data__;
	if (nativeCreate) {
		var result = data[key];
		return result === HASH_UNDEFINED ? undefined : result;
	}
	return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
	var data = this.__data__;
	return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
	var data = this.__data__;
	data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
	this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
	var data = this.__data__,
		index = assocIndexOf(data, key);

	if (index < 0) {
		return false;
	}
	var lastIndex = data.length - 1;
	if (index == lastIndex) {
		data.pop();
	} else {
		splice.call(data, index, 1);
	}
	return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
	var data = this.__data__,
		index = assocIndexOf(data, key);

	return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
	return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
	var data = this.__data__,
		index = assocIndexOf(data, key);

	if (index < 0) {
		data.push([key, value]);
	} else {
		data[index][1] = value;
	}
	return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
	this.__data__ = {
		'hash': new Hash,
		'map': new (Map$1 || ListCache),
		'string': new Hash
	};
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
	return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
	return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
	return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
	getMapData(this, key).set(key, value);
	return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
	var index = -1,
		length = values ? values.length : 0;

	this.__data__ = new MapCache;
	while (++index < length) {
		this.add(values[index]);
	}
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
	this.__data__.set(value, HASH_UNDEFINED);
	return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
	return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
	var length = array.length;
	while (length--) {
		if (eq(array[length][0], key)) {
			return length;
		}
	}
	return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
	if (!isObject(value) || isMasked(value)) {
		return false;
	}
	var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
	var index = -1,
		includes = arrayIncludes,
		length = array.length,
		isCommon = true,
		result = [],
		seen = result;

	if (comparator) {
		isCommon = false;
		includes = arrayIncludesWith;
	}
	else if (length >= LARGE_ARRAY_SIZE) {
		var set = iteratee ? null : createSet(array);
		if (set) {
			return setToArray(set);
		}
		isCommon = false;
		includes = cacheHas;
		seen = new SetCache;
	}
	else {
		seen = iteratee ? [] : result;
	}
	outer:
		while (++index < length) {
			var value = array[index],
				computed = iteratee ? iteratee(value) : value;

			value = (comparator || value !== 0) ? value : 0;
			if (isCommon && computed === computed) {
				var seenIndex = seen.length;
				while (seenIndex--) {
					if (seen[seenIndex] === computed) {
						continue outer;
					}
				}
				if (iteratee) {
					seen.push(computed);
				}
				result.push(value);
			}
			else if (!includes(seen, computed, comparator)) {
				if (seen !== result) {
					seen.push(computed);
				}
				result.push(value);
			}
		}
	return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop$2 : function(values) {
	return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
	var data = map.__data__;
	return isKeyable(key)
		? data[typeof key == 'string' ? 'string' : 'hash']
		: data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
	var value = getValue(object, key);
	return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
	var type = typeof value;
	return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
		? (value !== '__proto__')
		: (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
	return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
	if (func != null) {
		try {
			return funcToString.call(func);
		} catch (e) {}
		try {
			return (func + '');
		} catch (e) {}
	}
	return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
	return (array && array.length)
		? baseUniq(array)
		: [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
	return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
	// The use of `Object#toString` avoids issues with the `typeof` operator
	// in Safari 8-9 which returns 'object' for typed array and other constructors.
	var tag = isObject(value) ? objectToString.call(value) : '';
	return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
	var type = typeof value;
	return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop$2() {
	// No operation performed.
}

var lodash_uniq = uniq;

var beforeRequest$1 = authenticationBeforeRequest$1;




function authenticationBeforeRequest$1(state, options) {
	if (!state.auth.type) {
		return;
	}

	if (state.auth.type === "basic") {
		const hash = btoaNode(`${state.auth.username}:${state.auth.password}`);
		options.headers.authorization = `Basic ${hash}`;
		return;
	}

	if (state.auth.type === "token") {
		options.headers.authorization = `token ${state.auth.token}`;
		return;
	}

	if (state.auth.type === "app") {
		options.headers.authorization = `Bearer ${state.auth.token}`;
		const acceptHeaders = options.headers.accept
			.split(",")
			.concat("application/vnd.github.machine-man-preview+json");
		options.headers.accept = lodash_uniq(acceptHeaders)
			.filter(Boolean)
			.join(",");
		return;
	}

	options.url += options.url.indexOf("?") === -1 ? "?" : "&";

	if (state.auth.token) {
		options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
		return;
	}

	const key = encodeURIComponent(state.auth.key);
	const secret = encodeURIComponent(state.auth.secret);
	options.url += `client_id=${key}&client_secret=${secret}`;
}

var requestError$1 = authenticationRequestError$1;

const { RequestError: RequestError$1 } = distNode$a;

function authenticationRequestError$1(state, error, options) {
	/* istanbul ignore next */
	if (!error.headers) throw error;

	const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
	// handle "2FA required" error only
	if (error.status !== 401 || !otpRequired) {
		throw error;
	}

	if (
		error.status === 401 &&
		otpRequired &&
		error.request &&
		error.request.headers["x-github-otp"]
	) {
		throw new RequestError$1(
			"Invalid one-time password for two-factor authentication",
			401,
			{
				headers: error.headers,
				request: options
			}
		);
	}

	if (typeof state.auth.on2fa !== "function") {
		throw new RequestError$1(
			"2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
			401,
			{
				headers: error.headers,
				request: options
			}
		);
	}

	return Promise.resolve()
		.then(() => {
			return state.auth.on2fa();
		})
		.then(oneTimePassword => {
			const newOptions = Object.assign(options, {
				headers: Object.assign(
					{ "x-github-otp": oneTimePassword },
					options.headers
				)
			});
			return state.octokit.request(newOptions);
		});
}

var authenticationDeprecated = authenticationPlugin$1;

const { Deprecation: Deprecation$3 } = distNode$3;


const deprecateAuthenticate$1 = once_1((log, deprecation) => log.warn(deprecation));





function authenticationPlugin$1(octokit, options) {
	if (options.auth) {
		octokit.authenticate = () => {
			deprecateAuthenticate$1(
				octokit.log,
				new Deprecation$3(
					'[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
				)
			);
		};
		return;
	}
	const state = {
		octokit,
		auth: false
	};
	octokit.authenticate = authenticate_1.bind(null, state);
	octokit.hook.before("request", beforeRequest$1.bind(null, state));
	octokit.hook.error("request", requestError$1.bind(null, state));
}

var distNode$b = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	const VERSION = "1.1.2";

	/**
	 * Some “list” response that can be paginated have a different response structure
	 *
	 * They have a `total_count` key in the response (search also has `incomplete_results`,
	 * /installation/repositories also has `repository_selection`), as well as a key with
	 * the list of the items which name varies from endpoint to endpoint:
	 *
	 * - https://developer.github.com/v3/search/#example (key `items`)
	 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
	 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
	 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
	 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
	 *
	 * Octokit normalizes these responses so that paginated results are always returned following
	 * the same structure. One challenge is that if the list response has only one page, no Link
	 * header is provided, so this header alone is not sufficient to check wether a response is
	 * paginated or not. For the exceptions with the namespace, a fallback check for the route
	 * paths has to be added in order to normalize the response. We cannot check for the total_count
	 * property because it also exists in the response of Get the combined status for a specific ref.
	 */
	const REGEX = [/^\/search\//, /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)([^/]|$)/, /^\/installation\/repositories([^/]|$)/, /^\/user\/installations([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/secrets([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/workflows(\/[^/]+\/runs)?([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/runs(\/[^/]+\/(artifacts|jobs))?([^/]|$)/];
	function normalizePaginatedListResponse(octokit, url, response) {
		const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
		const responseNeedsNormalization = REGEX.find(regex => regex.test(path));
		if (!responseNeedsNormalization) return; // keep the additional properties intact as there is currently no other way
		// to retrieve the same information.

		const incompleteResults = response.data.incomplete_results;
		const repositorySelection = response.data.repository_selection;
		const totalCount = response.data.total_count;
		delete response.data.incomplete_results;
		delete response.data.repository_selection;
		delete response.data.total_count;
		const namespaceKey = Object.keys(response.data)[0];
		const data = response.data[namespaceKey];
		response.data = data;

		if (typeof incompleteResults !== "undefined") {
			response.data.incomplete_results = incompleteResults;
		}

		if (typeof repositorySelection !== "undefined") {
			response.data.repository_selection = repositorySelection;
		}

		response.data.total_count = totalCount;
		Object.defineProperty(response.data, namespaceKey, {
			get() {
				octokit.log.warn(`[@octokit/paginate-rest] "response.data.${namespaceKey}" is deprecated for "GET ${path}". Get the results directly from "response.data"`);
				return Array.from(data);
			}

		});
	}

	function iterator(octokit, route, parameters) {
		const options = octokit.request.endpoint(route, parameters);
		const method = options.method;
		const headers = options.headers;
		let url = options.url;
		return {
			[Symbol.asyncIterator]: () => ({
				next() {
					if (!url) {
						return Promise.resolve({
							done: true
						});
					}

					return octokit.request({
						method,
						url,
						headers
					}).then(response => {
						normalizePaginatedListResponse(octokit, url, response); // `response.headers.link` format:
						// '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
						// sets `url` to undefined if "next" URL is not present or `link` header is not set

						url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
						return {
							value: response
						};
					});
				}

			})
		};
	}

	function paginate(octokit, route, parameters, mapFn) {
		if (typeof parameters === "function") {
			mapFn = parameters;
			parameters = undefined;
		}

		return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
	}

	function gather(octokit, results, iterator, mapFn) {
		return iterator.next().then(result => {
			if (result.done) {
				return results;
			}

			let earlyExit = false;

			function done() {
				earlyExit = true;
			}

			results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

			if (earlyExit) {
				return results;
			}

			return gather(octokit, results, iterator, mapFn);
		});
	}

	/**
	 * @param octokit Octokit instance
	 * @param options Options passed to Octokit constructor
	 */

	function paginateRest(octokit) {
		return {
			paginate: Object.assign(paginate.bind(null, octokit), {
				iterator: iterator.bind(null, octokit)
			})
		};
	}
	paginateRest.VERSION = VERSION;

	exports.paginateRest = paginateRest;

});

unwrapExports(distNode$b);
var distNode_1$b = distNode$b.paginateRest;

var pagination = paginatePlugin;

const { paginateRest } = distNode$b;

function paginatePlugin(octokit) {
	Object.assign(octokit, paginateRest(octokit));
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** `Object#toString` result references. */
var funcTag$1 = '[object Function]',
	genTag$1 = '[object GeneratorFunction]',
	symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	reIsPlainProp = /^\w*$/,
	reLeadingDot = /^\./,
	rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
	return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$1(value) {
	// Many host objects are `Object` objects that can coerce to strings
	// despite having improperly defined `toString` methods.
	var result = false;
	if (value != null && typeof value.toString != 'function') {
		try {
			result = !!(value + '');
		} catch (e) {}
	}
	return result;
}

/** Used for built-in method references. */
var arrayProto$1 = Array.prototype,
	funcProto$1 = Function.prototype,
	objectProto$1 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$1 = (function() {
	var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
	return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Used to detect if a method is native. */
var reIsNative$1 = RegExp('^' +
	funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar$1, '\\$&')
		.replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$1 = root$1.Symbol,
	splice$1 = arrayProto$1.splice;

/* Built-in method references that are verified to be native. */
var Map$2 = getNative$1(root$1, 'Map'),
	nativeCreate$1 = getNative$1(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
	symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$1() {
	this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$1(key) {
	return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$1(key) {
	var data = this.__data__;
	if (nativeCreate$1) {
		var result = data[key];
		return result === HASH_UNDEFINED$1 ? undefined : result;
	}
	return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$1(key) {
	var data = this.__data__;
	return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty$1.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$1(key, value) {
	var data = this.__data__;
	data[key] = (nativeCreate$1 && value === undefined) ? HASH_UNDEFINED$1 : value;
	return this;
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear$1;
Hash$1.prototype['delete'] = hashDelete$1;
Hash$1.prototype.get = hashGet$1;
Hash$1.prototype.has = hashHas$1;
Hash$1.prototype.set = hashSet$1;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$1(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$1() {
	this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$1(key) {
	var data = this.__data__,
		index = assocIndexOf$1(data, key);

	if (index < 0) {
		return false;
	}
	var lastIndex = data.length - 1;
	if (index == lastIndex) {
		data.pop();
	} else {
		splice$1.call(data, index, 1);
	}
	return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$1(key) {
	var data = this.__data__,
		index = assocIndexOf$1(data, key);

	return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$1(key) {
	return assocIndexOf$1(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$1(key, value) {
	var data = this.__data__,
		index = assocIndexOf$1(data, key);

	if (index < 0) {
		data.push([key, value]);
	} else {
		data[index][1] = value;
	}
	return this;
}

// Add methods to `ListCache`.
ListCache$1.prototype.clear = listCacheClear$1;
ListCache$1.prototype['delete'] = listCacheDelete$1;
ListCache$1.prototype.get = listCacheGet$1;
ListCache$1.prototype.has = listCacheHas$1;
ListCache$1.prototype.set = listCacheSet$1;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$1(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$1() {
	this.__data__ = {
		'hash': new Hash$1,
		'map': new (Map$2 || ListCache$1),
		'string': new Hash$1
	};
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$1(key) {
	return getMapData$1(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$1(key) {
	return getMapData$1(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$1(key) {
	return getMapData$1(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$1(key, value) {
	getMapData$1(this, key).set(key, value);
	return this;
}

// Add methods to `MapCache`.
MapCache$1.prototype.clear = mapCacheClear$1;
MapCache$1.prototype['delete'] = mapCacheDelete$1;
MapCache$1.prototype.get = mapCacheGet$1;
MapCache$1.prototype.has = mapCacheHas$1;
MapCache$1.prototype.set = mapCacheSet$1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$1(array, key) {
	var length = array.length;
	while (length--) {
		if (eq$1(array[length][0], key)) {
			return length;
		}
	}
	return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
	path = isKey(path, object) ? [path] : castPath(path);

	var index = 0,
		length = path.length;

	while (object != null && index < length) {
		object = object[toKey(path[index++])];
	}
	return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
	if (!isObject$1(value) || isMasked$1(value)) {
		return false;
	}
	var pattern = (isFunction$1(value) || isHostObject$1(value)) ? reIsNative$1 : reIsHostCtor$1;
	return pattern.test(toSource$1(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
	// Exit early for strings to avoid a performance hit in some environments.
	if (typeof value == 'string') {
		return value;
	}
	if (isSymbol(value)) {
		return symbolToString ? symbolToString.call(value) : '';
	}
	var result = (value + '');
	return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
	return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$1(map, key) {
	var data = map.__data__;
	return isKeyable$1(key)
		? data[typeof key == 'string' ? 'string' : 'hash']
		: data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$1(object, key) {
	var value = getValue$1(object, key);
	return baseIsNative$1(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
	if (isArray(value)) {
		return false;
	}
	var type = typeof value;
	if (type == 'number' || type == 'symbol' || type == 'boolean' ||
		value == null || isSymbol(value)) {
		return true;
	}
	return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
		(object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$1(value) {
	var type = typeof value;
	return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
		? (value !== '__proto__')
		: (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
	return !!maskSrcKey$1 && (maskSrcKey$1 in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
	string = toString(string);

	var result = [];
	if (reLeadingDot.test(string)) {
		result.push('');
	}
	string.replace(rePropName, function(match, number, quote, string) {
		result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	});
	return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
	if (typeof value == 'string' || isSymbol(value)) {
		return value;
	}
	var result = (value + '');
	return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$1(func) {
	if (func != null) {
		try {
			return funcToString$1.call(func);
		} catch (e) {}
		try {
			return (func + '');
		} catch (e) {}
	}
	return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
	if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
		throw new TypeError(FUNC_ERROR_TEXT);
	}
	var memoized = function() {
		var args = arguments,
			key = resolver ? resolver.apply(this, args) : args[0],
			cache = memoized.cache;

		if (cache.has(key)) {
			return cache.get(key);
		}
		var result = func.apply(this, args);
		memoized.cache = cache.set(key, result);
		return result;
	};
	memoized.cache = new (memoize.Cache || MapCache$1);
	return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache$1;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$1(value, other) {
	return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
	// The use of `Object#toString` avoids issues with the `typeof` operator
	// in Safari 8-9 which returns 'object' for typed array and other constructors.
	var tag = isObject$1(value) ? objectToString$1.call(value) : '';
	return tag == funcTag$1 || tag == genTag$1;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
	var type = typeof value;
	return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
	return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
	return typeof value == 'symbol' ||
		(isObjectLike(value) && objectToString$1.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
	return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
	var result = object == null ? undefined : baseGet(object, path);
	return result === undefined ? defaultValue : result;
}

var lodash_get = get;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
	MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag$2 = '[object Function]',
	genTag$2 = '[object GeneratorFunction]',
	symbolTag$1 = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	reIsPlainProp$1 = /^\w*$/,
	reLeadingDot$1 = /^\./,
	rePropName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$2 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar$1 = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$2 = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal$2 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$2 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal$2 || freeSelf$2 || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$2(object, key) {
	return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$2(value) {
	// Many host objects are `Object` objects that can coerce to strings
	// despite having improperly defined `toString` methods.
	var result = false;
	if (value != null && typeof value.toString != 'function') {
		try {
			result = !!(value + '');
		} catch (e) {}
	}
	return result;
}

/** Used for built-in method references. */
var arrayProto$2 = Array.prototype,
	funcProto$2 = Function.prototype,
	objectProto$2 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$2 = root$2['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$2 = (function() {
	var uid = /[^.]+$/.exec(coreJsData$2 && coreJsData$2.keys && coreJsData$2.keys.IE_PROTO || '');
	return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$2 = objectProto$2.toString;

/** Used to detect if a method is native. */
var reIsNative$2 = RegExp('^' +
	funcToString$2.call(hasOwnProperty$2).replace(reRegExpChar$2, '\\$&')
		.replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$2 = root$2.Symbol,
	splice$2 = arrayProto$2.splice;

/* Built-in method references that are verified to be native. */
var Map$3 = getNative$2(root$2, 'Map'),
	nativeCreate$2 = getNative$2(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : undefined,
	symbolToString$1 = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$2(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$2() {
	this.__data__ = nativeCreate$2 ? nativeCreate$2(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$2(key) {
	return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$2(key) {
	var data = this.__data__;
	if (nativeCreate$2) {
		var result = data[key];
		return result === HASH_UNDEFINED$2 ? undefined : result;
	}
	return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$2(key) {
	var data = this.__data__;
	return nativeCreate$2 ? data[key] !== undefined : hasOwnProperty$2.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$2(key, value) {
	var data = this.__data__;
	data[key] = (nativeCreate$2 && value === undefined) ? HASH_UNDEFINED$2 : value;
	return this;
}

// Add methods to `Hash`.
Hash$2.prototype.clear = hashClear$2;
Hash$2.prototype['delete'] = hashDelete$2;
Hash$2.prototype.get = hashGet$2;
Hash$2.prototype.has = hashHas$2;
Hash$2.prototype.set = hashSet$2;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$2(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$2() {
	this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$2(key) {
	var data = this.__data__,
		index = assocIndexOf$2(data, key);

	if (index < 0) {
		return false;
	}
	var lastIndex = data.length - 1;
	if (index == lastIndex) {
		data.pop();
	} else {
		splice$2.call(data, index, 1);
	}
	return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$2(key) {
	var data = this.__data__,
		index = assocIndexOf$2(data, key);

	return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$2(key) {
	return assocIndexOf$2(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$2(key, value) {
	var data = this.__data__,
		index = assocIndexOf$2(data, key);

	if (index < 0) {
		data.push([key, value]);
	} else {
		data[index][1] = value;
	}
	return this;
}

// Add methods to `ListCache`.
ListCache$2.prototype.clear = listCacheClear$2;
ListCache$2.prototype['delete'] = listCacheDelete$2;
ListCache$2.prototype.get = listCacheGet$2;
ListCache$2.prototype.has = listCacheHas$2;
ListCache$2.prototype.set = listCacheSet$2;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$2(entries) {
	var index = -1,
		length = entries ? entries.length : 0;

	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$2() {
	this.__data__ = {
		'hash': new Hash$2,
		'map': new (Map$3 || ListCache$2),
		'string': new Hash$2
	};
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$2(key) {
	return getMapData$2(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$2(key) {
	return getMapData$2(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$2(key) {
	return getMapData$2(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$2(key, value) {
	getMapData$2(this, key).set(key, value);
	return this;
}

// Add methods to `MapCache`.
MapCache$2.prototype.clear = mapCacheClear$2;
MapCache$2.prototype['delete'] = mapCacheDelete$2;
MapCache$2.prototype.get = mapCacheGet$2;
MapCache$2.prototype.has = mapCacheHas$2;
MapCache$2.prototype.set = mapCacheSet$2;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
	var objValue = object[key];
	if (!(hasOwnProperty$2.call(object, key) && eq$2(objValue, value)) ||
		(value === undefined && !(key in object))) {
		object[key] = value;
	}
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$2(array, key) {
	var length = array.length;
	while (length--) {
		if (eq$2(array[length][0], key)) {
			return length;
		}
	}
	return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$2(value) {
	if (!isObject$2(value) || isMasked$2(value)) {
		return false;
	}
	var pattern = (isFunction$2(value) || isHostObject$2(value)) ? reIsNative$2 : reIsHostCtor$2;
	return pattern.test(toSource$2(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
	if (!isObject$2(object)) {
		return object;
	}
	path = isKey$1(path, object) ? [path] : castPath$1(path);

	var index = -1,
		length = path.length,
		lastIndex = length - 1,
		nested = object;

	while (nested != null && ++index < length) {
		var key = toKey$1(path[index]),
			newValue = value;

		if (index != lastIndex) {
			var objValue = nested[key];
			newValue = customizer ? customizer(objValue, key, nested) : undefined;
			if (newValue === undefined) {
				newValue = isObject$2(objValue)
					? objValue
					: (isIndex(path[index + 1]) ? [] : {});
			}
		}
		assignValue(nested, key, newValue);
		nested = nested[key];
	}
	return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString$1(value) {
	// Exit early for strings to avoid a performance hit in some environments.
	if (typeof value == 'string') {
		return value;
	}
	if (isSymbol$1(value)) {
		return symbolToString$1 ? symbolToString$1.call(value) : '';
	}
	var result = (value + '');
	return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath$1(value) {
	return isArray$1(value) ? value : stringToPath$1(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$2(map, key) {
	var data = map.__data__;
	return isKeyable$2(key)
		? data[typeof key == 'string' ? 'string' : 'hash']
		: data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$2(object, key) {
	var value = getValue$2(object, key);
	return baseIsNative$2(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
	length = length == null ? MAX_SAFE_INTEGER : length;
	return !!length &&
		(typeof value == 'number' || reIsUint.test(value)) &&
		(value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey$1(value, object) {
	if (isArray$1(value)) {
		return false;
	}
	var type = typeof value;
	if (type == 'number' || type == 'symbol' || type == 'boolean' ||
		value == null || isSymbol$1(value)) {
		return true;
	}
	return reIsPlainProp$1.test(value) || !reIsDeepProp$1.test(value) ||
		(object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$2(value) {
	var type = typeof value;
	return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
		? (value !== '__proto__')
		: (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$2(func) {
	return !!maskSrcKey$2 && (maskSrcKey$2 in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath$1 = memoize$1(function(string) {
	string = toString$1(string);

	var result = [];
	if (reLeadingDot$1.test(string)) {
		result.push('');
	}
	string.replace(rePropName$1, function(match, number, quote, string) {
		result.push(quote ? string.replace(reEscapeChar$1, '$1') : (number || match));
	});
	return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey$1(value) {
	if (typeof value == 'string' || isSymbol$1(value)) {
		return value;
	}
	var result = (value + '');
	return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$2(func) {
	if (func != null) {
		try {
			return funcToString$2.call(func);
		} catch (e) {}
		try {
			return (func + '');
		} catch (e) {}
	}
	return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize$1(func, resolver) {
	if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
		throw new TypeError(FUNC_ERROR_TEXT$1);
	}
	var memoized = function() {
		var args = arguments,
			key = resolver ? resolver.apply(this, args) : args[0],
			cache = memoized.cache;

		if (cache.has(key)) {
			return cache.get(key);
		}
		var result = func.apply(this, args);
		memoized.cache = cache.set(key, result);
		return result;
	};
	memoized.cache = new (memoize$1.Cache || MapCache$2);
	return memoized;
}

// Assign cache to `_.memoize`.
memoize$1.Cache = MapCache$2;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$2(value, other) {
	return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$2(value) {
	// The use of `Object#toString` avoids issues with the `typeof` operator
	// in Safari 8-9 which returns 'object' for typed array and other constructors.
	var tag = isObject$2(value) ? objectToString$2.call(value) : '';
	return tag == funcTag$2 || tag == genTag$2;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$2(value) {
	var type = typeof value;
	return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
	return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
	return typeof value == 'symbol' ||
		(isObjectLike$1(value) && objectToString$2.call(value) == symbolTag$1);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
	return value == null ? '' : baseToString$1(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
	return object == null ? object : baseSet(object, path, value);
}

var lodash_set = set;

var validate_1 = validate$1;

const { RequestError: RequestError$2 } = distNode$a;



function validate$1(octokit, options) {
	if (!options.request.validate) {
		return;
	}
	const { validate: params } = options.request;

	Object.keys(params).forEach(parameterName => {
		const parameter = lodash_get(params, parameterName);

		const expectedType = parameter.type;
		let parentParameterName;
		let parentValue;
		let parentParamIsPresent = true;
		let parentParameterIsArray = false;

		if (/\./.test(parameterName)) {
			parentParameterName = parameterName.replace(/\.[^.]+$/, "");
			parentParameterIsArray = parentParameterName.slice(-2) === "[]";
			if (parentParameterIsArray) {
				parentParameterName = parentParameterName.slice(0, -2);
			}
			parentValue = lodash_get(options, parentParameterName);
			parentParamIsPresent =
				parentParameterName === "headers" ||
				(typeof parentValue === "object" && parentValue !== null);
		}

		const values = parentParameterIsArray
			? (lodash_get(options, parentParameterName) || []).map(
				value => value[parameterName.split(/\./).pop()]
			)
			: [lodash_get(options, parameterName)];

		values.forEach((value, i) => {
			const valueIsPresent = typeof value !== "undefined";
			const valueIsNull = value === null;
			const currentParameterName = parentParameterIsArray
				? parameterName.replace(/\[\]/, `[${i}]`)
				: parameterName;

			if (!parameter.required && !valueIsPresent) {
				return;
			}

			// if the parent parameter is of type object but allows null
			// then the child parameters can be ignored
			if (!parentParamIsPresent) {
				return;
			}

			if (parameter.allowNull && valueIsNull) {
				return;
			}

			if (!parameter.allowNull && valueIsNull) {
				throw new RequestError$2(
					`'${currentParameterName}' cannot be null`,
					400,
					{
						request: options
					}
				);
			}

			if (parameter.required && !valueIsPresent) {
				throw new RequestError$2(
					`Empty value for parameter '${currentParameterName}': ${JSON.stringify(
						value
					)}`,
					400,
					{
						request: options
					}
				);
			}

			// parse to integer before checking for enum
			// so that string "1" will match enum with number 1
			if (expectedType === "integer") {
				const unparsedValue = value;
				value = parseInt(value, 10);
				if (isNaN(value)) {
					throw new RequestError$2(
						`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
							unparsedValue
						)} is NaN`,
						400,
						{
							request: options
						}
					);
				}
			}

			if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
				throw new RequestError$2(
					`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
						value
					)}`,
					400,
					{
						request: options
					}
				);
			}

			if (parameter.validation) {
				const regex = new RegExp(parameter.validation);
				if (!regex.test(value)) {
					throw new RequestError$2(
						`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
							value
						)}`,
						400,
						{
							request: options
						}
					);
				}
			}

			if (expectedType === "object" && typeof value === "string") {
				try {
					value = JSON.parse(value);
				} catch (exception) {
					throw new RequestError$2(
						`JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(
							value
						)}`,
						400,
						{
							request: options
						}
					);
				}
			}

			lodash_set(options, parameter.mapTo || currentParameterName, value);
		});
	});

	return options;
}

var validate_1$1 = octokitValidate;



function octokitValidate(octokit) {
	octokit.hook.before("request", validate_1.bind(null, octokit));
}

var deprecate_1 = deprecate;

const loggedMessages = {};

function deprecate (message) {
	if (loggedMessages[message]) {
		return
	}

	console.warn(`DEPRECATED (@octokit/rest): ${message}`);
	loggedMessages[message] = 1;
}

var getPageLinks_1 = getPageLinks;

function getPageLinks (link) {
	link = link.link || link.headers.link || '';

	const links = {};

	// link format:
	// '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
	link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
		links[type] = uri;
	});

	return links
}

var httpError = class HttpError extends Error {
	constructor (message, code, headers) {
		super(message);

		// Maintains proper stack trace (only available on V8)
		/* istanbul ignore next */
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}

		this.name = 'HttpError';
		this.code = code;
		this.headers = headers;
	}
};

var getPage_1 = getPage;





function getPage (octokit, link, which, headers) {
	deprecate_1(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
	const url = getPageLinks_1(link)[which];

	if (!url) {
		const urlError = new httpError(`No ${which} page found`, 404);
		return Promise.reject(urlError)
	}

	const requestOptions = {
		url,
		headers: applyAcceptHeader(link, headers)
	};

	const promise = octokit.request(requestOptions);

	return promise
}

function applyAcceptHeader (res, headers) {
	const previous = res.headers && res.headers['x-github-media-type'];

	if (!previous || (headers && headers.accept)) {
		return headers
	}
	headers = headers || {};
	headers.accept = 'application/vnd.' + previous
		.replace('; param=', '.')
		.replace('; format=', '+');

	return headers
}

var getFirstPage_1 = getFirstPage;



function getFirstPage (octokit, link, headers) {
	return getPage_1(octokit, link, 'first', headers)
}

var getLastPage_1 = getLastPage;



function getLastPage (octokit, link, headers) {
	return getPage_1(octokit, link, 'last', headers)
}

var getNextPage_1 = getNextPage;



function getNextPage (octokit, link, headers) {
	return getPage_1(octokit, link, 'next', headers)
}

var getPreviousPage_1 = getPreviousPage;



function getPreviousPage (octokit, link, headers) {
	return getPage_1(octokit, link, 'prev', headers)
}

var hasFirstPage_1 = hasFirstPage;




function hasFirstPage (link) {
	deprecate_1(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
	return getPageLinks_1(link).first
}

var hasLastPage_1 = hasLastPage;




function hasLastPage (link) {
	deprecate_1(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
	return getPageLinks_1(link).last
}

var hasNextPage_1 = hasNextPage;




function hasNextPage (link) {
	deprecate_1(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
	return getPageLinks_1(link).next
}

var hasPreviousPage_1 = hasPreviousPage;




function hasPreviousPage (link) {
	deprecate_1(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
	return getPageLinks_1(link).prev
}

var octokitPaginationMethods = paginationMethodsPlugin;

function paginationMethodsPlugin (octokit) {
	octokit.getFirstPage = getFirstPage_1.bind(null, octokit);
	octokit.getLastPage = getLastPage_1.bind(null, octokit);
	octokit.getNextPage = getNextPage_1.bind(null, octokit);
	octokit.getPreviousPage = getPreviousPage_1.bind(null, octokit);
	octokit.hasFirstPage = hasFirstPage_1;
	octokit.hasLastPage = hasLastPage_1;
	octokit.hasNextPage = hasNextPage_1;
	octokit.hasPreviousPage = hasPreviousPage_1;
}

const { requestLog } = distNode$6;
const {
	restEndpointMethods
} = distNode$7;



const CORE_PLUGINS = [
	authentication,
	authenticationDeprecated, // deprecated: remove in v17
	requestLog,
	pagination,
	restEndpointMethods,
	validate_1$1,

	octokitPaginationMethods // deprecated: remove in v17
];

const OctokitRest = core$3.plugin(CORE_PLUGINS);

function DeprecatedOctokit(options) {
	const warn =
		options && options.log && options.log.warn
			? options.log.warn
			: console.warn;
	warn(
		'[@octokit/rest] `const Octokit = require("@octokit/rest")` is deprecated. Use `const { Octokit } = require("@octokit/rest")` instead'
	);
	return new OctokitRest(options);
}

const Octokit$1 = Object.assign(DeprecatedOctokit, {
	Octokit: OctokitRest
});

Object.keys(OctokitRest).forEach(key => {
	/* istanbul ignore else */
	if (OctokitRest.hasOwnProperty(key)) {
		Octokit$1[key] = OctokitRest[key];
	}
});

var rest = Octokit$1;

var context = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	class Context {
		/**
		 * Hydrate the context from the environment
		 */
		constructor() {
			this.payload = {};
			if (process.env.GITHUB_EVENT_PATH) {
				if (fs__default.existsSync(process.env.GITHUB_EVENT_PATH)) {
					this.payload = JSON.parse(fs__default.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
				}
				else {
					process.stdout.write(`GITHUB_EVENT_PATH ${process.env.GITHUB_EVENT_PATH} does not exist${os.EOL}`);
				}
			}
			this.eventName = process.env.GITHUB_EVENT_NAME;
			this.sha = process.env.GITHUB_SHA;
			this.ref = process.env.GITHUB_REF;
			this.workflow = process.env.GITHUB_WORKFLOW;
			this.action = process.env.GITHUB_ACTION;
			this.actor = process.env.GITHUB_ACTOR;
		}
		get issue() {
			const payload = this.payload;
			return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pullRequest || payload).number });
		}
		get repo() {
			if (process.env.GITHUB_REPOSITORY) {
				const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
				return { owner, repo };
			}
			if (this.payload.repository) {
				return {
					owner: this.payload.repository.owner.login,
					repo: this.payload.repository.name
				};
			}
			throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
		}
	}
	exports.Context = Context;

});

unwrapExports(context);
var context_1 = context.Context;

var github = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
		return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
		result["default"] = mod;
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts

	const rest_1 = __importDefault(rest);
	const Context = __importStar(context);
// We need this in order to extend Octokit
	rest_1.default.prototype = new rest_1.default();
	exports.context = new Context.Context();
	class GitHub extends rest_1.default {
		constructor(token, opts = {}) {
			super(Object.assign(Object.assign({}, opts), { auth: `token ${token}` }));
			this.graphql = graphql$1.defaults({
				headers: { authorization: `token ${token}` }
			});
		}
	}
	exports.GitHub = GitHub;

});

unwrapExports(github);
var github_1 = github.context;
var github_2 = github.GitHub;

var defaults = createCommonjsModule(function (module, exports) {
// Generated by CoffeeScript 1.12.7
	(function() {
		exports.defaults = {
			"0.1": {
				explicitCharkey: false,
				trim: true,
				normalize: true,
				normalizeTags: false,
				attrkey: "@",
				charkey: "#",
				explicitArray: false,
				ignoreAttrs: false,
				mergeAttrs: false,
				explicitRoot: false,
				validator: null,
				xmlns: false,
				explicitChildren: false,
				childkey: '@@',
				charsAsChildren: false,
				includeWhiteChars: false,
				async: false,
				strict: true,
				attrNameProcessors: null,
				attrValueProcessors: null,
				tagNameProcessors: null,
				valueProcessors: null,
				emptyTag: ''
			},
			"0.2": {
				explicitCharkey: false,
				trim: false,
				normalize: false,
				normalizeTags: false,
				attrkey: "$",
				charkey: "_",
				explicitArray: true,
				ignoreAttrs: false,
				mergeAttrs: false,
				explicitRoot: true,
				validator: null,
				xmlns: false,
				explicitChildren: false,
				preserveChildrenOrder: false,
				childkey: '$$',
				charsAsChildren: false,
				includeWhiteChars: false,
				async: false,
				strict: true,
				attrNameProcessors: null,
				attrValueProcessors: null,
				tagNameProcessors: null,
				valueProcessors: null,
				rootName: 'root',
				xmldec: {
					'version': '1.0',
					'encoding': 'UTF-8',
					'standalone': true
				},
				doctype: null,
				renderOpts: {
					'pretty': true,
					'indent': '  ',
					'newline': '\n'
				},
				headless: false,
				chunkSize: 10000,
				emptyTag: '',
				cdata: false
			}
		};

	}).call(commonjsGlobal);
});
var defaults_1 = defaults.defaults;

var Utility = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject,
			slice = [].slice,
			hasProp = {}.hasOwnProperty;

		assign = function() {
			var i, key, len, source, sources, target;
			target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
			if (isFunction(Object.assign)) {
				Object.assign.apply(null, arguments);
			} else {
				for (i = 0, len = sources.length; i < len; i++) {
					source = sources[i];
					if (source != null) {
						for (key in source) {
							if (!hasProp.call(source, key)) continue;
							target[key] = source[key];
						}
					}
				}
			}
			return target;
		};

		isFunction = function(val) {
			return !!val && Object.prototype.toString.call(val) === '[object Function]';
		};

		isObject = function(val) {
			var ref;
			return !!val && ((ref = typeof val) === 'function' || ref === 'object');
		};

		isArray = function(val) {
			if (isFunction(Array.isArray)) {
				return Array.isArray(val);
			} else {
				return Object.prototype.toString.call(val) === '[object Array]';
			}
		};

		isEmpty = function(val) {
			var key;
			if (isArray(val)) {
				return !val.length;
			} else {
				for (key in val) {
					if (!hasProp.call(val, key)) continue;
					return false;
				}
				return true;
			}
		};

		isPlainObject = function(val) {
			var ctor, proto;
			return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && (typeof ctor === 'function') && (ctor instanceof ctor) && (Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object));
		};

		getValue = function(obj) {
			if (isFunction(obj.valueOf)) {
				return obj.valueOf();
			} else {
				return obj;
			}
		};

		module.exports.assign = assign;

		module.exports.isFunction = isFunction;

		module.exports.isObject = isObject;

		module.exports.isArray = isArray;

		module.exports.isEmpty = isEmpty;

		module.exports.isPlainObject = isPlainObject;

		module.exports.getValue = getValue;

	}).call(commonjsGlobal);
});
var Utility_1 = Utility.assign;
var Utility_2 = Utility.isFunction;
var Utility_3 = Utility.isObject;
var Utility_4 = Utility.isArray;
var Utility_5 = Utility.isEmpty;
var Utility_6 = Utility.isPlainObject;
var Utility_7 = Utility.getValue;

var XMLDOMImplementation = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLDOMImplementation;

		module.exports = XMLDOMImplementation = (function() {
			function XMLDOMImplementation() {}

			XMLDOMImplementation.prototype.hasFeature = function(feature, version) {
				return true;
			};

			XMLDOMImplementation.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
				throw new Error("This DOM method is not implemented.");
			};

			XMLDOMImplementation.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
				throw new Error("This DOM method is not implemented.");
			};

			XMLDOMImplementation.prototype.createHTMLDocument = function(title) {
				throw new Error("This DOM method is not implemented.");
			};

			XMLDOMImplementation.prototype.getFeature = function(feature, version) {
				throw new Error("This DOM method is not implemented.");
			};

			return XMLDOMImplementation;

		})();

	}).call(commonjsGlobal);
});

var XMLDOMErrorHandler = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLDOMErrorHandler;

		module.exports = XMLDOMErrorHandler = (function() {
			function XMLDOMErrorHandler() {}

			XMLDOMErrorHandler.prototype.handleError = function(error) {
				throw new Error(error);
			};

			return XMLDOMErrorHandler;

		})();

	}).call(commonjsGlobal);
});

var XMLDOMStringList = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLDOMStringList;

		module.exports = XMLDOMStringList = (function() {
			function XMLDOMStringList(arr) {
				this.arr = arr || [];
			}

			Object.defineProperty(XMLDOMStringList.prototype, 'length', {
				get: function() {
					return this.arr.length;
				}
			});

			XMLDOMStringList.prototype.item = function(index) {
				return this.arr[index] || null;
			};

			XMLDOMStringList.prototype.contains = function(str) {
				return this.arr.indexOf(str) !== -1;
			};

			return XMLDOMStringList;

		})();

	}).call(commonjsGlobal);
});

var XMLDOMConfiguration = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLDOMConfiguration, XMLDOMErrorHandler$1, XMLDOMStringList$1;

		XMLDOMErrorHandler$1 = XMLDOMErrorHandler;

		XMLDOMStringList$1 = XMLDOMStringList;

		module.exports = XMLDOMConfiguration = (function() {
			function XMLDOMConfiguration() {
				var clonedSelf;
				this.defaultParams = {
					"canonical-form": false,
					"cdata-sections": false,
					"comments": false,
					"datatype-normalization": false,
					"element-content-whitespace": true,
					"entities": true,
					"error-handler": new XMLDOMErrorHandler$1(),
					"infoset": true,
					"validate-if-schema": false,
					"namespaces": true,
					"namespace-declarations": true,
					"normalize-characters": false,
					"schema-location": '',
					"schema-type": '',
					"split-cdata-sections": true,
					"validate": false,
					"well-formed": true
				};
				this.params = clonedSelf = Object.create(this.defaultParams);
			}

			Object.defineProperty(XMLDOMConfiguration.prototype, 'parameterNames', {
				get: function() {
					return new XMLDOMStringList$1(Object.keys(this.defaultParams));
				}
			});

			XMLDOMConfiguration.prototype.getParameter = function(name) {
				if (this.params.hasOwnProperty(name)) {
					return this.params[name];
				} else {
					return null;
				}
			};

			XMLDOMConfiguration.prototype.canSetParameter = function(name, value) {
				return true;
			};

			XMLDOMConfiguration.prototype.setParameter = function(name, value) {
				if (value != null) {
					return this.params[name] = value;
				} else {
					return delete this.params[name];
				}
			};

			return XMLDOMConfiguration;

		})();

	}).call(commonjsGlobal);
});

var NodeType = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		module.exports = {
			Element: 1,
			Attribute: 2,
			Text: 3,
			CData: 4,
			EntityReference: 5,
			EntityDeclaration: 6,
			ProcessingInstruction: 7,
			Comment: 8,
			Document: 9,
			DocType: 10,
			DocumentFragment: 11,
			NotationDeclaration: 12,
			Declaration: 201,
			Raw: 202,
			AttributeDeclaration: 203,
			ElementDeclaration: 204,
			Dummy: 205
		};

	}).call(commonjsGlobal);
});
var NodeType_1 = NodeType.Element;
var NodeType_2 = NodeType.Attribute;
var NodeType_3 = NodeType.Text;
var NodeType_4 = NodeType.CData;
var NodeType_5 = NodeType.EntityReference;
var NodeType_6 = NodeType.EntityDeclaration;
var NodeType_7 = NodeType.ProcessingInstruction;
var NodeType_8 = NodeType.Comment;
var NodeType_9 = NodeType.Document;
var NodeType_10 = NodeType.DocType;
var NodeType_11 = NodeType.DocumentFragment;
var NodeType_12 = NodeType.NotationDeclaration;
var NodeType_13 = NodeType.Declaration;
var NodeType_14 = NodeType.Raw;
var NodeType_15 = NodeType.AttributeDeclaration;
var NodeType_16 = NodeType.ElementDeclaration;
var NodeType_17 = NodeType.Dummy;

var XMLAttribute = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLAttribute;

		NodeType$1 = NodeType;

		module.exports = XMLAttribute = (function() {
			function XMLAttribute(parent, name, value) {
				this.parent = parent;
				if (this.parent) {
					this.options = this.parent.options;
					this.stringify = this.parent.stringify;
				}
				if (name == null) {
					throw new Error("Missing attribute name. " + this.debugInfo(name));
				}
				this.name = this.stringify.name(name);
				this.value = this.stringify.attValue(value);
				this.type = NodeType$1.Attribute;
				this.isId = false;
				this.schemaTypeInfo = null;
			}

			Object.defineProperty(XMLAttribute.prototype, 'nodeType', {
				get: function() {
					return this.type;
				}
			});

			Object.defineProperty(XMLAttribute.prototype, 'ownerElement', {
				get: function() {
					return this.parent;
				}
			});

			Object.defineProperty(XMLAttribute.prototype, 'textContent', {
				get: function() {
					return this.value;
				},
				set: function(value) {
					return this.value = value || '';
				}
			});

			Object.defineProperty(XMLAttribute.prototype, 'namespaceURI', {
				get: function() {
					return '';
				}
			});

			Object.defineProperty(XMLAttribute.prototype, 'prefix', {
				get: function() {
					return '';
				}
			});

			Object.defineProperty(XMLAttribute.prototype, 'localName', {
				get: function() {
					return this.name;
				}
			});

			Object.defineProperty(XMLAttribute.prototype, 'specified', {
				get: function() {
					return true;
				}
			});

			XMLAttribute.prototype.clone = function() {
				return Object.create(this);
			};

			XMLAttribute.prototype.toString = function(options) {
				return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
			};

			XMLAttribute.prototype.debugInfo = function(name) {
				name = name || this.name;
				if (name == null) {
					return "parent: <" + this.parent.name + ">";
				} else {
					return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
				}
			};

			XMLAttribute.prototype.isEqualNode = function(node) {
				if (node.namespaceURI !== this.namespaceURI) {
					return false;
				}
				if (node.prefix !== this.prefix) {
					return false;
				}
				if (node.localName !== this.localName) {
					return false;
				}
				if (node.value !== this.value) {
					return false;
				}
				return true;
			};

			return XMLAttribute;

		})();

	}).call(commonjsGlobal);
});

var XMLNamedNodeMap = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLNamedNodeMap;

		module.exports = XMLNamedNodeMap = (function() {
			function XMLNamedNodeMap(nodes) {
				this.nodes = nodes;
			}

			Object.defineProperty(XMLNamedNodeMap.prototype, 'length', {
				get: function() {
					return Object.keys(this.nodes).length || 0;
				}
			});

			XMLNamedNodeMap.prototype.clone = function() {
				return this.nodes = null;
			};

			XMLNamedNodeMap.prototype.getNamedItem = function(name) {
				return this.nodes[name];
			};

			XMLNamedNodeMap.prototype.setNamedItem = function(node) {
				var oldNode;
				oldNode = this.nodes[node.nodeName];
				this.nodes[node.nodeName] = node;
				return oldNode || null;
			};

			XMLNamedNodeMap.prototype.removeNamedItem = function(name) {
				var oldNode;
				oldNode = this.nodes[name];
				delete this.nodes[name];
				return oldNode || null;
			};

			XMLNamedNodeMap.prototype.item = function(index) {
				return this.nodes[Object.keys(this.nodes)[index]] || null;
			};

			XMLNamedNodeMap.prototype.getNamedItemNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented.");
			};

			XMLNamedNodeMap.prototype.setNamedItemNS = function(node) {
				throw new Error("This DOM method is not implemented.");
			};

			XMLNamedNodeMap.prototype.removeNamedItemNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented.");
			};

			return XMLNamedNodeMap;

		})();

	}).call(commonjsGlobal);
});

var XMLNode = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var DocumentPosition$1, NodeType$1, XMLCData$1, XMLComment$1, XMLDeclaration$1, XMLDocType$1, XMLDummy$1, XMLElement$1, XMLNode, XMLNodeList$1, XMLProcessingInstruction$1, XMLRaw$1, XMLText$1, getValue, isEmpty, isFunction, isObject, ref1,
			hasProp = {}.hasOwnProperty;

		ref1 = Utility, isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;

		XMLElement$1 = null;

		XMLCData$1 = null;

		XMLComment$1 = null;

		XMLDeclaration$1 = null;

		XMLDocType$1 = null;

		XMLRaw$1 = null;

		XMLText$1 = null;

		XMLProcessingInstruction$1 = null;

		XMLDummy$1 = null;

		NodeType$1 = null;

		XMLNodeList$1 = null;

		DocumentPosition$1 = null;

		module.exports = XMLNode = (function() {
			function XMLNode(parent1) {
				this.parent = parent1;
				if (this.parent) {
					this.options = this.parent.options;
					this.stringify = this.parent.stringify;
				}
				this.value = null;
				this.children = [];
				this.baseURI = null;
				if (!XMLElement$1) {
					XMLElement$1 = XMLElement;
					XMLCData$1 = XMLCData;
					XMLComment$1 = XMLComment;
					XMLDeclaration$1 = XMLDeclaration;
					XMLDocType$1 = XMLDocType;
					XMLRaw$1 = XMLRaw;
					XMLText$1 = XMLText;
					XMLProcessingInstruction$1 = XMLProcessingInstruction;
					XMLDummy$1 = XMLDummy;
					NodeType$1 = NodeType;
					XMLNodeList$1 = XMLNodeList;
					DocumentPosition$1 = DocumentPosition;
				}
			}

			Object.defineProperty(XMLNode.prototype, 'nodeName', {
				get: function() {
					return this.name;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'nodeType', {
				get: function() {
					return this.type;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'nodeValue', {
				get: function() {
					return this.value;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'parentNode', {
				get: function() {
					return this.parent;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'childNodes', {
				get: function() {
					if (!this.childNodeList || !this.childNodeList.nodes) {
						this.childNodeList = new XMLNodeList$1(this.children);
					}
					return this.childNodeList;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'firstChild', {
				get: function() {
					return this.children[0] || null;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'lastChild', {
				get: function() {
					return this.children[this.children.length - 1] || null;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'previousSibling', {
				get: function() {
					var i;
					i = this.parent.children.indexOf(this);
					return this.parent.children[i - 1] || null;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'nextSibling', {
				get: function() {
					var i;
					i = this.parent.children.indexOf(this);
					return this.parent.children[i + 1] || null;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'ownerDocument', {
				get: function() {
					return this.document() || null;
				}
			});

			Object.defineProperty(XMLNode.prototype, 'textContent', {
				get: function() {
					var child, j, len, ref2, str;
					if (this.nodeType === NodeType$1.Element || this.nodeType === NodeType$1.DocumentFragment) {
						str = '';
						ref2 = this.children;
						for (j = 0, len = ref2.length; j < len; j++) {
							child = ref2[j];
							if (child.textContent) {
								str += child.textContent;
							}
						}
						return str;
					} else {
						return null;
					}
				},
				set: function(value) {
					throw new Error("This DOM method is not implemented." + this.debugInfo());
				}
			});

			XMLNode.prototype.setParent = function(parent) {
				var child, j, len, ref2, results;
				this.parent = parent;
				if (parent) {
					this.options = parent.options;
					this.stringify = parent.stringify;
				}
				ref2 = this.children;
				results = [];
				for (j = 0, len = ref2.length; j < len; j++) {
					child = ref2[j];
					results.push(child.setParent(this));
				}
				return results;
			};

			XMLNode.prototype.element = function(name, attributes, text) {
				var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
				lastChild = null;
				if (attributes === null && (text == null)) {
					ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
				}
				if (attributes == null) {
					attributes = {};
				}
				attributes = getValue(attributes);
				if (!isObject(attributes)) {
					ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
				}
				if (name != null) {
					name = getValue(name);
				}
				if (Array.isArray(name)) {
					for (j = 0, len = name.length; j < len; j++) {
						item = name[j];
						lastChild = this.element(item);
					}
				} else if (isFunction(name)) {
					lastChild = this.element(name.apply());
				} else if (isObject(name)) {
					for (key in name) {
						if (!hasProp.call(name, key)) continue;
						val = name[key];
						if (isFunction(val)) {
							val = val.apply();
						}
						if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
							lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
						} else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
							lastChild = this.dummy();
						} else if (isObject(val) && isEmpty(val)) {
							lastChild = this.element(key);
						} else if (!this.options.keepNullNodes && (val == null)) {
							lastChild = this.dummy();
						} else if (!this.options.separateArrayItems && Array.isArray(val)) {
							for (k = 0, len1 = val.length; k < len1; k++) {
								item = val[k];
								childNode = {};
								childNode[key] = item;
								lastChild = this.element(childNode);
							}
						} else if (isObject(val)) {
							if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
								lastChild = this.element(val);
							} else {
								lastChild = this.element(key);
								lastChild.element(val);
							}
						} else {
							lastChild = this.element(key, val);
						}
					}
				} else if (!this.options.keepNullNodes && text === null) {
					lastChild = this.dummy();
				} else {
					if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
						lastChild = this.text(text);
					} else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
						lastChild = this.cdata(text);
					} else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
						lastChild = this.comment(text);
					} else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
						lastChild = this.raw(text);
					} else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
						lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
					} else {
						lastChild = this.node(name, attributes, text);
					}
				}
				if (lastChild == null) {
					throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
				}
				return lastChild;
			};

			XMLNode.prototype.insertBefore = function(name, attributes, text) {
				var child, i, newChild, refChild, removed;
				if (name != null ? name.type : void 0) {
					newChild = name;
					refChild = attributes;
					newChild.setParent(this);
					if (refChild) {
						i = children.indexOf(refChild);
						removed = children.splice(i);
						children.push(newChild);
						Array.prototype.push.apply(children, removed);
					} else {
						children.push(newChild);
					}
					return newChild;
				} else {
					if (this.isRoot) {
						throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
					}
					i = this.parent.children.indexOf(this);
					removed = this.parent.children.splice(i);
					child = this.parent.element(name, attributes, text);
					Array.prototype.push.apply(this.parent.children, removed);
					return child;
				}
			};

			XMLNode.prototype.insertAfter = function(name, attributes, text) {
				var child, i, removed;
				if (this.isRoot) {
					throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
				}
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i + 1);
				child = this.parent.element(name, attributes, text);
				Array.prototype.push.apply(this.parent.children, removed);
				return child;
			};

			XMLNode.prototype.remove = function() {
				var i, ref2;
				if (this.isRoot) {
					throw new Error("Cannot remove the root element. " + this.debugInfo());
				}
				i = this.parent.children.indexOf(this);
				[].splice.apply(this.parent.children, [i, i - i + 1].concat(ref2 = [])), ref2;
				return this.parent;
			};

			XMLNode.prototype.node = function(name, attributes, text) {
				var child, ref2;
				if (name != null) {
					name = getValue(name);
				}
				attributes || (attributes = {});
				attributes = getValue(attributes);
				if (!isObject(attributes)) {
					ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
				}
				child = new XMLElement$1(this, name, attributes);
				if (text != null) {
					child.text(text);
				}
				this.children.push(child);
				return child;
			};

			XMLNode.prototype.text = function(value) {
				var child;
				if (isObject(value)) {
					this.element(value);
				}
				child = new XMLText$1(this, value);
				this.children.push(child);
				return this;
			};

			XMLNode.prototype.cdata = function(value) {
				var child;
				child = new XMLCData$1(this, value);
				this.children.push(child);
				return this;
			};

			XMLNode.prototype.comment = function(value) {
				var child;
				child = new XMLComment$1(this, value);
				this.children.push(child);
				return this;
			};

			XMLNode.prototype.commentBefore = function(value) {
				var child, i, removed;
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i);
				child = this.parent.comment(value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};

			XMLNode.prototype.commentAfter = function(value) {
				var child, i, removed;
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i + 1);
				child = this.parent.comment(value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};

			XMLNode.prototype.raw = function(value) {
				var child;
				child = new XMLRaw$1(this, value);
				this.children.push(child);
				return this;
			};

			XMLNode.prototype.dummy = function() {
				var child;
				child = new XMLDummy$1(this);
				return child;
			};

			XMLNode.prototype.instruction = function(target, value) {
				var insTarget, insValue, instruction, j, len;
				if (target != null) {
					target = getValue(target);
				}
				if (value != null) {
					value = getValue(value);
				}
				if (Array.isArray(target)) {
					for (j = 0, len = target.length; j < len; j++) {
						insTarget = target[j];
						this.instruction(insTarget);
					}
				} else if (isObject(target)) {
					for (insTarget in target) {
						if (!hasProp.call(target, insTarget)) continue;
						insValue = target[insTarget];
						this.instruction(insTarget, insValue);
					}
				} else {
					if (isFunction(value)) {
						value = value.apply();
					}
					instruction = new XMLProcessingInstruction$1(this, target, value);
					this.children.push(instruction);
				}
				return this;
			};

			XMLNode.prototype.instructionBefore = function(target, value) {
				var child, i, removed;
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i);
				child = this.parent.instruction(target, value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};

			XMLNode.prototype.instructionAfter = function(target, value) {
				var child, i, removed;
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i + 1);
				child = this.parent.instruction(target, value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};

			XMLNode.prototype.declaration = function(version, encoding, standalone) {
				var doc, xmldec;
				doc = this.document();
				xmldec = new XMLDeclaration$1(doc, version, encoding, standalone);
				if (doc.children.length === 0) {
					doc.children.unshift(xmldec);
				} else if (doc.children[0].type === NodeType$1.Declaration) {
					doc.children[0] = xmldec;
				} else {
					doc.children.unshift(xmldec);
				}
				return doc.root() || doc;
			};

			XMLNode.prototype.dtd = function(pubID, sysID) {
				var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
				doc = this.document();
				doctype = new XMLDocType$1(doc, pubID, sysID);
				ref2 = doc.children;
				for (i = j = 0, len = ref2.length; j < len; i = ++j) {
					child = ref2[i];
					if (child.type === NodeType$1.DocType) {
						doc.children[i] = doctype;
						return doctype;
					}
				}
				ref3 = doc.children;
				for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
					child = ref3[i];
					if (child.isRoot) {
						doc.children.splice(i, 0, doctype);
						return doctype;
					}
				}
				doc.children.push(doctype);
				return doctype;
			};

			XMLNode.prototype.up = function() {
				if (this.isRoot) {
					throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
				}
				return this.parent;
			};

			XMLNode.prototype.root = function() {
				var node;
				node = this;
				while (node) {
					if (node.type === NodeType$1.Document) {
						return node.rootObject;
					} else if (node.isRoot) {
						return node;
					} else {
						node = node.parent;
					}
				}
			};

			XMLNode.prototype.document = function() {
				var node;
				node = this;
				while (node) {
					if (node.type === NodeType$1.Document) {
						return node;
					} else {
						node = node.parent;
					}
				}
			};

			XMLNode.prototype.end = function(options) {
				return this.document().end(options);
			};

			XMLNode.prototype.prev = function() {
				var i;
				i = this.parent.children.indexOf(this);
				if (i < 1) {
					throw new Error("Already at the first node. " + this.debugInfo());
				}
				return this.parent.children[i - 1];
			};

			XMLNode.prototype.next = function() {
				var i;
				i = this.parent.children.indexOf(this);
				if (i === -1 || i === this.parent.children.length - 1) {
					throw new Error("Already at the last node. " + this.debugInfo());
				}
				return this.parent.children[i + 1];
			};

			XMLNode.prototype.importDocument = function(doc) {
				var clonedRoot;
				clonedRoot = doc.root().clone();
				clonedRoot.parent = this;
				clonedRoot.isRoot = false;
				this.children.push(clonedRoot);
				return this;
			};

			XMLNode.prototype.debugInfo = function(name) {
				var ref2, ref3;
				name = name || this.name;
				if ((name == null) && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
					return "";
				} else if (name == null) {
					return "parent: <" + this.parent.name + ">";
				} else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
					return "node: <" + name + ">";
				} else {
					return "node: <" + name + ">, parent: <" + this.parent.name + ">";
				}
			};

			XMLNode.prototype.ele = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};

			XMLNode.prototype.nod = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};

			XMLNode.prototype.txt = function(value) {
				return this.text(value);
			};

			XMLNode.prototype.dat = function(value) {
				return this.cdata(value);
			};

			XMLNode.prototype.com = function(value) {
				return this.comment(value);
			};

			XMLNode.prototype.ins = function(target, value) {
				return this.instruction(target, value);
			};

			XMLNode.prototype.doc = function() {
				return this.document();
			};

			XMLNode.prototype.dec = function(version, encoding, standalone) {
				return this.declaration(version, encoding, standalone);
			};

			XMLNode.prototype.e = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};

			XMLNode.prototype.n = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};

			XMLNode.prototype.t = function(value) {
				return this.text(value);
			};

			XMLNode.prototype.d = function(value) {
				return this.cdata(value);
			};

			XMLNode.prototype.c = function(value) {
				return this.comment(value);
			};

			XMLNode.prototype.r = function(value) {
				return this.raw(value);
			};

			XMLNode.prototype.i = function(target, value) {
				return this.instruction(target, value);
			};

			XMLNode.prototype.u = function() {
				return this.up();
			};

			XMLNode.prototype.importXMLBuilder = function(doc) {
				return this.importDocument(doc);
			};

			XMLNode.prototype.replaceChild = function(newChild, oldChild) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.removeChild = function(oldChild) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.appendChild = function(newChild) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.hasChildNodes = function() {
				return this.children.length !== 0;
			};

			XMLNode.prototype.cloneNode = function(deep) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.normalize = function() {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.isSupported = function(feature, version) {
				return true;
			};

			XMLNode.prototype.hasAttributes = function() {
				return this.attribs.length !== 0;
			};

			XMLNode.prototype.compareDocumentPosition = function(other) {
				var ref, res;
				ref = this;
				if (ref === other) {
					return 0;
				} else if (this.document() !== other.document()) {
					res = DocumentPosition$1.Disconnected | DocumentPosition$1.ImplementationSpecific;
					if (Math.random() < 0.5) {
						res |= DocumentPosition$1.Preceding;
					} else {
						res |= DocumentPosition$1.Following;
					}
					return res;
				} else if (ref.isAncestor(other)) {
					return DocumentPosition$1.Contains | DocumentPosition$1.Preceding;
				} else if (ref.isDescendant(other)) {
					return DocumentPosition$1.Contains | DocumentPosition$1.Following;
				} else if (ref.isPreceding(other)) {
					return DocumentPosition$1.Preceding;
				} else {
					return DocumentPosition$1.Following;
				}
			};

			XMLNode.prototype.isSameNode = function(other) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.lookupPrefix = function(namespaceURI) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.isDefaultNamespace = function(namespaceURI) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.lookupNamespaceURI = function(prefix) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.isEqualNode = function(node) {
				var i, j, ref2;
				if (node.nodeType !== this.nodeType) {
					return false;
				}
				if (node.children.length !== this.children.length) {
					return false;
				}
				for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
					if (!this.children[i].isEqualNode(node.children[i])) {
						return false;
					}
				}
				return true;
			};

			XMLNode.prototype.getFeature = function(feature, version) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.setUserData = function(key, data, handler) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.getUserData = function(key) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLNode.prototype.contains = function(other) {
				if (!other) {
					return false;
				}
				return other === this || this.isDescendant(other);
			};

			XMLNode.prototype.isDescendant = function(node) {
				var child, isDescendantChild, j, len, ref2;
				ref2 = this.children;
				for (j = 0, len = ref2.length; j < len; j++) {
					child = ref2[j];
					if (node === child) {
						return true;
					}
					isDescendantChild = child.isDescendant(node);
					if (isDescendantChild) {
						return true;
					}
				}
				return false;
			};

			XMLNode.prototype.isAncestor = function(node) {
				return node.isDescendant(this);
			};

			XMLNode.prototype.isPreceding = function(node) {
				var nodePos, thisPos;
				nodePos = this.treePosition(node);
				thisPos = this.treePosition(this);
				if (nodePos === -1 || thisPos === -1) {
					return false;
				} else {
					return nodePos < thisPos;
				}
			};

			XMLNode.prototype.isFollowing = function(node) {
				var nodePos, thisPos;
				nodePos = this.treePosition(node);
				thisPos = this.treePosition(this);
				if (nodePos === -1 || thisPos === -1) {
					return false;
				} else {
					return nodePos > thisPos;
				}
			};

			XMLNode.prototype.treePosition = function(node) {
				var found, pos;
				pos = 0;
				found = false;
				this.foreachTreeNode(this.document(), function(childNode) {
					pos++;
					if (!found && childNode === node) {
						return found = true;
					}
				});
				if (found) {
					return pos;
				} else {
					return -1;
				}
			};

			XMLNode.prototype.foreachTreeNode = function(node, func) {
				var child, j, len, ref2, res;
				node || (node = this.document());
				ref2 = node.children;
				for (j = 0, len = ref2.length; j < len; j++) {
					child = ref2[j];
					if (res = func(child)) {
						return res;
					} else {
						res = this.foreachTreeNode(child, func);
						if (res) {
							return res;
						}
					}
				}
			};

			return XMLNode;

		})();

	}).call(commonjsGlobal);
});

var XMLElement = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLAttribute$1, XMLElement, XMLNamedNodeMap$1, XMLNode$1, getValue, isFunction, isObject, ref,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		ref = Utility, isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		XMLAttribute$1 = XMLAttribute;

		XMLNamedNodeMap$1 = XMLNamedNodeMap;

		module.exports = XMLElement = (function(superClass) {
			extend(XMLElement, superClass);

			function XMLElement(parent, name, attributes) {
				var child, j, len, ref1;
				XMLElement.__super__.constructor.call(this, parent);
				if (name == null) {
					throw new Error("Missing element name. " + this.debugInfo());
				}
				this.name = this.stringify.name(name);
				this.type = NodeType$1.Element;
				this.attribs = {};
				this.schemaTypeInfo = null;
				if (attributes != null) {
					this.attribute(attributes);
				}
				if (parent.type === NodeType$1.Document) {
					this.isRoot = true;
					this.documentObject = parent;
					parent.rootObject = this;
					if (parent.children) {
						ref1 = parent.children;
						for (j = 0, len = ref1.length; j < len; j++) {
							child = ref1[j];
							if (child.type === NodeType$1.DocType) {
								child.name = this.name;
								break;
							}
						}
					}
				}
			}

			Object.defineProperty(XMLElement.prototype, 'tagName', {
				get: function() {
					return this.name;
				}
			});

			Object.defineProperty(XMLElement.prototype, 'namespaceURI', {
				get: function() {
					return '';
				}
			});

			Object.defineProperty(XMLElement.prototype, 'prefix', {
				get: function() {
					return '';
				}
			});

			Object.defineProperty(XMLElement.prototype, 'localName', {
				get: function() {
					return this.name;
				}
			});

			Object.defineProperty(XMLElement.prototype, 'id', {
				get: function() {
					throw new Error("This DOM method is not implemented." + this.debugInfo());
				}
			});

			Object.defineProperty(XMLElement.prototype, 'className', {
				get: function() {
					throw new Error("This DOM method is not implemented." + this.debugInfo());
				}
			});

			Object.defineProperty(XMLElement.prototype, 'classList', {
				get: function() {
					throw new Error("This DOM method is not implemented." + this.debugInfo());
				}
			});

			Object.defineProperty(XMLElement.prototype, 'attributes', {
				get: function() {
					if (!this.attributeMap || !this.attributeMap.nodes) {
						this.attributeMap = new XMLNamedNodeMap$1(this.attribs);
					}
					return this.attributeMap;
				}
			});

			XMLElement.prototype.clone = function() {
				var att, attName, clonedSelf, ref1;
				clonedSelf = Object.create(this);
				if (clonedSelf.isRoot) {
					clonedSelf.documentObject = null;
				}
				clonedSelf.attribs = {};
				ref1 = this.attribs;
				for (attName in ref1) {
					if (!hasProp.call(ref1, attName)) continue;
					att = ref1[attName];
					clonedSelf.attribs[attName] = att.clone();
				}
				clonedSelf.children = [];
				this.children.forEach(function(child) {
					var clonedChild;
					clonedChild = child.clone();
					clonedChild.parent = clonedSelf;
					return clonedSelf.children.push(clonedChild);
				});
				return clonedSelf;
			};

			XMLElement.prototype.attribute = function(name, value) {
				var attName, attValue;
				if (name != null) {
					name = getValue(name);
				}
				if (isObject(name)) {
					for (attName in name) {
						if (!hasProp.call(name, attName)) continue;
						attValue = name[attName];
						this.attribute(attName, attValue);
					}
				} else {
					if (isFunction(value)) {
						value = value.apply();
					}
					if (this.options.keepNullAttributes && (value == null)) {
						this.attribs[name] = new XMLAttribute$1(this, name, "");
					} else if (value != null) {
						this.attribs[name] = new XMLAttribute$1(this, name, value);
					}
				}
				return this;
			};

			XMLElement.prototype.removeAttribute = function(name) {
				var attName, j, len;
				if (name == null) {
					throw new Error("Missing attribute name. " + this.debugInfo());
				}
				name = getValue(name);
				if (Array.isArray(name)) {
					for (j = 0, len = name.length; j < len; j++) {
						attName = name[j];
						delete this.attribs[attName];
					}
				} else {
					delete this.attribs[name];
				}
				return this;
			};

			XMLElement.prototype.toString = function(options) {
				return this.options.writer.element(this, this.options.writer.filterOptions(options));
			};

			XMLElement.prototype.att = function(name, value) {
				return this.attribute(name, value);
			};

			XMLElement.prototype.a = function(name, value) {
				return this.attribute(name, value);
			};

			XMLElement.prototype.getAttribute = function(name) {
				if (this.attribs.hasOwnProperty(name)) {
					return this.attribs[name].value;
				} else {
					return null;
				}
			};

			XMLElement.prototype.setAttribute = function(name, value) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.getAttributeNode = function(name) {
				if (this.attribs.hasOwnProperty(name)) {
					return this.attribs[name];
				} else {
					return null;
				}
			};

			XMLElement.prototype.setAttributeNode = function(newAttr) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.removeAttributeNode = function(oldAttr) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.getElementsByTagName = function(name) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.getAttributeNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.removeAttributeNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.setAttributeNodeNS = function(newAttr) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.hasAttribute = function(name) {
				return this.attribs.hasOwnProperty(name);
			};

			XMLElement.prototype.hasAttributeNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.setIdAttribute = function(name, isId) {
				if (this.attribs.hasOwnProperty(name)) {
					return this.attribs[name].isId;
				} else {
					return isId;
				}
			};

			XMLElement.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.setIdAttributeNode = function(idAttr, isId) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.getElementsByTagName = function(tagname) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.getElementsByClassName = function(classNames) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLElement.prototype.isEqualNode = function(node) {
				var i, j, ref1;
				if (!XMLElement.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
					return false;
				}
				if (node.namespaceURI !== this.namespaceURI) {
					return false;
				}
				if (node.prefix !== this.prefix) {
					return false;
				}
				if (node.localName !== this.localName) {
					return false;
				}
				if (node.attribs.length !== this.attribs.length) {
					return false;
				}
				for (i = j = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
					if (!this.attribs[i].isEqualNode(node.attribs[i])) {
						return false;
					}
				}
				return true;
			};

			return XMLElement;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLCharacterData = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLCharacterData, XMLNode$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		XMLNode$1 = XMLNode;

		module.exports = XMLCharacterData = (function(superClass) {
			extend(XMLCharacterData, superClass);

			function XMLCharacterData(parent) {
				XMLCharacterData.__super__.constructor.call(this, parent);
				this.value = '';
			}

			Object.defineProperty(XMLCharacterData.prototype, 'data', {
				get: function() {
					return this.value;
				},
				set: function(value) {
					return this.value = value || '';
				}
			});

			Object.defineProperty(XMLCharacterData.prototype, 'length', {
				get: function() {
					return this.value.length;
				}
			});

			Object.defineProperty(XMLCharacterData.prototype, 'textContent', {
				get: function() {
					return this.value;
				},
				set: function(value) {
					return this.value = value || '';
				}
			});

			XMLCharacterData.prototype.clone = function() {
				return Object.create(this);
			};

			XMLCharacterData.prototype.substringData = function(offset, count) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLCharacterData.prototype.appendData = function(arg) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLCharacterData.prototype.insertData = function(offset, arg) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLCharacterData.prototype.deleteData = function(offset, count) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLCharacterData.prototype.replaceData = function(offset, count, arg) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLCharacterData.prototype.isEqualNode = function(node) {
				if (!XMLCharacterData.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
					return false;
				}
				if (node.data !== this.data) {
					return false;
				}
				return true;
			};

			return XMLCharacterData;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLCData = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLCData, XMLCharacterData$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		NodeType$1 = NodeType;

		XMLCharacterData$1 = XMLCharacterData;

		module.exports = XMLCData = (function(superClass) {
			extend(XMLCData, superClass);

			function XMLCData(parent, text) {
				XMLCData.__super__.constructor.call(this, parent);
				if (text == null) {
					throw new Error("Missing CDATA text. " + this.debugInfo());
				}
				this.name = "#cdata-section";
				this.type = NodeType$1.CData;
				this.value = this.stringify.cdata(text);
			}

			XMLCData.prototype.clone = function() {
				return Object.create(this);
			};

			XMLCData.prototype.toString = function(options) {
				return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
			};

			return XMLCData;

		})(XMLCharacterData$1);

	}).call(commonjsGlobal);
});

var XMLComment = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLCharacterData$1, XMLComment,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		NodeType$1 = NodeType;

		XMLCharacterData$1 = XMLCharacterData;

		module.exports = XMLComment = (function(superClass) {
			extend(XMLComment, superClass);

			function XMLComment(parent, text) {
				XMLComment.__super__.constructor.call(this, parent);
				if (text == null) {
					throw new Error("Missing comment text. " + this.debugInfo());
				}
				this.name = "#comment";
				this.type = NodeType$1.Comment;
				this.value = this.stringify.comment(text);
			}

			XMLComment.prototype.clone = function() {
				return Object.create(this);
			};

			XMLComment.prototype.toString = function(options) {
				return this.options.writer.comment(this, this.options.writer.filterOptions(options));
			};

			return XMLComment;

		})(XMLCharacterData$1);

	}).call(commonjsGlobal);
});

var XMLDeclaration = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLDeclaration, XMLNode$1, isObject,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		isObject = Utility.isObject;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		module.exports = XMLDeclaration = (function(superClass) {
			extend(XMLDeclaration, superClass);

			function XMLDeclaration(parent, version, encoding, standalone) {
				var ref;
				XMLDeclaration.__super__.constructor.call(this, parent);
				if (isObject(version)) {
					ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
				}
				if (!version) {
					version = '1.0';
				}
				this.type = NodeType$1.Declaration;
				this.version = this.stringify.xmlVersion(version);
				if (encoding != null) {
					this.encoding = this.stringify.xmlEncoding(encoding);
				}
				if (standalone != null) {
					this.standalone = this.stringify.xmlStandalone(standalone);
				}
			}

			XMLDeclaration.prototype.toString = function(options) {
				return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
			};

			return XMLDeclaration;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLDTDAttList = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLDTDAttList, XMLNode$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		module.exports = XMLDTDAttList = (function(superClass) {
			extend(XMLDTDAttList, superClass);

			function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				XMLDTDAttList.__super__.constructor.call(this, parent);
				if (elementName == null) {
					throw new Error("Missing DTD element name. " + this.debugInfo());
				}
				if (attributeName == null) {
					throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
				}
				if (!attributeType) {
					throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
				}
				if (!defaultValueType) {
					throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
				}
				if (defaultValueType.indexOf('#') !== 0) {
					defaultValueType = '#' + defaultValueType;
				}
				if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
					throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
				}
				if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
					throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
				}
				this.elementName = this.stringify.name(elementName);
				this.type = NodeType$1.AttributeDeclaration;
				this.attributeName = this.stringify.name(attributeName);
				this.attributeType = this.stringify.dtdAttType(attributeType);
				if (defaultValue) {
					this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
				}
				this.defaultValueType = defaultValueType;
			}

			XMLDTDAttList.prototype.toString = function(options) {
				return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
			};

			return XMLDTDAttList;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLDTDEntity = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLDTDEntity, XMLNode$1, isObject,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		isObject = Utility.isObject;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		module.exports = XMLDTDEntity = (function(superClass) {
			extend(XMLDTDEntity, superClass);

			function XMLDTDEntity(parent, pe, name, value) {
				XMLDTDEntity.__super__.constructor.call(this, parent);
				if (name == null) {
					throw new Error("Missing DTD entity name. " + this.debugInfo(name));
				}
				if (value == null) {
					throw new Error("Missing DTD entity value. " + this.debugInfo(name));
				}
				this.pe = !!pe;
				this.name = this.stringify.name(name);
				this.type = NodeType$1.EntityDeclaration;
				if (!isObject(value)) {
					this.value = this.stringify.dtdEntityValue(value);
					this.internal = true;
				} else {
					if (!value.pubID && !value.sysID) {
						throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
					}
					if (value.pubID && !value.sysID) {
						throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
					}
					this.internal = false;
					if (value.pubID != null) {
						this.pubID = this.stringify.dtdPubID(value.pubID);
					}
					if (value.sysID != null) {
						this.sysID = this.stringify.dtdSysID(value.sysID);
					}
					if (value.nData != null) {
						this.nData = this.stringify.dtdNData(value.nData);
					}
					if (this.pe && this.nData) {
						throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
					}
				}
			}

			Object.defineProperty(XMLDTDEntity.prototype, 'publicId', {
				get: function() {
					return this.pubID;
				}
			});

			Object.defineProperty(XMLDTDEntity.prototype, 'systemId', {
				get: function() {
					return this.sysID;
				}
			});

			Object.defineProperty(XMLDTDEntity.prototype, 'notationName', {
				get: function() {
					return this.nData || null;
				}
			});

			Object.defineProperty(XMLDTDEntity.prototype, 'inputEncoding', {
				get: function() {
					return null;
				}
			});

			Object.defineProperty(XMLDTDEntity.prototype, 'xmlEncoding', {
				get: function() {
					return null;
				}
			});

			Object.defineProperty(XMLDTDEntity.prototype, 'xmlVersion', {
				get: function() {
					return null;
				}
			});

			XMLDTDEntity.prototype.toString = function(options) {
				return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
			};

			return XMLDTDEntity;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLDTDElement = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLDTDElement, XMLNode$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		module.exports = XMLDTDElement = (function(superClass) {
			extend(XMLDTDElement, superClass);

			function XMLDTDElement(parent, name, value) {
				XMLDTDElement.__super__.constructor.call(this, parent);
				if (name == null) {
					throw new Error("Missing DTD element name. " + this.debugInfo());
				}
				if (!value) {
					value = '(#PCDATA)';
				}
				if (Array.isArray(value)) {
					value = '(' + value.join(',') + ')';
				}
				this.name = this.stringify.name(name);
				this.type = NodeType$1.ElementDeclaration;
				this.value = this.stringify.dtdElementValue(value);
			}

			XMLDTDElement.prototype.toString = function(options) {
				return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
			};

			return XMLDTDElement;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLDTDNotation = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLDTDNotation, XMLNode$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		module.exports = XMLDTDNotation = (function(superClass) {
			extend(XMLDTDNotation, superClass);

			function XMLDTDNotation(parent, name, value) {
				XMLDTDNotation.__super__.constructor.call(this, parent);
				if (name == null) {
					throw new Error("Missing DTD notation name. " + this.debugInfo(name));
				}
				if (!value.pubID && !value.sysID) {
					throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
				}
				this.name = this.stringify.name(name);
				this.type = NodeType$1.NotationDeclaration;
				if (value.pubID != null) {
					this.pubID = this.stringify.dtdPubID(value.pubID);
				}
				if (value.sysID != null) {
					this.sysID = this.stringify.dtdSysID(value.sysID);
				}
			}

			Object.defineProperty(XMLDTDNotation.prototype, 'publicId', {
				get: function() {
					return this.pubID;
				}
			});

			Object.defineProperty(XMLDTDNotation.prototype, 'systemId', {
				get: function() {
					return this.sysID;
				}
			});

			XMLDTDNotation.prototype.toString = function(options) {
				return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
			};

			return XMLDTDNotation;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLDocType = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLDTDAttList$1, XMLDTDElement$1, XMLDTDEntity$1, XMLDTDNotation$1, XMLDocType, XMLNamedNodeMap$1, XMLNode$1, isObject,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		isObject = Utility.isObject;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		XMLDTDAttList$1 = XMLDTDAttList;

		XMLDTDEntity$1 = XMLDTDEntity;

		XMLDTDElement$1 = XMLDTDElement;

		XMLDTDNotation$1 = XMLDTDNotation;

		XMLNamedNodeMap$1 = XMLNamedNodeMap;

		module.exports = XMLDocType = (function(superClass) {
			extend(XMLDocType, superClass);

			function XMLDocType(parent, pubID, sysID) {
				var child, i, len, ref, ref1, ref2;
				XMLDocType.__super__.constructor.call(this, parent);
				this.type = NodeType$1.DocType;
				if (parent.children) {
					ref = parent.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						if (child.type === NodeType$1.Element) {
							this.name = child.name;
							break;
						}
					}
				}
				this.documentObject = parent;
				if (isObject(pubID)) {
					ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
				}
				if (sysID == null) {
					ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
				}
				if (pubID != null) {
					this.pubID = this.stringify.dtdPubID(pubID);
				}
				if (sysID != null) {
					this.sysID = this.stringify.dtdSysID(sysID);
				}
			}

			Object.defineProperty(XMLDocType.prototype, 'entities', {
				get: function() {
					var child, i, len, nodes, ref;
					nodes = {};
					ref = this.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						if ((child.type === NodeType$1.EntityDeclaration) && !child.pe) {
							nodes[child.name] = child;
						}
					}
					return new XMLNamedNodeMap$1(nodes);
				}
			});

			Object.defineProperty(XMLDocType.prototype, 'notations', {
				get: function() {
					var child, i, len, nodes, ref;
					nodes = {};
					ref = this.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						if (child.type === NodeType$1.NotationDeclaration) {
							nodes[child.name] = child;
						}
					}
					return new XMLNamedNodeMap$1(nodes);
				}
			});

			Object.defineProperty(XMLDocType.prototype, 'publicId', {
				get: function() {
					return this.pubID;
				}
			});

			Object.defineProperty(XMLDocType.prototype, 'systemId', {
				get: function() {
					return this.sysID;
				}
			});

			Object.defineProperty(XMLDocType.prototype, 'internalSubset', {
				get: function() {
					throw new Error("This DOM method is not implemented." + this.debugInfo());
				}
			});

			XMLDocType.prototype.element = function(name, value) {
				var child;
				child = new XMLDTDElement$1(this, name, value);
				this.children.push(child);
				return this;
			};

			XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				var child;
				child = new XMLDTDAttList$1(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
				this.children.push(child);
				return this;
			};

			XMLDocType.prototype.entity = function(name, value) {
				var child;
				child = new XMLDTDEntity$1(this, false, name, value);
				this.children.push(child);
				return this;
			};

			XMLDocType.prototype.pEntity = function(name, value) {
				var child;
				child = new XMLDTDEntity$1(this, true, name, value);
				this.children.push(child);
				return this;
			};

			XMLDocType.prototype.notation = function(name, value) {
				var child;
				child = new XMLDTDNotation$1(this, name, value);
				this.children.push(child);
				return this;
			};

			XMLDocType.prototype.toString = function(options) {
				return this.options.writer.docType(this, this.options.writer.filterOptions(options));
			};

			XMLDocType.prototype.ele = function(name, value) {
				return this.element(name, value);
			};

			XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
			};

			XMLDocType.prototype.ent = function(name, value) {
				return this.entity(name, value);
			};

			XMLDocType.prototype.pent = function(name, value) {
				return this.pEntity(name, value);
			};

			XMLDocType.prototype.not = function(name, value) {
				return this.notation(name, value);
			};

			XMLDocType.prototype.up = function() {
				return this.root() || this.documentObject;
			};

			XMLDocType.prototype.isEqualNode = function(node) {
				if (!XMLDocType.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
					return false;
				}
				if (node.name !== this.name) {
					return false;
				}
				if (node.publicId !== this.publicId) {
					return false;
				}
				if (node.systemId !== this.systemId) {
					return false;
				}
				return true;
			};

			return XMLDocType;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLRaw = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLNode$1, XMLRaw,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		NodeType$1 = NodeType;

		XMLNode$1 = XMLNode;

		module.exports = XMLRaw = (function(superClass) {
			extend(XMLRaw, superClass);

			function XMLRaw(parent, text) {
				XMLRaw.__super__.constructor.call(this, parent);
				if (text == null) {
					throw new Error("Missing raw text. " + this.debugInfo());
				}
				this.type = NodeType$1.Raw;
				this.value = this.stringify.raw(text);
			}

			XMLRaw.prototype.clone = function() {
				return Object.create(this);
			};

			XMLRaw.prototype.toString = function(options) {
				return this.options.writer.raw(this, this.options.writer.filterOptions(options));
			};

			return XMLRaw;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLText = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLCharacterData$1, XMLText,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		NodeType$1 = NodeType;

		XMLCharacterData$1 = XMLCharacterData;

		module.exports = XMLText = (function(superClass) {
			extend(XMLText, superClass);

			function XMLText(parent, text) {
				XMLText.__super__.constructor.call(this, parent);
				if (text == null) {
					throw new Error("Missing element text. " + this.debugInfo());
				}
				this.name = "#text";
				this.type = NodeType$1.Text;
				this.value = this.stringify.text(text);
			}

			Object.defineProperty(XMLText.prototype, 'isElementContentWhitespace', {
				get: function() {
					throw new Error("This DOM method is not implemented." + this.debugInfo());
				}
			});

			Object.defineProperty(XMLText.prototype, 'wholeText', {
				get: function() {
					var next, prev, str;
					str = '';
					prev = this.previousSibling;
					while (prev) {
						str = prev.data + str;
						prev = prev.previousSibling;
					}
					str += this.data;
					next = this.nextSibling;
					while (next) {
						str = str + next.data;
						next = next.nextSibling;
					}
					return str;
				}
			});

			XMLText.prototype.clone = function() {
				return Object.create(this);
			};

			XMLText.prototype.toString = function(options) {
				return this.options.writer.text(this, this.options.writer.filterOptions(options));
			};

			XMLText.prototype.splitText = function(offset) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLText.prototype.replaceWholeText = function(content) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			return XMLText;

		})(XMLCharacterData$1);

	}).call(commonjsGlobal);
});

var XMLProcessingInstruction = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLCharacterData$1, XMLProcessingInstruction,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		NodeType$1 = NodeType;

		XMLCharacterData$1 = XMLCharacterData;

		module.exports = XMLProcessingInstruction = (function(superClass) {
			extend(XMLProcessingInstruction, superClass);

			function XMLProcessingInstruction(parent, target, value) {
				XMLProcessingInstruction.__super__.constructor.call(this, parent);
				if (target == null) {
					throw new Error("Missing instruction target. " + this.debugInfo());
				}
				this.type = NodeType$1.ProcessingInstruction;
				this.target = this.stringify.insTarget(target);
				this.name = this.target;
				if (value) {
					this.value = this.stringify.insValue(value);
				}
			}

			XMLProcessingInstruction.prototype.clone = function() {
				return Object.create(this);
			};

			XMLProcessingInstruction.prototype.toString = function(options) {
				return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
			};

			XMLProcessingInstruction.prototype.isEqualNode = function(node) {
				if (!XMLProcessingInstruction.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
					return false;
				}
				if (node.target !== this.target) {
					return false;
				}
				return true;
			};

			return XMLProcessingInstruction;

		})(XMLCharacterData$1);

	}).call(commonjsGlobal);
});

var XMLDummy = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLDummy, XMLNode$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		module.exports = XMLDummy = (function(superClass) {
			extend(XMLDummy, superClass);

			function XMLDummy(parent) {
				XMLDummy.__super__.constructor.call(this, parent);
				this.type = NodeType$1.Dummy;
			}

			XMLDummy.prototype.clone = function() {
				return Object.create(this);
			};

			XMLDummy.prototype.toString = function(options) {
				return '';
			};

			return XMLDummy;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLNodeList = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLNodeList;

		module.exports = XMLNodeList = (function() {
			function XMLNodeList(nodes) {
				this.nodes = nodes;
			}

			Object.defineProperty(XMLNodeList.prototype, 'length', {
				get: function() {
					return this.nodes.length || 0;
				}
			});

			XMLNodeList.prototype.clone = function() {
				return this.nodes = null;
			};

			XMLNodeList.prototype.item = function(index) {
				return this.nodes[index] || null;
			};

			return XMLNodeList;

		})();

	}).call(commonjsGlobal);
});

var DocumentPosition = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		module.exports = {
			Disconnected: 1,
			Preceding: 2,
			Following: 4,
			Contains: 8,
			ContainedBy: 16,
			ImplementationSpecific: 32
		};

	}).call(commonjsGlobal);
});
var DocumentPosition_1 = DocumentPosition.Disconnected;
var DocumentPosition_2 = DocumentPosition.Preceding;
var DocumentPosition_3 = DocumentPosition.Following;
var DocumentPosition_4 = DocumentPosition.Contains;
var DocumentPosition_5 = DocumentPosition.ContainedBy;
var DocumentPosition_6 = DocumentPosition.ImplementationSpecific;

var XMLStringifier = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLStringifier,
			bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
			hasProp = {}.hasOwnProperty;

		module.exports = XMLStringifier = (function() {
			function XMLStringifier(options) {
				this.assertLegalName = bind(this.assertLegalName, this);
				this.assertLegalChar = bind(this.assertLegalChar, this);
				var key, ref, value;
				options || (options = {});
				this.options = options;
				if (!this.options.version) {
					this.options.version = '1.0';
				}
				ref = options.stringify || {};
				for (key in ref) {
					if (!hasProp.call(ref, key)) continue;
					value = ref[key];
					this[key] = value;
				}
			}

			XMLStringifier.prototype.name = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalName('' + val || '');
			};

			XMLStringifier.prototype.text = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar(this.textEscape('' + val || ''));
			};

			XMLStringifier.prototype.cdata = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				val = '' + val || '';
				val = val.replace(']]>', ']]]]><![CDATA[>');
				return this.assertLegalChar(val);
			};

			XMLStringifier.prototype.comment = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				val = '' + val || '';
				if (val.match(/--/)) {
					throw new Error("Comment text cannot contain double-hypen: " + val);
				}
				return this.assertLegalChar(val);
			};

			XMLStringifier.prototype.raw = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return '' + val || '';
			};

			XMLStringifier.prototype.attValue = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar(this.attEscape(val = '' + val || ''));
			};

			XMLStringifier.prototype.insTarget = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar('' + val || '');
			};

			XMLStringifier.prototype.insValue = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				val = '' + val || '';
				if (val.match(/\?>/)) {
					throw new Error("Invalid processing instruction value: " + val);
				}
				return this.assertLegalChar(val);
			};

			XMLStringifier.prototype.xmlVersion = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				val = '' + val || '';
				if (!val.match(/1\.[0-9]+/)) {
					throw new Error("Invalid version number: " + val);
				}
				return val;
			};

			XMLStringifier.prototype.xmlEncoding = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				val = '' + val || '';
				if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
					throw new Error("Invalid encoding: " + val);
				}
				return this.assertLegalChar(val);
			};

			XMLStringifier.prototype.xmlStandalone = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				if (val) {
					return "yes";
				} else {
					return "no";
				}
			};

			XMLStringifier.prototype.dtdPubID = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar('' + val || '');
			};

			XMLStringifier.prototype.dtdSysID = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar('' + val || '');
			};

			XMLStringifier.prototype.dtdElementValue = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar('' + val || '');
			};

			XMLStringifier.prototype.dtdAttType = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar('' + val || '');
			};

			XMLStringifier.prototype.dtdAttDefault = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar('' + val || '');
			};

			XMLStringifier.prototype.dtdEntityValue = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar('' + val || '');
			};

			XMLStringifier.prototype.dtdNData = function(val) {
				if (this.options.noValidation) {
					return val;
				}
				return this.assertLegalChar('' + val || '');
			};

			XMLStringifier.prototype.convertAttKey = '@';

			XMLStringifier.prototype.convertPIKey = '?';

			XMLStringifier.prototype.convertTextKey = '#text';

			XMLStringifier.prototype.convertCDataKey = '#cdata';

			XMLStringifier.prototype.convertCommentKey = '#comment';

			XMLStringifier.prototype.convertRawKey = '#raw';

			XMLStringifier.prototype.assertLegalChar = function(str) {
				var regex, res;
				if (this.options.noValidation) {
					return str;
				}
				regex = '';
				if (this.options.version === '1.0') {
					regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
					if (res = str.match(regex)) {
						throw new Error("Invalid character in string: " + str + " at index " + res.index);
					}
				} else if (this.options.version === '1.1') {
					regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
					if (res = str.match(regex)) {
						throw new Error("Invalid character in string: " + str + " at index " + res.index);
					}
				}
				return str;
			};

			XMLStringifier.prototype.assertLegalName = function(str) {
				var regex;
				if (this.options.noValidation) {
					return str;
				}
				this.assertLegalChar(str);
				regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
				if (!str.match(regex)) {
					throw new Error("Invalid character in name");
				}
				return str;
			};

			XMLStringifier.prototype.textEscape = function(str) {
				var ampregex;
				if (this.options.noValidation) {
					return str;
				}
				ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
				return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
			};

			XMLStringifier.prototype.attEscape = function(str) {
				var ampregex;
				if (this.options.noValidation) {
					return str;
				}
				ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
				return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
			};

			return XMLStringifier;

		})();

	}).call(commonjsGlobal);
});

var WriterState = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		module.exports = {
			None: 0,
			OpenTag: 1,
			InsideTag: 2,
			CloseTag: 3
		};

	}).call(commonjsGlobal);
});
var WriterState_1 = WriterState.None;
var WriterState_2 = WriterState.OpenTag;
var WriterState_3 = WriterState.InsideTag;
var WriterState_4 = WriterState.CloseTag;

var XMLWriterBase = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, WriterState$1, XMLWriterBase, assign,
			hasProp = {}.hasOwnProperty;

		assign = Utility.assign;

		NodeType$1 = NodeType;

		WriterState$1 = WriterState;

		module.exports = XMLWriterBase = (function() {
			function XMLWriterBase(options) {
				var key, ref, value;
				options || (options = {});
				this.options = options;
				ref = options.writer || {};
				for (key in ref) {
					if (!hasProp.call(ref, key)) continue;
					value = ref[key];
					this["_" + key] = this[key];
					this[key] = value;
				}
			}

			XMLWriterBase.prototype.filterOptions = function(options) {
				var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
				options || (options = {});
				options = assign({}, this.options, options);
				filteredOptions = {
					writer: this
				};
				filteredOptions.pretty = options.pretty || false;
				filteredOptions.allowEmpty = options.allowEmpty || false;
				filteredOptions.indent = (ref = options.indent) != null ? ref : '  ';
				filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : '\n';
				filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
				filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
				filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : '';
				if (filteredOptions.spaceBeforeSlash === true) {
					filteredOptions.spaceBeforeSlash = ' ';
				}
				filteredOptions.suppressPrettyCount = 0;
				filteredOptions.user = {};
				filteredOptions.state = WriterState$1.None;
				return filteredOptions;
			};

			XMLWriterBase.prototype.indent = function(node, options, level) {
				var indentLevel;
				if (!options.pretty || options.suppressPrettyCount) {
					return '';
				} else if (options.pretty) {
					indentLevel = (level || 0) + options.offset + 1;
					if (indentLevel > 0) {
						return new Array(indentLevel).join(options.indent);
					}
				}
				return '';
			};

			XMLWriterBase.prototype.endline = function(node, options, level) {
				if (!options.pretty || options.suppressPrettyCount) {
					return '';
				} else {
					return options.newline;
				}
			};

			XMLWriterBase.prototype.attribute = function(att, options, level) {
				var r;
				this.openAttribute(att, options, level);
				r = ' ' + att.name + '="' + att.value + '"';
				this.closeAttribute(att, options, level);
				return r;
			};

			XMLWriterBase.prototype.cdata = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level) + '<![CDATA[';
				options.state = WriterState$1.InsideTag;
				r += node.value;
				options.state = WriterState$1.CloseTag;
				r += ']]>' + this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.comment = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level) + '<!-- ';
				options.state = WriterState$1.InsideTag;
				r += node.value;
				options.state = WriterState$1.CloseTag;
				r += ' -->' + this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.declaration = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level) + '<?xml';
				options.state = WriterState$1.InsideTag;
				r += ' version="' + node.version + '"';
				if (node.encoding != null) {
					r += ' encoding="' + node.encoding + '"';
				}
				if (node.standalone != null) {
					r += ' standalone="' + node.standalone + '"';
				}
				options.state = WriterState$1.CloseTag;
				r += options.spaceBeforeSlash + '?>';
				r += this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.docType = function(node, options, level) {
				var child, i, len, r, ref;
				level || (level = 0);
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level);
				r += '<!DOCTYPE ' + node.root().name;
				if (node.pubID && node.sysID) {
					r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
				} else if (node.sysID) {
					r += ' SYSTEM "' + node.sysID + '"';
				}
				if (node.children.length > 0) {
					r += ' [';
					r += this.endline(node, options, level);
					options.state = WriterState$1.InsideTag;
					ref = node.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						r += this.writeChildNode(child, options, level + 1);
					}
					options.state = WriterState$1.CloseTag;
					r += ']';
				}
				options.state = WriterState$1.CloseTag;
				r += options.spaceBeforeSlash + '>';
				r += this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.element = function(node, options, level) {
				var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
				level || (level = 0);
				prettySuppressed = false;
				r = '';
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r += this.indent(node, options, level) + '<' + node.name;
				ref = node.attribs;
				for (name in ref) {
					if (!hasProp.call(ref, name)) continue;
					att = ref[name];
					r += this.attribute(att, options, level);
				}
				childNodeCount = node.children.length;
				firstChildNode = childNodeCount === 0 ? null : node.children[0];
				if (childNodeCount === 0 || node.children.every(function(e) {
					return (e.type === NodeType$1.Text || e.type === NodeType$1.Raw) && e.value === '';
				})) {
					if (options.allowEmpty) {
						r += '>';
						options.state = WriterState$1.CloseTag;
						r += '</' + node.name + '>' + this.endline(node, options, level);
					} else {
						options.state = WriterState$1.CloseTag;
						r += options.spaceBeforeSlash + '/>' + this.endline(node, options, level);
					}
				} else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType$1.Text || firstChildNode.type === NodeType$1.Raw) && (firstChildNode.value != null)) {
					r += '>';
					options.state = WriterState$1.InsideTag;
					options.suppressPrettyCount++;
					prettySuppressed = true;
					r += this.writeChildNode(firstChildNode, options, level + 1);
					options.suppressPrettyCount--;
					prettySuppressed = false;
					options.state = WriterState$1.CloseTag;
					r += '</' + node.name + '>' + this.endline(node, options, level);
				} else {
					if (options.dontPrettyTextNodes) {
						ref1 = node.children;
						for (i = 0, len = ref1.length; i < len; i++) {
							child = ref1[i];
							if ((child.type === NodeType$1.Text || child.type === NodeType$1.Raw) && (child.value != null)) {
								options.suppressPrettyCount++;
								prettySuppressed = true;
								break;
							}
						}
					}
					r += '>' + this.endline(node, options, level);
					options.state = WriterState$1.InsideTag;
					ref2 = node.children;
					for (j = 0, len1 = ref2.length; j < len1; j++) {
						child = ref2[j];
						r += this.writeChildNode(child, options, level + 1);
					}
					options.state = WriterState$1.CloseTag;
					r += this.indent(node, options, level) + '</' + node.name + '>';
					if (prettySuppressed) {
						options.suppressPrettyCount--;
					}
					r += this.endline(node, options, level);
					options.state = WriterState$1.None;
				}
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.writeChildNode = function(node, options, level) {
				switch (node.type) {
					case NodeType$1.CData:
						return this.cdata(node, options, level);
					case NodeType$1.Comment:
						return this.comment(node, options, level);
					case NodeType$1.Element:
						return this.element(node, options, level);
					case NodeType$1.Raw:
						return this.raw(node, options, level);
					case NodeType$1.Text:
						return this.text(node, options, level);
					case NodeType$1.ProcessingInstruction:
						return this.processingInstruction(node, options, level);
					case NodeType$1.Dummy:
						return '';
					case NodeType$1.Declaration:
						return this.declaration(node, options, level);
					case NodeType$1.DocType:
						return this.docType(node, options, level);
					case NodeType$1.AttributeDeclaration:
						return this.dtdAttList(node, options, level);
					case NodeType$1.ElementDeclaration:
						return this.dtdElement(node, options, level);
					case NodeType$1.EntityDeclaration:
						return this.dtdEntity(node, options, level);
					case NodeType$1.NotationDeclaration:
						return this.dtdNotation(node, options, level);
					default:
						throw new Error("Unknown XML node type: " + node.constructor.name);
				}
			};

			XMLWriterBase.prototype.processingInstruction = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level) + '<?';
				options.state = WriterState$1.InsideTag;
				r += node.target;
				if (node.value) {
					r += ' ' + node.value;
				}
				options.state = WriterState$1.CloseTag;
				r += options.spaceBeforeSlash + '?>';
				r += this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.raw = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level);
				options.state = WriterState$1.InsideTag;
				r += node.value;
				options.state = WriterState$1.CloseTag;
				r += this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.text = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level);
				options.state = WriterState$1.InsideTag;
				r += node.value;
				options.state = WriterState$1.CloseTag;
				r += this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.dtdAttList = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level) + '<!ATTLIST';
				options.state = WriterState$1.InsideTag;
				r += ' ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType;
				if (node.defaultValueType !== '#DEFAULT') {
					r += ' ' + node.defaultValueType;
				}
				if (node.defaultValue) {
					r += ' "' + node.defaultValue + '"';
				}
				options.state = WriterState$1.CloseTag;
				r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.dtdElement = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level) + '<!ELEMENT';
				options.state = WriterState$1.InsideTag;
				r += ' ' + node.name + ' ' + node.value;
				options.state = WriterState$1.CloseTag;
				r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.dtdEntity = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level) + '<!ENTITY';
				options.state = WriterState$1.InsideTag;
				if (node.pe) {
					r += ' %';
				}
				r += ' ' + node.name;
				if (node.value) {
					r += ' "' + node.value + '"';
				} else {
					if (node.pubID && node.sysID) {
						r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
					} else if (node.sysID) {
						r += ' SYSTEM "' + node.sysID + '"';
					}
					if (node.nData) {
						r += ' NDATA ' + node.nData;
					}
				}
				options.state = WriterState$1.CloseTag;
				r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.dtdNotation = function(node, options, level) {
				var r;
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				r = this.indent(node, options, level) + '<!NOTATION';
				options.state = WriterState$1.InsideTag;
				r += ' ' + node.name;
				if (node.pubID && node.sysID) {
					r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
				} else if (node.pubID) {
					r += ' PUBLIC "' + node.pubID + '"';
				} else if (node.sysID) {
					r += ' SYSTEM "' + node.sysID + '"';
				}
				options.state = WriterState$1.CloseTag;
				r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
				options.state = WriterState$1.None;
				this.closeNode(node, options, level);
				return r;
			};

			XMLWriterBase.prototype.openNode = function(node, options, level) {};

			XMLWriterBase.prototype.closeNode = function(node, options, level) {};

			XMLWriterBase.prototype.openAttribute = function(att, options, level) {};

			XMLWriterBase.prototype.closeAttribute = function(att, options, level) {};

			return XMLWriterBase;

		})();

	}).call(commonjsGlobal);
});

var XMLStringWriter = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var XMLStringWriter, XMLWriterBase$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		XMLWriterBase$1 = XMLWriterBase;

		module.exports = XMLStringWriter = (function(superClass) {
			extend(XMLStringWriter, superClass);

			function XMLStringWriter(options) {
				XMLStringWriter.__super__.constructor.call(this, options);
			}

			XMLStringWriter.prototype.document = function(doc, options) {
				var child, i, len, r, ref;
				options = this.filterOptions(options);
				r = '';
				ref = doc.children;
				for (i = 0, len = ref.length; i < len; i++) {
					child = ref[i];
					r += this.writeChildNode(child, options, 0);
				}
				if (options.pretty && r.slice(-options.newline.length) === options.newline) {
					r = r.slice(0, -options.newline.length);
				}
				return r;
			};

			return XMLStringWriter;

		})(XMLWriterBase$1);

	}).call(commonjsGlobal);
});

var XMLDocument = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, XMLDOMConfiguration$1, XMLDOMImplementation$1, XMLDocument, XMLNode$1, XMLStringWriter$1, XMLStringifier$1, isPlainObject,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		isPlainObject = Utility.isPlainObject;

		XMLDOMImplementation$1 = XMLDOMImplementation;

		XMLDOMConfiguration$1 = XMLDOMConfiguration;

		XMLNode$1 = XMLNode;

		NodeType$1 = NodeType;

		XMLStringifier$1 = XMLStringifier;

		XMLStringWriter$1 = XMLStringWriter;

		module.exports = XMLDocument = (function(superClass) {
			extend(XMLDocument, superClass);

			function XMLDocument(options) {
				XMLDocument.__super__.constructor.call(this, null);
				this.name = "#document";
				this.type = NodeType$1.Document;
				this.documentURI = null;
				this.domConfig = new XMLDOMConfiguration$1();
				options || (options = {});
				if (!options.writer) {
					options.writer = new XMLStringWriter$1();
				}
				this.options = options;
				this.stringify = new XMLStringifier$1(options);
			}

			Object.defineProperty(XMLDocument.prototype, 'implementation', {
				value: new XMLDOMImplementation$1()
			});

			Object.defineProperty(XMLDocument.prototype, 'doctype', {
				get: function() {
					var child, i, len, ref;
					ref = this.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						if (child.type === NodeType$1.DocType) {
							return child;
						}
					}
					return null;
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'documentElement', {
				get: function() {
					return this.rootObject || null;
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'inputEncoding', {
				get: function() {
					return null;
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'strictErrorChecking', {
				get: function() {
					return false;
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'xmlEncoding', {
				get: function() {
					if (this.children.length !== 0 && this.children[0].type === NodeType$1.Declaration) {
						return this.children[0].encoding;
					} else {
						return null;
					}
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'xmlStandalone', {
				get: function() {
					if (this.children.length !== 0 && this.children[0].type === NodeType$1.Declaration) {
						return this.children[0].standalone === 'yes';
					} else {
						return false;
					}
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'xmlVersion', {
				get: function() {
					if (this.children.length !== 0 && this.children[0].type === NodeType$1.Declaration) {
						return this.children[0].version;
					} else {
						return "1.0";
					}
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'URL', {
				get: function() {
					return this.documentURI;
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'origin', {
				get: function() {
					return null;
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'compatMode', {
				get: function() {
					return null;
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'characterSet', {
				get: function() {
					return null;
				}
			});

			Object.defineProperty(XMLDocument.prototype, 'contentType', {
				get: function() {
					return null;
				}
			});

			XMLDocument.prototype.end = function(writer) {
				var writerOptions;
				writerOptions = {};
				if (!writer) {
					writer = this.options.writer;
				} else if (isPlainObject(writer)) {
					writerOptions = writer;
					writer = this.options.writer;
				}
				return writer.document(this, writer.filterOptions(writerOptions));
			};

			XMLDocument.prototype.toString = function(options) {
				return this.options.writer.document(this, this.options.writer.filterOptions(options));
			};

			XMLDocument.prototype.createElement = function(tagName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createDocumentFragment = function() {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createTextNode = function(data) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createComment = function(data) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createCDATASection = function(data) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createProcessingInstruction = function(target, data) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createAttribute = function(name) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createEntityReference = function(name) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.getElementsByTagName = function(tagname) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.importNode = function(importedNode, deep) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createElementNS = function(namespaceURI, qualifiedName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.getElementById = function(elementId) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.adoptNode = function(source) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.normalizeDocument = function() {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.renameNode = function(node, namespaceURI, qualifiedName) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.getElementsByClassName = function(classNames) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createEvent = function(eventInterface) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createRange = function() {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createNodeIterator = function(root, whatToShow, filter) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			XMLDocument.prototype.createTreeWalker = function(root, whatToShow, filter) {
				throw new Error("This DOM method is not implemented." + this.debugInfo());
			};

			return XMLDocument;

		})(XMLNode$1);

	}).call(commonjsGlobal);
});

var XMLDocumentCB = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, WriterState$1, XMLAttribute$1, XMLCData$1, XMLComment$1, XMLDTDAttList$1, XMLDTDElement$1, XMLDTDEntity$1, XMLDTDNotation$1, XMLDeclaration$1, XMLDocType$1, XMLDocument$1, XMLDocumentCB, XMLElement$1, XMLProcessingInstruction$1, XMLRaw$1, XMLStringWriter$1, XMLStringifier$1, XMLText$1, getValue, isFunction, isObject, isPlainObject, ref,
			hasProp = {}.hasOwnProperty;

		ref = Utility, isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;

		NodeType$1 = NodeType;

		XMLDocument$1 = XMLDocument;

		XMLElement$1 = XMLElement;

		XMLCData$1 = XMLCData;

		XMLComment$1 = XMLComment;

		XMLRaw$1 = XMLRaw;

		XMLText$1 = XMLText;

		XMLProcessingInstruction$1 = XMLProcessingInstruction;

		XMLDeclaration$1 = XMLDeclaration;

		XMLDocType$1 = XMLDocType;

		XMLDTDAttList$1 = XMLDTDAttList;

		XMLDTDEntity$1 = XMLDTDEntity;

		XMLDTDElement$1 = XMLDTDElement;

		XMLDTDNotation$1 = XMLDTDNotation;

		XMLAttribute$1 = XMLAttribute;

		XMLStringifier$1 = XMLStringifier;

		XMLStringWriter$1 = XMLStringWriter;

		WriterState$1 = WriterState;

		module.exports = XMLDocumentCB = (function() {
			function XMLDocumentCB(options, onData, onEnd) {
				var writerOptions;
				this.name = "?xml";
				this.type = NodeType$1.Document;
				options || (options = {});
				writerOptions = {};
				if (!options.writer) {
					options.writer = new XMLStringWriter$1();
				} else if (isPlainObject(options.writer)) {
					writerOptions = options.writer;
					options.writer = new XMLStringWriter$1();
				}
				this.options = options;
				this.writer = options.writer;
				this.writerOptions = this.writer.filterOptions(writerOptions);
				this.stringify = new XMLStringifier$1(options);
				this.onDataCallback = onData || function() {};
				this.onEndCallback = onEnd || function() {};
				this.currentNode = null;
				this.currentLevel = -1;
				this.openTags = {};
				this.documentStarted = false;
				this.documentCompleted = false;
				this.root = null;
			}

			XMLDocumentCB.prototype.createChildNode = function(node) {
				var att, attName, attributes, child, i, len, ref1, ref2;
				switch (node.type) {
					case NodeType$1.CData:
						this.cdata(node.value);
						break;
					case NodeType$1.Comment:
						this.comment(node.value);
						break;
					case NodeType$1.Element:
						attributes = {};
						ref1 = node.attribs;
						for (attName in ref1) {
							if (!hasProp.call(ref1, attName)) continue;
							att = ref1[attName];
							attributes[attName] = att.value;
						}
						this.node(node.name, attributes);
						break;
					case NodeType$1.Dummy:
						this.dummy();
						break;
					case NodeType$1.Raw:
						this.raw(node.value);
						break;
					case NodeType$1.Text:
						this.text(node.value);
						break;
					case NodeType$1.ProcessingInstruction:
						this.instruction(node.target, node.value);
						break;
					default:
						throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
				}
				ref2 = node.children;
				for (i = 0, len = ref2.length; i < len; i++) {
					child = ref2[i];
					this.createChildNode(child);
					if (child.type === NodeType$1.Element) {
						this.up();
					}
				}
				return this;
			};

			XMLDocumentCB.prototype.dummy = function() {
				return this;
			};

			XMLDocumentCB.prototype.node = function(name, attributes, text) {
				var ref1;
				if (name == null) {
					throw new Error("Missing node name.");
				}
				if (this.root && this.currentLevel === -1) {
					throw new Error("Document can only have one root node. " + this.debugInfo(name));
				}
				this.openCurrent();
				name = getValue(name);
				if (attributes == null) {
					attributes = {};
				}
				attributes = getValue(attributes);
				if (!isObject(attributes)) {
					ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
				}
				this.currentNode = new XMLElement$1(this, name, attributes);
				this.currentNode.children = false;
				this.currentLevel++;
				this.openTags[this.currentLevel] = this.currentNode;
				if (text != null) {
					this.text(text);
				}
				return this;
			};

			XMLDocumentCB.prototype.element = function(name, attributes, text) {
				var child, i, len, oldValidationFlag, ref1, root;
				if (this.currentNode && this.currentNode.type === NodeType$1.DocType) {
					this.dtdElement.apply(this, arguments);
				} else {
					if (Array.isArray(name) || isObject(name) || isFunction(name)) {
						oldValidationFlag = this.options.noValidation;
						this.options.noValidation = true;
						root = new XMLDocument$1(this.options).element('TEMP_ROOT');
						root.element(name);
						this.options.noValidation = oldValidationFlag;
						ref1 = root.children;
						for (i = 0, len = ref1.length; i < len; i++) {
							child = ref1[i];
							this.createChildNode(child);
							if (child.type === NodeType$1.Element) {
								this.up();
							}
						}
					} else {
						this.node(name, attributes, text);
					}
				}
				return this;
			};

			XMLDocumentCB.prototype.attribute = function(name, value) {
				var attName, attValue;
				if (!this.currentNode || this.currentNode.children) {
					throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
				}
				if (name != null) {
					name = getValue(name);
				}
				if (isObject(name)) {
					for (attName in name) {
						if (!hasProp.call(name, attName)) continue;
						attValue = name[attName];
						this.attribute(attName, attValue);
					}
				} else {
					if (isFunction(value)) {
						value = value.apply();
					}
					if (this.options.keepNullAttributes && (value == null)) {
						this.currentNode.attribs[name] = new XMLAttribute$1(this, name, "");
					} else if (value != null) {
						this.currentNode.attribs[name] = new XMLAttribute$1(this, name, value);
					}
				}
				return this;
			};

			XMLDocumentCB.prototype.text = function(value) {
				var node;
				this.openCurrent();
				node = new XMLText$1(this, value);
				this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.cdata = function(value) {
				var node;
				this.openCurrent();
				node = new XMLCData$1(this, value);
				this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.comment = function(value) {
				var node;
				this.openCurrent();
				node = new XMLComment$1(this, value);
				this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.raw = function(value) {
				var node;
				this.openCurrent();
				node = new XMLRaw$1(this, value);
				this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.instruction = function(target, value) {
				var i, insTarget, insValue, len, node;
				this.openCurrent();
				if (target != null) {
					target = getValue(target);
				}
				if (value != null) {
					value = getValue(value);
				}
				if (Array.isArray(target)) {
					for (i = 0, len = target.length; i < len; i++) {
						insTarget = target[i];
						this.instruction(insTarget);
					}
				} else if (isObject(target)) {
					for (insTarget in target) {
						if (!hasProp.call(target, insTarget)) continue;
						insValue = target[insTarget];
						this.instruction(insTarget, insValue);
					}
				} else {
					if (isFunction(value)) {
						value = value.apply();
					}
					node = new XMLProcessingInstruction$1(this, target, value);
					this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				}
				return this;
			};

			XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
				var node;
				this.openCurrent();
				if (this.documentStarted) {
					throw new Error("declaration() must be the first node.");
				}
				node = new XMLDeclaration$1(this, version, encoding, standalone);
				this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
				this.openCurrent();
				if (root == null) {
					throw new Error("Missing root node name.");
				}
				if (this.root) {
					throw new Error("dtd() must come before the root node.");
				}
				this.currentNode = new XMLDocType$1(this, pubID, sysID);
				this.currentNode.rootNodeName = root;
				this.currentNode.children = false;
				this.currentLevel++;
				this.openTags[this.currentLevel] = this.currentNode;
				return this;
			};

			XMLDocumentCB.prototype.dtdElement = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDElement$1(this, name, value);
				this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				var node;
				this.openCurrent();
				node = new XMLDTDAttList$1(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
				this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.entity = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDEntity$1(this, false, name, value);
				this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.pEntity = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDEntity$1(this, true, name, value);
				this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.notation = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDNotation$1(this, name, value);
				this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};

			XMLDocumentCB.prototype.up = function() {
				if (this.currentLevel < 0) {
					throw new Error("The document node has no parent.");
				}
				if (this.currentNode) {
					if (this.currentNode.children) {
						this.closeNode(this.currentNode);
					} else {
						this.openNode(this.currentNode);
					}
					this.currentNode = null;
				} else {
					this.closeNode(this.openTags[this.currentLevel]);
				}
				delete this.openTags[this.currentLevel];
				this.currentLevel--;
				return this;
			};

			XMLDocumentCB.prototype.end = function() {
				while (this.currentLevel >= 0) {
					this.up();
				}
				return this.onEnd();
			};

			XMLDocumentCB.prototype.openCurrent = function() {
				if (this.currentNode) {
					this.currentNode.children = true;
					return this.openNode(this.currentNode);
				}
			};

			XMLDocumentCB.prototype.openNode = function(node) {
				var att, chunk, name, ref1;
				if (!node.isOpen) {
					if (!this.root && this.currentLevel === 0 && node.type === NodeType$1.Element) {
						this.root = node;
					}
					chunk = '';
					if (node.type === NodeType$1.Element) {
						this.writerOptions.state = WriterState$1.OpenTag;
						chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<' + node.name;
						ref1 = node.attribs;
						for (name in ref1) {
							if (!hasProp.call(ref1, name)) continue;
							att = ref1[name];
							chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
						}
						chunk += (node.children ? '>' : '/>') + this.writer.endline(node, this.writerOptions, this.currentLevel);
						this.writerOptions.state = WriterState$1.InsideTag;
					} else {
						this.writerOptions.state = WriterState$1.OpenTag;
						chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<!DOCTYPE ' + node.rootNodeName;
						if (node.pubID && node.sysID) {
							chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
						} else if (node.sysID) {
							chunk += ' SYSTEM "' + node.sysID + '"';
						}
						if (node.children) {
							chunk += ' [';
							this.writerOptions.state = WriterState$1.InsideTag;
						} else {
							this.writerOptions.state = WriterState$1.CloseTag;
							chunk += '>';
						}
						chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
					}
					this.onData(chunk, this.currentLevel);
					return node.isOpen = true;
				}
			};

			XMLDocumentCB.prototype.closeNode = function(node) {
				var chunk;
				if (!node.isClosed) {
					chunk = '';
					this.writerOptions.state = WriterState$1.CloseTag;
					if (node.type === NodeType$1.Element) {
						chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '</' + node.name + '>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
					} else {
						chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + ']>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
					}
					this.writerOptions.state = WriterState$1.None;
					this.onData(chunk, this.currentLevel);
					return node.isClosed = true;
				}
			};

			XMLDocumentCB.prototype.onData = function(chunk, level) {
				this.documentStarted = true;
				return this.onDataCallback(chunk, level + 1);
			};

			XMLDocumentCB.prototype.onEnd = function() {
				this.documentCompleted = true;
				return this.onEndCallback();
			};

			XMLDocumentCB.prototype.debugInfo = function(name) {
				if (name == null) {
					return "";
				} else {
					return "node: <" + name + ">";
				}
			};

			XMLDocumentCB.prototype.ele = function() {
				return this.element.apply(this, arguments);
			};

			XMLDocumentCB.prototype.nod = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};

			XMLDocumentCB.prototype.txt = function(value) {
				return this.text(value);
			};

			XMLDocumentCB.prototype.dat = function(value) {
				return this.cdata(value);
			};

			XMLDocumentCB.prototype.com = function(value) {
				return this.comment(value);
			};

			XMLDocumentCB.prototype.ins = function(target, value) {
				return this.instruction(target, value);
			};

			XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
				return this.declaration(version, encoding, standalone);
			};

			XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
				return this.doctype(root, pubID, sysID);
			};

			XMLDocumentCB.prototype.e = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};

			XMLDocumentCB.prototype.n = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};

			XMLDocumentCB.prototype.t = function(value) {
				return this.text(value);
			};

			XMLDocumentCB.prototype.d = function(value) {
				return this.cdata(value);
			};

			XMLDocumentCB.prototype.c = function(value) {
				return this.comment(value);
			};

			XMLDocumentCB.prototype.r = function(value) {
				return this.raw(value);
			};

			XMLDocumentCB.prototype.i = function(target, value) {
				return this.instruction(target, value);
			};

			XMLDocumentCB.prototype.att = function() {
				if (this.currentNode && this.currentNode.type === NodeType$1.DocType) {
					return this.attList.apply(this, arguments);
				} else {
					return this.attribute.apply(this, arguments);
				}
			};

			XMLDocumentCB.prototype.a = function() {
				if (this.currentNode && this.currentNode.type === NodeType$1.DocType) {
					return this.attList.apply(this, arguments);
				} else {
					return this.attribute.apply(this, arguments);
				}
			};

			XMLDocumentCB.prototype.ent = function(name, value) {
				return this.entity(name, value);
			};

			XMLDocumentCB.prototype.pent = function(name, value) {
				return this.pEntity(name, value);
			};

			XMLDocumentCB.prototype.not = function(name, value) {
				return this.notation(name, value);
			};

			return XMLDocumentCB;

		})();

	}).call(commonjsGlobal);
});

var XMLStreamWriter = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, WriterState$1, XMLStreamWriter, XMLWriterBase$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		NodeType$1 = NodeType;

		XMLWriterBase$1 = XMLWriterBase;

		WriterState$1 = WriterState;

		module.exports = XMLStreamWriter = (function(superClass) {
			extend(XMLStreamWriter, superClass);

			function XMLStreamWriter(stream, options) {
				this.stream = stream;
				XMLStreamWriter.__super__.constructor.call(this, options);
			}

			XMLStreamWriter.prototype.endline = function(node, options, level) {
				if (node.isLastRootNode && options.state === WriterState$1.CloseTag) {
					return '';
				} else {
					return XMLStreamWriter.__super__.endline.call(this, node, options, level);
				}
			};

			XMLStreamWriter.prototype.document = function(doc, options) {
				var child, i, j, k, len, len1, ref, ref1, results;
				ref = doc.children;
				for (i = j = 0, len = ref.length; j < len; i = ++j) {
					child = ref[i];
					child.isLastRootNode = i === doc.children.length - 1;
				}
				options = this.filterOptions(options);
				ref1 = doc.children;
				results = [];
				for (k = 0, len1 = ref1.length; k < len1; k++) {
					child = ref1[k];
					results.push(this.writeChildNode(child, options, 0));
				}
				return results;
			};

			XMLStreamWriter.prototype.attribute = function(att, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.attribute.call(this, att, options, level));
			};

			XMLStreamWriter.prototype.cdata = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.cdata.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.comment = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.comment.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.declaration = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.declaration.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.docType = function(node, options, level) {
				var child, j, len, ref;
				level || (level = 0);
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				this.stream.write(this.indent(node, options, level));
				this.stream.write('<!DOCTYPE ' + node.root().name);
				if (node.pubID && node.sysID) {
					this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
				} else if (node.sysID) {
					this.stream.write(' SYSTEM "' + node.sysID + '"');
				}
				if (node.children.length > 0) {
					this.stream.write(' [');
					this.stream.write(this.endline(node, options, level));
					options.state = WriterState$1.InsideTag;
					ref = node.children;
					for (j = 0, len = ref.length; j < len; j++) {
						child = ref[j];
						this.writeChildNode(child, options, level + 1);
					}
					options.state = WriterState$1.CloseTag;
					this.stream.write(']');
				}
				options.state = WriterState$1.CloseTag;
				this.stream.write(options.spaceBeforeSlash + '>');
				this.stream.write(this.endline(node, options, level));
				options.state = WriterState$1.None;
				return this.closeNode(node, options, level);
			};

			XMLStreamWriter.prototype.element = function(node, options, level) {
				var att, child, childNodeCount, firstChildNode, j, len, name, ref, ref1;
				level || (level = 0);
				this.openNode(node, options, level);
				options.state = WriterState$1.OpenTag;
				this.stream.write(this.indent(node, options, level) + '<' + node.name);
				ref = node.attribs;
				for (name in ref) {
					if (!hasProp.call(ref, name)) continue;
					att = ref[name];
					this.attribute(att, options, level);
				}
				childNodeCount = node.children.length;
				firstChildNode = childNodeCount === 0 ? null : node.children[0];
				if (childNodeCount === 0 || node.children.every(function(e) {
					return (e.type === NodeType$1.Text || e.type === NodeType$1.Raw) && e.value === '';
				})) {
					if (options.allowEmpty) {
						this.stream.write('>');
						options.state = WriterState$1.CloseTag;
						this.stream.write('</' + node.name + '>');
					} else {
						options.state = WriterState$1.CloseTag;
						this.stream.write(options.spaceBeforeSlash + '/>');
					}
				} else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType$1.Text || firstChildNode.type === NodeType$1.Raw) && (firstChildNode.value != null)) {
					this.stream.write('>');
					options.state = WriterState$1.InsideTag;
					options.suppressPrettyCount++;
					this.writeChildNode(firstChildNode, options, level + 1);
					options.suppressPrettyCount--;
					options.state = WriterState$1.CloseTag;
					this.stream.write('</' + node.name + '>');
				} else {
					this.stream.write('>' + this.endline(node, options, level));
					options.state = WriterState$1.InsideTag;
					ref1 = node.children;
					for (j = 0, len = ref1.length; j < len; j++) {
						child = ref1[j];
						this.writeChildNode(child, options, level + 1);
					}
					options.state = WriterState$1.CloseTag;
					this.stream.write(this.indent(node, options, level) + '</' + node.name + '>');
				}
				this.stream.write(this.endline(node, options, level));
				options.state = WriterState$1.None;
				return this.closeNode(node, options, level);
			};

			XMLStreamWriter.prototype.processingInstruction = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.processingInstruction.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.raw = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.raw.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.text = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.text.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.dtdAttList = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.dtdAttList.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.dtdElement = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.dtdElement.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.dtdEntity = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.dtdEntity.call(this, node, options, level));
			};

			XMLStreamWriter.prototype.dtdNotation = function(node, options, level) {
				return this.stream.write(XMLStreamWriter.__super__.dtdNotation.call(this, node, options, level));
			};

			return XMLStreamWriter;

		})(XMLWriterBase$1);

	}).call(commonjsGlobal);
});

var lib$1 = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var NodeType$1, WriterState$1, XMLDOMImplementation$1, XMLDocument$1, XMLDocumentCB$1, XMLStreamWriter$1, XMLStringWriter$1, assign, isFunction, ref;

		ref = Utility, assign = ref.assign, isFunction = ref.isFunction;

		XMLDOMImplementation$1 = XMLDOMImplementation;

		XMLDocument$1 = XMLDocument;

		XMLDocumentCB$1 = XMLDocumentCB;

		XMLStringWriter$1 = XMLStringWriter;

		XMLStreamWriter$1 = XMLStreamWriter;

		NodeType$1 = NodeType;

		WriterState$1 = WriterState;

		module.exports.create = function(name, xmldec, doctype, options) {
			var doc, root;
			if (name == null) {
				throw new Error("Root element needs a name.");
			}
			options = assign({}, xmldec, doctype, options);
			doc = new XMLDocument$1(options);
			root = doc.element(name);
			if (!options.headless) {
				doc.declaration(options);
				if ((options.pubID != null) || (options.sysID != null)) {
					doc.dtd(options);
				}
			}
			return root;
		};

		module.exports.begin = function(options, onData, onEnd) {
			var ref1;
			if (isFunction(options)) {
				ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
				options = {};
			}
			if (onData) {
				return new XMLDocumentCB$1(options, onData, onEnd);
			} else {
				return new XMLDocument$1(options);
			}
		};

		module.exports.stringWriter = function(options) {
			return new XMLStringWriter$1(options);
		};

		module.exports.streamWriter = function(stream, options) {
			return new XMLStreamWriter$1(stream, options);
		};

		module.exports.implementation = new XMLDOMImplementation$1();

		module.exports.nodeType = NodeType$1;

		module.exports.writerState = WriterState$1;

	}).call(commonjsGlobal);
});
var lib_1 = lib$1.create;
var lib_2 = lib$1.begin;
var lib_3 = lib$1.stringWriter;
var lib_4 = lib$1.streamWriter;
var lib_5 = lib$1.implementation;
var lib_6 = lib$1.nodeType;
var lib_7 = lib$1.writerState;

var builder = createCommonjsModule(function (module, exports) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var builder, defaults$1, escapeCDATA, requiresCDATA, wrapCDATA,
			hasProp = {}.hasOwnProperty;

		builder = lib$1;

		defaults$1 = defaults.defaults;

		requiresCDATA = function(entry) {
			return typeof entry === "string" && (entry.indexOf('&') >= 0 || entry.indexOf('>') >= 0 || entry.indexOf('<') >= 0);
		};

		wrapCDATA = function(entry) {
			return "<![CDATA[" + (escapeCDATA(entry)) + "]]>";
		};

		escapeCDATA = function(entry) {
			return entry.replace(']]>', ']]]]><![CDATA[>');
		};

		exports.Builder = (function() {
			function Builder(opts) {
				var key, ref, value;
				this.options = {};
				ref = defaults$1["0.2"];
				for (key in ref) {
					if (!hasProp.call(ref, key)) continue;
					value = ref[key];
					this.options[key] = value;
				}
				for (key in opts) {
					if (!hasProp.call(opts, key)) continue;
					value = opts[key];
					this.options[key] = value;
				}
			}

			Builder.prototype.buildObject = function(rootObj) {
				var attrkey, charkey, render, rootElement, rootName;
				attrkey = this.options.attrkey;
				charkey = this.options.charkey;
				if ((Object.keys(rootObj).length === 1) && (this.options.rootName === defaults$1['0.2'].rootName)) {
					rootName = Object.keys(rootObj)[0];
					rootObj = rootObj[rootName];
				} else {
					rootName = this.options.rootName;
				}
				render = (function(_this) {
					return function(element, obj) {
						var attr, child, entry, index, key, value;
						if (typeof obj !== 'object') {
							if (_this.options.cdata && requiresCDATA(obj)) {
								element.raw(wrapCDATA(obj));
							} else {
								element.txt(obj);
							}
						} else if (Array.isArray(obj)) {
							for (index in obj) {
								if (!hasProp.call(obj, index)) continue;
								child = obj[index];
								for (key in child) {
									entry = child[key];
									element = render(element.ele(key), entry).up();
								}
							}
						} else {
							for (key in obj) {
								if (!hasProp.call(obj, key)) continue;
								child = obj[key];
								if (key === attrkey) {
									if (typeof child === "object") {
										for (attr in child) {
											value = child[attr];
											element = element.att(attr, value);
										}
									}
								} else if (key === charkey) {
									if (_this.options.cdata && requiresCDATA(child)) {
										element = element.raw(wrapCDATA(child));
									} else {
										element = element.txt(child);
									}
								} else if (Array.isArray(child)) {
									for (index in child) {
										if (!hasProp.call(child, index)) continue;
										entry = child[index];
										if (typeof entry === 'string') {
											if (_this.options.cdata && requiresCDATA(entry)) {
												element = element.ele(key).raw(wrapCDATA(entry)).up();
											} else {
												element = element.ele(key, entry).up();
											}
										} else {
											element = render(element.ele(key), entry).up();
										}
									}
								} else if (typeof child === "object") {
									element = render(element.ele(key), child).up();
								} else {
									if (typeof child === 'string' && _this.options.cdata && requiresCDATA(child)) {
										element = element.ele(key).raw(wrapCDATA(child)).up();
									} else {
										if (child == null) {
											child = '';
										}
										element = element.ele(key, child.toString()).up();
									}
								}
							}
						}
						return element;
					};
				})(this);
				rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
					headless: this.options.headless,
					allowSurrogateChars: this.options.allowSurrogateChars
				});
				return render(rootElement, rootObj).end(this.options.renderOpts);
			};

			return Builder;

		})();

	}).call(commonjsGlobal);
});
var builder_1 = builder.Builder;

var sax = createCommonjsModule(function (module, exports) {
	(function (sax) { // wrapper for non-node envs
		sax.parser = function (strict, opt) { return new SAXParser(strict, opt) };
		sax.SAXParser = SAXParser;
		sax.SAXStream = SAXStream;
		sax.createStream = createStream;

		// When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
		// When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
		// since that's the earliest that a buffer overrun could occur.  This way, checks are
		// as rare as required, but as often as necessary to ensure never crossing this bound.
		// Furthermore, buffers are only tested at most once per write(), so passing a very
		// large string into write() might have undesirable effects, but this is manageable by
		// the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
		// edge case, result in creating at most one complete copy of the string passed in.
		// Set to Infinity to have unlimited buffers.
		sax.MAX_BUFFER_LENGTH = 64 * 1024;

		var buffers = [
			'comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype',
			'procInstName', 'procInstBody', 'entity', 'attribName',
			'attribValue', 'cdata', 'script'
		];

		sax.EVENTS = [
			'text',
			'processinginstruction',
			'sgmldeclaration',
			'doctype',
			'comment',
			'opentagstart',
			'attribute',
			'opentag',
			'closetag',
			'opencdata',
			'cdata',
			'closecdata',
			'error',
			'end',
			'ready',
			'script',
			'opennamespace',
			'closenamespace'
		];

		function SAXParser (strict, opt) {
			if (!(this instanceof SAXParser)) {
				return new SAXParser(strict, opt)
			}

			var parser = this;
			clearBuffers(parser);
			parser.q = parser.c = '';
			parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
			parser.opt = opt || {};
			parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
			parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase';
			parser.tags = [];
			parser.closed = parser.closedRoot = parser.sawRoot = false;
			parser.tag = parser.error = null;
			parser.strict = !!strict;
			parser.noscript = !!(strict || parser.opt.noscript);
			parser.state = S.BEGIN;
			parser.strictEntities = parser.opt.strictEntities;
			parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
			parser.attribList = [];

			// namespaces form a prototype chain.
			// it always points at the current tag,
			// which protos to its parent tag.
			if (parser.opt.xmlns) {
				parser.ns = Object.create(rootNS);
			}

			// mostly just for error reporting
			parser.trackPosition = parser.opt.position !== false;
			if (parser.trackPosition) {
				parser.position = parser.line = parser.column = 0;
			}
			emit(parser, 'onready');
		}

		if (!Object.create) {
			Object.create = function (o) {
				function F () {}
				F.prototype = o;
				var newf = new F();
				return newf
			};
		}

		if (!Object.keys) {
			Object.keys = function (o) {
				var a = [];
				for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
				return a
			};
		}

		function checkBufferLength (parser) {
			var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
			var maxActual = 0;
			for (var i = 0, l = buffers.length; i < l; i++) {
				var len = parser[buffers[i]].length;
				if (len > maxAllowed) {
					// Text/cdata nodes can get big, and since they're buffered,
					// we can get here under normal conditions.
					// Avoid issues by emitting the text node now,
					// so at least it won't get any bigger.
					switch (buffers[i]) {
						case 'textNode':
							closeText(parser);
							break

						case 'cdata':
							emitNode(parser, 'oncdata', parser.cdata);
							parser.cdata = '';
							break

						case 'script':
							emitNode(parser, 'onscript', parser.script);
							parser.script = '';
							break

						default:
							error(parser, 'Max buffer length exceeded: ' + buffers[i]);
					}
				}
				maxActual = Math.max(maxActual, len);
			}
			// schedule the next check for the earliest possible buffer overrun.
			var m = sax.MAX_BUFFER_LENGTH - maxActual;
			parser.bufferCheckPosition = m + parser.position;
		}

		function clearBuffers (parser) {
			for (var i = 0, l = buffers.length; i < l; i++) {
				parser[buffers[i]] = '';
			}
		}

		function flushBuffers (parser) {
			closeText(parser);
			if (parser.cdata !== '') {
				emitNode(parser, 'oncdata', parser.cdata);
				parser.cdata = '';
			}
			if (parser.script !== '') {
				emitNode(parser, 'onscript', parser.script);
				parser.script = '';
			}
		}

		SAXParser.prototype = {
			end: function () { end(this); },
			write: write,
			resume: function () { this.error = null; return this },
			close: function () { return this.write(null) },
			flush: function () { flushBuffers(this); }
		};

		var Stream$1;
		try {
			Stream$1 = Stream.Stream;
		} catch (ex) {
			Stream$1 = function () {};
		}

		var streamWraps = sax.EVENTS.filter(function (ev) {
			return ev !== 'error' && ev !== 'end'
		});

		function createStream (strict, opt) {
			return new SAXStream(strict, opt)
		}

		function SAXStream (strict, opt) {
			if (!(this instanceof SAXStream)) {
				return new SAXStream(strict, opt)
			}

			Stream$1.apply(this);

			this._parser = new SAXParser(strict, opt);
			this.writable = true;
			this.readable = true;

			var me = this;

			this._parser.onend = function () {
				me.emit('end');
			};

			this._parser.onerror = function (er) {
				me.emit('error', er);

				// if didn't throw, then means error was handled.
				// go ahead and clear error, so we can write again.
				me._parser.error = null;
			};

			this._decoder = null;

			streamWraps.forEach(function (ev) {
				Object.defineProperty(me, 'on' + ev, {
					get: function () {
						return me._parser['on' + ev]
					},
					set: function (h) {
						if (!h) {
							me.removeAllListeners(ev);
							me._parser['on' + ev] = h;
							return h
						}
						me.on(ev, h);
					},
					enumerable: true,
					configurable: false
				});
			});
		}

		SAXStream.prototype = Object.create(Stream$1.prototype, {
			constructor: {
				value: SAXStream
			}
		});

		SAXStream.prototype.write = function (data) {
			if (typeof Buffer === 'function' &&
				typeof Buffer.isBuffer === 'function' &&
				Buffer.isBuffer(data)) {
				if (!this._decoder) {
					var SD = string_decoder.StringDecoder;
					this._decoder = new SD('utf8');
				}
				data = this._decoder.write(data);
			}

			this._parser.write(data.toString());
			this.emit('data', data);
			return true
		};

		SAXStream.prototype.end = function (chunk) {
			if (chunk && chunk.length) {
				this.write(chunk);
			}
			this._parser.end();
			return true
		};

		SAXStream.prototype.on = function (ev, handler) {
			var me = this;
			if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
				me._parser['on' + ev] = function () {
					var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
					args.splice(0, 0, ev);
					me.emit.apply(me, args);
				};
			}

			return Stream$1.prototype.on.call(me, ev, handler)
		};

		// this really needs to be replaced with character classes.
		// XML allows all manner of ridiculous numbers and digits.
		var CDATA = '[CDATA[';
		var DOCTYPE = 'DOCTYPE';
		var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
		var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/';
		var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };

		// http://www.w3.org/TR/REC-xml/#NT-NameStartChar
		// This implementation works on strings, a single character at a time
		// as such, it cannot ever support astral-plane characters (10000-EFFFF)
		// without a significant breaking change to either this  parser, or the
		// JavaScript language.  Implementation of an emoji-capable xml parser
		// is left as an exercise for the reader.
		var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;

		var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;

		var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
		var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;

		function isWhitespace (c) {
			return c === ' ' || c === '\n' || c === '\r' || c === '\t'
		}

		function isQuote (c) {
			return c === '"' || c === '\''
		}

		function isAttribEnd (c) {
			return c === '>' || isWhitespace(c)
		}

		function isMatch (regex, c) {
			return regex.test(c)
		}

		function notMatch (regex, c) {
			return !isMatch(regex, c)
		}

		var S = 0;
		sax.STATE = {
			BEGIN: S++, // leading byte order mark or whitespace
			BEGIN_WHITESPACE: S++, // leading whitespace
			TEXT: S++, // general stuff
			TEXT_ENTITY: S++, // &amp and such.
			OPEN_WAKA: S++, // <
			SGML_DECL: S++, // <!BLARG
			SGML_DECL_QUOTED: S++, // <!BLARG foo "bar
			DOCTYPE: S++, // <!DOCTYPE
			DOCTYPE_QUOTED: S++, // <!DOCTYPE "//blah
			DOCTYPE_DTD: S++, // <!DOCTYPE "//blah" [ ...
			DOCTYPE_DTD_QUOTED: S++, // <!DOCTYPE "//blah" [ "foo
			COMMENT_STARTING: S++, // <!-
			COMMENT: S++, // <!--
			COMMENT_ENDING: S++, // <!-- blah -
			COMMENT_ENDED: S++, // <!-- blah --
			CDATA: S++, // <![CDATA[ something
			CDATA_ENDING: S++, // ]
			CDATA_ENDING_2: S++, // ]]
			PROC_INST: S++, // <?hi
			PROC_INST_BODY: S++, // <?hi there
			PROC_INST_ENDING: S++, // <?hi "there" ?
			OPEN_TAG: S++, // <strong
			OPEN_TAG_SLASH: S++, // <strong /
			ATTRIB: S++, // <a
			ATTRIB_NAME: S++, // <a foo
			ATTRIB_NAME_SAW_WHITE: S++, // <a foo _
			ATTRIB_VALUE: S++, // <a foo=
			ATTRIB_VALUE_QUOTED: S++, // <a foo="bar
			ATTRIB_VALUE_CLOSED: S++, // <a foo="bar"
			ATTRIB_VALUE_UNQUOTED: S++, // <a foo=bar
			ATTRIB_VALUE_ENTITY_Q: S++, // <foo bar="&quot;"
			ATTRIB_VALUE_ENTITY_U: S++, // <foo bar=&quot
			CLOSE_TAG: S++, // </a
			CLOSE_TAG_SAW_WHITE: S++, // </a   >
			SCRIPT: S++, // <script> ...
			SCRIPT_ENDING: S++ // <script> ... <
		};

		sax.XML_ENTITIES = {
			'amp': '&',
			'gt': '>',
			'lt': '<',
			'quot': '"',
			'apos': "'"
		};

		sax.ENTITIES = {
			'amp': '&',
			'gt': '>',
			'lt': '<',
			'quot': '"',
			'apos': "'",
			'AElig': 198,
			'Aacute': 193,
			'Acirc': 194,
			'Agrave': 192,
			'Aring': 197,
			'Atilde': 195,
			'Auml': 196,
			'Ccedil': 199,
			'ETH': 208,
			'Eacute': 201,
			'Ecirc': 202,
			'Egrave': 200,
			'Euml': 203,
			'Iacute': 205,
			'Icirc': 206,
			'Igrave': 204,
			'Iuml': 207,
			'Ntilde': 209,
			'Oacute': 211,
			'Ocirc': 212,
			'Ograve': 210,
			'Oslash': 216,
			'Otilde': 213,
			'Ouml': 214,
			'THORN': 222,
			'Uacute': 218,
			'Ucirc': 219,
			'Ugrave': 217,
			'Uuml': 220,
			'Yacute': 221,
			'aacute': 225,
			'acirc': 226,
			'aelig': 230,
			'agrave': 224,
			'aring': 229,
			'atilde': 227,
			'auml': 228,
			'ccedil': 231,
			'eacute': 233,
			'ecirc': 234,
			'egrave': 232,
			'eth': 240,
			'euml': 235,
			'iacute': 237,
			'icirc': 238,
			'igrave': 236,
			'iuml': 239,
			'ntilde': 241,
			'oacute': 243,
			'ocirc': 244,
			'ograve': 242,
			'oslash': 248,
			'otilde': 245,
			'ouml': 246,
			'szlig': 223,
			'thorn': 254,
			'uacute': 250,
			'ucirc': 251,
			'ugrave': 249,
			'uuml': 252,
			'yacute': 253,
			'yuml': 255,
			'copy': 169,
			'reg': 174,
			'nbsp': 160,
			'iexcl': 161,
			'cent': 162,
			'pound': 163,
			'curren': 164,
			'yen': 165,
			'brvbar': 166,
			'sect': 167,
			'uml': 168,
			'ordf': 170,
			'laquo': 171,
			'not': 172,
			'shy': 173,
			'macr': 175,
			'deg': 176,
			'plusmn': 177,
			'sup1': 185,
			'sup2': 178,
			'sup3': 179,
			'acute': 180,
			'micro': 181,
			'para': 182,
			'middot': 183,
			'cedil': 184,
			'ordm': 186,
			'raquo': 187,
			'frac14': 188,
			'frac12': 189,
			'frac34': 190,
			'iquest': 191,
			'times': 215,
			'divide': 247,
			'OElig': 338,
			'oelig': 339,
			'Scaron': 352,
			'scaron': 353,
			'Yuml': 376,
			'fnof': 402,
			'circ': 710,
			'tilde': 732,
			'Alpha': 913,
			'Beta': 914,
			'Gamma': 915,
			'Delta': 916,
			'Epsilon': 917,
			'Zeta': 918,
			'Eta': 919,
			'Theta': 920,
			'Iota': 921,
			'Kappa': 922,
			'Lambda': 923,
			'Mu': 924,
			'Nu': 925,
			'Xi': 926,
			'Omicron': 927,
			'Pi': 928,
			'Rho': 929,
			'Sigma': 931,
			'Tau': 932,
			'Upsilon': 933,
			'Phi': 934,
			'Chi': 935,
			'Psi': 936,
			'Omega': 937,
			'alpha': 945,
			'beta': 946,
			'gamma': 947,
			'delta': 948,
			'epsilon': 949,
			'zeta': 950,
			'eta': 951,
			'theta': 952,
			'iota': 953,
			'kappa': 954,
			'lambda': 955,
			'mu': 956,
			'nu': 957,
			'xi': 958,
			'omicron': 959,
			'pi': 960,
			'rho': 961,
			'sigmaf': 962,
			'sigma': 963,
			'tau': 964,
			'upsilon': 965,
			'phi': 966,
			'chi': 967,
			'psi': 968,
			'omega': 969,
			'thetasym': 977,
			'upsih': 978,
			'piv': 982,
			'ensp': 8194,
			'emsp': 8195,
			'thinsp': 8201,
			'zwnj': 8204,
			'zwj': 8205,
			'lrm': 8206,
			'rlm': 8207,
			'ndash': 8211,
			'mdash': 8212,
			'lsquo': 8216,
			'rsquo': 8217,
			'sbquo': 8218,
			'ldquo': 8220,
			'rdquo': 8221,
			'bdquo': 8222,
			'dagger': 8224,
			'Dagger': 8225,
			'bull': 8226,
			'hellip': 8230,
			'permil': 8240,
			'prime': 8242,
			'Prime': 8243,
			'lsaquo': 8249,
			'rsaquo': 8250,
			'oline': 8254,
			'frasl': 8260,
			'euro': 8364,
			'image': 8465,
			'weierp': 8472,
			'real': 8476,
			'trade': 8482,
			'alefsym': 8501,
			'larr': 8592,
			'uarr': 8593,
			'rarr': 8594,
			'darr': 8595,
			'harr': 8596,
			'crarr': 8629,
			'lArr': 8656,
			'uArr': 8657,
			'rArr': 8658,
			'dArr': 8659,
			'hArr': 8660,
			'forall': 8704,
			'part': 8706,
			'exist': 8707,
			'empty': 8709,
			'nabla': 8711,
			'isin': 8712,
			'notin': 8713,
			'ni': 8715,
			'prod': 8719,
			'sum': 8721,
			'minus': 8722,
			'lowast': 8727,
			'radic': 8730,
			'prop': 8733,
			'infin': 8734,
			'ang': 8736,
			'and': 8743,
			'or': 8744,
			'cap': 8745,
			'cup': 8746,
			'int': 8747,
			'there4': 8756,
			'sim': 8764,
			'cong': 8773,
			'asymp': 8776,
			'ne': 8800,
			'equiv': 8801,
			'le': 8804,
			'ge': 8805,
			'sub': 8834,
			'sup': 8835,
			'nsub': 8836,
			'sube': 8838,
			'supe': 8839,
			'oplus': 8853,
			'otimes': 8855,
			'perp': 8869,
			'sdot': 8901,
			'lceil': 8968,
			'rceil': 8969,
			'lfloor': 8970,
			'rfloor': 8971,
			'lang': 9001,
			'rang': 9002,
			'loz': 9674,
			'spades': 9824,
			'clubs': 9827,
			'hearts': 9829,
			'diams': 9830
		};

		Object.keys(sax.ENTITIES).forEach(function (key) {
			var e = sax.ENTITIES[key];
			var s = typeof e === 'number' ? String.fromCharCode(e) : e;
			sax.ENTITIES[key] = s;
		});

		for (var s in sax.STATE) {
			sax.STATE[sax.STATE[s]] = s;
		}

		// shorthand
		S = sax.STATE;

		function emit (parser, event, data) {
			parser[event] && parser[event](data);
		}

		function emitNode (parser, nodeType, data) {
			if (parser.textNode) closeText(parser);
			emit(parser, nodeType, data);
		}

		function closeText (parser) {
			parser.textNode = textopts(parser.opt, parser.textNode);
			if (parser.textNode) emit(parser, 'ontext', parser.textNode);
			parser.textNode = '';
		}

		function textopts (opt, text) {
			if (opt.trim) text = text.trim();
			if (opt.normalize) text = text.replace(/\s+/g, ' ');
			return text
		}

		function error (parser, er) {
			closeText(parser);
			if (parser.trackPosition) {
				er += '\nLine: ' + parser.line +
					'\nColumn: ' + parser.column +
					'\nChar: ' + parser.c;
			}
			er = new Error(er);
			parser.error = er;
			emit(parser, 'onerror', er);
			return parser
		}

		function end (parser) {
			if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag');
			if ((parser.state !== S.BEGIN) &&
				(parser.state !== S.BEGIN_WHITESPACE) &&
				(parser.state !== S.TEXT)) {
				error(parser, 'Unexpected end');
			}
			closeText(parser);
			parser.c = '';
			parser.closed = true;
			emit(parser, 'onend');
			SAXParser.call(parser, parser.strict, parser.opt);
			return parser
		}

		function strictFail (parser, message) {
			if (typeof parser !== 'object' || !(parser instanceof SAXParser)) {
				throw new Error('bad call to strictFail')
			}
			if (parser.strict) {
				error(parser, message);
			}
		}

		function newTag (parser) {
			if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
			var parent = parser.tags[parser.tags.length - 1] || parser;
			var tag = parser.tag = { name: parser.tagName, attributes: {} };

			// will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
			if (parser.opt.xmlns) {
				tag.ns = parent.ns;
			}
			parser.attribList.length = 0;
			emitNode(parser, 'onopentagstart', tag);
		}

		function qname (name, attribute) {
			var i = name.indexOf(':');
			var qualName = i < 0 ? [ '', name ] : name.split(':');
			var prefix = qualName[0];
			var local = qualName[1];

			// <x "xmlns"="http://foo">
			if (attribute && name === 'xmlns') {
				prefix = 'xmlns';
				local = '';
			}

			return { prefix: prefix, local: local }
		}

		function attrib (parser) {
			if (!parser.strict) {
				parser.attribName = parser.attribName[parser.looseCase]();
			}

			if (parser.attribList.indexOf(parser.attribName) !== -1 ||
				parser.tag.attributes.hasOwnProperty(parser.attribName)) {
				parser.attribName = parser.attribValue = '';
				return
			}

			if (parser.opt.xmlns) {
				var qn = qname(parser.attribName, true);
				var prefix = qn.prefix;
				var local = qn.local;

				if (prefix === 'xmlns') {
					// namespace binding attribute. push the binding into scope
					if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
						strictFail(parser,
							'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' +
							'Actual: ' + parser.attribValue);
					} else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
						strictFail(parser,
							'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' +
							'Actual: ' + parser.attribValue);
					} else {
						var tag = parser.tag;
						var parent = parser.tags[parser.tags.length - 1] || parser;
						if (tag.ns === parent.ns) {
							tag.ns = Object.create(parent.ns);
						}
						tag.ns[local] = parser.attribValue;
					}
				}

				// defer onattribute events until all attributes have been seen
				// so any new bindings can take effect. preserve attribute order
				// so deferred events can be emitted in document order
				parser.attribList.push([parser.attribName, parser.attribValue]);
			} else {
				// in non-xmlns mode, we can emit the event right away
				parser.tag.attributes[parser.attribName] = parser.attribValue;
				emitNode(parser, 'onattribute', {
					name: parser.attribName,
					value: parser.attribValue
				});
			}

			parser.attribName = parser.attribValue = '';
		}

		function openTag (parser, selfClosing) {
			if (parser.opt.xmlns) {
				// emit namespace binding events
				var tag = parser.tag;

				// add namespace info to tag
				var qn = qname(parser.tagName);
				tag.prefix = qn.prefix;
				tag.local = qn.local;
				tag.uri = tag.ns[qn.prefix] || '';

				if (tag.prefix && !tag.uri) {
					strictFail(parser, 'Unbound namespace prefix: ' +
						JSON.stringify(parser.tagName));
					tag.uri = qn.prefix;
				}

				var parent = parser.tags[parser.tags.length - 1] || parser;
				if (tag.ns && parent.ns !== tag.ns) {
					Object.keys(tag.ns).forEach(function (p) {
						emitNode(parser, 'onopennamespace', {
							prefix: p,
							uri: tag.ns[p]
						});
					});
				}

				// handle deferred onattribute events
				// Note: do not apply default ns to attributes:
				//   http://www.w3.org/TR/REC-xml-names/#defaulting
				for (var i = 0, l = parser.attribList.length; i < l; i++) {
					var nv = parser.attribList[i];
					var name = nv[0];
					var value = nv[1];
					var qualName = qname(name, true);
					var prefix = qualName.prefix;
					var local = qualName.local;
					var uri = prefix === '' ? '' : (tag.ns[prefix] || '');
					var a = {
						name: name,
						value: value,
						prefix: prefix,
						local: local,
						uri: uri
					};

					// if there's any attributes with an undefined namespace,
					// then fail on them now.
					if (prefix && prefix !== 'xmlns' && !uri) {
						strictFail(parser, 'Unbound namespace prefix: ' +
							JSON.stringify(prefix));
						a.uri = prefix;
					}
					parser.tag.attributes[name] = a;
					emitNode(parser, 'onattribute', a);
				}
				parser.attribList.length = 0;
			}

			parser.tag.isSelfClosing = !!selfClosing;

			// process the tag
			parser.sawRoot = true;
			parser.tags.push(parser.tag);
			emitNode(parser, 'onopentag', parser.tag);
			if (!selfClosing) {
				// special case for <script> in non-strict mode.
				if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
					parser.state = S.SCRIPT;
				} else {
					parser.state = S.TEXT;
				}
				parser.tag = null;
				parser.tagName = '';
			}
			parser.attribName = parser.attribValue = '';
			parser.attribList.length = 0;
		}

		function closeTag (parser) {
			if (!parser.tagName) {
				strictFail(parser, 'Weird empty close tag.');
				parser.textNode += '</>';
				parser.state = S.TEXT;
				return
			}

			if (parser.script) {
				if (parser.tagName !== 'script') {
					parser.script += '</' + parser.tagName + '>';
					parser.tagName = '';
					parser.state = S.SCRIPT;
					return
				}
				emitNode(parser, 'onscript', parser.script);
				parser.script = '';
			}

			// first make sure that the closing tag actually exists.
			// <a><b></c></b></a> will close everything, otherwise.
			var t = parser.tags.length;
			var tagName = parser.tagName;
			if (!parser.strict) {
				tagName = tagName[parser.looseCase]();
			}
			var closeTo = tagName;
			while (t--) {
				var close = parser.tags[t];
				if (close.name !== closeTo) {
					// fail the first time in strict mode
					strictFail(parser, 'Unexpected close tag');
				} else {
					break
				}
			}

			// didn't find it.  we already failed for strict, so just abort.
			if (t < 0) {
				strictFail(parser, 'Unmatched closing tag: ' + parser.tagName);
				parser.textNode += '</' + parser.tagName + '>';
				parser.state = S.TEXT;
				return
			}
			parser.tagName = tagName;
			var s = parser.tags.length;
			while (s-- > t) {
				var tag = parser.tag = parser.tags.pop();
				parser.tagName = parser.tag.name;
				emitNode(parser, 'onclosetag', parser.tagName);

				var x = {};
				for (var i in tag.ns) {
					x[i] = tag.ns[i];
				}

				var parent = parser.tags[parser.tags.length - 1] || parser;
				if (parser.opt.xmlns && tag.ns !== parent.ns) {
					// remove namespace bindings introduced by tag
					Object.keys(tag.ns).forEach(function (p) {
						var n = tag.ns[p];
						emitNode(parser, 'onclosenamespace', { prefix: p, uri: n });
					});
				}
			}
			if (t === 0) parser.closedRoot = true;
			parser.tagName = parser.attribValue = parser.attribName = '';
			parser.attribList.length = 0;
			parser.state = S.TEXT;
		}

		function parseEntity (parser) {
			var entity = parser.entity;
			var entityLC = entity.toLowerCase();
			var num;
			var numStr = '';

			if (parser.ENTITIES[entity]) {
				return parser.ENTITIES[entity]
			}
			if (parser.ENTITIES[entityLC]) {
				return parser.ENTITIES[entityLC]
			}
			entity = entityLC;
			if (entity.charAt(0) === '#') {
				if (entity.charAt(1) === 'x') {
					entity = entity.slice(2);
					num = parseInt(entity, 16);
					numStr = num.toString(16);
				} else {
					entity = entity.slice(1);
					num = parseInt(entity, 10);
					numStr = num.toString(10);
				}
			}
			entity = entity.replace(/^0+/, '');
			if (isNaN(num) || numStr.toLowerCase() !== entity) {
				strictFail(parser, 'Invalid character entity');
				return '&' + parser.entity + ';'
			}

			return String.fromCodePoint(num)
		}

		function beginWhiteSpace (parser, c) {
			if (c === '<') {
				parser.state = S.OPEN_WAKA;
				parser.startTagPosition = parser.position;
			} else if (!isWhitespace(c)) {
				// have to process this as a text node.
				// weird, but happens.
				strictFail(parser, 'Non-whitespace before first tag.');
				parser.textNode = c;
				parser.state = S.TEXT;
			}
		}

		function charAt (chunk, i) {
			var result = '';
			if (i < chunk.length) {
				result = chunk.charAt(i);
			}
			return result
		}

		function write (chunk) {
			var parser = this;
			if (this.error) {
				throw this.error
			}
			if (parser.closed) {
				return error(parser,
					'Cannot write after close. Assign an onready handler.')
			}
			if (chunk === null) {
				return end(parser)
			}
			if (typeof chunk === 'object') {
				chunk = chunk.toString();
			}
			var i = 0;
			var c = '';
			while (true) {
				c = charAt(chunk, i++);
				parser.c = c;

				if (!c) {
					break
				}

				if (parser.trackPosition) {
					parser.position++;
					if (c === '\n') {
						parser.line++;
						parser.column = 0;
					} else {
						parser.column++;
					}
				}

				switch (parser.state) {
					case S.BEGIN:
						parser.state = S.BEGIN_WHITESPACE;
						if (c === '\uFEFF') {
							continue
						}
						beginWhiteSpace(parser, c);
						continue

					case S.BEGIN_WHITESPACE:
						beginWhiteSpace(parser, c);
						continue

					case S.TEXT:
						if (parser.sawRoot && !parser.closedRoot) {
							var starti = i - 1;
							while (c && c !== '<' && c !== '&') {
								c = charAt(chunk, i++);
								if (c && parser.trackPosition) {
									parser.position++;
									if (c === '\n') {
										parser.line++;
										parser.column = 0;
									} else {
										parser.column++;
									}
								}
							}
							parser.textNode += chunk.substring(starti, i - 1);
						}
						if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
							parser.state = S.OPEN_WAKA;
							parser.startTagPosition = parser.position;
						} else {
							if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
								strictFail(parser, 'Text data outside of root node.');
							}
							if (c === '&') {
								parser.state = S.TEXT_ENTITY;
							} else {
								parser.textNode += c;
							}
						}
						continue

					case S.SCRIPT:
						// only non-strict
						if (c === '<') {
							parser.state = S.SCRIPT_ENDING;
						} else {
							parser.script += c;
						}
						continue

					case S.SCRIPT_ENDING:
						if (c === '/') {
							parser.state = S.CLOSE_TAG;
						} else {
							parser.script += '<' + c;
							parser.state = S.SCRIPT;
						}
						continue

					case S.OPEN_WAKA:
						// either a /, ?, !, or text is coming next.
						if (c === '!') {
							parser.state = S.SGML_DECL;
							parser.sgmlDecl = '';
						} else if (isWhitespace(c)) ; else if (isMatch(nameStart, c)) {
							parser.state = S.OPEN_TAG;
							parser.tagName = c;
						} else if (c === '/') {
							parser.state = S.CLOSE_TAG;
							parser.tagName = '';
						} else if (c === '?') {
							parser.state = S.PROC_INST;
							parser.procInstName = parser.procInstBody = '';
						} else {
							strictFail(parser, 'Unencoded <');
							// if there was some whitespace, then add that in.
							if (parser.startTagPosition + 1 < parser.position) {
								var pad = parser.position - parser.startTagPosition;
								c = new Array(pad).join(' ') + c;
							}
							parser.textNode += '<' + c;
							parser.state = S.TEXT;
						}
						continue

					case S.SGML_DECL:
						if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
							emitNode(parser, 'onopencdata');
							parser.state = S.CDATA;
							parser.sgmlDecl = '';
							parser.cdata = '';
						} else if (parser.sgmlDecl + c === '--') {
							parser.state = S.COMMENT;
							parser.comment = '';
							parser.sgmlDecl = '';
						} else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
							parser.state = S.DOCTYPE;
							if (parser.doctype || parser.sawRoot) {
								strictFail(parser,
									'Inappropriately located doctype declaration');
							}
							parser.doctype = '';
							parser.sgmlDecl = '';
						} else if (c === '>') {
							emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl);
							parser.sgmlDecl = '';
							parser.state = S.TEXT;
						} else if (isQuote(c)) {
							parser.state = S.SGML_DECL_QUOTED;
							parser.sgmlDecl += c;
						} else {
							parser.sgmlDecl += c;
						}
						continue

					case S.SGML_DECL_QUOTED:
						if (c === parser.q) {
							parser.state = S.SGML_DECL;
							parser.q = '';
						}
						parser.sgmlDecl += c;
						continue

					case S.DOCTYPE:
						if (c === '>') {
							parser.state = S.TEXT;
							emitNode(parser, 'ondoctype', parser.doctype);
							parser.doctype = true; // just remember that we saw it.
						} else {
							parser.doctype += c;
							if (c === '[') {
								parser.state = S.DOCTYPE_DTD;
							} else if (isQuote(c)) {
								parser.state = S.DOCTYPE_QUOTED;
								parser.q = c;
							}
						}
						continue

					case S.DOCTYPE_QUOTED:
						parser.doctype += c;
						if (c === parser.q) {
							parser.q = '';
							parser.state = S.DOCTYPE;
						}
						continue

					case S.DOCTYPE_DTD:
						parser.doctype += c;
						if (c === ']') {
							parser.state = S.DOCTYPE;
						} else if (isQuote(c)) {
							parser.state = S.DOCTYPE_DTD_QUOTED;
							parser.q = c;
						}
						continue

					case S.DOCTYPE_DTD_QUOTED:
						parser.doctype += c;
						if (c === parser.q) {
							parser.state = S.DOCTYPE_DTD;
							parser.q = '';
						}
						continue

					case S.COMMENT:
						if (c === '-') {
							parser.state = S.COMMENT_ENDING;
						} else {
							parser.comment += c;
						}
						continue

					case S.COMMENT_ENDING:
						if (c === '-') {
							parser.state = S.COMMENT_ENDED;
							parser.comment = textopts(parser.opt, parser.comment);
							if (parser.comment) {
								emitNode(parser, 'oncomment', parser.comment);
							}
							parser.comment = '';
						} else {
							parser.comment += '-' + c;
							parser.state = S.COMMENT;
						}
						continue

					case S.COMMENT_ENDED:
						if (c !== '>') {
							strictFail(parser, 'Malformed comment');
							// allow <!-- blah -- bloo --> in non-strict mode,
							// which is a comment of " blah -- bloo "
							parser.comment += '--' + c;
							parser.state = S.COMMENT;
						} else {
							parser.state = S.TEXT;
						}
						continue

					case S.CDATA:
						if (c === ']') {
							parser.state = S.CDATA_ENDING;
						} else {
							parser.cdata += c;
						}
						continue

					case S.CDATA_ENDING:
						if (c === ']') {
							parser.state = S.CDATA_ENDING_2;
						} else {
							parser.cdata += ']' + c;
							parser.state = S.CDATA;
						}
						continue

					case S.CDATA_ENDING_2:
						if (c === '>') {
							if (parser.cdata) {
								emitNode(parser, 'oncdata', parser.cdata);
							}
							emitNode(parser, 'onclosecdata');
							parser.cdata = '';
							parser.state = S.TEXT;
						} else if (c === ']') {
							parser.cdata += ']';
						} else {
							parser.cdata += ']]' + c;
							parser.state = S.CDATA;
						}
						continue

					case S.PROC_INST:
						if (c === '?') {
							parser.state = S.PROC_INST_ENDING;
						} else if (isWhitespace(c)) {
							parser.state = S.PROC_INST_BODY;
						} else {
							parser.procInstName += c;
						}
						continue

					case S.PROC_INST_BODY:
						if (!parser.procInstBody && isWhitespace(c)) {
							continue
						} else if (c === '?') {
							parser.state = S.PROC_INST_ENDING;
						} else {
							parser.procInstBody += c;
						}
						continue

					case S.PROC_INST_ENDING:
						if (c === '>') {
							emitNode(parser, 'onprocessinginstruction', {
								name: parser.procInstName,
								body: parser.procInstBody
							});
							parser.procInstName = parser.procInstBody = '';
							parser.state = S.TEXT;
						} else {
							parser.procInstBody += '?' + c;
							parser.state = S.PROC_INST_BODY;
						}
						continue

					case S.OPEN_TAG:
						if (isMatch(nameBody, c)) {
							parser.tagName += c;
						} else {
							newTag(parser);
							if (c === '>') {
								openTag(parser);
							} else if (c === '/') {
								parser.state = S.OPEN_TAG_SLASH;
							} else {
								if (!isWhitespace(c)) {
									strictFail(parser, 'Invalid character in tag name');
								}
								parser.state = S.ATTRIB;
							}
						}
						continue

					case S.OPEN_TAG_SLASH:
						if (c === '>') {
							openTag(parser, true);
							closeTag(parser);
						} else {
							strictFail(parser, 'Forward-slash in opening tag not followed by >');
							parser.state = S.ATTRIB;
						}
						continue

					case S.ATTRIB:
						// haven't read the attribute name yet.
						if (isWhitespace(c)) {
							continue
						} else if (c === '>') {
							openTag(parser);
						} else if (c === '/') {
							parser.state = S.OPEN_TAG_SLASH;
						} else if (isMatch(nameStart, c)) {
							parser.attribName = c;
							parser.attribValue = '';
							parser.state = S.ATTRIB_NAME;
						} else {
							strictFail(parser, 'Invalid attribute name');
						}
						continue

					case S.ATTRIB_NAME:
						if (c === '=') {
							parser.state = S.ATTRIB_VALUE;
						} else if (c === '>') {
							strictFail(parser, 'Attribute without value');
							parser.attribValue = parser.attribName;
							attrib(parser);
							openTag(parser);
						} else if (isWhitespace(c)) {
							parser.state = S.ATTRIB_NAME_SAW_WHITE;
						} else if (isMatch(nameBody, c)) {
							parser.attribName += c;
						} else {
							strictFail(parser, 'Invalid attribute name');
						}
						continue

					case S.ATTRIB_NAME_SAW_WHITE:
						if (c === '=') {
							parser.state = S.ATTRIB_VALUE;
						} else if (isWhitespace(c)) {
							continue
						} else {
							strictFail(parser, 'Attribute without value');
							parser.tag.attributes[parser.attribName] = '';
							parser.attribValue = '';
							emitNode(parser, 'onattribute', {
								name: parser.attribName,
								value: ''
							});
							parser.attribName = '';
							if (c === '>') {
								openTag(parser);
							} else if (isMatch(nameStart, c)) {
								parser.attribName = c;
								parser.state = S.ATTRIB_NAME;
							} else {
								strictFail(parser, 'Invalid attribute name');
								parser.state = S.ATTRIB;
							}
						}
						continue

					case S.ATTRIB_VALUE:
						if (isWhitespace(c)) {
							continue
						} else if (isQuote(c)) {
							parser.q = c;
							parser.state = S.ATTRIB_VALUE_QUOTED;
						} else {
							strictFail(parser, 'Unquoted attribute value');
							parser.state = S.ATTRIB_VALUE_UNQUOTED;
							parser.attribValue = c;
						}
						continue

					case S.ATTRIB_VALUE_QUOTED:
						if (c !== parser.q) {
							if (c === '&') {
								parser.state = S.ATTRIB_VALUE_ENTITY_Q;
							} else {
								parser.attribValue += c;
							}
							continue
						}
						attrib(parser);
						parser.q = '';
						parser.state = S.ATTRIB_VALUE_CLOSED;
						continue

					case S.ATTRIB_VALUE_CLOSED:
						if (isWhitespace(c)) {
							parser.state = S.ATTRIB;
						} else if (c === '>') {
							openTag(parser);
						} else if (c === '/') {
							parser.state = S.OPEN_TAG_SLASH;
						} else if (isMatch(nameStart, c)) {
							strictFail(parser, 'No whitespace between attributes');
							parser.attribName = c;
							parser.attribValue = '';
							parser.state = S.ATTRIB_NAME;
						} else {
							strictFail(parser, 'Invalid attribute name');
						}
						continue

					case S.ATTRIB_VALUE_UNQUOTED:
						if (!isAttribEnd(c)) {
							if (c === '&') {
								parser.state = S.ATTRIB_VALUE_ENTITY_U;
							} else {
								parser.attribValue += c;
							}
							continue
						}
						attrib(parser);
						if (c === '>') {
							openTag(parser);
						} else {
							parser.state = S.ATTRIB;
						}
						continue

					case S.CLOSE_TAG:
						if (!parser.tagName) {
							if (isWhitespace(c)) {
								continue
							} else if (notMatch(nameStart, c)) {
								if (parser.script) {
									parser.script += '</' + c;
									parser.state = S.SCRIPT;
								} else {
									strictFail(parser, 'Invalid tagname in closing tag.');
								}
							} else {
								parser.tagName = c;
							}
						} else if (c === '>') {
							closeTag(parser);
						} else if (isMatch(nameBody, c)) {
							parser.tagName += c;
						} else if (parser.script) {
							parser.script += '</' + parser.tagName;
							parser.tagName = '';
							parser.state = S.SCRIPT;
						} else {
							if (!isWhitespace(c)) {
								strictFail(parser, 'Invalid tagname in closing tag');
							}
							parser.state = S.CLOSE_TAG_SAW_WHITE;
						}
						continue

					case S.CLOSE_TAG_SAW_WHITE:
						if (isWhitespace(c)) {
							continue
						}
						if (c === '>') {
							closeTag(parser);
						} else {
							strictFail(parser, 'Invalid characters in closing tag');
						}
						continue

					case S.TEXT_ENTITY:
					case S.ATTRIB_VALUE_ENTITY_Q:
					case S.ATTRIB_VALUE_ENTITY_U:
						var returnState;
						var buffer;
						switch (parser.state) {
							case S.TEXT_ENTITY:
								returnState = S.TEXT;
								buffer = 'textNode';
								break

							case S.ATTRIB_VALUE_ENTITY_Q:
								returnState = S.ATTRIB_VALUE_QUOTED;
								buffer = 'attribValue';
								break

							case S.ATTRIB_VALUE_ENTITY_U:
								returnState = S.ATTRIB_VALUE_UNQUOTED;
								buffer = 'attribValue';
								break
						}

						if (c === ';') {
							parser[buffer] += parseEntity(parser);
							parser.entity = '';
							parser.state = returnState;
						} else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
							parser.entity += c;
						} else {
							strictFail(parser, 'Invalid character in entity name');
							parser[buffer] += '&' + parser.entity + c;
							parser.entity = '';
							parser.state = returnState;
						}

						continue

					default:
						throw new Error(parser, 'Unknown state: ' + parser.state)
				}
			} // while

			if (parser.position >= parser.bufferCheckPosition) {
				checkBufferLength(parser);
			}
			return parser
		}

		/*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
		/* istanbul ignore next */
		if (!String.fromCodePoint) {
			(function () {
				var stringFromCharCode = String.fromCharCode;
				var floor = Math.floor;
				var fromCodePoint = function () {
					var MAX_SIZE = 0x4000;
					var codeUnits = [];
					var highSurrogate;
					var lowSurrogate;
					var index = -1;
					var length = arguments.length;
					if (!length) {
						return ''
					}
					var result = '';
					while (++index < length) {
						var codePoint = Number(arguments[index]);
						if (
							!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
							codePoint < 0 || // not a valid Unicode code point
							codePoint > 0x10FFFF || // not a valid Unicode code point
							floor(codePoint) !== codePoint // not an integer
						) {
							throw RangeError('Invalid code point: ' + codePoint)
						}
						if (codePoint <= 0xFFFF) { // BMP code point
							codeUnits.push(codePoint);
						} else { // Astral code point; split in surrogate halves
							// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
							codePoint -= 0x10000;
							highSurrogate = (codePoint >> 10) + 0xD800;
							lowSurrogate = (codePoint % 0x400) + 0xDC00;
							codeUnits.push(highSurrogate, lowSurrogate);
						}
						if (index + 1 === length || codeUnits.length > MAX_SIZE) {
							result += stringFromCharCode.apply(null, codeUnits);
							codeUnits.length = 0;
						}
					}
					return result
				};
				/* istanbul ignore next */
				if (Object.defineProperty) {
					Object.defineProperty(String, 'fromCodePoint', {
						value: fromCodePoint,
						configurable: true,
						writable: true
					});
				} else {
					String.fromCodePoint = fromCodePoint;
				}
			}());
		}
	})( exports);
});

var bom = createCommonjsModule(function (module, exports) {
// Generated by CoffeeScript 1.12.7
	(function() {
		exports.stripBOM = function(str) {
			if (str[0] === '\uFEFF') {
				return str.substring(1);
			} else {
				return str;
			}
		};

	}).call(commonjsGlobal);
});
var bom_1 = bom.stripBOM;

var processors = createCommonjsModule(function (module, exports) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var prefixMatch;

		prefixMatch = new RegExp(/(?!xmlns)^.*:/);

		exports.normalize = function(str) {
			return str.toLowerCase();
		};

		exports.firstCharLowerCase = function(str) {
			return str.charAt(0).toLowerCase() + str.slice(1);
		};

		exports.stripPrefix = function(str) {
			return str.replace(prefixMatch, '');
		};

		exports.parseNumbers = function(str) {
			if (!isNaN(str)) {
				str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
			}
			return str;
		};

		exports.parseBooleans = function(str) {
			if (/^(?:true|false)$/i.test(str)) {
				str = str.toLowerCase() === 'true';
			}
			return str;
		};

	}).call(commonjsGlobal);
});
var processors_1 = processors.normalize;
var processors_2 = processors.firstCharLowerCase;
var processors_3 = processors.stripPrefix;
var processors_4 = processors.parseNumbers;
var processors_5 = processors.parseBooleans;

var parser = createCommonjsModule(function (module, exports) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var bom$1, defaults$1, events$1, isEmpty, processItem, processors$1, sax$1, setImmediate,
			bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		sax$1 = sax;

		events$1 = events;

		bom$1 = bom;

		processors$1 = processors;

		setImmediate = timers.setImmediate;

		defaults$1 = defaults.defaults;

		isEmpty = function(thing) {
			return typeof thing === "object" && (thing != null) && Object.keys(thing).length === 0;
		};

		processItem = function(processors, item, key) {
			var i, len, process;
			for (i = 0, len = processors.length; i < len; i++) {
				process = processors[i];
				item = process(item, key);
			}
			return item;
		};

		exports.Parser = (function(superClass) {
			extend(Parser, superClass);

			function Parser(opts) {
				this.parseStringPromise = bind(this.parseStringPromise, this);
				this.parseString = bind(this.parseString, this);
				this.reset = bind(this.reset, this);
				this.assignOrPush = bind(this.assignOrPush, this);
				this.processAsync = bind(this.processAsync, this);
				var key, ref, value;
				if (!(this instanceof exports.Parser)) {
					return new exports.Parser(opts);
				}
				this.options = {};
				ref = defaults$1["0.2"];
				for (key in ref) {
					if (!hasProp.call(ref, key)) continue;
					value = ref[key];
					this.options[key] = value;
				}
				for (key in opts) {
					if (!hasProp.call(opts, key)) continue;
					value = opts[key];
					this.options[key] = value;
				}
				if (this.options.xmlns) {
					this.options.xmlnskey = this.options.attrkey + "ns";
				}
				if (this.options.normalizeTags) {
					if (!this.options.tagNameProcessors) {
						this.options.tagNameProcessors = [];
					}
					this.options.tagNameProcessors.unshift(processors$1.normalize);
				}
				this.reset();
			}

			Parser.prototype.processAsync = function() {
				var chunk, err;
				try {
					if (this.remaining.length <= this.options.chunkSize) {
						chunk = this.remaining;
						this.remaining = '';
						this.saxParser = this.saxParser.write(chunk);
						return this.saxParser.close();
					} else {
						chunk = this.remaining.substr(0, this.options.chunkSize);
						this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
						this.saxParser = this.saxParser.write(chunk);
						return setImmediate(this.processAsync);
					}
				} catch (error1) {
					err = error1;
					if (!this.saxParser.errThrown) {
						this.saxParser.errThrown = true;
						return this.emit(err);
					}
				}
			};

			Parser.prototype.assignOrPush = function(obj, key, newValue) {
				if (!(key in obj)) {
					if (!this.options.explicitArray) {
						return obj[key] = newValue;
					} else {
						return obj[key] = [newValue];
					}
				} else {
					if (!(obj[key] instanceof Array)) {
						obj[key] = [obj[key]];
					}
					return obj[key].push(newValue);
				}
			};

			Parser.prototype.reset = function() {
				var attrkey, charkey, ontext, stack;
				this.removeAllListeners();
				this.saxParser = sax$1.parser(this.options.strict, {
					trim: false,
					normalize: false,
					xmlns: this.options.xmlns
				});
				this.saxParser.errThrown = false;
				this.saxParser.onerror = (function(_this) {
					return function(error) {
						_this.saxParser.resume();
						if (!_this.saxParser.errThrown) {
							_this.saxParser.errThrown = true;
							return _this.emit("error", error);
						}
					};
				})(this);
				this.saxParser.onend = (function(_this) {
					return function() {
						if (!_this.saxParser.ended) {
							_this.saxParser.ended = true;
							return _this.emit("end", _this.resultObject);
						}
					};
				})(this);
				this.saxParser.ended = false;
				this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
				this.resultObject = null;
				stack = [];
				attrkey = this.options.attrkey;
				charkey = this.options.charkey;
				this.saxParser.onopentag = (function(_this) {
					return function(node) {
						var key, newValue, obj, processedKey, ref;
						obj = {};
						obj[charkey] = "";
						if (!_this.options.ignoreAttrs) {
							ref = node.attributes;
							for (key in ref) {
								if (!hasProp.call(ref, key)) continue;
								if (!(attrkey in obj) && !_this.options.mergeAttrs) {
									obj[attrkey] = {};
								}
								newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
								processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
								if (_this.options.mergeAttrs) {
									_this.assignOrPush(obj, processedKey, newValue);
								} else {
									obj[attrkey][processedKey] = newValue;
								}
							}
						}
						obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
						if (_this.options.xmlns) {
							obj[_this.options.xmlnskey] = {
								uri: node.uri,
								local: node.local
							};
						}
						return stack.push(obj);
					};
				})(this);
				this.saxParser.onclosetag = (function(_this) {
					return function() {
						var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
						obj = stack.pop();
						nodeName = obj["#name"];
						if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
							delete obj["#name"];
						}
						if (obj.cdata === true) {
							cdata = obj.cdata;
							delete obj.cdata;
						}
						s = stack[stack.length - 1];
						if (obj[charkey].match(/^\s*$/) && !cdata) {
							emptyStr = obj[charkey];
							delete obj[charkey];
						} else {
							if (_this.options.trim) {
								obj[charkey] = obj[charkey].trim();
							}
							if (_this.options.normalize) {
								obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
							}
							obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
							if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
								obj = obj[charkey];
							}
						}
						if (isEmpty(obj)) {
							obj = _this.options.emptyTag !== '' ? _this.options.emptyTag : emptyStr;
						}
						if (_this.options.validator != null) {
							xpath = "/" + ((function() {
								var i, len, results;
								results = [];
								for (i = 0, len = stack.length; i < len; i++) {
									node = stack[i];
									results.push(node["#name"]);
								}
								return results;
							})()).concat(nodeName).join("/");
							(function() {
								var err;
								try {
									return obj = _this.options.validator(xpath, s && s[nodeName], obj);
								} catch (error1) {
									err = error1;
									return _this.emit("error", err);
								}
							})();
						}
						if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === 'object') {
							if (!_this.options.preserveChildrenOrder) {
								node = {};
								if (_this.options.attrkey in obj) {
									node[_this.options.attrkey] = obj[_this.options.attrkey];
									delete obj[_this.options.attrkey];
								}
								if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
									node[_this.options.charkey] = obj[_this.options.charkey];
									delete obj[_this.options.charkey];
								}
								if (Object.getOwnPropertyNames(obj).length > 0) {
									node[_this.options.childkey] = obj;
								}
								obj = node;
							} else if (s) {
								s[_this.options.childkey] = s[_this.options.childkey] || [];
								objClone = {};
								for (key in obj) {
									if (!hasProp.call(obj, key)) continue;
									objClone[key] = obj[key];
								}
								s[_this.options.childkey].push(objClone);
								delete obj["#name"];
								if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
									obj = obj[charkey];
								}
							}
						}
						if (stack.length > 0) {
							return _this.assignOrPush(s, nodeName, obj);
						} else {
							if (_this.options.explicitRoot) {
								old = obj;
								obj = {};
								obj[nodeName] = old;
							}
							_this.resultObject = obj;
							_this.saxParser.ended = true;
							return _this.emit("end", _this.resultObject);
						}
					};
				})(this);
				ontext = (function(_this) {
					return function(text) {
						var charChild, s;
						s = stack[stack.length - 1];
						if (s) {
							s[charkey] += text;
							if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, '').trim() !== '')) {
								s[_this.options.childkey] = s[_this.options.childkey] || [];
								charChild = {
									'#name': '__text__'
								};
								charChild[charkey] = text;
								if (_this.options.normalize) {
									charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
								}
								s[_this.options.childkey].push(charChild);
							}
							return s;
						}
					};
				})(this);
				this.saxParser.ontext = ontext;
				return this.saxParser.oncdata = (function(_this) {
					return function(text) {
						var s;
						s = ontext(text);
						if (s) {
							return s.cdata = true;
						}
					};
				})();
			};

			Parser.prototype.parseString = function(str, cb) {
				var err;
				if ((cb != null) && typeof cb === "function") {
					this.on("end", function(result) {
						this.reset();
						return cb(null, result);
					});
					this.on("error", function(err) {
						this.reset();
						return cb(err);
					});
				}
				try {
					str = str.toString();
					if (str.trim() === '') {
						this.emit("end", null);
						return true;
					}
					str = bom$1.stripBOM(str);
					if (this.options.async) {
						this.remaining = str;
						setImmediate(this.processAsync);
						return this.saxParser;
					}
					return this.saxParser.write(str).close();
				} catch (error1) {
					err = error1;
					if (!(this.saxParser.errThrown || this.saxParser.ended)) {
						this.emit('error', err);
						return this.saxParser.errThrown = true;
					} else if (this.saxParser.ended) {
						throw err;
					}
				}
			};

			Parser.prototype.parseStringPromise = function(str) {
				return new Promise((function(_this) {
					return function(resolve, reject) {
						return _this.parseString(str, function(err, value) {
							if (err) {
								return reject(err);
							} else {
								return resolve(value);
							}
						});
					};
				})(this));
			};

			return Parser;

		})(events$1);

		exports.parseString = function(str, a, b) {
			var cb, options, parser;
			if (b != null) {
				if (typeof b === 'function') {
					cb = b;
				}
				if (typeof a === 'object') {
					options = a;
				}
			} else {
				if (typeof a === 'function') {
					cb = a;
				}
				options = {};
			}
			parser = new exports.Parser(options);
			return parser.parseString(str, cb);
		};

		exports.parseStringPromise = function(str, a) {
			var options, parser;
			if (typeof a === 'object') {
				options = a;
			}
			parser = new exports.Parser(options);
			return parser.parseStringPromise(str);
		};

	}).call(commonjsGlobal);
});
var parser_1 = parser.Parser;
var parser_2 = parser.parseString;
var parser_3 = parser.parseStringPromise;

var xml2js = createCommonjsModule(function (module, exports) {
// Generated by CoffeeScript 1.12.7
	(function() {
		var builder$1, defaults$1, parser$1, processors$1,
			extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
			hasProp = {}.hasOwnProperty;

		defaults$1 = defaults;

		builder$1 = builder;

		parser$1 = parser;

		processors$1 = processors;

		exports.defaults = defaults$1.defaults;

		exports.processors = processors$1;

		exports.ValidationError = (function(superClass) {
			extend(ValidationError, superClass);

			function ValidationError(message) {
				this.message = message;
			}

			return ValidationError;

		})(Error);

		exports.Builder = builder$1.Builder;

		exports.Parser = parser$1.Parser;

		exports.parseString = parser$1.parseString;

		exports.parseStringPromise = parser$1.parseStringPromise;

	}).call(commonjsGlobal);
});
var xml2js_1 = xml2js.defaults;
var xml2js_2 = xml2js.processors;
var xml2js_3 = xml2js.ValidationError;
var xml2js_4 = xml2js.Builder;
var xml2js_5 = xml2js.Parser;
var xml2js_6 = xml2js.parseString;
var xml2js_7 = xml2js.parseStringPromise;

var dist = createCommonjsModule(function (module, exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
		function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
			function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
			function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
		return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parseFile = exports.parseContent = void 0;
	const fs_1 = __importDefault(fs__default);


	const getCoverageData = (projectObj) => Object.prototype.hasOwnProperty.call(projectObj, 'package') ? projectObj.package : [Object.assign({}, projectObj, { $: Object.assign({}, projectObj.$, { name: undefined }) })];
	const getPackageName = (data) => Object.prototype.hasOwnProperty.call(data, '$') && Object.prototype.hasOwnProperty.call(data.$, 'name') && data.$.name ? data.$.name + '/' : '';
	const classDetailsFromProjects = (projects) => {
		const classDetails = [];
		projects.forEach(projectObj => {
			getCoverageData(projectObj).forEach(data => {
				data.file.forEach(fileObj => {
					if (Object.prototype.hasOwnProperty.call(fileObj, 'class')) {
						fileObj['class'].forEach(classObj => {
							classDetails.push({
								name: classObj.$.name,
								fileName: getPackageName(data) + fileObj.$.name,
								lines: fileObj.line,
							});
						});
					}
					else {
						classDetails.push({
							fileName: getPackageName(data) + fileObj.$.name,
							lines: fileObj.line,
						});
					}
				});
			});
		});
		return classDetails;
	};
	const unpackage = (projects) => classDetailsFromProjects(projects).map(detail => {
		const methodStats = detail.lines ? detail.lines.filter(line => line.$.type === 'method').map(line => ({
			name: line.$.name,
			line: Number(line.$.num),
			hit: Number(line.$.count),
		})) : [];
		const lineStats = detail.lines ? detail.lines.filter(line => line.$.type !== 'method').map(line => ({
			line: Number(line.$.num),
			hit: Number(line.$.count),
		})) : [];
		return {
			title: detail.name,
			file: detail.fileName,
			functions: {
				found: methodStats.length,
				// eslint-disable-next-line no-magic-numbers
				hit: methodStats.filter(val => val.hit > 0).length,
				details: methodStats,
			},
			lines: {
				found: lineStats.length,
				// eslint-disable-next-line no-magic-numbers
				hit: lineStats.filter(val => val.hit > 0).length,
				details: lineStats,
			},
		};
	});
	exports.parseContent = (xml) => new Promise((resolve, reject) => {
		xml2js.parseString(xml, (err, parseResult) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(unpackage(parseResult.coverage.project));
			}
		});
	});
	exports.parseFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.parseContent(yield util.promisify(fs_1.default.readFile)(filePath, 'utf-8')); });

});

unwrapExports(dist);
var dist_1 = dist.parseFile;
var dist_2 = dist.parseContent;

// Parse clover string into clover data
function parse$1(data) {
	return dist_2(data)
}

// Get the total coverage percentage from the clover data.
function percentage(clover) {
	let hit = 0;
	let found = 0;
	for (const entry of clover) {
		hit += entry.lines.hit;
		found += entry.lines.found;
	}

	return (hit / found) * 100
}

function tag(name) {
	return function(...children) {
		const props =
			typeof children[0] === "object"
				? Object.keys(children[0])
					.map(key => ` ${key}='${children[0][key]}'`)
					.join("")
				: "";

		const c = typeof children[0] === "string" ? children : children.slice(1);

		return `<${name}${props}>${c.join("")}</${name}>`
	}
}

const details = tag("details");
const summary = tag("summary");
const tr = tag("tr");
const td = tag("td");
const th = tag("th");
const b = tag("b");
const table = tag("table");
const tbody = tag("tbody");
const a = tag("a");

const fragment = function(...children) {
	return children.join("")
};

// Tabulate the clover data in a HTML table.
function tabulate(clover, options) {
	const head = tr(
		th("File"),
		th("Branches"),
		th("Funcs"),
		th("Lines"),
		th("Uncovered Lines"),
	);

	const folders = {};
	for (const file of clover) {
		const parts = file.file.replace(options.prefix, "").split("/");
		const folder = parts.slice(0, -1).join("/");
		folders[folder] = folders[folder] || [];
		folders[folder].push(file);
	}

	const rows = Object.keys(folders)
		.sort()
		.reduce(
			(acc, key) => [
				...acc,
				toFolder(key),
				...folders[key].map(file => toRow(file, key !== "", options)),
			],
			[],
		);

	return table(tbody(head, ...rows))
}

function toFolder(path) {
	if (path === "") {
		return ""
	}

	return tr(td({ colspan: 5 }, b(path)))
}

function toRow(file, indent, options) {
	return tr(
		td(filename(file, indent, options)),
		td(percentage$1(file.branches)),
		td(percentage$1(file.functions)),
		td(percentage$1(file.lines)),
		td(uncovered(file, options)),
	)
}

function filename(file, indent, options) {
	const relative = file.file.replace(options.prefix, "");
	const href = `https://github.com/${options.repository}/blob/${options.commit}/${relative}`;
	const parts = relative.split("/");
	const last = parts[parts.length - 1];
	const space = indent ? "&nbsp; &nbsp;" : "";
	return fragment(space, a({ href }, last))
}

function percentage$1(item) {
	if (!item) {
		return "N/A"
	}

	const value = item.found === 0 ? 100 : (item.hit / item.found) * 100;
	const rounded = value.toFixed(2).replace(/\.0*$/, "");

	const tag = value === 100 ? fragment : b;

	return tag(`${rounded}%`)
}

function uncovered(file, options) {
	const branches = (file.branches ? file.branches.details : [])
		.filter(branch => branch.taken === 0)
		.map(branch => branch.line);

	const lines = (file.lines ? file.lines.details : [])
		.filter(line => line.hit === 0)
		.map(line => line.line);

	const all = [...branches, ...lines].sort();

	return all
		.map(function(line) {
			const relative = file.file.replace(options.prefix, "");
			const href = `https://github.com/${options.repository}/blob/${options.commit}/${relative}#L${line}`;
			return a({ href }, line)
		})
		.join(", ")
}

function comment(clover, options, name) {
	return fragment(
		`${name} Coverage after merging ${b(options.head)} into ${b(options.base)}`,
		table(tbody(tr(th(percentage(clover).toFixed(2), "%")))),
		"\n\n",
		details(summary("Coverage Report"), tabulate(clover, options)),
	)
}

function diff(clover, before, options, name) {
	if (!before) {
		return comment(clover, options, name)
	}

	const pbefore = percentage(before);
	const pafter = percentage(clover);
	const pdiff = pafter - pbefore;
	const plus = pdiff > 0 ? "+" : "";
	const arrow = pdiff === 0 ? "" : pdiff < 0 ? "▾" : "▴";

	return fragment(
		`${name} Coverage after merging ${b(options.head)} into ${b(options.base)}`,
		table(
			tbody(
				tr(
					th(pafter.toFixed(2), "%"),
					th(arrow, " ", plus, pdiff.toFixed(2), "%"),
				),
			),
		),
		"\n\n",
		details(summary("Coverage Report"), tabulate(clover, options)),
	)
}

async function main$1() {
	const token = core$1.getInput("github-token");
	const cloverFile = core$1.getInput("clover-file") || "./coverage/clover.xml";
	const baseFile = core$1.getInput("clover-base");
	const name = core$1.getInput("name") || "Coverage";

	const raw = await fs.promises.readFile(cloverFile, "utf-8").catch(err => null);
	if (!raw) {
		console.log(`No coverage report found at '${cloverFile}', exiting...`);
		return
	}

	const baseRaw =
		baseFile && (await fs.promises.readFile(baseFile, "utf-8").catch(err => null));
	if (baseFile && !baseRaw) {
		console.log(`No coverage report found at '${baseFile}', ignoring...`);
	}

	const options = {
		repository: github_1.payload.repository.full_name,
		commit: github_1.payload.pull_request.head.sha,
		prefix: `${process.env.GITHUB_WORKSPACE}/`,
		head: github_1.payload.pull_request.head.ref,
		base: github_1.payload.pull_request.base.ref,
	};

	const clover = await parse$1(raw);
	const baseclover = baseRaw && (await parse$1(baseRaw));
	const body = diff(clover, baseclover, options, name);

	const github = new github_2(token);

	const { data: comments } = await github.issues.listComments({
		owner: github_1.repo.owner,
		repo: github_1.repo.repo,
		issue_number: github_1.issue.number,
	});

	const botComment = comments.find(comment => {
		return comment.user.type === "Bot" && comment.body.includes(`${name} Coverage after merging`)
	});

	if (botComment) {
		await github.issues.updateComment({
			owner: github_1.repo.owner,
			repo: github_1.repo.repo,
			comment_id: botComment.id,
			body: body
		});
	} else {
		await github.issues.createComment({
			repo: github_1.repo.repo,
			owner: github_1.repo.owner,
			issue_number: github_1.payload.pull_request.number,
			body: diff(clover, baseclover, options, name),
		});
	}
}

main$1().catch(function(err) {
	console.log(err);
	core$1.setFailed(err.message);
});
