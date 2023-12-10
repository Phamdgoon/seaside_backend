require("dotenv").config();
import mysql from "mysql2/promise";

const getCategoriesService = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        try {
            const [dataCategories] = await connection.execute(
                "SELECT id, name_category, url_category FROM categories"
            );

            const categoriesWithChildren = await Promise.all(
                dataCategories.map(async (category) => {
                    const [childRows] = await connection.execute(
                        "SELECT name_category_child FROM category_child WHERE id_category = ?",
                        [category.id]
                    );

                    const childrenNames = childRows.map(
                        (child) => child.name_category_child
                    );

                    return {
                        id: category.id,
                        name_category: category.name_category,
                        url_category: category.url_category,
                        name_category_sub: childrenNames,
                    };
                })
            );

            return {
                EM: "Categories retrieved successfully",
                EC: 0,
                DT: categoriesWithChildren,
            };
        } catch (error) {
            console.log(error);
            return {
                EM: "Error while executing query.",
                EC: -3,
                DT: "",
            };
        } finally {
            connection.end();
        }
    } catch (e) {
        console.error(e);
        return {
            EM: "There's something wrong with the service...",
            EC: -2,
            DT: "",
        };
    }
};

const getProductsService = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        try {
            const [dataProducts] = await connection.execute(`
                SELECT 
                    p.id AS product_id,
                    p.name_product,
                    p.name_shop,
                    p.description,
                    pd.id AS product_detail_id,
                    pd.name_product_detail,
                    pd.price,
                    pi.url_image,
                    ps.size,
                    ps.product_number
                FROM product p
                LEFT JOIN product_detail pd ON p.id = pd.id_product
                LEFT JOIN product_image pi ON pd.id = pi.id_product_detail
                LEFT JOIN product_size ps ON pd.id = ps.id_product_detail
            `);

            return {
                EM: "Products retrieved successfully",
                EC: 0,
                DT: dataProducts,
            };
        } catch (error) {
            console.log(error);
            return {
                EM: "Error while executing query.",
                EC: -3,
                DT: "",
            };
        } finally {
            connection.end();
        }
    } catch (e) {
        console.error(e);
        return {
            EM: "There's something wrong with the service...",
            EC: -2,
            DT: "",
        };
    }
};

module.exports = {
    getCategoriesService,
    getProductsService,
};
