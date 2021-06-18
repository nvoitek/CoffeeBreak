import { useState } from 'react';
import axios from 'axios';
import Button from './styled-components/Button';
import styled from 'styled-components';

function NewPost() {
    const [postMessage, setPostMessage] = useState('');

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('user_data') !== null ? JSON.parse(localStorage.getItem('user_data')).jwt_token : '')
        }
    };

    const onPostMessageChange = (e) => {
        setPostMessage(e.target.value);
    }

    const onAddPost = (e) => {
        e.preventDefault();

        axios.post(
            'https://akademia108.pl/api/social-app/post/add',
            { content: postMessage },
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);

                if (res.data.message === 'Post added') {
                    setPostMessage('');
                }

            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    }

    return (
        <PostForm onSubmit={onAddPost}>
            <PostMessage placeholder="what do you want to say?" value={postMessage} onChange={onPostMessageChange} />
            <Button>Submit</Button>
        </PostForm>
    );
}

const PostForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
`;

const PostMessage = styled.textarea`
    min-width: 400px;
    min-height: 100px;
`;

export default NewPost;