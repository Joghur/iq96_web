import { isEmail, isPhoneNumber } from './regexPatterns';
import translations from './translations';

export default (id, value) => {
  let ok = false;
  let correctedValue = value; // initial value - some id's will change this
  let errorMessage = '';

  switch (id) {
    case 'name':
    case 'username':
    case 'work':
    case 'address':
      correctedValue = value.replace(/[\\]|[\+]|[\;]|[\:]|[\"]/g, ''); // removing \ and +
      ok = true;
      break;

    case 'email':
    case 'workemail':
      ok = isEmail(value);
      break;

    case 'phone':
    case 'mobile':
    case 'workphone':
      correctedValue = value
        .replace(/^\+[0-9]{2}/g, '') // removing +45
        .replace(/ /g, '') // removing all spaces
        .replace(/(\d{2})/g, '$1 ') // put in spaces between 2 digits
        .trim(); // remove the last space put in by above
      ok = isPhoneNumber(correctedValue);
      break;

    case 'birthday':
      ok = true;
      break;

    case 'active':
    case 'size':
    case 'roles':
      ok = true;
      break;
  }

  if (!ok) errorMessage = `${translations[id]} er ikke formet rigtig`;
  if (!correctedValue) {
    ok = true;
    errorMessage = '';
  } // value may and can be empty

  return { ok, value: correctedValue, errorMessage };
};
