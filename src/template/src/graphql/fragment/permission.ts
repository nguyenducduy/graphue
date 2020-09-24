import gql from "graphql-tag";

export const PERMISSION_FRAGMENT = gql`
  fragment permission on PermissionNode {
    id
    name
    description
    createdAt
  }
`;
