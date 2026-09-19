/**
 * @typedef {'MATERNIDADE'|'BEBE'|'CRIANCA'|'CASA_COM_CRIANCAS'|'PRESENTES'} Category
 */

/**
 * Contrato ProductNormalized — ver product-normalized.schema.json
 * Documentação tipada para editores (JSDoc).
 *
 * @typedef {Object} ProductNormalized
 * @property {'shopee'|'mercadolivre'|'amazon'|'other'} source
 * @property {string} source_product_id
 * @property {string} title
 * @property {string|null} [description]
 * @property {string|null} [product_url]
 * @property {string|null} [affiliate_url]
 * @property {string|null} [image_url]
 * @property {string|null} [category]
 * @property {string|null} [subcategory]
 * @property {number} price
 * @property {number|null} [original_price]
 * @property {number|null} [rating]
 * @property {number|null} [review_count]
 * @property {number|null} [sold_count]
 * @property {number|null} [commission_percent]
 * @property {number|null} [extra_commission_percent]
 * @property {string} [currency]
 * @property {string|null} [coupon_code]
 */

export {};
