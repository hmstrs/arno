const random = (min, max) => ~~(Math.random() * (max ? ((max - min + 1) + min) : ++min));
const genKey = (length, [...chars]) => Array.from({ length }, () => chars[random(chars.length)]).join('');

module.exports = genKey;
