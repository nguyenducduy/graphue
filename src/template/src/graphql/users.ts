import gql from "graphql-tag";
import { USER_FRAGMENT } from "./fragment/user";
import { NESTED_MENU_FRAGMENT } from "./fragment/menu";

export const COUNT_USER = gql`
  query listUser {
    listUser {
      totalCount
    }
  }
`;

export const LIST_USER = gql`
  query listUser(
    $first: Int
    $last: Int
    $sort: [UserNodeSortEnum]
    $filters: UserFilter
  ) {
    listUser(first: $first, last: $last, sort: $sort, filters: $filters) {
      totalCount
      statusList {
        text
        value
        color
      }
      edges {
        node {
          ...user
        }
      }
    }
  }
  ${USER_FRAGMENT}
`;
export const GET_USER = gql`
  query getUser($id: Int!) {
    getUser(id: $id) {
      ...user
    }
  }
  ${USER_FRAGMENT}
`;

export const CREATE_USER = gql`
  mutation createUser(
    $fullName: String!
    $email: String!
    $password: String!
    $groupId: Int!
    $status: Int!
  ) {
    createUser(
      fullName: $fullName
      email: $email
      password: $password
      groupId: $groupId
      status: $status
    ) {
      user {
        ...user
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $id: Int!
    $fullName: String!
    $groupId: Int!
    $status: Int!
  ) {
    updateUser(
      id: $id
      fullName: $fullName
      groupId: $groupId
      status: $status
    ) {
      user {
        ...user
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      deleted
    }
  }
`;

export const LOGIN_BY_EMAIL = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        ...user
        menu {
          ...nested_menu
        }
      }
      token
    }
  }
  ${USER_FRAGMENT}
  ${NESTED_MENU_FRAGMENT}
`;

export const LOGOUT_USER = gql`
  mutation logoutUser {
    logoutUser {
      loggedOut
    }
  }
`;

export const CHANGE_PASSWORD_USER = gql`
  mutation changePasswordUser($password: String!) {
    changePasswordUser(password: $password) {
      user {
        ...user
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const CREATE_FROM_GOOGLE_USER = gql`
  mutation createFromGoogleUser(
    $fullName: String!
    $email: String!
    $password: String
    $picture: String
    $token: String!
    $refreshToken: String!
    $expiresAt: Int!
  ) {
    createFromGoogleUser(
      fullName: $fullName
      email: $email
      password: $password
      picture: $picture
      token: $token
      refreshToken: $refreshToken
      expiresAt: $expiresAt
    ) {
      user {
        ...user
        menu {
          ...nested_menu
        }
      }
      token
    }
  }
  ${USER_FRAGMENT}
  ${NESTED_MENU_FRAGMENT}
`;

export const LIST_STATUS_USER = gql`
  query listUser {
    listUser {
      statusList {
        text
        value
        color
      }
    }
  }
`;
