export const KEY = 'nbwn';
import isRange from './../is-range';

/**
 * @param {object} builder
 * @param {string} property
 * @param {number[]} value
 * @returns {*}
 */
export default (builder, property, value) => {
  if (!isRange(value)) {
    return builder;
  }
  
  return builder.whereNotBetween(property, value);
};