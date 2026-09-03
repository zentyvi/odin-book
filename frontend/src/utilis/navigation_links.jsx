export const getNavigationLinks = () => {
  return [
    {
      path: "/",
      title: "Home",
      unactive: <i className="bi bi-house" />,
      active: <i className="bi bi-house-fill" />,
    },
    {
      path: "/friends",
      title: "Friends",
      unactive: <i className="bi bi-people" />,
      active: <i className="bi bi-people-fill" />,
    },
    {
      path: "/search/users",
      title: "Search",
      unactive: <i className="bi bi-search-heart" />,
      active: <i className="bi bi-search-heart-fill" />,
    },
    {
      path: "/create/post",
      title: "Create post",
      unactive: <i className="bi bi-stickies" />,
      active: <i className="bi bi-stickies-fill" />,
    },
    {
      path: "/settings",
      title: "Settings",
      unactive: <i className="bi bi-gear" />,
      active: <i className="bi bi-gear-fill" />,
    },
  ];
};
