const arr1 = ['Formand', 'dfkujk'];
const arr3 = ['jh', 'dfkujk'];

const tdt = arr1.some(item => {
  console.log('item', item);
  console.log('arr3', arr3);

  return arr3.includes(item);
});

console.log('tdt', tdt);
