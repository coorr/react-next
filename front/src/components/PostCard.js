import { EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Popover, List, Comment } from 'antd';
import React, { useState,useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import PostImages from './PostImages.js';
import CommentForm from './CommentForm.js';
import PostCardContent from './PostCardContent.js';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post.js';
import FollowButton from './FollowButton.js'
import Link from 'next/link';
import moment from 'moment';

moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const id = useSelector((state) => state.user.me?.id);
  
  const { removePostLoading } = useSelector((state) => state.post);

 

  const onLike = useCallback(() => {
    if(!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    })
  },[]);
  const onUnlike = useCallback(() => {
    if(!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    })
  },[]);

  const onToggleComment = useCallback(() => {
    if(!id) {
      return alert("로그인이 필요합니다.");
    }
    setCommentFormOpened((prev) => !prev);
  },[]);

  const onRemovePost = useCallback(() => {
    if(!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id
    })
  },[]);

  const onRetweet = useCallback(() => {
    if(!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    })
  })
  // console.log(post);
  const liked = post.Likers.find((v) => v.id === id);

  return (
    <div style={{marginBottom:20}}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} /> }
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
          : <HeartOutlined key="heart"  onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover key="more" content={(
            <Button.Group>
              { id && post.User.id === id ? (  
                <>
                <Button>수정</Button>
                <Button type="danger" onClick={onRemovePost} loading={removePostLoading}>삭제</Button>
                </>
              ) : <Button>신고</Button>}
            </Button.Group>
          )}>
            <EllipsisOutlined   />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && <FollowButton post={post} />}
      >
        { post.RetweetId && post.Retweet ?
          (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />} 
            >
              <div style={{float: 'right'}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>

              <Card.Meta 
                avatar={(
                  <Link href={`/user/${post.Retweet.User.id}`}>
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                description={<PostCardContent postData={post.Retweet.content} />}
                title={post.Retweet.User.nickname}
              />
            </Card>
          )
          : (
            <>
              <div style={{float: 'right'}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta 
              avatar={(
                <Link href={`/user/${post.User.id}`}>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </Link>
              )}
              description={<PostCardContent postData={post.content} />}
              title={post.User.nickname}
              />
            </>
          
          )
        }
        
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List 
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={`/user/${item.User.id}`}>
                      <Avatar>{item.User.nickname[0]}</Avatar>
                    </Link>
                  )}
                  content={item.content}
                />
                
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post : PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt : PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
}

export default PostCard;