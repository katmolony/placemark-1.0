export const reviewController = {
    index: {
      handler: async function (request, h) {
        return h.view("review");
      },
    },
  };