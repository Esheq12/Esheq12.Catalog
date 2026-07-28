// ===== Global Variables =====

let products = [];
let filtered = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Elements =====

const productsDiv = document.getElementById("products");

const search = document.getElementById("search");

const category = document.getElementById("category");

const sort = document.getElementById("sort");

const modal = document.getElementById("productModal");

const modalBody = document.getElementById("modalBody");

const cartModal = document.getElementById("cartModal");

const cartBody = document.getElementById("cartBody");

const cartBar = document.getElementById("cartBar");

loadProducts();

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");
