// utils/generateSKU.js

//const slugify = (text) => {
//  return text
//    .toString()
//    .toUpperCase()
//    .replace(/\s+/g, '')         // Remove spaces
//    .replace(/[^\w\-]+/g, '')    // Remove non-word characters
//    .slice(0, 10);               // Optional: Limit length
//};

//const generateSKU = ({ productName, brand, variant }) => {
//  const nameCode = slugify(productName).slice(0, 4); // eg. REDT
//  const brandCode = brand ? slugify(brand).slice(0, 3) : 'GEN'; // LUX
//  const variantCode = variant ? slugify(variant).slice(0, 3) : 'STD'; // L

//  return `${brandCode}-${nameCode}-${variantCode}`;
//};

//module.exports = generateSKU;
module.exports = function generateSKU({ productName = '', brand = '', variant = '' }) {
  const safeName = productName.trim().split(' ')[0] || 'PRD';
  const safeBrand = brand.trim() || 'BRD';
  const safeVariant = variant.trim() || 'STD';

  const nameCode = safeName.toUpperCase().slice(0, 3);
  const brandCode = safeBrand.toUpperCase().slice(0, 3);
  const variantCode = safeVariant.toUpperCase().slice(0, 3);

  return `${nameCode}-${brandCode}-${variantCode}`;
};
