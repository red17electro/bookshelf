import {queryCache, useMutation, useQuery} from 'react-query'
import {client} from './api-client.exercise'
import {setQueryDataForBook} from './books.exercise'

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
  onError(err, variables, recover) {
    if (typeof recover === 'function') {
      recover()
    }
  },
}

const useCreateListItem = (user, ...props) => {
  const [create] = useMutation(
    ({bookId}) =>
      client(`list-items`, {
        data: {
          bookId,
        },
        token: user.token,
      }),
    {
      ...defaultMutationOptions,
      ...props,
    },
  )

  return create
}

const useUpdateListItem = (user, ...props) => {
  const result = useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items')
        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })
        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...props,
    },
  )

  return result
}

const useRemoveListItem = (user, ...props) => {
  const [remove] = useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        method: 'DELETE',
        token: user.token,
      }),
    {
      onMutate(removedItem) {
        const previousItems = queryCache.getQueryData('list-items')
        queryCache.setQueryData('list-items', old => {
          return old.filter(item => item.id !== removedItem.id)
        })
        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...props,
    },
  )

  return remove
}

const useListItems = user => {
  const {data: listItems} = useQuery({
    queryKey: ['list-items'],
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
    config: {
      onSuccess(listItems) {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })

  return listItems ?? []
}

const useListItem = (bookId, user) => {
  const listItems = useListItems(user)
  return listItems?.find(item => item.bookId === bookId) ?? null
}

export {
  useCreateListItem,
  useRemoveListItem,
  useUpdateListItem,
  useListItem,
  useListItems,
}
