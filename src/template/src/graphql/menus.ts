import gql from 'graphql-tag'
import { NESTED_MENU_FRAGMENT, MENU_FRAGMENT } from './fragment/menu'

export const LIST_MENU = gql`
  query listMenu {
    listMenu {
      ...nested_menu
    }
  }
  ${NESTED_MENU_FRAGMENT}
`
export const GET_MENU = gql`
  query getMenu($id: Int!) {
    getMenu(id: $id) {
      ...menu
    }
  }
  ${MENU_FRAGMENT}
`

export const CREATE_MENU = gql`
  mutation createMenu($name: String!, $path: String, $icon: String, $parentId: Int!) {
    createMenu(name: $name, path: $path, icon: $icon, parentId: $parentId) {
      menu {
        ...menu
      }
    }
  }
  ${MENU_FRAGMENT}
`

export const UPDATE_MENU = gql`
  mutation updateMenu($id: Int!, $name: String!, $path: String, $icon: String, $parentId: Int!) {
    updateMenu(id: $id, name: $name, path: $path, icon: $icon, parentId: $parentId) {
      menu {
        ...menu
      }
    }
  }
  ${MENU_FRAGMENT}
`

export const DELETE_MENU = gql`
  mutation deleteMenu($id: Int!) {
    deleteMenu(id: $id) {
      deleted
    }
  }
`
