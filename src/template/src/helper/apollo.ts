import Vue from 'vue'
import ApolloClient from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { notification } from 'ant-design-vue'

const getHeaders = () => {
  const headers = {}
  const token = window.localStorage['Access-Token']
  const currentLang = window.localStorage['lang']

  if (token) {
    headers['Authorization'] = `Bearer ${JSON.parse(token)['value']}`
  }

  if (currentLang) {
    const lang = JSON.parse(currentLang)['value'].split('-')[0]
    headers['Accept-Language'] = lang
  }

  return headers
}

// Error Handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      notification.error({
        message: message,
        description: path as any,
      })
    )
  if (networkError) {
    notification.error({
      message: 'Network error',
      description: networkError.toString(),
    })
  }
})

export default new ApolloClient({
  link: errorLink.concat(
    createUploadLink({
      uri: `${process.env.VUE_APP_GRAPHQL_URI}`,
      headers: getHeaders(),
    })
  ),
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})
