import Vue from 'vue'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost'
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
  if (graphQLErrors) console.dir(graphQLErrors)
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

// authentication & language middleware
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = window.localStorage['Access-Token']
  if (token) {
    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        Authorization: `Bearer ${JSON.parse(token)['value']}`,
      },
    })
  }

  // Retrieve language
  const currentLang = window.localStorage['lang']
  if (currentLang) {
    const lang = JSON.parse(currentLang)['value'].split('-')[0]

    operation.setContext({
      headers: {
        'Accept-Language': lang,
      },
    })
  }

  // Call the next link in the middleware chain.
  return forward(operation)
})

// upload file for apollo
const uploadLink = createUploadLink({
  uri: `${process.env.VUE_APP_GRAPHQL_URI}`,
  headers: getHeaders(),
})

// apollo root link
const link = ApolloLink.from([authLink, errorLink, uploadLink])

export default new ApolloClient({
  link: link,
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
