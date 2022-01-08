import React from 'react';
import { Card, Avatar, Button } from 'antd';
import { useCallback } from 'react/cjs/react.development';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user.js';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user)

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <>
        <div key='twit'>찍찍<br />{me.Posts.length}</div>
        <div key='followings'>팔로잉<br />{me.Followings.length}</div>
        <div key='followings'>팔로워<br />{me.Followers.length}</div>
        </>
      ]}
    >
      <Card.Meta 
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading} >로그아웃</Button>
    </Card>
  );
};

export default UserProfile;