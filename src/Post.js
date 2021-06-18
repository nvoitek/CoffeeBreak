import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faUserPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import ReactTimeAgo from 'react-time-ago'

function Post(props) {

    const currentUser = (localStorage.getItem('user_data') !== null ? JSON.parse(localStorage.getItem('user_data')).username : '');
    const date = new Date(props.post.created_at);

    const [post, setPost] = useState(props.post);
    const [isLiked, setIsLiked] = useState(props.post.likes.filter(x => x.username === currentUser).length !== 0);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('user_data') !== null ? JSON.parse(localStorage.getItem('user_data')).jwt_token : '')
        }
    };

    const onLike = () => {
        let url = '';
        if (isLiked) {
            url = 'https://akademia108.pl/api/social-app/post/dislike'
        } else {
            url = 'https://akademia108.pl/api/social-app/post/like'
        }

        axios.post(
            url,
            { post_id : props.post.id },
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);

                let newPost = post;
                if (isLiked) {
                    newPost.likes = post.likes.filter(x => x.username !== currentUser);
                } else {
                    newPost.likes = [...post.likes, currentUser];
                }
                setPost(newPost);
                setIsLiked(!isLiked);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    }

    const onDelete = () => {
        if (currentUser === props.post.user.username) {
            axios.post(
                'https://akademia108.pl/api/social-app/post/delete',
                { post_id : props.post.id },
                axiosConfig)
                .then((res) => {
                    console.log("RESPONSE RECEIVED: ", res);
                    props.onDeletePost(props.post.id);
                })
                .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                })
        }
    }

    return (
        <PostContainer className="Post">
            <Row className="Row">
                <Image src={post.user.avatar_url} alt={"avatar of " + post.user.username}></Image>
                <div>
                    <PostHeader className="User">{post.user.username} <ReactTimeAgo className="Date" date={date} /></PostHeader>
                    <PostContent className="Content">{post.content}</PostContent>
                </div>
            </Row>
            <Row className="Row">
                <FontAwesomeIcon className={"Icon " + (isLiked ? "liked" : "")} icon={faThumbsUp} onClick={onLike} />
                <span>{post.likes.length}</span>
                <FontAwesomeIcon className="Icon" icon={faUserPlus} />
                {
                    (currentUser === post.user.username) ? 
                    <FontAwesomeIcon className="Icon" icon={faTimes} onClick={onDelete}/> :
                    ''
                }
                
            </Row>
        </PostContainer>
    );
}

const PostContainer = styled.div`
    border-top: 1px solid grey;
`;

const Row = styled.div`
    display: flex;
    align-items: center;

    .Icon {
        cursor: pointer;
        transition: all 0.3s;
        margin: 15px;
    }

    .Icon:hover {
        color: orange;
    }

    .Icon.liked {
        color: orange;        
    }

    .Icon.liked:hover {
        color: black;
    }
`;

const Image = styled.img`
    align-self: flex-start;
    width: 80px;
`;

const PostHeader = styled.p`
    font-weight: 600;
    margin: 15px;
    
    .Date {
        color: gray;
    }
`;

const PostContent = styled.p`
    font-style: italic;
    margin: 15px;
`;

export default Post;