const openMenu = document.getElementById('openMenu');
const imageOpenMenu = document.querySelector('.hamburgerMenu img');
const menu = document.getElementById('menu');

const openModal = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const allContentDiv = document.getElementById('allContentDiv');

const radioInputs = document.querySelectorAll('input[type="radio"]');
const modalOffers = document.querySelectorAll('.modalOffer');
const allOptions = document.querySelectorAll('.modalOffer');

const successModal = document.querySelector('.sucessModal');
const successModalBtn = document.querySelector('.sucessModal button');

const progressBar = document.querySelector('progress');

const bookmarkBtn = document.getElementById('bookmark');
const selectRewardBtns = document.querySelectorAll('.offer .primaryBtn');

const store = {
  goal: 1000000,
  products: [
    { name: 'bamboo-stand', stock: 101, minPledge: 25 },
    { name: 'black-edition-stand', stock: 64, minPledge: 75 },
    { name: 'mahogany-special-edition', stock: 0, minPledge: 200 },
  ],
  stats: {
    totalBackers: 5007,
    totalMoney: 89914,
    totalDays: 56,
  },
};

document.querySelectorAll(".disabled").forEach(el => {
  el.style.pointerEvents = "none";
});

document.querySelectorAll('input[type="number"]').forEach(input => {
  preventWritingLetters(input);
});

renderStats();

function scrollToModal() {
  const offset = window.innerWidth > 992 ? 0.19 : 0.10;
  window.scrollTo({
    top: window.innerHeight * offset,
    left: 0,
    behavior: 'smooth'
  });
}

function formatCurrency(num) {
  return `$${new Intl.NumberFormat(navigator.language).format(num)}`;
}

function preventWritingLetters(input) {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
}

function validateInput(input) {
  const min = parseInt(input.getAttribute("min"));
  const value = parseInt(input.value);
  return value >= min;
}

function renderStats() {
  document.getElementById('totalBackers').textContent =
    new Intl.NumberFormat().format(store.stats.totalBackers);

  document.getElementById('totalMoney').textContent =
    formatCurrency(store.stats.totalMoney);

  document.getElementById('totalDays').textContent =
    new Intl.NumberFormat().format(store.stats.totalDays);

  progressBar.max = store.goal;
  progressBar.value = store.stats.totalMoney;
}

function updateStats(input) {
  const value = parseInt(input.value);

  if (isNaN(value)) return;

  if (!validateInput(input)) return;

  store.stats.totalBackers += 1;
  store.stats.totalMoney += value;
  store.stats.totalDays -= 1;

  const product = store.products.find(p => p.minPledge == input.min);
  if (product && product.stock > 0) {
    product.stock -= 1;
  }

  renderStats();
}

function handleInputChange(input) {
  const selectedDiv = input.closest('.modalOffer');
  const form = selectedDiv.querySelector('form');

  document.querySelectorAll('.borderActive').forEach(el => {
    el.classList.remove('borderActive');
    const f = el.querySelector('form');
    if (f) f.classList.add('d-none');
  });

  selectedDiv.classList.add('borderActive');
  if (form) form.classList.remove('d-none');

  const pledgeInput = selectedDiv.querySelector('input[type="number"]');
  if (pledgeInput) {
    pledgeInput.value = pledgeInput.min;
    pledgeInput.focus();
  }
}

function dismissModal(targetModal) {
  targetModal.classList.add('d-none');
  allContentDiv.classList.remove('modalOpened');

  document.querySelectorAll('.borderActive').forEach(el => {
    el.classList.remove('borderActive');
    const f = el.querySelector('form');
    if (f) f.classList.add('d-none');
  });

  radioInputs.forEach(r => r.checked = false);
}

function openSuccessModal() {
  successModal.classList.remove('d-none');
  allContentDiv.classList.add('modalOpened');
}

openMenu.addEventListener('click', () => {
  imageOpenMenu.src = imageOpenMenu.src.includes('close')
    ? 'images/icon-hamburger.svg'
    : 'images/icon-close-menu.svg';

  menu.classList.toggle('menuHidden');
});

bookmarkBtn.addEventListener('click', () => {
  bookmarkBtn.classList.toggle('bookmarked');
});

openModal.addEventListener('click', () => {
  modal.classList.remove('d-none');
  allContentDiv.classList.add('modalOpened');
  scrollToModal();
});

closeModal.addEventListener('click', () => dismissModal(modal));

modal.addEventListener('click', (e) => {
  if (e.target === modal) dismissModal(modal);
});

selectRewardBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    modal.classList.remove('d-none');
    allContentDiv.classList.add('modalOpened');
    scrollToModal();

    const offer = modalOffers[index + 1];
    const radio = offer.querySelector('input[type="radio"]');
    radio.checked = true;
    handleInputChange(radio);
  });
});

modalOffers.forEach(offer => {
  offer.addEventListener('click', () => {
    const radio = offer.querySelector('input[type="radio"]');
    if (!radio) return;

    radio.checked = true;
    handleInputChange(radio);
  });
});

radioInputs.forEach(input => {
  input.addEventListener('change', () => handleInputChange(input));
});

allOptions.forEach(option => {
  const input = option.querySelector('input[type="number"]');
  const button = option.querySelector('form button');

  if (!button) return;

  button.addEventListener('click', (e) => {
    e.preventDefault();

    if (!input || input.value === "") return;

    updateStats(input);

    dismissModal(modal);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    openSuccessModal();
  });
});

successModalBtn.addEventListener('click', () => {
  dismissModal(successModal);
});