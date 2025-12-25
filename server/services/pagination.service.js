import { Op } from "sequelize";

export const PaginationService = {
  async paginate(model, options = {}) {
    let {
      page = 1,
      limit = 10,
      where = {},
      search = null,
      order = [["created_at", "DESC"]],
      include = [],
    } = options;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;
    where = { ...where };
    if (search && search.value && search.key) {
      where[search.key] = { [Op.iLike]: `%${search.value}%` };
    }

    if (search && search.value && Array.isArray(search.keys)) {
      where[Op.or] = search.keys.map((k) => ({
        [k]: { [Op.iLike]: `%${search.value}%` },
      }));
    }
    const { count, rows } = await model.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include,
      distinct: true, 
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },
};
