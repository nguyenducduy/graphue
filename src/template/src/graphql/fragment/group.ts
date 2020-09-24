import gql from "graphql-tag";

export const GROUP_FRAGMENT = gql`
  fragment group on GroupNode {
    id
    name
    screenName
    color
    createdAt
  }
`;
