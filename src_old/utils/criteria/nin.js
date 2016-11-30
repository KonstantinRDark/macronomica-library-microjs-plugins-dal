export const KEY = 'nin';

/**
 * @param {object} builder
 * @param {string} property
 * @param {number[]} value
 * @returns {*}
 */
export default (builder, property, value) => {
  return builder.whereNotIn(property, value);
};