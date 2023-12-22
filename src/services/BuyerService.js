import connection from "../config/connectDB";
import mysql from "mysql2/promise";
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
        product_detail.id AS id_product_detail,
        product_detail.price,
        shop_profile.name_shop,
        shop_profile.avt,
        shop_profile.address,
        product_size.size,
        product_size.product_number,
        product_detail.name_product_detail
    from product
    inner join product_detail on product_detail.id_product = product.id
    inner join product_image on product_detail.id = product_image.id_product_detail
    inner join category_child on product.id_category_child = category_child.id
    inner join categories on category_child.id_category = categories.id
    inner join shop_profile ON shop_profile.id = product.id_shop
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

    await connection.beginTransaction();

    try {
      // Thêm thông tin đơn hàng vào bảng `order`
      const [orderResult] = await connection.execute(
        "INSERT INTO `order` (username, id_shipping_address, payment_methods) VALUES (?, ?, ?)",
        [data.username, data.id_shipping_address, data.payment_methods]
      );

      // Lấy ID của đơn hàng vừa thêm
      const orderId = orderResult.insertId;

      // Thêm chi tiết đơn hàng vào bảng `order_detail`
      const [orderDetailResult] = await connection.execute(
        "INSERT INTO `order_detail` (id_order, id_product_detail, quantity, size, price, status) VALUES (?, ?, ?, ?, ?, ?)",
        [
          orderId,
          data.id_product_detail,
          data.quantity,
          data.size,
          data.price,
          data.status,
        ]
      );

      const [newOrder] = await connection.execute(
        "SELECT * FROM `order` AS o JOIN `order_detail` AS od ON o.id = od.id_order WHERE o.id = ?",
        [orderId]
      );

      await connection.commit();

      return {
        EM: "Order placed successfully",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      await connection.rollback();
      console.error(error);
      return {
        EM: "Error during order placement.",
        EC: -4,
        DT: "",
      };
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error(error);
    return {
      EM: "Error during order placement.",
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
