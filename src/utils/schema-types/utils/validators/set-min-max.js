import isNumber from 'lodash.isnumber';

export default function setMinMax(defaults = {}) {
  return (options, schema) => {
    const { min:defaultMin, max:defaultMax } = defaults;
    let { min = defaultMin, max = defaultMax } = options;
    const hasMin = isNumber(min);
    const hasMax = isNumber(max);

    if (hasMin) {
      if (min < defaultMin) { min = defaultMin }
      if (hasMax && min > max) { min = max }
      schema = schema.min(+min);
    }

    if (hasMax) {
      if (max > defaultMax) { max = defaultMax }
      if (hasMin && max < min) { max = min }
      schema = schema.max(+max);
    }

    return schema;
  };
}
