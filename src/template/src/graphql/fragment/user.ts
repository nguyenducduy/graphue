import gql from "graphql-tag";

export const USER_FRAGMENT = gql`
  fragment user on UserNode {
    id
    fullName
    email
    avatar
    oauthProvider
    oauthTokenExpiredAt
    createdAt
    group {
      id
      screenName
      name
      color
      permissions {
        name
      }
      menus {
        id
      }
    }
    status {
      text
      value
      color
    }
  }
`;
