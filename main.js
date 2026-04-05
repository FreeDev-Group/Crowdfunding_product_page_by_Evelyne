// Variables and DOM element selectors
const openMenu = document.getElementById('openMenu');
const imageOpenMenu = document.querySelector('.humbergerMenu img');
const menu = document.getElementById('menu');
const openModal = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const allContentDiv = document.getElementById('allContentDiv');
const radioInputs = document.querySelectorAll('input[type="radio"]');
const successModal = document.querySelector('.sucessModal');
const successModalBtn = document.querySelector('.sucessModal button');
const modalOffers = document.querySelectorAll('.modalOffer');
const progressBar = document.querySelector('progress');
const allOptions = document.querySelectorAll('.modalOffer');

// Store data
const store = {
  products: [
    {
      name: 'bamboo-stand',
      stock: 101,
      minPledge: 25,
    },
    {
      name: 'black-edition-stand',
      stock: 64,
      minPledge: 75,
    },
    {
      name: 'mahogany-special-edition',
      stock: 0,
      minPledge: 200,
    },
  ],
  stats: {
    totalBackers: 5007,
    totalMoney: 89914,
    totalDays: 56,
  },
};

// Disable pointer events for elements with the "disabled" class
document.querySelectorAll(".disabled").forEach(element => {
  element.style.pointerEvents = "none";
});

// Event listener for opening/closing the menu
openMenu.addEventListener('click', () => {
  // Toggle the menu icon
  if (imageOpenMenu.src.includes('images/icon-close-menu.svg')) {
    imageOpenMenu.src = 'images/icon-hamburger.svg';
  } else {
    imageOpenMenu.src = 'images/icon-close-menu.svg';
  }
  menu.classList.toggle('menuHidden');
});

// Event listener for opening the modal
openModal.addEventListener('click', () => {
  modal.classList.remove('d-none');
  allContentDiv.classList.add('modalOpened');

  // Scroll to a specific position based on window width
  if (window.innerWidth > 992) {
    window.scrollTo({
      top: window.innerHeight * 0.19,
      left: 0,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo({
      top: window.innerHeight * 0.10,
      left: 0,
      behavior: 'smooth'
    });
  }
});

// Event listener for closing the modal
closeModal.addEventListener('click', () => {
  dismissModal(modal);
});

// Event listeners for selecting an offer in the modal
modalOffers.forEach((offer) => {
  offer.addEventListener('click', () => {
    const radioInput = offer.querySelector('input[type="radio"]');
    radioInput.checked = true;
    handleInputChange(radioInput);
  });
});

// Event listeners for radio button changes in the modal
radioInputs.forEach((input) => {
  if (input.checked) {
    handleInputChange(input);
  }
  input.addEventListener('change', () => {
    handleInputChange(input);
  });
});

// Function to handle changes when a radio button is selected
function handleInputChange(input) {
  const selectedDiv = input.parentNode.parentNode;
  const form = selectedDiv.querySelector('form');
  const previousSelectedDivs = document.querySelectorAll('.borderActive');

  // Deactivate previously selected offers and forms
  previousSelectedDivs.forEach((previousSelected) => {
    const previousSelectedDivForm = previousSelected.querySelector('form');
    previousSelected.classList.remove('borderActive');
    previousSelectedDivForm.classList.add('d-none');
  });

  // Activate the selected offer and form
  selectedDiv.classList.toggle('borderActive', input.checked);
  form.classList.remove('d-none');
}

// Event listener for submitting the form
allOptions.forEach((option) => {
  const input = option.querySelector('input[type="number"]');
  const buttonSubmit = option.querySelector('button');
  buttonSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    updateStats(input);
    dismissModal(modal);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    openSuccessModal();
  });
});

// Event listener for closing the success modal
successModalBtn.addEventListener('click', () => {
  dismissModal(successModal);
});

// Function to open the success modal
function openSuccessModal() {
  successModal.classList.remove('d-none');
  allContentDiv.classList.add('modalOpened');
}


// Function to dismiss the modal
function dismissModal(modal) {
  modal.classList.add('d-none');
  allContentDiv.classList.remove('modalOpened');
  document.querySelectorAll('.borderActive').forEach((previousSelected) => {
    const previousSelectedDivForm = previousSelected.querySelector('form');
    previousSelected.classList.remove('borderActive');
    previousSelectedDivForm.classList.add('d-none');
  });
  radioInputs.forEach((input) => {
    input.checked = false;
  });
}

// Function to format currency
function formatCurrency(num) {
  const formattedNum = new Intl.NumberFormat(navigator.language).format(num);
  return `$${formattedNum}`;
}

// Function to prevent non-numeric input
function preventWritingLetters(input) {
  input.addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
}

// Function to validate user input
function validateInput(input) {
  const minPledge = input.getAttribute("min");
  const value = input.value;
  if (value < minPledge) {
    return false;
  } else if (value > minPledge) {
    return true;
  }
}

// Function to render statistics on the page
function renderStats() {
  const totalBackersElement = document.getElementById('totalBackers');
  const totalMoneyElement = document.getElementById('totalMoney');
  const totalDaysElement = document.getElementById('totalDays');
  totalBackersElement.textContent = store.stats.totalBackers;
  totalMoneyElement.textContent = formatCurrency(store.stats.totalMoney);
  totalDaysElement.textContent = store.stats.totalDays;
}

// Initial rendering of statistics
renderStats();

// Function to update statistics when a user makes a pledge
function updateStats(input) {
  progressBar.setAttribute('value', store.stats.totalMoney);
  preventWritingLetters(input);
  const isValid = validateInput(input);
  console.log(isValid);
  if (isValid) {
    store.stats.totalBackers++;
    console.log(store.stats.totalMoney);
    console.log(input.value);
    store.stats.totalMoney += input.value;

    renderStats();
  } else {
    console.error("Invalid input");
  }
}