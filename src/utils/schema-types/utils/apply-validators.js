
export default function applyValidators(options, schema, validators) {
  return validators.reduce((schema, validator) => validator(options, schema), schema);
}