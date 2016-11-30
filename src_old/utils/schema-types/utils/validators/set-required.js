
export default function setRequired(options, schema) {
  let { required } = options;

  if ('required' in options && options.required === true) {
    schema = schema.required();
  }

  return schema;
}