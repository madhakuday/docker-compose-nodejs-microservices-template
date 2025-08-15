const User = require("./user.model");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../utils/responseHandler");
const { externalPostApiCall } = require("../../service/externalApi");

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const limitNum = parseInt(limit, 10);
    const pageNum = Math.max(1, parseInt(page, 10));

    const skip = (pageNum - 1) * limitNum;

    const searchTerm = search.trim() || null;

    let searchQuery = {};

    if (searchTerm) {
      searchQuery.$or = [
        {
          email: { $regex: search, $options: "i" },
        },
      ];
    }

    const match = searchTerm
      ? {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        }
      : {};

    const pipeline = [
      { $match: match },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                _id: 1,
                email: 1,
                name: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
    ];

    const [result] = await User.aggregate(pipeline);
    const users = result?.data || [];
    const total = result?.metadata?.[0]?.total || 0;
    const ids = users.map((u) => u._id.toString()).filter(Boolean);

    try {
      const postsRes = await externalPostApiCall(
        process.env.POST_SERVICE,
        "api/posts/betByIds",
        {
          ids: ids,
        }
      );

      if (postsRes?.data?.success && Array.isArray(postsRes.data.data)) {
        const postsByUser = postsRes.data.data.reduce((acc, p) => {
          const uid = p.userId ? String(p.userId) : null;
          if (!uid) return acc;
          acc[uid] = acc[uid] || [];
          acc[uid].push(p);
          return acc;
        }, {});

        for (const u of users) {
          const uid = u._id.toString();
          u.posts = postsByUser[uid] || [];
        }
      }
    } catch (error) {
      console.error("Error in fetching users posts", error?.message || "");
    }

    return sendSuccessResponse(
      res,
      {
        pagination: {
          total,
          totalPages: Math.ceil(total / limitNum),
          currentPage: pageNum,
        },
        data: result.data,
      },
      "User data fetched",
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to fetch users", 400);
  }
};

exports.getUsersByIds = async (req, res) => {
  try {
    const { ids = [] } = req.body;

    if (!ids.length) {
      return sendErrorResponse(res, "No ids provided", 404);
    }

    const result = await User.find({ _id: { $in: ids } }).select(
      "name email createdAt"
    );

    return sendSuccessResponse(res, result, "User data fetched", 200);
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to fetch users", 400);
  }
};
