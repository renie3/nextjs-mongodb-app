export type LinkType = {
  title: string;
  path: string;
};

export const links: LinkType[] = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Most Popular",
    path: "/popular",
  },
];

export const ITEM_PER_PAGE = 12;
