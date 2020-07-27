import Vue from 'vue'
import { filter } from 'vue/types/umd'
import * as Case from 'case'
const qs = require('query-string')
import settings from '@/config/settings'

export const setDocumentTitle = function(title) {
  document.title = title
  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function() {
      setTimeout(function() {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

export const domTitle = settings.title

export function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field])
}

function _distinctValue(value, index, self) {
  return self.indexOf(value) === index
}

export function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function randomID() {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

export function getVariables(context, curPage) {
  let variables: any = {}
  const totalPages: number = Math.floor(context.total / context.pagination.pageSize)
  const currentPage: number = parseInt(curPage)

  variables['first'] = context.pagination.pageSize * currentPage

  if (totalPages === 0) {
    variables['last'] = context.pagination.pageSize
  } else {
    variables['last'] =
      currentPage > totalPages ? context.total % context.pagination.pageSize : context.pagination.pageSize
  }

  let currentQs = qs.parse(window.location.search, { arrayFormat: 'comma' })

  // sort
  if (typeof currentQs['sort'] !== 'undefined') {
    let [sortBy, sortType] = currentQs['sort'].split('.')
    variables['sort'] = [_sort(sortBy, sortType)]
  }

  // filter
  let filterObject = {}
  variables['filters'] = filterObject
  if (typeof currentQs['filter'] !== 'undefined' && Array.isArray(currentQs['filter'])) {
    let customFilterKey = ''
    let customFilterVal = []

    currentQs['filter'].map((filter) => {
      let [filterBy, filterValue] = filter.split('.')
      customFilterKey = _convertFilterBy(filterBy)
      if (typeof filterObject[customFilterKey] === 'undefined') {
        filterObject[customFilterKey] = []
      }

      filterObject[customFilterKey].push(_convertFilterValue(filterBy, filterValue))
    })

    variables['filters'] = filterObject
  } else if (typeof currentQs['filter'] !== 'undefined' && typeof currentQs['filter'] == 'string') {
    let [filterBy, filterValue] = currentQs['filter'].split('.')
    filterObject[_convertFilterBy(filterBy)] = _convertFilterValue(filterBy, filterValue)

    variables['filters'] = filterObject
  }

  // search
  if (typeof currentQs['q'] !== 'undefined' && currentQs['q'] !== '') {
    let searchObject = []
    context['searchInInfo'].map((item) => {
      let searchContext = {}
      ;(searchContext[_convertSearchBy(item.field)] = '%' + currentQs['q'] + '%'), searchObject.push(searchContext)
    })

    filterObject['or'] = searchObject
  }

  return variables
}

function _sort(sortBy, sortType) {
  let sortString = ''

  switch (sortType) {
    case 'ascend':
      sortString = sortBy.toUpperCase() + '_ASC'
      break
    case 'descend':
      sortString = sortBy.toUpperCase() + '_DESC'
      break
    default:
      sortString = sortBy.toUpperCase() + '_ASC'
  }

  return sortString
}

function _convertFilterBy(filterBy) {
  return Case.camel(filterBy) + 'In'
}

function _convertFilterValue(filterBy, filterValue) {
  switch (filterValue) {
    case 'true':
      filterValue = true
      break
    case 'false':
      filterValue = false
      break
  }

  return filterValue
}

function _convertSearchBy(field) {
  return Case.camel(field) + 'Like'
}

export function createUrl(sorter, filters, searcher = {}) {
  let currentQs = qs.parse(window.location.search, { arrayFormat: 'comma' })

  if (Object.keys(sorter).length !== 0) {
    const sortKey = sorter.columnKey + '.' + sorter.order
    currentQs['sort'] = sortKey
  }

  if (Object.keys(filters).length !== 0) {
    // generate filter value
    let filterValue = []
    Object.keys(filters).map((filterKey) => {
      if (filters[filterKey] !== null) {
        filters[filterKey].map((v) => {
          // console.log(v)
          filterValue.push(filterKey + '.' + v)
        })
      }
    })

    currentQs['filter'] = filterValue
  }

  if (Object.keys(searcher).length !== 0) {
    if (searcher['text'] !== '') {
      currentQs['q'] = searcher['text']
    } else {
      delete currentQs['q']
    }

    delete currentQs['page']
  }

  return qs.stringify(currentQs, { arrayFormat: 'comma' })
}

export function initQs() {
  let currentQs = qs.parse(window.location.search, { arrayFormat: 'comma' })

  let sorter = {}
  let filters = {}
  let q = ''

  if (currentQs['sort']) {
    const sortArr = currentQs['sort'].split('.')
    sorter = {
      columnKey: sortArr[0],
      order: sortArr[1],
    }
  }

  if (Array.isArray(currentQs['filter'])) {
    currentQs['filter'].map((item) => {
      const filterArr = item.split('.')
      if (typeof filters[filterArr[0]] === 'undefined') {
        filters[filterArr[0]] = []
      }
      filters[filterArr[0]].push(filterArr[1])
    })
  } else if (typeof currentQs['filter'] === 'string') {
    const filterArr = currentQs['filter'].split('.')
    filters[filterArr[0]] = [filterArr[1]]
  }

  if (currentQs['q']) {
    q = currentQs['q']
  }

  return {
    currentSort: sorter,
    currentFilters: filters,
    currentSearchText: q,
  }
}
