const fetch = require("node-fetch");
const ObjectsToCsv = require("objects-to-csv");


let settings = { method: "Get" };
let params = {
    page: 1,
    limit: 250,
};
let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");

function groupByTypeAndCountProducts(products) {

    const groupedByType = products.reduce((group, product) => {
        const type = product.product_type;
        if (!group[type]) {
            group[type] = [];
        }
        group[type].push(product);
        return group;
    }, {});

    const groupArraysTypeAndCount = Object.keys(groupedByType).map((type) => {
        return {
            type,
            productCount: groupedByType[type].length,
        };
    });

    return groupArraysTypeAndCount;
}

function groupByDateAndCountProducts(products) {

    const groupedByDate = products.reduce((group, product) => {
        const date = product.published_at.split("T")[0];
        if (!group[date]) {
            group[date] = [];
        }
        group[date].push(product);
        return group;
    }, {});

    const groupArraysDateAndCount = Object.keys(groupedByDate).map((date) => {
        return {
            date,
            productCount: groupedByDate[date].length,
        };
    });

    return groupArraysDateAndCount;
}


const  getResults = () => {
    
let urlArray = ["https://fanjoy.co/products.json?" + query, "https://gymshark.com/products.json?" + query, "https://ca.ultamodan.com/products.json?" + query];
   
    for (let i = 0; i < urlArray.length; i++) {
        let jsonURL = urlArray[i];
        fetch(jsonURL, settings)
            .then((res) => res.json())
            .then((JSONproductList) => {
             
                const groupedProductsbyDate = groupByDateAndCountProducts(
                    JSONproductList.products
                );
             
                const groupedProductsbyType = groupByTypeAndCountProducts(
                    JSONproductList.products
                );
                console.log(groupedProductsbyType)
                const csv_date = new ObjectsToCsv(groupedProductsbyDate);
                csv_date.toDisk(`./products_by_date-${urlArray[i].split('/')[2]}.csv`);
                const csv_type = new ObjectsToCsv(groupedProductsbyType);
                csv_type.toDisk(`./products_by_type-${urlArray[i].split('/')[2]}.csv`);

                return;
            });
    }
};

module.exports = getResults;
