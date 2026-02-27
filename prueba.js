(() => {
  // Desestructuración de array: extrae elementos del array y los asigna a variables individuales
  const owner = ["Jorge", "Gonzalez", 30, "Developer"];

  const [firstName, lastName, age, profession] = owner;

  console.log(firstName); // Jorge
  console.log(lastName); // Gonzalez
  console.log(age); // 30
  console.log(profession); // Developer

  // Desestructuración de objeto: extrae propiedades del objeto y las asigna a variables con sus mismos nombres
  let person = {
    name: "Jorge",
    lastName: "Gonzalez",
    age: 30,
    profession: "Developer",
  };

  let { cosa, pepito, pepita, cosita } = person;

  console.log(cosa); // undefined
  console.log(pepito); // undefined
  console.log(pepita); // undefined
  console.log(cosita); // undefined
})();
