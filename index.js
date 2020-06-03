const newWish = document.querySelector('.new-wish');
const wishArea = document.querySelector('.wish-wrapper');

let allWishes = localStorage.getItem('wishes')
  ? JSON.parse(localStorage.getItem('wishes'))
  : [];
let userName = localStorage.getItem('userName')
  ? JSON.parse(localStorage.getItem('userName'))
  : [];

function setList(list) {
  localStorage.setItem('wishes', JSON.stringify(list));
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const findIndex = (id) => {
  return allWishes.findIndex(wish => wish.id === id);
}


function createNewWish(text, id, link, price) {
  let li = `<li list-id="${id ? id : generateId()}">
    <div class="title-wrapper"> 
    <div class="text-wrapper"> 
        <input type="checkbox">
        <span class="title">${text}</span>
    </div>
    <div class="button-wrapper">
      <img class="delete" src="img/close-24px.svg">
      <img class="deploy" src="img/expand_more-24px.svg">
    </div>
    </div>
      <span class="additionally">
        <p class="wish-price"> 
        <i class="fas fa-dollar-sign img-price"></i>`;

  if (price) {
    li += `<span>${price} грн</span> <img src="img/create-24px.svg" class="edit price"> </p>
      <p class="wish-link"> <i class="fas fa-link img-link"></i>`;
  } else {
    li += `
      <input type="number" step="0.01" min="0" placeholder="0,00">  грн.</p>
      <p class="wish-link"><i class="fas fa-link img-link"></i>`;
  }

  if (link) {
    li += `<a href="${link}" class="wish-link" target="_blank">${link}</a>
            <img src="img/create-24px.svg" class="edit link"></p>
        </span>
    </li>`;
  } else {
    li += `
            <input type="text" class="wish-link"></input>
        </span>
    </li>`;
  }
  li.className = 'wish';
  wishArea.innerHTML += li;
}

function addWishPrice(li, index, value) {
  allWishes[index].price = value;

  const wishPrice = `
    <img class="img-price" src="img/attach_money-24px.svg">
    <span>${value} грн</span> <img src="img/create-24px.svg" class="edit price">`;

  li.querySelector('p.wish-price').innerHTML = wishPrice;
  setList(allWishes);
}

function addWishLink(li, index, value) {
  allWishes[index].link = value;

  const wishLink = `
    <img class="img-link" src="img/insert_link-24px.svg">
    <a href="${value}" class="wish-link" target="_blank">${value}</a> 
    <img src="img/create-24px.svg" class="edit link">`;

  li.querySelector('p.wish-link').innerHTML = wishLink;
  setList(allWishes);
}

function editInput(li, index) {
  if (event.target.matches('img.link')) {
    let input = `
      <img class="img-link" src="img/insert_link-24px.svg"> 
      <input type="text" class="wish-link" value="${allWishes[index].link}">`;
    li.querySelector('p.wish-link').innerHTML = input;
  } else {
    let input = `
      <img class="img-price" src="img/attach_money-24px.svg"> 
      <input type="number" class="wish-price" value="${allWishes[index].price}"> грн.`;
    li.querySelector('p.wish-price').innerHTML = input;
  }
  setList(allWishes);
}

function deleteLi(li, id) {
    li.remove();
    allWishes = allWishes.filter(wish => wish.id !== id);
    setList(allWishes);
}

if (localStorage.getItem('userName')) {
  document.querySelector(
    '.img-shadow'
  ).innerHTML = `<h1>Вітаю, ${userName}!</h1>`;
  document.querySelector('.welcome-block').style.display = 'none';
} else {
  document.querySelector('.welcome-block').style.display = 'block';
  user.addEventListener('keydown', event => {
    if (event.keyCode === 13 && event.target.value) {
      hello = `<h1>Вітаю, ${event.target.value}!</h1>`;
      document.querySelector('.img-shadow').innerHTML = hello;
      document.querySelector('.welcome-block').style.display = 'none';

      localStorage.setItem('userName', JSON.stringify(event.target.value));
    }
  });
}

allWishes.forEach(wish => {
  createNewWish(wish.name, wish.id, wish.link, wish.price);
});

newWish.addEventListener('keydown', function(event) {
  if (event.keyCode === 13 && event.target.value) {
    const id = generateId();
    let wish = {name: this.value, id: id};
    allWishes.push(wish);

    createNewWish(this.value, id);

    newWish.value = '';
    setList(allWishes);
  }
});

wishArea.addEventListener('keydown', event => {
  const value = event.target.value;
  
  if (event.keyCode === 13 && value) {
    const li = event.target.closest('li');
    const id = li.getAttribute('list-id');
    const index = findIndex(id);

    if (event.target.matches('p.wish-price input')) addWishPrice(li, index, value);
    if (event.target.matches('input.wish-link')) addWishLink(li, index, value);
  }
});

wishArea.addEventListener('click', event => {
  const li = event.target.closest('li');
  const id = li.getAttribute('list-id');
  const index = findIndex(id);

  if (event.target.matches('img.deploy')) {
    if (li && li.className !== 'deployed') {
      li.className = 'deployed';
    } else {
      li.className = '';
    }
  }

  if (event.target.matches('img.edit')) editInput(li, index);
  if (event.target.matches('img.delete')) deleteLi(li, id);
});