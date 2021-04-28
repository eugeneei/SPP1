class ApiHelper {
    constructor(url) {
        this.url = url;
    }

    async getDishes() {
        const url = `${this.url}/dishes`; 

        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        const dishes = await fetch(url, requestOptions)
            .then(response => response.json())
            .catch(error => console.log('error', error));

        return dishes;
    }

    async addDish(name, description, weight, cost) {
        const url = `${this.url}/dishes`; 

        const body = JSON.stringify({
            name,
            description,
            weight,
            cost
        });

        const requestOptions = {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        };

        await fetch(url, requestOptions)
            .catch(error => console.log('error', error));
    }

    async editDish(id, name, description, weight, cost) {
        const url = `${this.url}/dishes`; 

        const body = JSON.stringify({
            id,
            name,
            description,
            weight,
            cost
        });

        const requestOptions = {
            method: 'PUT',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        };

        await fetch(url, requestOptions)
            .catch(error => console.log('error', error));
    }

    async deleteDish(id) {
        const url = `${this.url}/dishes`; 

        const body = JSON.stringify({
            id
        });

        const requestOptions = {
            method: 'DELETE',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        };

        await fetch(url, requestOptions)
            .catch(error => console.log('error', error));
    }
}

class CatalogController {
    constructor(className) {
        this.catalog = document.getElementsByClassName(className)[0];
    }

    displayDishes(dishes) {
        let innerHtml = '';

        dishes.forEach(dish => {
            innerHtml += `
            <div class="dish" id="${dish.id}" onclick="selectDish(${dish.id})">
                <div class="dish-name">
                    ${dish.name}
                </div>
                <div class="dish-description">
                    ${dish.description}
                </div>
                <div class="dish-weight">
                    ${dish.weight} г.
                </div>
                <div class="dish-cost">
                    ${dish.cost} р.
                </div>
            </div>
            `;
        });

        this.catalog.innerHTML = innerHtml;
    }

    addDishCreatingBox() {
        const innerHtml = `
            <div class="new-dish">
                <input type="text" placeholder="Введите название блюда" class="new-dish-name">
                </input>
                <textarea placeholder="Введите описание блюда" class="new-dish-description"></textarea>
                <input type="text" placeholder="Введите вес блюда (г.)" class="new-dish-weight">
                </input>
                <input type="text" placeholder="Введите стоимость блюда (р.)" class="new-dish-cost">
                </input>
                <button class="confirm">Подтвердить</button>
                <button class="cancel">Отменить</button>
            </div>
        `;

        this.catalog.innerHTML += innerHtml;

        const confirm = document.getElementsByClassName('confirm')[0];

        confirm.addEventListener('click', async () => {
            const name = document.getElementsByClassName('new-dish-name')[0].value;
            const description = document.getElementsByClassName('new-dish-description')[0].value;
            const weight = document.getElementsByClassName('new-dish-weight')[0].value;
            const cost = document.getElementsByClassName('new-dish-cost')[0].value;
        
            apiHelper.addDish(name, description, weight, cost);

            showDishes();
        });

        const cancel = document.getElementsByClassName('cancel')[0];

        cancel.addEventListener('click', async () => {
            const newDish = document.getElementsByClassName('new-dish')[0];
            this.catalog.removeChild(newDish);

            showDishes();
        });
    }

    addDishEditingBox(dish) {
        const innerHtml = `
            <div class="edit-dish" id="${dish.id}">
                <input type="text" placeholder="Введите название блюда" value="${dish.name}" class="edit-dish-name">
                </input>
                <textarea placeholder="Введите описание блюда" class="edit-dish-description">${dish.description}</textarea>
                <input type="text" placeholder="Введите вес блюда (г.)" value="${dish.weight}" class="edit-dish-weight">
                </input>
                <input type="text" placeholder="Введите стоимость блюда (р.)" value="${dish.cost}" class="edit-dish-cost">
                </input>
                <button class="confirm">Подтвердить</button>
                <button class="cancel">Отменить</button>
            </div>
        `;

        this.catalog.innerHTML += innerHtml;

        const confirm = document.getElementsByClassName('confirm')[0];

        confirm.addEventListener('click', async () => {
            const id = document.getElementsByClassName('edit-dish')[0].id;
            const name = document.getElementsByClassName('edit-dish-name')[0].value;
            const description = document.getElementsByClassName('edit-dish-description')[0].value;
            const weight = document.getElementsByClassName('edit-dish-weight')[0].value;
            const cost = document.getElementsByClassName('edit-dish-cost')[0].value;
        
            apiHelper.editDish(id, name, description, weight, cost);

            showDishes();
        });

        const cancel = document.getElementsByClassName('cancel')[0];

        cancel.addEventListener('click', async () => {
            const newDish = document.getElementsByClassName('edit-dish')[0];
            this.catalog.removeChild(newDish);

            showDishes();
        });
    }
}

let currentDish = -1;

const apiHelper = new ApiHelper('http://127.0.0.1:3000');
const catalogController = new CatalogController('catalog');

function showDishes() {
    setTimeout(async () => {
        const dishes = await apiHelper.getDishes(); 
        catalogController.displayDishes(dishes);
    }, 500);
}

function addButtonClickedEvent(className) {
    const addButton = document.getElementsByClassName(className)[0];

    addButton.addEventListener('click', () => {
        catalogController.addDishCreatingBox();
    });
}

function editButtonClickedEvent(className) {
    const editButton = document.getElementsByClassName(className)[0];

    editButton.addEventListener('click', async () => {
        if (currentDish !== -1) {
            const dishes = await apiHelper.getDishes();
            const editingDish = dishes.filter((value) => {
                if (value.id === currentDish) {
                    return true;
                }
            })[0];
            catalogController.addDishEditingBox(editingDish);
        }
    });
}

function deleteButtonClickedEvent(className) {
    const deleteButton = document.getElementsByClassName(className)[0];

    deleteButton.addEventListener('click', async () => {
        if (currentDish !== -1) {
            apiHelper.deleteDish(currentDish);
            showDishes();
        }
    });
}

function selectDish(id) {
    if (currentDish !== -1) {
        const previousDish = document.getElementById(currentDish);
        previousDish.setAttribute('class', 'dish');
    }

    currentDish = id;

    const dish = document.getElementById(id);
    dish.setAttribute('class', 'dish selected-dish');
}

addButtonClickedEvent('add');
editButtonClickedEvent('edit');
deleteButtonClickedEvent('delete');

showDishes();
