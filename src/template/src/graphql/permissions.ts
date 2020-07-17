import gql from "graphql-tag";
import { PERMISSION_FRAGMENT } from "./fragment/permission";

export const COUNT_PERMISSION = gql`
  query listPermission {
    listPermission {
      totalCount
    }
  }
`;

export const LIST_PERMISSION = gql`
  query listPermission(
    $first: Int
    $last: Int
    $sort: [PermissionNodeSortEnum]
    $filters: PermissionFilter
  ) {
    listPermission(first: $first, last: $last, sort: $sort, filters: $filters) {
      totalCount
      edges {
        node {
          ...permission
        }
      }
    }
  }
  ${PERMISSION_FRAGMENT}
`;

export const GET_PERMISSION = gql`
  query getPermission($id: Int) {
    getPermission(id: $id) {
      ...permission
    }
  }
  ${PERMISSION_FRAGMENT}
`;

export const CREATE_PERMISSION = gql`
  mutation createPermission($name: String!, $description: String!) {
    createPermission(name: $name, description: $description) {
      permission {
        ...permission
      }
    }
  }
  ${PERMISSION_FRAGMENT}
`;

export const UPDATE_PERMISSION = gql`
  mutation updatePermission($id: Int!, $name: String!, $description: String!) {
    updatePermission(id: $id, name: $name, description: $description) {
      permission {
        ...permission
      }
    }
  }
  ${PERMISSION_FRAGMENT}
`;

export const DELETE_PERMISSION = gql`
  mutation deletePermission($id: Int!) {
    deletePermission(id: $id) {
      deleted
    }
  }
`;
