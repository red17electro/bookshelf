import {queryCache, useQuery} from 'react-query'
import {client} from './api-client.exercise'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const refetchBookSearchQuery = user => {
  queryCache.removeQueries(['bookSearch'])
  queryCache.prefetchQuery(getBoookSearchConfig('', user))
}

const setQueryDataForBook = book => {
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}

const getBoookSearchConfig = (query, user) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  config: {
    onSuccess(books) {
      for (const book of books) {
        setQueryDataForBook(book)
      }
    },
  },
})

const useBookSearch = (query, user) => {
  const result = useQuery(getBoookSearchConfig(query, user))

  return {...result, books: result.data ?? loadingBooks}
}

const useBook = (bookId, user) => {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })

  return data ?? loadingBook
}

export {useBookSearch, useBook, refetchBookSearchQuery, setQueryDataForBook}
