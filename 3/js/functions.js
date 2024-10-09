/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const checkMaxLength = (string,maxLength) => string.length <= maxLength;

const isPalindrome = function(string){
  let reversedString = string.replaceAll(' ','').toLowerCase().split('').reverse().join('');
  return reversedString === string;
};

