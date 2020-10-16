//функция ,котоаря ждет полной загрузки окна 
//и создает карты и корзину
window.onload = () => {
	getData(JSONFOOD , (data)  => {
	
		let getObj = JSON.parse(data)
		for(let i = 0; i < getObj.length; i++) {
			cardInfo = getObj[i].cormorantPizza.restuant
			restInfo = getObj[i].cormorantPizza
		}
		console.log(restInfo);
		console.log(cardInfo);
		createRestauranHeading(restInfo);
		createCard(cardInfo);
		cheakCard();
		createCardBasket();
		rememberUser();	
	});
	getData(CITY_API, (data) => {
		cityinfo = JSON.parse(data).result;
		console.log(cityinfo);
	});
	rememberStreet();
};

// Declaration 0f variables
const basketButton = document.querySelector('#card-basket');
const loginButton = document.querySelector('#card-login');


const modalWindowBasket = document.querySelector('.modal-basket');
const modalWindowLogin  = document.querySelector('.modal-login');
const modalFooterPrice = document.querySelector('.modal-footer-price');
const modalConfirmOrder = document.querySelector('.modal-confirm-order');


const restaurantHeading = document.querySelector('.restaurant-heading');
const cardsSection = document.querySelector('.cards-section')

const closeBasket = document.querySelector('.modal-close-basket');
const closeLogin = document.querySelector('.modal-close-login');
const modalcloseConfirmOrder = document.querySelector('.modal-close-confirm-order');

const inputNumber = document.querySelector('.input-def-number');

const formNumberPhone = document.querySelector('.form-number-phone');
const titleInput = document.querySelector('.label-title-def');

const modalBasketBody = document.querySelector('.modal-basket-body');
const formBasket = document.querySelector('.form-basket');
const buttonSubmit = document.querySelector('.button-primary-submit');
const buttonCancel = document.querySelector('.button-cancel');


// переменные дял поиска городов
const inputAdress = document.querySelector('.input-adress');
const inputAdressDropdown = document.querySelector('.input-adress-dropdown');
const CITY_API = 'JSON/api.json'
let hasStreet;



let cityinfo = [];



// регуляторные выражения
const regExpNum = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/g;
 
const JSONFOOD = '/JSON/basket.json';

let totalPrice = '';
let cardBasket = '';
let sum = 0 ;
let multi = 0;
let RESTHEADING = '';

let cardInfo = {};
let restInfo = {};
let basketId = {};
let numberUser;


// получение JSON файлов
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
//откртыие и закрытие модаьного окна
const addModalWindow = (event,el) => {
	el.classList.add('modal-is-open');
};
const removeModalWindow = (event,el) => {
	el.classList.remove('modal-is-open');
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
// создание информации о рестоарне
const createRestauranHeading = (data) => {

	RESTHEADING = `
		<h2 class="restaurant-title">${data.title}</h2>
			<div class="info">
			<div class="reating">${data.reating}</div>
			<div class="price">${data.cost}</div>
			<div class="danie">${data.danie}</div>
		</div>
		`
	restaurantHeading.insertAdjacentHTML('afterbegin', RESTHEADING);
	
}

//создание карточек ,при получении JSON файлов 
const createCard = (data) => {

	
	let deep = '';
	for (let key in data) {
		deep = `  
		<div class="card-item wow fadeInUp "data-wow-delay="0.15s">
			<img src="${data[key].image}" alt="pizzaPlus" class="card-image">
			<div class="card-title">
				<h3 class="card-text">${data[key].names}</h3>
			</div>
			<div class="card-info">
				<div class="card-descrition">${data[key].description}</div>
				<button data-articul="${key}" class="button button-into-the-basket">
					В Корзину
					<img src="img/whitebasket.svg" alt="Shopping-cart" class="button-icon">
				</button>
				<div class="card-price">${data[key].price}₽</div>
			</div>
		</div>
	`
		cardsSection.insertAdjacentHTML('afterbegin', deep);
	}	
	
	const cardItem = document.querySelectorAll('.card-item');
	// внутри этой функции для всех кнопок устанавливаются прослушиватели с помощью делегироанния 
	cardItem.forEach((item) => {item.addEventListener('click', () => {
			addCard(event);
			modalBasketBody.textContent = '';
		
			createCardBasket();

		})
	});


};

//добавление значений продуктов в localStorage

const addCard = (event) => {
	let arcticul = event.target.getAttribute('data-articul');
	if (!arcticul)return;
	basketId[arcticul] = 1;
	localStorage.setItem('basket', JSON.stringify(basketId))
}
// првоерка на присутствие корзины в localStorage и получение ее
const cheakCard = () => {
	if(localStorage.getItem('basket')) {
		basketId = JSON.parse(localStorage.getItem('basket'));
	}
	

};
// сбор всех данных о ценах количествах продуктов и отправка их на 'сервер'
const formSubmission = (event) => {
	if(!localStorage.getItem('numberUser')) {
		addModalWindow(event, modalWindowLogin);
	}
	let userOrder = {
		number: numberUser['number'],
		sum: multi,
		grocerList: basketId,
		restuarant: restInfo.title,
	
	};
	if(localStorage.getItem('basket')) {
			localStorage.removeItem('basket');
		for (let key in basketId) {
			delete basketId[key];
		}
		modalBasketBody.textContent = '';		
		createCardBasket();
		console.log(userOrder);
		addModalWindow(event, modalConfirmOrder);
		
	}	
}
// кнопка отмены очищение всего
const deleteForm = (event) => {
		
	localStorage.removeItem('basket');
	for (let key in basketId) {
		delete basketId[key];
	}
	modalBasketBody.textContent = '';		
	createCardBasket();
	removeModalWindow(event, modalWindowBasket)
}


// создание карточек корзины с данными ценой и количеством
const createCardBasket = () => {
	
	totalPrice = '';
    cardBasket = '';
	sum = 0 ;
	multi = 0;
	for (let key in basketId) {

		 if (typeof cardInfo[key] !== "undefined") {

			sum = cardInfo[key].price * basketId[key]
			multi += sum;
			cardBasket =  `
				<div class="food-row">
					<span class="food-name">${cardInfo[key].names}</span>
					<strong class="food-price">${sum}₽</strong>			
					<div class="food-counter">
						<button class="counter-button counter-button-minus" data-articul="${key}">-</button>
						<span class="counter"> ${basketId[key]} </span>
						<button class="counter-button counter-button-plus" data-articul="${key}">+</button>
					</div>
				</div>
			`
		

			modalBasketBody.insertAdjacentHTML('afterbegin', cardBasket);


			totalPrice = `	
				<div class="footer-price">${multi} ₽</div>	
			`;
		
		 }
			
		
	};
	// удаление всех итоговых цен
	for(let i = 0; i < modalFooterPrice.children.length; i++ ) {
		modalFooterPrice.children[i].remove();
	}

	modalFooterPrice.insertAdjacentHTML('afterbegin', totalPrice);

	//объявление кнопок минус плюс
	const counterButtonMinus = document.querySelectorAll('.counter-button-minus'),
			counterButtonPlus = document.querySelectorAll('.counter-button-plus');

		// функционал для плюса
			counterButtonPlus.forEach( (item) => {item.addEventListener( 'click', ( event ) => {
				let arcticul = event.target.getAttribute('data-articul');
				if (!arcticul)return;
				modalBasketBody.textContent = '';
				basketId[arcticul]++
				createCardBasket();
				localStorage.setItem('basket', JSON.stringify(basketId))
			
			})
		});
		// функционал для минуса
		counterButtonMinus.forEach( (item) => {item.addEventListener( 'click', ( event ) => {
				let arcticul = event.target.getAttribute('data-articul');
				if (!arcticul)return;
				modalBasketBody.textContent = '';
				if( basketId[arcticul] !== 1) {
					basketId[arcticul]--;
				}
				else {
					delete basketId[arcticul];	
				}
				createCardBasket();
				localStorage.setItem('basket', JSON.stringify(basketId))
			
			})
		});

}



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
basketButton.addEventListener('click', () => {
	addModalWindow(event, modalWindowBasket) 
});
closeBasket.addEventListener('click', () => {
	removeModalWindow(event, modalWindowBasket)
});
loginButton.addEventListener('click', () => {
	addModalWindow(event, modalWindowLogin) 
});
closeLogin.addEventListener('click', () => {
	removeModalWindow(event, modalWindowLogin)
});
modalcloseConfirmOrder.addEventListener('click', () => {
	removeModalWindow(event, modalConfirmOrder)
});
modalWindowLogin.addEventListener('click', (event) => {
	if(event.target.classList.contains('modal-login')) {
		removeModalWindow(event, modalWindowLogin);
	}
});
modalWindowBasket.addEventListener('click', (event) => {
	if(event.target.classList.contains('modal-basket')) {
		removeModalWindow(event, modalWindowBasket);
	}
});
modalConfirmOrder.addEventListener('click', (event) => {
	if(event.target.classList.contains('modal-confirm-order')) {
		removeModalWindow(event, modalConfirmOrder);
	}
});

// форма для номера
formNumberPhone.addEventListener('submit', () => {
	UserLogIn(event);
	removeModalWindow(event, modalWindowLogin);
});

// сбор всех данных о ценах количествах продуктов и отправка их на 'сервер'
buttonSubmit.addEventListener('click', (event) => {
	formSubmission(event);
});
// кнопка отмены отчищение всего
buttonCancel.addEventListener('click', (event) => {
	deleteForm(event);
})

inputAdress.addEventListener('input', (event) => {
	showCity(event);
});
inputAdressDropdown.addEventListener('click', (event) => {
	handlerCity(event)
});



//Animation
new WOW().init();