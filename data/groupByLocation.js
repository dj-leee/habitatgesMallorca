(async () => {
    const fs = require('fs');
    const response = await fs.readFileSync('./data.json');
    const data = JSON.parse(response);

    const groupedData = data.reduce((acc, item) => {

        const location = item.location


        if(!item.longitude) return acc 
        if(location === "") return acc

        if (!acc[location]) {
            acc[location] = [];
        }

        acc[location].push(item);
        return acc;
    }, {});

    fs.writeFileSync('./groupedData.json', JSON.stringify(groupedData, null, 2))
})()