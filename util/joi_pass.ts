import { assert } from "console";
import Joi from 'joi';

let defaultMessage = 'valid password';
type joiType = typeof Joi;

export const joiPass = (Joi: joiType, message?: string) => {
  assert(Joi && Joi.object, 'you must pass Joi as an argument');
  if (!message || !(typeof message === 'string')) {
        message = defaultMessage;
    }
  return function password() {
    return Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/, message);
  };
};