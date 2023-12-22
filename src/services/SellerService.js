import connection from "../config/connectDB";

const handleAddNewCategoryService = async (data) => {
  try {
    //req.body
    const idShop = await connection.execute(
      "SELECT id FROM `shop_profile` WHERE username = ?",
      [data.userName]
    );
    const idS = idShop[0];
    const id_shop = idS[0].id;

    const res = await connection.execute(
      "insert into category_child (name_category_child,id_category,id_shop) values (?,?,?)",
      [data.nameCategoryChild, data.idCategory, id_shop]
    );
    if (res) {
      return {
        EM: "OK",
        EC: 0,
      };
    }
  } catch (e) {
    console.error(e);
    return {
      EM: "There's something wrong with the service...",
      EC: -2,
    };
  }
};

const handleCreateNewProduct = async (data) => {
  if (
    !data.nameCategoryChild ||
    !data.prodNameShop ||
    !data.prodName ||
    !data.prodDesc ||
    !data.prodStyles
  ) {
    return {
      EM: "Missing data parameter",
      EC: 1,
    };
  }

  try {
    //req.body
    const idCateChild = await connection.execute(
      "SELECT (id) FROM category_child WHERE name_category_child = ?",
      [data.nameCategoryChild]
    );

    const dt1 = idCateChild[0];
    const idCateC = dt1[0].id;

    const idShopResult = await connection.execute(
      "SELECT id FROM shop_profile WHERE name_shop = ?",
      [data.prodNameShop]
    );
    const idSR = idShopResult[0];
    const idShop = idSR[0].id;

    await connection.execute(
      "INSERT INTO product(id, name_product, id_shop, id_category_child, description) VALUES (null,?,?,?,?)",
      [data.prodName, idShop, idCateC, data.prodDesc]
    );

    const idNewProd = await connection.execute(
      "SELECT id FROM product WHERE name_product = ? and id_shop = ? and description = ?",
      [data.prodName, idShop, data.prodDesc]
    );

    const idp = idNewProd[0];
    const idProd = idp[0].id;

    data.prodStyles.forEach(async (item) => {
      await connection.execute(
        "INSERT INTO product_detail(id_product, name_product_detail, price) VALUES (?,?,?)",
        [idProd, item.prodColorName, item.prodPrice]
      );

      const idProdDetail = await connection.execute(
        "SELECT id FROM product_detail WHERE name_product_detail =? AND price = ?",
        [item.prodColorName, item.prodPrice]
      );

      const idpd = idProdDetail[0];
      const idProdD = idpd[0].id;

      await connection.execute(
        "INSERT INTO product_image(id_product_detail, url_image) VALUES (?,?)",
        [idProdD, item.image]
      );

      item.size.forEach(async (size) => {
        await connection.execute(
          "INSERT INTO product_size( id_product_detail, size, product_number)  VALUES (?,?,?)",
          [idProdD, size, item.prodNumber]
        );
      });
    });

    return {
      EM: "OK",
      EC: 0,
    };
  } catch (e) {
    console.error(e);
    return {
      EM: "There's something wrong with the service...",
      EC: -2,
    };
  }
};

const getAllOrdersService = async (data) => {
  if (!data) {
    return {
      EM: "Missing data parameter",
      EC: 1,
    };
  }

  try {
    const res = await connection.execute(
      "SELECT product.id_shop, product.name_product, product_image.url_image as image, order_detail.quantity, order_detail.size, order_detail.price, order_detail.status, `order`.payment_methods, shipping_address.name, shipping_address.phone_number, shipping_address.address FROM shop_profile  INNER JOIN  product ON shop_profile.id = product.id_shop INNER JOIN product_detail ON product.id = product_detail.id_product INNER JOIN product_image ON product_detail.id = product_image.id_product_detail INNER JOIN order_detail ON product_detail.id = order_detail.id_product_detail INNER JOIN `order` ON order_detail.id_order = `order`.id INNER JOIN buyer_profile ON `order`.username = buyer_profile.username INNER JOIN shipping_address ON buyer_profile.username = shipping_address.username where shop_profile.username = ?",
      [data]
    );

    if (res) {
      return {
        EM: "OK",
        EC: 0,
        DT: res[0],
      };
    }
  } catch (e) {
    console.error(e);
    return {
      EM: "There's something wrong with the service...",
      EC: -2,
    };
  }
};

module.exports = {
  handleAddNewCategoryService,
  handleCreateNewProduct,
  getAllOrdersService,
};
