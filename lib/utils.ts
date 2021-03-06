/*
Copyright 2016-17 Balena

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as _ from 'lodash';

/**
 * @summary Merge objects into one
 * @function
 * @protected
 *
 * @description
 * The last passed objects have precedence over the first ones.
 *
 * @param {...Object} objects - input objects
 * @returns {Object} merged object
 *
 * @example
 * const first = { foo: 'bar' }
 * const second = { foo: 'baz' }
 * const third = { foo: 'qux' }
 *
 * console.log(utils.mergeObjects(first, second, third))
 * > { foo: 'qux' }
 */

// Notice that this function equals `_.merge` and thus the latter
// could be used directly, making this function declaration unnecessary.
// However, we decided to create a new function for this in order to
// test specific behaviour that affects this module, like function
// merging.
export const mergeObjects = _.merge;

/**
 * @summary Evaluate a setting property
 * @function
 * @protected
 *
 * @param {Object} [settings={}] - settings
 * @param {String} property - period separated property
 * @returns {*} setting value
 *
 * @throws Will throw if setting is not found.
 *
 * @example
 * console.log(utils.evaluateSetting({ foo: 'bar' }, 'foo'))
 * > 'bar'
 *
 * @example
 * console.log(utils.evaluateSetting({
 * 	foo: {
 * 		bar: 'baz'
 * 	}
 * }, 'foo.bar'))
 * > 'baz'
 *
 * @example
 * console.log(utils.evaluateSetting({
 * 	greeting: 'Hola',
 * 	message: function() {
 * 		return `${this.greeting} World`
 * 	}
 * }), 'message')
 * > Hola World
 */
export const evaluateSetting = <T>(
	settings: object | undefined | null = {},
	property: string,
): T => {
	let value = _.get(settings, property);

	if (value == null) {
		throw new Error(`Setting not found: ${property}`);
	}

	if (_.isFunction(value)) {
		// This enables nifty things like dynamic
		// settings that rely on other settings
		value = value.call(settings);
	}

	return value as T;
};
