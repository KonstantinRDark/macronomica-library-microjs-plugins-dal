import booleanType from './types/boolean';
import numberType from './types/number';
import smallintType from './types/smallint';
import integerType from './types/integer';
import floatType from './types/float';
import moneyType from './types/money';
import stringType from './types/string';
import textType from './types/text';
import datetimeType from './types/datetime';
import arrayType from './types/array';

export default {
  get boolean () { return booleanType },
  get number  () { return numberType },
  get smallint() { return smallintType },
  get integer () { return integerType },
  get float   () { return floatType },
  get money   () { return moneyType },
  get string  () { return stringType },
  get text    () { return textType },
  get datetime() { return datetimeType },
  get array   () { return arrayType }
};