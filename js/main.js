const dataBase = JSON.parse(localStorage.getItem('awito')) || [];
let counter = dataBase.length

const btnAdd = document.querySelector('.add__ad')
const modalAdd = document.querySelector('.modal__add')
const modalItem = document.querySelector('.modal__item')
const modalBtnSubmit = document.querySelector('.modal__btn-submit')
const modalSubmit = document.querySelector('.modal__submit')
const catalog = document.querySelector('.catalog')
const modalBtnWarning = document.querySelector('.modal__btn-warning')
const modalFileInput = document.querySelector('.modal__file-input')
const modalFileBtn = document.querySelector('.modal__file-btn')
const modalImageAdd = document.querySelector('.modal__image-add')
const searchInput = document.querySelector('.search__input')
const menuContainer = document.querySelector('.menu__container')
const body = document.querySelector('body')

const modalImageItem = document.querySelector('.modal__image-item'),
      modalHeaderItem = document.querySelector('.modal__header-item'),
      modalStatusItem = document.querySelector('.modal__status-item'),
      modalDescriptionItem = document.querySelector('.modal__description-item'),
      modalCostItem = document.querySelector('.modal__cost-item');

const infoPhoto = {}

const textFileBtn = modalFileBtn.textContent
const srcModalImage = modalImageAdd.src


//* Получаем все элементы из формы

const elementsModalSubmit = [...modalSubmit.elements]
     .filter(elem =>  elem.tagName !== 'BUTTON' && elem.type !== 'submit')

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

// * Валидация формы

function checkForm() {
    const validForm = elementsModalSubmit.every(elem => elem.value)
    modalBtnSubmit.disabled = !validForm
    modalBtnWarning.style.display = validForm ? 'none' : ''
}

// *  Закрытие модалок

function closeModal(event) {
    const keyName = event.key;
    const target = event.target
    if (target.classList.contains('modal__close') ||
        target.classList.contains('modal')||
        keyName === 'Escape') {

            modalAdd.classList.add('hide')
            modalItem.classList.add('hide')
            body.removeEventListener('keydown', closeModal);
            modalSubmit.reset()
            modalImageAdd.src = srcModalImage
            modalFileBtn.textContent = textFileBtn
            checkForm()
    }
}

// * Рендер карточек

function renderCard(DB = dataBase) {
    catalog.textContent = ''

    DB.forEach((item) => {
        catalog.insertAdjacentHTML("beforeend", `
            <li class="card" data-id="${item.id}">
                <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} ₽</div>
                </div>
            </li>
        `)
    })
}


// * Обработчики событий

// * Показ модалок

catalog.addEventListener('click', (event) => {
    const target = event.target
    const card = target.closest('.card')

    if (card) {

        const item = dataBase.find(obj => obj.id === +card.dataset.id)

        modalImageItem.src = `data:image/jpeg;base64,${item.image}`
        modalHeaderItem.textContent = item.nameItem
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У'
        modalDescriptionItem.textContent = item.descriptionItem
        modalCostItem.textContent = item.costItem

        modalItem.classList.remove('hide')
        body.addEventListener('keydown', closeModal);
    }
})

btnAdd.addEventListener('click', (event) => {
    modalAdd.classList.remove('hide')
    modalBtnSubmit.disabled = true
    body.addEventListener('keydown', closeModal);
})


modalFileInput.addEventListener('change', event => {
    const target = event.target

    const reader = new FileReader()
    const file = target.files[0]

    infoPhoto.filename = file.name
    infoPhoto.size = file.size

    reader.readAsBinaryString(file)

    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
            modalFileBtn.textContent = infoPhoto.filename
            infoPhoto.base64 = btoa(event.target.result)
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`
        } else {
            modalFileBtn.textContent = 'Размер файла не должен превышать 200кб'
            modalFileInput.value = ''
            checkForm()
        }
    })
})

// * Отправка формы

modalSubmit.addEventListener('input', checkForm)


// * Поиск по объявлениям

searchInput.addEventListener('input', () => {

    const value = searchInput.value.trim().toLowerCase()

    if (value.length > 2) {
        const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(value) ||
                                       item.descriptionItem.toLowerCase().includes(value))
        renderCard(result)
    }
})

// * Добавление данных о товаре при подаче объявления

modalSubmit.addEventListener('submit', (event) => {
    event.preventDefault()

    const itemObj = {}
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value
    }
    itemObj.id = counter++
    itemObj.image = infoPhoto.base64
    dataBase.push(itemObj)
    closeModal({target: modalAdd})
    saveDB()
    renderCard()
})

menuContainer.addEventListener('click', event => {
    const target = event.target
    console.log(target.dataset.category)
    if (target.tagName === 'A') {
        const result = dataBase.filter(item => item.category === target.dataset.category)

        renderCard(result)
    }
})

modalAdd.addEventListener('click', closeModal)
modalItem.addEventListener('click', closeModal)



renderCard()