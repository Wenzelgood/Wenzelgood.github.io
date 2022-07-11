function getJson (url) {
  return fetch(url)
    .then(res => res.json());
}
    
/* Clans IDs
0 -> Crab
1 -> Crane
2 -> Dragon
3 -> Lion
4 -> Phoenix
5 -> Scorpion
6 -> Unicorn
7 -> The Imperial Families
8 -> Falcon
9 -> Mantis
10 -> Tortoise
11 -> Deer
12 -> Centipede
13 -> Badger
 */


function selectClan (clans) {
  document
    .getElementById('pageOne')
    .addEventListener('click', function (event) {
      if (event.target.tagName == 'DIV') {
        for (let clan in clans) {
          if (event.target.dataset.clan === clans[clan].name) {
            document.querySelector('.right--Content').innerHTML = `
              <h1><center>${clans[clan].name}</center></h1>
              ${clans[clan].description}`;
            selectFamily();
          }
        }
      }
    });
}

function selectFamily () {
  document.querySelector('.btn--ok').style.display = 'inline-block';
  
}

getJson('../data/clans.json')
  .then((dataClans) => selectClan(dataClans));
