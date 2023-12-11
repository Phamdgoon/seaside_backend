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
  } finally {
    connection.end();
  }
};

const getProductsService = async () => {
  try {
    const [dataProducts] = await connection.execute(`
      select product.name_product,product.id as product_id ,
      category_child.id as category_child_id,category_child.name_category_child,
      categories.id as category_id ,categories.name_category,
      product_image.url_image
      from product 
      inner join product_detail
      on product_detail.id_product = product.id
      inner join product_image 
      on product_detail.id = product_image.id_product_detail
      inner join category_child
      on product.id_category_child = category_child.id
      inner join categories 
      on category_child.id_category = categories.id
            `);

    let oldID = 0;
    let newData = [];
    dataProducts.forEach((item) => {
      const cate_id = item.category_id;
      let newArr = [];
      let new_name_cate = "";

      dataProducts.forEach((val) => {
        if (cate_id === oldID) return;
        if (cate_id === val.category_id) {
          let newVal = val;
          new_name_cate = newVal.name_category;

          delete newVal.category_id;
          delete newVal.name_category;
          newArr.push(newVal);
        }
      });

      if (cate_id && newArr.length > 0)
        newData.push({ id: cate_id, new_name_cate, data: newArr });

      oldID = cate_id;
    });

    let oldID1 = 0;
    newData.forEach((cate) => {
      let newC = cate.data;
      cate.data = [];

      newC.forEach((item) => {
        const cate_id1 = item.category_child_id;
        if (cate_id1 === oldID1) return;

        let newArr1 = [];
        let new_name_cate_child = "";

        newC.forEach((val) => {
          if (cate_id1 === val.category_child_id) {
            let newVal = val;
            new_name_cate_child = newVal.name_category_child;

            delete newVal.category_child_id;
            delete newVal.name_category_child;
            newArr1.push(newVal);
          }
        });

        if (cate_id1 && newArr1.length > 0) {
          cate.data.push({
            id_child: cate_id1,
            new_name_cate_child,
            products: newArr1,
          });
        }
        oldID1 = cate_id1;
      });
    });

    return {
      EM: "Products retrieved successfully",
      EC: 0,
      DT: newData,
    };
  } catch (e) {
    console.error(e);
    return {
      EM: "There's something wrong with the service...",
      EC: -2,
      DT: "",
    };
  } finally {
    connection.end();
  }
};

module.exports = {
  getCategoriesService,
  getProductsService,
};
