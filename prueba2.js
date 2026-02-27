(() => {
  let ower = {
    name: "DJ",
    lastName: "Diawara",
    age: 30,
    profession: "Developer",
  };

  Object.entries(ower).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
})();

console.log("--------------------------------------------------");
