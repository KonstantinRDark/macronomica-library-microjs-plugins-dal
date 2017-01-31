export const KEY = 'like';

/**
 * @param {object} builder
 * @param {string} property
 * @param {number[]} value
 * @returns {*}
 */
export default (builder, property, value) => {
  return builder.where(property, 'like', value);
};