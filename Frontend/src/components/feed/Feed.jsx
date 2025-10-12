import React, { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import {BASE_URL} from '../../utils/constant'
import { addFeed } from '../../utils/feedSlice'
import UserCard from './UserCard'
function Feed() {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch()

  const getFeed = async () => {
    if(feed) return;

    try{
      const res = await axios.get(BASE_URL + '/feed', {}, {withCredentials: true})
      dispatch(addFeed(res?.data))
    }
    catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {getFeed()}, [])
  return feed && (
    <>
    {feed.map((user) => {
      return <UserCard user={user} />
    })}
    </>
  )
}

export default Feed