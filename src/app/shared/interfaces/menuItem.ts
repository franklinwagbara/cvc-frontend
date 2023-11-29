export interface IMenuItem {
  name: string;
  url: string;
  subMenu: ISubmenu[];
}

export interface ISubmenu {
  name: string;
  url: string;
  subMenu: ISubmenu[];
}
