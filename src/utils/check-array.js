export default (properties) => Object.keys(properties).filter(key => {
  if (properties[ key ].type.value === 'array') {
    return true;
  }
});