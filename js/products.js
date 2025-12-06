// js/products.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// === ЗАМЕНИ НА СВОИ ДАННЫЕ Supabase ===
const SUPABASE_URL = "https://osndrwkqjafkfgyhdnpl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_W3slfkQr-v1jJbYZWBQE-Q_Pri4nak1"; // только anon

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Загрузка товаров
async function loadProducts() {
    const container = document.querySelector(".store-card");
    if (!container) return;

    container.innerHTML = "<p>Loading...</p>";

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        container.innerHTML = "<p>Error loading products.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>No products yet.</p>";
        return;
    }

    container.innerHTML = ""; // очищаем

    data.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("product-item");

        div.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.description || ""}</p>
            <p><strong>${item.price} ${item.currency}</strong></p>
            <p>Stock: ${item.stock}</p>
        `;

        container.appendChild(div);
    });
}

loadProducts();
