import gql from 'graphql-tag'
import { GROUP_FRAGMENT } from './fragment/group'
import { PERMISSION_FRAGMENT } from './fragment/permission'
import { MENU_FRAGMENT } from './fragment/menu'

export const COUNT_GROUP = gql`
  query listGroup {
    listGroup {
      totalCount
    }
  }
`

export const LIST_GROUP = gql`
  query listGroup($first: Int, $last: Int, $sort: [GroupNodeSortEnum], $filters: GroupFilter) {
    listGroup(first: $first, last: $last, sort: $sort, filters: $filters) {
      totalCount
      edges {
        node {
          ...group
        }
      }
    }
  }
  ${GROUP_FRAGMENT}
`

export const GET_GROUP = gql`
  query getGroup($id: Int) {
    getGroup(id: $id) {
      ...group
      permissions {
        ...permission
      }
      menus {
        ...menu
      }
    }
  }
  ${GROUP_FRAGMENT}
  ${PERMISSION_FRAGMENT}
  ${MENU_FRAGMENT}
`

export const CREATE_GROUP = gql`
  mutation createGroup($name: String!, $screenName: String!, $color: String) {
    createGroup(name: $name, screenName: $screenName, color: $color) {
      group {
        ...group
      }
    }
  }
  ${GROUP_FRAGMENT}
`

export const UPDATE_GROUP = gql`
  mutation updateGroup($id: Int!, $name: String!, $screenName: String!, $color: String) {
    updateGroup(id: $id, name: $name, screenName: $screenName, color: $color) {
      group {
        ...group
      }
    }
  }
  ${GROUP_FRAGMENT}
`

export const DELETE_GROUP = gql`
  mutation deleteGroup($id: Int!) {
    deleteGroup(id: $id) {
      deleted
    }
  }
`

export const GRANT_PERMISSION_GROUP = gql`
  mutation grantPermissionGroup($id: Int!, $permissions: [String]!) {
    grantPermissionGroup(id: $id, permissions: $permissions) {
      granted
    }
  }
`

export const ASSIGN_MENU_GROUP = gql`
  mutation assignMenuGroup($id: Int!, $menus: [String]!) {
    assignMenuGroup(id: $id, menus: $menus) {
      assigned
    }
  }
`
