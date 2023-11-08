const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");

const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

//Se encarga de mostrar el contenido del carrito en un modal
const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";
    //modal Header
    const modalHeader = document.createElement("div");

    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    })

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Cart";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    //modal Body
    if(cart.length > 0){
    //Se itera sobre los productos en el carrito (variable cart) y se crea un elemento HTML para cada uno
    cart.forEach((product) => {
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.innerHTML = `
        <div class = "product">
            <img class = "product-img" src="${product.img}" />
            <div class = "product-info">
                <h4>${product.productName}</h4>
            </div>
            <div class = "quantity">
                <span class = "quantity-btn-decrese">-</span>
                <span class = "quantity-input">${product.quanty}</span>
                <span class = "quantity-btn-increse">+</span>
            </div>
            <div class = "price">${product.price * product.quanty} $</div>
            <div class = "delete-product">❌</div>
        </div>
        
        `;

        modalContainer.append(modalBody);

        const decrese = modalBody.querySelector(".quantity-btn-decrese");
        decrese.addEventListener("click", () => {
            if(product.quanty !== 1){
                product.quanty--;
                displayCart();
                displayCartCounter();

            }
        });

        const increse = modalBody.querySelector(".quantity-btn-increse");
        increse.addEventListener("click", () => {
            product.quanty++;
            displayCart();
            displayCartCounter();
        })


    
        //delete
    const deleteProduct = modalBody.querySelector(".delete-product");

    deleteProduct.addEventListener("click", ()=> {
        deleteCartProduct(product.id)
    })
});
    //modal footer
    const total = cart.reduce((acc,el) => acc + el.price * el.quanty, 0);


    //Se muestra un resumen del carrito, con el precio total de todos los productos y un botón "ir al proceso de pago"
    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
    <div class = "total-price">Total: ${total}</div>
    <button class = "btn-primary" id="checkout-btn"> Ir al proceso de pago</button> 
    <div id="button-checkout"></div>
    `; // boton que lleva al checkout y dispara el evento de mercadopago

    modalContainer.append(modalFooter);

    //Token de acceso 
    const mercadopago = new MercadoPago("APP_USR-5edee690-9d67-4f22-b564-0bffaa7bf97a", {
        locale: "es-AR",
    }); //inicia una instancia de Mercado Pago

    const checkoutButton = modalFooter.querySelector("#checkout-btn"); //capturamos el boton para el evento click y ejecutar

    checkoutButton.addEventListener("click", function (){

        checkoutButton.remove(); //remueve el boton checkout para evitar dobles comprar

        const orderData = {
            quantity: 1,
            description: "compra de ecomerce",
            price: total,
        };

        fetch("http://localhost:8080/create_preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (preference) {
                createCheckoutButton(preference.id);
            })
            .catch(function () {
                alert("Unexpected error"); 
            });
    });
    
    function createCheckoutButton(preferenceId) {
        // Se inicia el checkout
        const bricksBuilder = mercadopago.bricks();

        const renderComponent = async (bricksBuilder) => {
            //if (window.checkoutButton) checkoutButton.unmount();

            await bricksBuilder.create(
                "wallet",
                "button-checkout", 
                {
                    initialization: {
                        preferenceId: preferenceId,
                    },
                    callbacks: {
                        onError: (error) => console.error(error),
                        onReady: () => {},
                    },
                }
            );

        };
        window.checkoutButton = renderComponent(bricksBuilder);
    }
// Si el carrito está vacío, se muestra un mensaje que indicándolo
}else{
    const modalText = document.createElement("h2");
    modalText.className = "modal-body";
    modalText.innerText = "El carrito está vacío";
    modalContainer.append(modalText);
}    
};

cartBtn.addEventListener("click", displayCart);

//Se encarga de eliminar productos del carrito
const deleteCartProduct =(id) => {
    const foundId = cart.findIndex((element)=> element.id === id);
    cart.splice(foundId, 1);
    displayCart();
    displayCartCounter();
};

// Se encarga de mostrar el contador de productos en el carrito 
const displayCartCounter = ()=> {
    const cartLenght = cart.reduce((acc, el) => acc + el.quanty, 0);
    if (cartLenght > 0) {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLenght;
    }else{
        cartCounter.style.display = "none";
    }
    
    
};