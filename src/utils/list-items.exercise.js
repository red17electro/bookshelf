import {queryCache, useMutation, useQuery} from 'react-query'
import {client} from './api-client.exercise'

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
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
  const [update] = useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      ...defaultMutationOptions,
      ...props,
    },
  )

  return update
}

const useRemoveListItem = (user, ...props) => {
  const [remove] = useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        method: 'DELETE',
        token: user.token,
      }),
    {
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
