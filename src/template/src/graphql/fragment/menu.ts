import gql from "graphql-tag";

export const MENU_FRAGMENT = gql`
  fragment menu on NestedMenuNode {
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
