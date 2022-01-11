import shortid from "shortid";
import { ADD_POST_TO_ME } from "./user";
import produce from 'immer';
import faker from '@withshepherd/faker';

export const initialState = {
  mainPosts: [{
    id:1,
    User: {
      id:1,
      nickname: '김진성'
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스',
    Images: [{
      id: shortid.generate(),
      src:  'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?update=20180726'
    }, {
      id: shortid.generate(),
      src : 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?update=20180726'
    },{
      id: shortid.generate(),
      src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?update=20180726'
    }],
    Comments: [{
      id: shortid.generate(),
      User: {
        id: shortid.generate(),
        nickname: 'nero',
      },
      content: '우와 개정판이 나왔군요~'
    }, {
      User: {
        id: shortid.generate(),
        nickname: 'hero'
      },
      content: '얼른 사고싶어요'
    }]
  }],
  imagePaths: [],
  hasMorePost: true,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,

  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  removePostLoading: false,
  removePostDone: false,
  removePostError: null,

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
}

export const generateDummyPost = (number) => 
  Array(number).fill().map((v,i) => ({
    id:shortid.generate(),
    User: {
      id: shortid.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.paragraph(),
    Images: [{
      src: faker.image.image(),
    }],
    Comment: [{
      User: {
        id:shortid.generate(),
        nickname:faker.name.findName(),
      }, 
      content: faker.lorem.sentence(),
    }],
  }))


export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE"; 

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
})

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
})

const dummyPost = (data) =>  ({
  id: data.id,
  content: data.content,
  User: {
    id:1,
    nickname:'김진성2'
  },
  Images: [{
    src: null
  }],
  Comments: [],
}) 

const dummyComment = (data) => ({
  id:shortid.generate(),
  content: data,
  User: {
    id: 1,
    nickname:'김진성2'
  },
})

// reducer == 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성을 지키면서)
const reducer = (state = initialState,action) => produce(state, (draft) => {
    switch(action.type) {
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading=true;
        draft.loadPostsDone=false;
        draft.loadPostsError=null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.mainPosts = action.data.concat(draft.mainPosts);
        draft.loadPostsLoading=false;
        draft.loadPostsDone=true;
        draft.loadPostsError=null;
        draft.hasMorePost = draft.mainPosts.length < 50;
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading=false;
        draft.loadPostsError=action.error
        break;

      case ADD_POST_REQUEST:
        draft.addPostLoading=true;
        draft.addPostDone=false;
        draft.addPostError=null;
        break;
      case ADD_POST_SUCCESS:
        draft.mainPosts.unshift(dummyPost(action.data));
        draft.addPostLoading=false;
        draft.addPostDone=true;
        draft.addPostError=null;
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading=false;
        draft.addPostError=action.error
        break;
  
      case REMOVE_POST_REQUEST:
        draft.removePostLoading=true;
        draft.removePostDone=false;
        draft.removePostError=null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.mainPosts= draft.mainPosts.filter((v)=> v.id !== action.data);
        draft.removePostLoading=false;
        draft.removePostDone=true;
        draft.removePostError=null;
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading=false;
        draft.removePostError=action.error
        break;
  
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading=true;
        draft.addCommentDone=false;
        break;
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);  
        post.Comments.unshift(dummyComment(action.data.content));   // 게시글 글 넣어주기
        draft.addCommentLoading=false;
        draft.addCommentDone=true;
        draft.addCommentError=null;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading=false;
        draft.addCommentError=action.error
        break;
      default:
        break;
    }
  })


export default reducer;