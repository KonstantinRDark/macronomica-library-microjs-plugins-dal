import isNumber from 'lodash.isnumber';

export default function isRange(value) {
  return Array.isArray(value)
    && value.length === 2
    && (isNumber(value[ 0 ]))
    && (isNumber(value[ 1 ]))
    && (+value[ 0 ]) <= (+value[ 1 ]);
}