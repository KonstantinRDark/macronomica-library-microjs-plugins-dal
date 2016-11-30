export const KEY = 'in';

/**
 * @param {object} builder
 * @param {string} property
 * @param {number[]} value
 * @returns {*}
 */
export default (builder, property, value) => {
  return builder.whereIn(property, value);
};