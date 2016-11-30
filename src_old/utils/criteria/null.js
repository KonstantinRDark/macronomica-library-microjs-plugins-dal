export const KEY = 'null';

/**
 * @param {object} builder
 * @param {string} property
 * @param {boolean} value
 * @returns {*}
 */
export default (builder, property, value) => {
  if (value === true || value === false) {
    const operation = value === true ? 'whereNull' : 'whereNotNull';
    return builder[ operation ](property);
  }
  
  return builder;
};