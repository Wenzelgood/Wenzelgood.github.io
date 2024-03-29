const sortChildren = ({ container, child, compare }) => {
  const items = [...container.querySelectorAll(child)];
  items
    .sort((a, b) => compare(b) - compare(a))
    .forEach(item => container.appendChild(item));
};

function getElemIndexById (arrNode, searchId) {
  const arr = Array.from(arrNode);
  return arr.findIndex(el => el.id == searchId);
}

(function () {
  const initiative = document.querySelector('.initiative');
  let turnCount = 1; 
  let initArr = [];

  document.querySelector('.btn--add').addEventListener('click', function () {
    let newRow = document.createElement('div');
    newRow.className = 'row';
    newRow.innerHTML = '<input type="text" name="" id="" class="name" placeholder="Имя"><input type="text" name="" id="" placeholder="Действие"><input type="number" min="0" value="0" name="" id="" class="init--value"><div class="optional"><input type="checkbox"></div>';
    initiative.appendChild(newRow);
    initArr = initiative.querySelectorAll('.row');
  });

  document.querySelector('.initiative').addEventListener('change', function(e) {
    if (e.target && e.target.matches('input.init--value')) {
      sortChildren({
        container: initiative,
        child: ".row",
        compare: item => {
          const initValue = item.querySelector("input.init--value").value;
          if (!initValue) return 0;
          return initValue;
        }
      });
    }
    resetActiveRow();
  });


  function resetActiveRow () {
    initArr = initiative.querySelectorAll('.row');
    initArr.forEach(el => {
      el.id == 'isTurn'? el.id = '' : null; 
    });
    initArr[0].id = 'isTurn';
  }

  document.getElementById('nextInitiative').addEventListener('click', function () {
    let activeRowIndex = getElemIndexById(initArr, 'isTurn');
    if (initArr.length > 1) {
      initArr[activeRowIndex].id = '';
      if (initArr[activeRowIndex+1]) {
        initArr[activeRowIndex+1].id = 'isTurn';
      }
      else if (initArr[activeRowIndex] === initArr[initArr.length-1]) {
        initArr[0].id = 'isTurn';
        document.getElementById('turnCount').textContent = `Раунд ${++turnCount}`;
      }
    }
  });
})()