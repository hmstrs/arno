export const compareObjs = (obj1, obj2) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

const removeDuplicateObject = arr => {
  let temp = arr.map(item => JSON.stringify(item));
  temp = Array.from(new Set(temp));
  return temp.map(item => JSON.parse(item));
};

const matchesObjProps = (obj1, obj2, { title, artist, reference }) =>
  obj1[title] === obj2[title] &&
  obj1[artist] === obj2[artist] &&
  obj1[reference] === obj2[reference];

export const offeredWithoutSong = (array, song) =>
  removeDuplicateObject(
    array.filter(offeredSong => {
      delete offeredSong.__typename;
      return !matchesObjProps(offeredSong, song, {
        title: 'title',
        artist: 'artist',
        reference: 'reference'
      });
    })
  );
