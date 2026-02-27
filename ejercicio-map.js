(() => {
  const flota = [
    { nombre: "Aura", eslora: 12, requierePintura: true },
    { nombre: "Mistral", eslora: 15, requierePintura: false },
    { nombre: "Levante", eslora: 8, requierePintura: true },
  ];

  const nombresBarcos = flota.map((barco) => ({
    nombre: barco.nombre.toUpperCase(),
    eslora: barco.eslora * 2,
    requierePintura: barco.requierePintura ? "Sí" : "No",
  }));
  console.log(nombresBarcos);

  flota.forEach((element) => {
    if (element.requierePintura) {
      console.log(`El barco ${element.nombre} requiere pintura.`);
    }
  });
})();
