import { isEmail, isPhoneNumber, isProperPassword } from './regexPatterns';
import translations from './translations';
import { quiz } from './secrets';

export default (id, value, isAdmin, isSuperAdmin) => {
  let ok = true;
  let noError = true;
  let correctedValue = value; // initial value - some id's will change this
  let errorMessage = '';

  if (!isAdmin && !isSuperAdmin) {
    return {
      ok: false,
      value: correctedValue,
      errorMessage: 'Kun admin kan gemme ændret værdi',
    };
  }

  console.log('id 4, isAdmin, isSuperAdmin', id, isAdmin, isSuperAdmin);
  switch (id) {
    case 'name':
    case 'username':
    case 'work':
    case 'address':
      correctedValue = value.replace(/[\\]|[\+]|[\;]|[\:]|[\"]/g, ''); // removing \ and +
      noError = true;
      break;

    case 'password':
    case 'repeatPassword':
      correctedValue = value;
      if (correctedValue.length >= 6) {
        noError = true;
        break;
      }
      noError = false;
      break;

    case 'quiz':
      correctedValue = value;
      if (correctedValue.toLowerCase() === quiz && correctedValue.length > 0) {
        noError = true;
        break;
      }
      noError = false;
      break;

    case 'email':
    case 'workemail':
      noError = isEmail(value);
      break;

    case 'phone':
    case 'mobile':
    case 'workphone':
      correctedValue = value
        .replace(/^\+[0-9]{2}/g, '') // removing +45
        .replace(/ /g, '') // removing all spaces
        .replace(/(\d{2})/g, '$1 ') // put in spaces between 2 digits
        .trim(); // remove the last space put in by above
      noError = isPhoneNumber(correctedValue);
      break;

    case 'birthday':
      noError = true;
      break;

    case 'active':
    case 'size':
      noError = true;
      break;

    case 'roles':
      noError = true;
      break;
  }

  if (!noError) errorMessage = `${translations[id]} er ikke formet rigtig`;
  if (!correctedValue) {
    noError = true;
    errorMessage = '';
  } // value may and can be empty

  console.log('ok 149', ok);
  console.log('correctedValue 150', correctedValue);
  console.log('errorMessage 151', errorMessage);

  return { ok, value: correctedValue, errorMessage };
};

export const isEmptyObject = object => {
  console.log('Object.keys(object) 65', Object.keys(object));
  let isEmpty = true;
  Object.keys(object).map(key => {
    // console.log('key 1', key);
    // console.log('value 2', object[key]);
    // console.log('object[key].length > 0 333', object[key].length > 0);
    if (object[key].length > 0) return (isEmpty = false);
  });
  return isEmpty;
};

export const findEmptyKeysInObject = object => {
  console.log(
    'findEmptyKeysInObject Object.keys(object) 66',
    Object.keys(object),
  );
  let emptyKeys = [];
  Object.keys(object).map(key => {
    if (object[key] === '') emptyKeys.push(key);
  });
  console.log('emptyKeys 67', emptyKeys);
  return emptyKeys;
};

export const findMissingKeysInObject = (missingObject, fullObject) => {
  console.log('fullObject 67', Object.keys(fullObject));
  console.log(
    'Objectwith potentiel missing keys 68',
    Object.keys(missingObject),
  );
  let missingKeys = [];
  Object.keys(fullObject).map(key => {
    if (!missingObject.hasOwnProperty(key)) missingKeys.push(key);
  });
  console.log('missingKeys 67', missingKeys);
  return missingKeys;
};
