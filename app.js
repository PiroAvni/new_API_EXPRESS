const express = require("express");
const cors = require("cors");

const logger = require("./logger");
const cars = require("./cars.json");
const { capitalise } = require("./helpers");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Welcome to the Avni Piro API");
});

app.get("/cars", (req, res) => {
  res.send(cars);
});

app.get("/cars/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
  
    const car = cars.find((car) => car.name.toLowerCase() === name);
    car === undefined ? res.status(404).send({ error: ` car ${name} not found :( ` }) : res.send(car);
  });

app.post("/cars", (req, res) => {
   console.log("line 30:", req.body.name);

    const ids = cars.map((car) => car.id);
    console.log("line 33:", ids);

   let maxId = Math.max(...ids);
   const car = cars.find((car) => car.name === req.body.name);

   if (car !== undefined) {
     res.status(409).send({ error: 'car already exists'});
  } else {
    maxId += 1;
    const newCar = req.body;
    newCar.id = maxId;
    cars.push(newCar);

    res.status(201).send(newCar);
  }
});

app.patch("/cars/:name", (req, res) => {
  const car = cars.find(
    (car) => car.name.toLowerCase() === req.params.name.toLowerCase()
  );
  console.log("line 83:", car);
  if (car === undefined) {
    return res.status(404).send({ error: "car does not exist" });
  }
  try {
    console.log("line 89:", req.body);
    const updatedCars = {
      ...req.body,
      name: capitalise(req.body.name),
      id: car.id,
    };
    console.log("line 67", updatedCars);

    const idx = cars.findIndex((carItem) => carItem.id === car.id);
    console.log("line 70:", idx);

    cars[idx] = updatedCars;

    console.log(cars[idx]);

    res.send(updatedCars);
  } catch (error) {
    res.send(400).send(error.message);
  }
});
app.delete("/cars/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    const carIndex = cars.findIndex(
      (car) => car.name.toLowerCase() === name
    );
  // why -1? if the Index is not found then -1 will return (if no data is found then the value of -1 is returned.) 
    if (carIndex === -1) {
      res.status(404).send({ error: "cars does not exist" });
    } else {
      cars.splice(carIndex, 1);
  
      res.status(204).send();
    }
  });


module.exports = app;
