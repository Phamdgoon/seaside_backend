import connection from "../config/connectDB";

const handleAddNewCategoryService = async (data) => {
  try {
    //req.body
    const res = await connection.execute(
      "insert into category_child (name_category_child,id_category) values (?,?)",
      [data.nameCategoryChild, data.idCategory]
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

module.exports = {
  handleAddNewCategoryService,
};
