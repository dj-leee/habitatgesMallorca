
(async () => {
    const fs = require('fs/promises');
    const papaparse = require('papaparse');

    try {
        const file = await fs.readFile("./habitatges_turistics_mallorca.csv", "utf-8");

        const result = await papaparse.parse(file, {
            header: true,
            skipEmptyLines: true,

        });

        const data = result.data;
        console.log(data);

        const dataUpdate = data.map(element => {
            return {
                name: element['Denominació comercial'],
                location: element.Localitat,
                state: element.Estat,
                startDate: element['Inici d\'activitat'],
                address: element['Direcció'],
                longitude: parseFloat(element.longitude),
                latitude: parseFloat(element.latitude)
            }
        })

        const conteoPorLocalidad = dataUpdate.reduce((acc, element) => {
            if (acc[element.location]) {
                acc[element.location]++;
            } else {
                acc[element.location] = 1;
            }
            return acc;

        }, {});

        const ordenadoPorLocalidad = dataUpdate.sort((a, b) => a.location.localeCompare(b.location));

        await fs.writeFile('./data.json', JSON.stringify(ordenadoPorLocalidad, null, 2), 'utf-8')

        console.log(dataUpdate);

        // Convertir a array y ordenar de mayor a menor con sort
        const conteoArray = Object.keys(conteoPorLocalidad).map(localidad => ({
            localidad: localidad,
            count: conteoPorLocalidad[localidad]
        }));
        conteoArray.sort((a, b) => b.count - a.count);

        console.table(conteoArray);
        console.log(`Procceso finalizado se han completado ${dataUpdate.length} registros`);
        
    } catch (error) {
        console.error('Error al leer el archivo:', error);
    }
})();