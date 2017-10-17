var a = [{
  name: 'superman',
  age: 12
}, {
  name: 'superman1',
  age: 123
}];

const b = a.filter((person) => {
  person.sex = '33';
  return person.age === 123;
});

console.log('a', a);
console.log('b', b);
