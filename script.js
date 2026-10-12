// 1. Product data
const products = [
    { id: 1, name: "Laptop", category: "Electronics", price: 65000, stock: 10, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" },
    { id: 2, name: "Wireless Mouse", category: "Accessories", price: 850, stock: 50, image: "https://images.unsplash.com/photo-1527814050087-3793815479db" },
    { id: 3, name: "Mechanical Keyboard", category: "Accessories", price: 3200, stock: 25, image: "https://images.unsplash.com/photo-1595225476474-87563907a212" },
    { id: 4, name: "Monitor 24 inch", category: "Electronics", price: 14500, stock: 15, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf" },
    { id: 5, name: "USB-C Hub", category: "Accessories", price: 1800, stock: 30, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761" },
    { id: 6, name: "Headphones", category: "Audio", price: 2500, stock: 20, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
    { id: 7, name: "Webcam", category: "Electronics", price: 4200, stock: 12, image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da" },
    { id: 8, name: "USB Flash Drive 64GB", category: "Storage", price: 750, stock: 40, image: "https://images.unsplash.com/photo-1618410320928-25228d811631" },
    { id: 9, name: "External SSD 1TB", category: "Storage", price: 11500, stock: 8, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b" },
    { id: 10, name: "Laptop Stand", category: "Accessories", price: 1600, stock: 18, image: "https://images.unsplash.com/photo-1616353071855-2c8b2e2c1e2d" }
];

const $ = id => document.getElementById(id);
const selected = new Set();
const cart = {};

// 2. Display products
function showProducts() {
    const category = $("categoryFilter").value;

    $("productList").innerHTML = products
        .filter(p => category === "All" || p.category === category)
        .map(p => `
            <div class="product">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>Category: ${p.category}</p>
                <p>Price: ৳${p.price}</p>
                <p>Stock: ${p.stock}</p>

                <button class="unselect-btn"
                    onclick="toggleSelect(${p.id})">
                    ${selected.has(p.id) ? "Unselect" : "Select"}
                </button>

                ${selected.has(p.id) ? `
                    <button onclick="addToCart(${p.id})">
                        Add to Cart
                    </button>` : ""}
            </div>
        `).join("");
}

// 3. Select or unselect a product
function toggleSelect(id) {
    selected.has(id) ? selected.delete(id) : selected.add(id);
    showProducts();
}

// 4. Add selected product to cart
function addToCart(id) {
    if (!selected.has(id)) return;

    const p = products.find(item => item.id === id);

    if ((cart[id] || 0) >= p.stock) {
        alert("Stock limit reached.");
        return;
    }

    cart[id] = (cart[id] || 0) + 1;
    showCart();
}

// 5. Remove product from cart
function removeItem(id) {
    delete cart[id];
    showCart();
}

// 6. Change quantity
function changeQuantity(id, value) {
    const p = products.find(item => item.id === id);

    cart[id] = Math.max(1, Math.min(p.stock, Number(value) || 1));
    showCart();
}

// 7. Display cart and calculate total
function showCart() {
    let total = 0;

    $("cartItems").innerHTML = Object.keys(cart).map(id => {
        const p = products.find(item => item.id == id);
        total += p.price * cart[id];

        return `
            <div class="cart-item">
                <p>${p.name} — ৳${p.price}</p>

                <input type="number" min="1" max="${p.stock}"
                    value="${cart[id]}"
                    onchange="changeQuantity(${id}, this.value)">

                <p>Subtotal: ৳${p.price * cart[id]}</p>

                <button class="remove-btn"
                    onclick="removeItem(${id})">
                    Remove
                </button>
            </div>
        `;
    }).join("");

    $("total").textContent = total;
}

// 8. Show customer form at checkout
$("checkout").onclick = () => {
    if (!Object.keys(cart).length) {
        alert("Please add a product to your cart.");
        return;
    }

    $("customerForm").classList.remove("hidden");
};

// 9. Generate payment slip
$("makeReceipt").onclick = () => {
    const name = $("customerName").value.trim();
    const phone = $("customerPhone").value.trim();

    if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
    }

    const rows = Object.keys(cart).map(id => {
        const p = products.find(item => item.id == id);

        return `<tr>
            <td>${p.name}</td>
            <td>${cart[id]}</td>
            <td>৳${p.price * cart[id]}</td>
        </tr>`;
    }).join("");

    $("receipt").innerHTML = `
        <h2>Payment Slip</h2>
        <p>Customer: ${safeText(name)}</p>
        <p>Phone: ${safeText(phone)}</p>

        <table>
            <tr><th>Product</th><th>Qty</th><th>Subtotal</th></tr>
            ${rows}
        </table>

        <h3>Total: ৳${$("total").textContent}</h3>
        <p>Demo slip only. No real payment processed.</p>
        <button onclick="window.print()">Print Slip</button>
    `;

    $("receipt").classList.remove("hidden");
};

// Protect customer input when displaying it
function safeText(text) {
    return text.replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[char]);
}

// 10. Category filter
$("categoryFilter").onchange = showProducts;

// Initial display
showProducts();
showCart();