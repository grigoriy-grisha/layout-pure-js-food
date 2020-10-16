//Declaration of variables

const kurerHeaderCity = document.querySelector('.kurer-header-city'),
		kurerHeaderList = document.querySelector('.kurer-header-list');


const requestForm =	document.querySelector('.card-request-form'),
		inputName =	document.querySelector('.input-def-name'),
		inputNumber = document.querySelector('.input-def-number'),
		cardRequestButton = document.querySelector('.card-request-button'),
		cardRequestForm = document.querySelector('.card-request-form'),
		titleInput = document.querySelectorAll('.label-title-def'),
		courierCity = document.querySelector('.courier-city');

const regExpLatin = /[A-Za-z0-9]/g;
const regExpNum = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/g;




//Declaration of functionс
const visibleOrUnvisibleDropdown = (event, el) => {

	if(el.classList.contains('dropdown-is-open')){
		el.classList.remove('dropdown-is-open');
	}else {
		el.classList.add('dropdown-is-open');
	}
};





//Using
kurerHeaderCity.addEventListener('click' , () => {
	visibleOrUnvisibleDropdown(event, kurerHeaderList);
});


requestForm.addEventListener('submit', (event) => {
	event.preventDefault();
	
	let courierInformation = {
		name: inputName.value,
		number: inputNumber.value,
		city: courierCity.textContent,
	};

	if(inputName.length < 2  || !(inputNumber.value.length === 12) ||
		inputName.value.match(regExpLatin) || !(inputNumber.value.match(regExpNum))) {

		for (let i = 0; i < titleInput.length; i++) {
			titleInput[i].classList.add('label-title-def-error');
		}
		inputName.classList.add('input-def-error');
		inputNumber.classList.add('input-def-error');

	}else {
		for (let i = 0; i < titleInput.length; i++) {
			titleInput[i].classList.remove('label-title-def-error');
		}
		inputName.classList.remove('input-def-error');
		inputNumber.classList.remove('input-def-error');
		console.log(courierInformation);
	} 


	inputName.value = '';
	inputNumber.value = '+7'


});



