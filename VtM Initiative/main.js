const sortChildren = ({ container, child, compare }) => {
  const items = [...container.querySelectorAll(child)];
  items
    .sort((a, b) => compare(b) - compare(a))
    .forEach(item => container.appendChild(item));
};



(function () {
  // let count = 0;
  document.querySelector('.btn--add').addEventListener('click', function () {
    let newInitiative = document.createElement('div');
    newInitiative.className = 'row';
    // newInitiative.id = count;
    newInitiative.innerHTML = '<input type="text" name="" id="" class="name" placeholder="Имя"><input type="text" name="" id="" placeholder="Действие"><input type="number" min="0" value="0" name="" id="" class="init--value"><div class="optional"><input type="checkbox"></div>';
    document.querySelector('.initiative').appendChild(newInitiative);
    // count++;
  });
  document.querySelector('.initiative').addEventListener('change', function(e) {
    if (e.target && e.target.matches('input.init--value')) {
      sortChildren({
        container: document.querySelector(".initiative"),
        child: ".row",
        compare: item => {
          const initValue = item.querySelector("input.init--value").value;
          if (!initValue) return 0;
          return initValue;
        }
      });
    }
  });

  // Переделать через массив
  let turnCount = 1; 
  document.getElementById('nextInitiative').addEventListener('click', function (){
    let activeRow = document.getElementById('isTurn');
    if (activeRow.nextElementSibling) {
      activeRow.id = '';
      activeRow.nextElementSibling.id = 'isTurn'
    }
    else {
      activeRow.id = '';
      document.querySelector('.initiative .row').id = 'isTurn';
      ++turnCount;
      document.getElementById('turnCount').textContent = `Раунд ${turnCount}`;
    }
  });
})()