export const aboutController = {
    index: {
      handler: function (request, h) {
        const viewData = {
          title: "About Placemark", // maybe change
        };
        return h.view("about-view", viewData);
      },
    },
  };