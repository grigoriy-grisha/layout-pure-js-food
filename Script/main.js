//modal window

window.onload = () => {
	getData(JSONFOOD , (data)  => {
		let getObj = JSON.parse(data)
		for(let i = 0; i < getObj.length; i++) {
		
			restInfo = getObj[i]
		}
		rememberUser();
		createCardResuarant(restInfo);
	});

	getData(CITY_API, (data) => {
		cityinfo = JSON.parse(data).result;
		console.log(cityinfo);
	});
	rememberStreet();
};


// Declaration 0f variables

const loginButton = document.querySelector('#card-login');


const modalWindowLogin  = document.querySelector('.modal-login');

const cardsSection = document.querySelector('.cards-section');

const closeBasket = document.querySelector('.modal-close-basket');
const closeLogin = document.querySelector('.modal-close-login');

const closeSupport= document.querySelector('.modal-close-support');

const inputNumber = document.querySelector('.input-def');
const inputSearch = document.querySelector('.input-search');

const formNumberPhone = document.querySelector('.form-number-phone');
const titleInput = document.querySelector('.label-title-def');

const support = document.querySelector('.support');
const modalSupport = document.querySelector('.modal-support');
const operatorBlock = document.querySelector('.operator-block');
 
const regExpNum = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/g;

const JSONFOOD = '/JSON/basket.json';

// поиск адреса
const inputAdress = document.querySelector('.input-adress');
const inputAdressDropdown = document.querySelector('.input-adress-dropdown');
const CITY_API = 'JSON/api.json'
let hasStreet;


let cityinfo = [];


//Передвижение окна Support
let draggetItem = null;




let numberUser;

let restInfo = [];

let RESTСARD = '';

let internalDNDType = 'text/x-example';

// получение данныих из JSON файла
const getData = (url, callback) => {
	const request = new XMLHttpRequest();

	request.open('GET', url);

	request.addEventListener('readystatechange', () => {

		if (request.readyState !== 4) return; 

		if(request.status === 200) {
			callback(request.response);
		}else {
			console.error(request.status);
		}
	});

	request.send();
};

//Function
const addModalWindow = (event,el) => {
	el.classList.add('modal-is-open');
};


const removeModalWindow = (event,el) => {
	el.classList.remove('modal-is-open');
};

const createCardResuarant = (data) => {

	for(let key in data) {
		RESTСARD = `
		<a href="${data[key].href}" class="card-item wow fadeInUp" data-wow-delay="0.15s">
			<img src="${data[key].image}" alt="pizzaPlus" class="card-image">
			<div class="card-title">
				<h3 class="card-text">${data[key].title}</h3>
				<div class="card-time">${data[key].time}</div>
			</div>
			<div class="card-info">
				<div class="card-reating">${data[key].reating}</div>
				<div class="card-price">${data[key].cost}</div>
				<div class="card-danie">${data[key].danie}</div>
			</div>
		</a>
		`;
		cardsSection.insertAdjacentHTML('afterbegin', RESTСARD);
	}
};

// валидация при вводе номера телефона во вкладке войти если номер введен неправильно,то поле загорается красным
let UserLogIn = (event) => {
	event.preventDefault();
	
	let UserPhone = {
		number: inputNumber.value,
	};


	if(!(inputNumber.value.length === 12) || !(inputNumber.value.match(regExpNum))) {
		titleInput.classList.add('label-title-def-error');
		inputNumber.classList.add('input-def-error');
		

	}else {
		titleInput.classList.remove('label-title-def-error');
		inputNumber.classList.remove('input-def-error');
		localStorage.setItem('numberUser', JSON.stringify(UserPhone))
		rememberUser();
	}
};


// запись  номера в localStorage, для использования между окнами
const rememberUser = () => {
	if(localStorage.getItem('numberUser')) {
		numberUser = JSON.parse(localStorage.getItem('numberUser'));
	}
	if(numberUser) {
		inputNumber.value = numberUser["number"];
	}
	
} 



const dragModalWindow = (event) => {

	let shiftX = event.clientX - modalSupport.getBoundingClientRect().left;
	let shiftY = event.clientY - modalSupport.getBoundingClientRect().top;
	
  
	modalSupport.style.position = 'absolute';
	modalSupport.style.zIndex = 1000;
  
	moveAt(event.pageX, event.pageY);
  
	// переносит мяч на координаты (pageX, pageY),
	// дополнительно учитывая изначальный сдвиг относительно указателя мыши
	function moveAt(pageX, pageY) {
		modalSupport.style.left = pageX - shiftX + 'px';
		modalSupport.style.top = pageY - shiftY + 'px';
	
  
	}
  
	function onMouseMove(event) {
	  moveAt(event.pageX, event.pageY);
	}
  

	document.addEventListener('mousemove', onMouseMove);
  
	modalSupport.addEventListener('mouseup', () => {
		document.removeEventListener('mousemove', onMouseMove);
		modalSupport.onmouseup = null;
	  });

	
	modalSupport.ondragstart = function() {
		return false;
	}
};
// поиск городов 
const showCity = (event) => {
	inputAdressDropdown.textContent = '';

	if (inputAdress.value !== '') {
		const filterCity = cityinfo.filter( (item) => {
			if (item.name) {
				const fixCity = item.name.toLowerCase();
				return fixCity.includes(inputAdress.value.toLowerCase());
			}		
		});

		filterCity.forEach( (item) => {
			const li = document.createElement('li');
			li.classList.add('input-adress-dropdown-item');
			li.textContent = item.name;
			inputAdressDropdown.append(li);
		});

	}
}

const handlerCity = (event) => {
	const target = event.target;
	
	if(target.tagName.toLowerCase() === 'li') {
		inputAdress.value = target.textContent;
		inputAdressDropdown.textContent = '';
		let objectStreet = {
			street: inputAdress.value,
		}
		localStorage.setItem('street', JSON.stringify(objectStreet))
		rememberStreet();
	}
	
};
const rememberStreet = () => {
	if(localStorage.getItem('street')) {
		hasStreet = JSON.parse(localStorage.getItem('street'));
	}
	if(hasStreet) {
		inputAdress.value = hasStreet['street'];
	}
};
//Using

loginButton.addEventListener('click', () => {
	addModalWindow(event, modalWindowLogin) 
});
closeLogin.addEventListener('click', () => {
	removeModalWindow(event, modalWindowLogin)
});
support.addEventListener('click', () => {
	addModalWindow(event, modalSupport);
});
closeSupport.addEventListener('click', () => {
	removeModalWindow(event, modalSupport);
});
// форма для номера
formNumberPhone.addEventListener('submit', () => {
	UserLogIn(event)
});
 // перевдижение модального окна support
operatorBlock.addEventListener('mousedown', () => {
	dragModalWindow(event);	
});
modalWindowLogin.addEventListener('click', (event) => {
	if(event.target.classList.contains('modal-login')) {
		removeModalWindow(event, modalWindowLogin);
	}
});
//  посик и установка города

inputAdress.addEventListener('input', (event) => {
	showCity(event);
});
inputAdressDropdown.addEventListener('click', (event) => {
	handlerCity(event)
});

//Animation
new WOW().init();