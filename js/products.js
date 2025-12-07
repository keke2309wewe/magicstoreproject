// js/products.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Данные Supabase
const SUPABASE_URL = "https://osndrwkqjafkfgyhdnpl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_W3slfkQr-v1jJbYZWBQE-Q_Pri4nak1";

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

    container.innerHTML = "";

    data.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("product-item");

        // --- определяем URL картинки ---
        let imageUrl = null;

        // 1) если вдруг позже добавишь колонку image_url (text)
        if (item.image_url) {
            imageUrl = item.image_url;
        }

        // 2) текущий вариант: колонка images (jsonb)
        if (!imageUrl && item.images) {
            // если это массив
            if (Array.isArray(item.images) && item.images.length > 0) {
                const first = item.images[0];
                if (typeof first === "string") {
                    imageUrl = first;
                } else if (first && typeof first === "object" && first.url) {
                    // на случай, если сохранён объект { "url": "..." }
                    imageUrl = first.url;
                }
            }
            // если вдруг в jsonb лежит просто строка
            else if (typeof item.images === "string") {
                imageUrl = item.images;
            }
        }

        // верстаем карточку
        let imgPart = "";
        if (imageUrl) {
            imgPart = `<img src="${imageUrl}" alt="${
                item.name || "product image"
            }" class="product-image">`;
        }

        div.innerHTML = `
            ${imgPart}
            <h2 class="product-name">${item.name}</h2>
            ${
                item.description
                    ? `<p class="product-description">${item.description}</p>`
                    : ""
            }
            <p class="product-price"><strong>${item.price} ${
            item.currency || ""
        }</strong></p>
            <p class="product-stock">Stock: ${item.stock}</p>
        `;

        container.appendChild(div);
    });
}

loadProducts();
