const shopContent = document.getElementById("shopContent");
const cart = []; 

productosFamilia.forEach((product) =>{
    const content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
    <img src="${product.img}">
    <h3>${product.productName}</h3>
    <div class="card-body">
            <p class="card-text"><h3>${product.duration}</h3></p>
            <p class="card-text">Fecha de salida: ${product.DepartureDate}</p>
            <p class="card-text">Horario de salida: ${product.departureTime}</p>
            <p class="card-text">Horario de llegada: ${product.arrivalTime}</p>
            <p class="card-text">Precio grupo familiar:</p>
            <p class="card-text"><h3 class="texto-azul">$ ${product.price}</h3></p>
            <p class="card-text"><small>Valor de la tarifa correspondiente a adultos</small></p>
            <p class="card-text"><small>Niños menores a 4 años no abonan costo de servicio</small></p>
            
        </div>
    <p>${product.price} $</p>
    `;
    shopContent.append(content);

    const buyButton = document.createElement("button");
    buyButton.innerText = "Comprar";

    content.append(buyButton);

    buyButton.addEventListener("click", ()=>{
        const repeat = cart.some((repeatProduct) => repeatProduct.id === product.id);
        if (repeat) {
            cart.map((prod) => {
                if (prod.id === product.id){
                    prod.quanty++;
                    displayCartCounter();
                }
            });            
        }else{
            cart.push({
                id: product.id,
                productName: product.productName,
                price: product.price,
                quanty: product.quanty,
                img: product.img,
            });
            displayCartCounter();
        }
        //console.log(cart)
    });
});