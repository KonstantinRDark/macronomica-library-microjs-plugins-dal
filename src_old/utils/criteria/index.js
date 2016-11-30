import inCriteria, {KEY as KEY_IN} from './in';
import ninCriteria, {KEY as KEY_NIN} from './nin';
import nullCriteria, {KEY as KEY_NULL} from './null';
import bwnCriteria, {KEY as KEY_BWN} from './between';
import nbwnCriteria, {KEY as KEY_NBWN} from './not-between';
import gtCriteria, {KEY as KEY_GT} from './gt';
import gteCriteria, {KEY as KEY_GTE} from './gte';
import ltCriteria, {KEY as KEY_LT} from './lt';
import lteCriteria, {KEY as KEY_LTE} from './lte';

export default {
  [ KEY_IN ]  : inCriteria,
  [ KEY_NIN ] : ninCriteria,
  [ KEY_NULL ]: nullCriteria,
  [ KEY_BWN ] : bwnCriteria,
  [ KEY_NBWN ]: nbwnCriteria,
  [ KEY_GT ]  : gtCriteria,
  [ KEY_GTE ] : gteCriteria,
  [ KEY_LT ]  : ltCriteria,
  [ KEY_LTE ] : lteCriteria
}