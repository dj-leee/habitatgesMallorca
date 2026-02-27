(async () => {
  // Archivo ejecutable: lee `hola.json` con manejo de errores
  const fs = require("fs/promises");

  // El bloque try-catch se utiliza para manejar errores que puedan ocurrir durante la lectura del archivo. Si el archivo no existe o hay un error de lectura, se capturará y se imprimirá un mensaje de error en la consola.
  try {
    // Lee el archivo `hola.json` de forma asíncrona utilizando `fs.readFile`. El segundo argumento 'utf-8' se utiliza para especificar que el contenido del archivo debe ser leído como texto en lugar de un buffer.
    const file = await fs.readFile("hola.json", "utf-8");

    // El contenido del archivo JSON se parsea utilizando `JSON.parse`, lo que convierte el texto JSON en un objeto JavaScript que se puede manipular en el código.
    const data = JSON.parse(file);

    console.log(data); // Imprime el contenido del archivo JSON como un objeto JavaScript
  } catch (error) {
    console.error("Error al leer el archivo:", error);
  }
})();
