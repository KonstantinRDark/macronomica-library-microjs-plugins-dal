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
  boolean : booleanType,
  number  : numberType,
  smallint: smallintType,
  integer : integerType,
  float   : floatType,
  money   : moneyType,
  string  : stringType,
  text    : textType,
  datetime: datetimeType,
  array   : arrayType
};