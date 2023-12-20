import connection from "../config/connectDB";

const getCategoriesService = async () => {
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
        const [dataProducts] = await connection.execute(`
        select 
        product.name_product,
        product.id as product_id,
        category_child.id as category_child_id,
        category_child.name_category_child,
        categories.id as category_id,
        categories.name_category,
        product_image.url_image,
        product_detail.price,
        product.name_shop,
        shop_profile.avt,
        shop_profile.address,
        product_size.size,
        product_detail.name_product_detail
    from product
    inner join product_detail on product_detail.id_product = product.id
    inner join product_image on product_detail.id = product_image.id_product_detail
    inner join category_child on product.id_category_child = category_child.id
    inner join categories on category_child.id_category = categories.id
    inner join shop_profile ON shop_profile.name_shop = product.name_shop
    inner join product_size ON product_size.id_product_detail = product_detail.id;
      
            `);

        return {
            EM: "Products retrieved successfully",
            EC: 0,
            DT: dataProducts,
        };
    } catch (e) {
        console.error(e);
        return {
            EM: "There's something wrong with the service...",
            EC: -2,
            DT: "",
        };
    }
};

const handleBuyerOrderService = async (data) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        try {
        } catch (error) {
            await connection.rollback();
            console.log(error);
            return {
                EM: "Error during registration.",
                EC: -4,
                DT: "",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Error during registration.",
            EC: -4,
            DT: "",
        };
    }
};

module.exports = {
    getCategoriesService,
    getProductsService,
    handleBuyerOrderService,
};
