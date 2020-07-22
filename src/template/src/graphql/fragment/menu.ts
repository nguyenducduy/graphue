import gql from "graphql-tag";

export const NESTED_MENU_FRAGMENT = gql`
  fragment nested_menu on NestedMenuNode {
    node {
      id
      name
      path
      icon
      parentId
      children {
        id
        name
        path
        icon
        parentId
        children {
          id
          name
          path
          icon
          parentId
          children {
            id
            name
            path
            icon
            parentId
          }
        }
      }
    }
  }
`;

export const MENU_FRAGMENT = gql`
  fragment menu on MenuNode {
    id
    name
    path
    icon
    parentId
  }
`;
