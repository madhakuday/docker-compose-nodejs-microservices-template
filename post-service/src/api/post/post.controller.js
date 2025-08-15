const { externalPostApiCall } = require("../../service/externalApi");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../utils/responseHandler");
const Post = require("./post.model");

exports.getAllPost = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const limitNum = parseInt(limit, 10);
    const pageNum = Math.max(1, parseInt(page, 10));

    const skip = (pageNum - 1) * limitNum;

    let searchQuery = {};

    if (search.trim()) {
      searchQuery.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
      ];
    }

    const total = await Post.countDocuments(searchQuery);
    const result = await Post.find(searchQuery)
      .limit(limitNum)
      .skip(skip)
      .sort({
        createdAt: -1,
      })
      .lean();

    const ids = result.map((u) => u.userId).filter(Boolean);

    try {
      const users = await externalPostApiCall(
        process.env.USER_SERVICE,
        "api/users/usersByIds",
        {
          ids: ids,
        }
      );

      if (users?.data?.success && Array.isArray(users.data.data)) {
        const newArray = new Map();

        for (const element of users.data.data) {
          newArray.set(element._id, element);
        }

        for (const element of result) {
          element["user"] = newArray.get(String(element.userId));
        }
      }
    } catch (error) {
      console.error("Error in fetching users", error?.message || "");
    }

    sendSuccessResponse(
      res,
      {
        pagination: {
          total,
          totalPages: Math.ceil(total / limitNum),
          currentPage: pageNum,
        },
        data: result,
      },
      "Posts fetched",
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to fetch Posts", 400);
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, userId, description } = req.body;

    const post = new Post({
      title,
      description,
      userId,
    });
    await post.save();
    return sendSuccessResponse(res, post, "Post created successfully.");
  } catch (error) {
    sendErrorResponse(res, error?.message || "Failed to create Post", 400);
  }
};

exports.getByIds = async (req, res) => {
  try {
    const { ids = [] } = req.body;

    const data = await Post.find({ userId: { $in: ids } });

    sendSuccessResponse(res, data, "Posts fetched", 200);
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to fetch Posts", 400);
  }
};
