import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faUserPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import ReactTimeAgo from 'react-time-ago'

function Post(props) {

    const date = new Date(props.post.created_at);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('user_data') !== null ? JSON.parse(localStorage.getItem('user_data')).jwt_token : '')
        }
    };

    const currentUser = (localStorage.getItem('user_data') !== null ? JSON.parse(localStorage.getItem('user_data')).username : '');

    const onLike = () => {
        let url = '';
        if (props.post.likes.filter(x => x.username === currentUser).length !== 0) {
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
    
                })
                .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                })
        }
    }

    return (
        <PostContainer className="Post">
            <Row className="Row">
                <Image src={props.post.user.avatar_url} alt={"avatar of " + props.post.user.username}></Image>
                <div>
                    <PostHeader className="User">{props.post.user.username} <ReactTimeAgo className="Date" date={date} /></PostHeader>
                    <PostContent className="Content">{props.post.content}</PostContent>
                </div>
            </Row>
            <Row className="Row">
                <FontAwesomeIcon className="Icon" icon={faThumbsUp} onClick={onLike} />
                <FontAwesomeIcon className="Icon" icon={faUserPlus} />
                {
                    (currentUser === props.post.user.username) ? 
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