class Dish {
    constructor (name, description, weight, cost) {
        this.name = name;
        this.description = description;
        this.weight = weight;
        this.cost = cost;
    }
}

class Model {
    dishes = [
        new Dish(
            'Пицца Баварская', 
            'Пицца «Баварская» — это блюдо со вкусными и свежими мясными ингредиентами. Она предназначена для настоящих ценителей мясных деликатесов.',
            1000,
            13,45
        ),
        new Dish(
            'Пицца Охотничья', 
            'Пицца Охотничья, несомненно, сможет удивить своим пикантным вкусом наших посетителей. Остренькие охотничьи колбаски прекрасно гармонируют с ароматными шампиньонами, болгарским перцем и репчатым луком. Всё это располагается на нежнейшем тесте с томатным соусом и тягучим сыром моцарелла.',
            1000,
            14,99
        )
    ];

    getDishes() {
        return this.dishes.map((value, index) => { 
            return {
                id: index,
                name: value.name,
                description: value.description,
                weight: value.weight,
                cost: value.cost,
            }
        });
    }

    addDish(name, description, weight, cost) {
        this.dishes.push(
            new Dish(name, description, weight, cost)
        );
    }

    deleteDish(id) {
        this.dishes.splice(id, 1);
    }

    editDish(id, name, description, weight, cost) {
        const editedDish = this.dishes[id];
        editedDish.name = name;
        editedDish.description = description;
        editedDish.weight = weight;
        editedDish.cost = cost;
    }
}

const model = new Model();

const port = 3000;
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors());

app.get('/dishes', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    response.status(200).json(model.getDishes());
});

app.post('/dishes', (request, response) => {
    const name = request.body.name;
    const description = request.body.description;
    const weight = request.body.weight;
    const cost = request.body.cost;

    model.addDish(name, description, weight, cost);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    response.status(200).send();
});

app.put('/dishes', (request, response) => {
    const id = request.body.id;
    const name = request.body.name;
    const description = request.body.description;
    const weight = request.body.weight;
    const cost = request.body.cost;

    model.editDish(id, name, description, weight, cost);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.status(200).send();
});

app.delete('/dishes', (request, response) => {
    const id = request.query.id;

    model.deleteDish(id);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.status(200).send();
});

app.listen(port);