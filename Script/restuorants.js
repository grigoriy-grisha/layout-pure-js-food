window.onload = () => {
	getData(CITY_API, (data) => {
		city = JSON.parse(data);
		console.log(city);
	});
	rememberCity();
}
//Declaration of variables

const partnersCardJoin = document.querySelector('#card-join');

const modalWindowRestuorant = document.querySelector('.modal-restuorant');

const closeRestuorant = document.querySelector('.modal-close-restuorant');

const formsFilling = document.querySelector('.filling-for-restaurants'),
		inputsTabs = document.querySelectorAll('.input-def'),

		labelTitleContactInformation = document.querySelectorAll('.label-title-def-contact-information'),
		labelTitleAboutRestaurants = document.querySelectorAll('.label-title-def-about-restaurants'),
		labelTextAboutRestaurants = document.querySelectorAll('.label-text-def-about-restaurants'),

		labelText = document.querySelectorAll('.label-text-def'),
		labelTextDelivery = document.querySelectorAll('.label-text-def-delivery'),


		radioButtons = document.querySelectorAll('.radio-def'),

		checkboxButtons = document.querySelectorAll('.checkbox-def'),

		inputName = document.querySelector('.input-def-name'),
		inputPhone = document.querySelector('.input-def-phone'),
		inputEmail = document.querySelector('.input-def-email'),

		radioOneRestaurants = document.querySelector('.radio-def-one'),
		radioMoreRestaurants = document.querySelector('.radio-def-more'),
		inputNameRestaurants = document.querySelector('.input-def-nameRestaurants'),
		inputCity = document.querySelector('.input-def-city'),
		inputWebSite = document.querySelector('.input-def-webSite'),
		inputAddress = document.querySelector('.input-def-address'),
		
		checkboxOwn = document.querySelector('.checkbox-def-own'),
		checkboxneedDelivery = document.querySelector('.checkbox-def-needDelivery'),
		checkboxTakeaway = document.querySelector('.checkbox-def-takeaway'),
		inputComment = document.querySelector('.input-def-comment');






 

const regExpLatin = /[A-Za-z0-9]/g;
const regExpNum = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/g;


// поиск городов
let cityinfo;
const inputAdressDropdown = document.querySelector('.input-adress-dropdown');
const CITY_API = 'JSON/russia.json'
let hasCity;
//Function

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

const addModalWindow = (event,el) => {
	el.classList.add('modal-is-open');
};


const removeModalWindow = (event,el) => {
	el.classList.remove('modal-is-open');
};
const validationOneBlock = () => {
	//проверка первого блока
	if(inputName.length < 2  || !(inputPhone.value.length === 12) ||
		inputName.value.match(regExpLatin) || !(inputPhone.value.match(regExpNum))) {

		for (let i = 0; i < labelTitleContactInformation.length; i++) {
			labelTitleContactInformation[i].classList.add('label-title-def-error');
		}
		inputName.classList.add('input-def-error');
		inputPhone.classList.add('input-def-error');
		inputEmail.classList.add('input-def-error');

		return false;

	}else {
		for (let i = 0; i < labelTitleContactInformation.length; i++) {
			labelTitleContactInformation[i].classList.remove('label-title-def-error');
		}
		inputName.classList.remove('input-def-error');
		inputPhone.classList.remove('input-def-error');
		inputEmail.classList.remove('input-def-error');
		return true;
	}

};

const validationTwoBlock = () => {
	// валидация второго блока
	if(inputNameRestaurants.length < 2 || !(radioOneRestaurants.checked || radioMoreRestaurants.checked) ||
		inputNameRestaurants.value.match(regExpLatin) || inputCity.value.match(regExpLatin) ||
		!inputCity.value || !inputAddress.value){

		for (let i = 0; i < labelTextAboutRestaurants.length; i++) {
			labelTextAboutRestaurants[i].classList.add('label-text-def-error');
		}

		for (let i = 0; i < labelTitleAboutRestaurants.length; i++) {
			labelTitleAboutRestaurants[i].classList.add('label-text-def-error');
		}

		inputNameRestaurants.classList.add('input-def-error');
		inputCity.classList.add('input-def-error');
		inputAddress.classList.add('input-def-error');

		return false;
	} else {
		for (let i = 0; i < labelTextAboutRestaurants.length; i++) {
			labelTextAboutRestaurants[i].classList.remove('label-text-def-error');
		}

		for (let i = 0; i < labelTitleAboutRestaurants.length; i++) {
			labelTitleAboutRestaurants[i].classList.remove('label-text-def-error');
		}

		inputNameRestaurants.classList.remove('input-def-error');
		inputCity.classList.remove('input-def-error');
		inputAddress.classList.remove('input-def-error');
		return true;
	}

};

const validationThreeBlock = () => {
	// валидация третьего блока
	if(!(checkboxOwn.checked || checkboxneedDelivery.checked || checkboxTakeaway.checked)) {
		for (let i = 0; i < labelTextDelivery.length; i++) {
			labelTextDelivery[i].classList.add('label-text-def-error');
		}
		return false;
	}else {
		for (let i = 0; i < labelTextDelivery.length; i++) {
				labelTextDelivery[i].classList.remove('label-text-def-error');
		}

		return true;

	}
};

const validationForm = (event) => {
	event.preventDefault();

	//объект дял вывода в консоль
	let restaurantInformation = {
		contactInformation: {
			name: inputName.value,
			phone: inputPhone.value,
			email: inputEmail.value,
		},
		aboutOfRestuarants: {
			oneRestuarants: radioOneRestaurants.checked ? radioOneRestaurants.value : '0',
			moreRestuarants: radioMoreRestaurants.checked ? radioMoreRestaurants.value : '0',
			name:inputNameRestaurants.value,
			city: inputCity.value,
			webSite:inputWebSite.value,
			address: inputAddress.value,
		},
		delivery: {
			own:  checkboxOwn.checked ? checkboxOwn.value : '0',        
			needDelivery: checkboxneedDelivery.checked ? checkboxneedDelivery.value : '0',    
			takeaway: checkboxTakeaway.checked ? checkboxTakeaway.value : '0',
		},
		comment: inputComment.value,
	
	};
	let oneBlock = validationOneBlock();
	let twoBlock = validationTwoBlock();
	let threeBlock = validationThreeBlock();

	if(oneBlock && twoBlock && threeBlock) {
		console.log(restaurantInformation);
	}

}

// поиск городов 
const showCity = (event) => {
	inputAdressDropdown.textContent = '';

	if (inputCity.value !== '') {
		const filterCity = city.filter( (item) => {
			if (item.city) {
				const fixCity = item.city.toLowerCase();
				return fixCity.startsWith(inputCity.value.toLowerCase());
			}		
		});

		filterCity.forEach( (item) => {
			const li = document.createElement('li');
			li.classList.add('input-adress-dropdown-item');
			li.textContent = item.city;
			inputAdressDropdown.append(li);
		});

	}
}

const handlerCity = (event) => {
	const target = event.target;
	
	if(target.tagName.toLowerCase() === 'li') {
		inputCity.value = target.textContent;
		inputAdressDropdown.textContent = '';
		let objectCity = {
			city: inputCity.value,
		}
		localStorage.setItem('city', JSON.stringify(objectCity))
		rememberCity();
	}
	
};
const rememberCity = () => {
	if(localStorage.getItem('city')) {
		hasCity = JSON.parse(localStorage.getItem('city'));
	}
	if(hasCity) {
		inputCity.value = hasCity['city'];
	}
};




//Using
partnersCardJoin.addEventListener('click', () => {
	addModalWindow(event, modalWindowRestuorant) 
});
closeRestuorant.addEventListener('click', () => {
	removeModalWindow(event, modalWindowRestuorant)
});
modalWindowRestuorant.addEventListener('click', (event) => {
	if(event.target.classList.contains('modal-restuorant')) {
		removeModalWindow(event, modalWindowRestuorant)
	}
});


formsFilling.addEventListener('submit', () => {
	validationForm(event);

});
inputCity.addEventListener('input', () => {
	showCity(event)
});
inputAdressDropdown.addEventListener('click', (event) => {
	handlerCity(event)
});