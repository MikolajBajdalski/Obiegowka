// sizes.js
const CLOTHING_SIZES = ["Brak", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// Generujemy rozmiary butów od 28 do 55 – wszystko jako string.
const SHOE_SIZES = Array.from({ length: 28 }, (_, i) => String(i + 28));

export { CLOTHING_SIZES, SHOE_SIZES };
