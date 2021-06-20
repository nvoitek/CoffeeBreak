import Post from './Post';
import NewPost from './NewPost';
import Login from './Login';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { InView } from 'react-intersection-observer'
import coffee from './img/coffee.gif';

function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [latestPostDate, setLatestPostDate] = useState({});
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [inView, setInView] = useState(false);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('user_data') !== null ? JSON.parse(localStorage.getItem('user_data')).jwt_token : '')
        }
    };

    useEffect(() => {
        getPosts();

        let intervalId = setInterval(() => showLoginPopup(), 10000);

        return function cleanup() {
            console.log(`Clean Interval - ${Date.now()}`);
            clearInterval(intervalId);
        }
    }, []);

    const showLoginPopup = () => {
        if (!props.isLoggedIn) {
            setIsPopupVisible(true);
        }
    };

    const getPosts = () => {
        axios.post(
            'https://akademia108.pl/api/social-app/post/latest',
            '',
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                setPosts([...res.data]);

                let lastPost = res.data[res.data.length - 1];
                setLatestPostDate(lastPost.created_at);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    }

    const getMorePosts = (e) => {
        setInView(e);
        if (e) {
            axios.post(
                'https://akademia108.pl/api/social-app/post/older-then',
                { date: latestPostDate },
                axiosConfig)
                .then((res) => {
                    console.log("RESPONSE RECEIVED: ", res);
                    setPosts(prevState => [...prevState, ...res.data]);

                    let lastPost = res.data[res.data.length - 1];
                    setLatestPostDate(lastPost.created_at);
                })
                .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                })
        }
    }

    const onLogin = () => {
        setIsPopupVisible(false);
        props.onLogin();
    }

    const onAddPost = (postMessage) => {
        let user_data = JSON.parse(localStorage.getItem("user_data"));
        let newPost = {
            user: {
                username: user_data.username,
                avatar_url: ''
            },
            created_at: Date.now(),
            content: postMessage
        };

        setPosts(prevState => [newPost, ...prevState]);
    }

    const onDeletePost = (postId) => {
        let newPosts = posts.filter(x => x.id !== postId);
        setPosts(newPosts);
    }

    return (
        <div inView={inView}>
            {(props.isLoggedIn ? <NewPost onAddPost={onAddPost} /> : '')}
            {
                posts.map((item) => {
                    return <Post key={item.id} post={item} onDeletePost={onDeletePost} />
                })
            }
            <InView onChange={getMorePosts}>
                {({ ref }) => (
                    <Container ref={ref}>
                        <LoadingGif src={coffee} alt="coffee is brewing" />
                    </Container>
                )}
            </InView>
            <Popup visible={!props.isLoggedIn && isPopupVisible}>
                <Login onLogin={onLogin} />
            </Popup>
        </div>
    );
}

const Popup = styled.div`
  background-color: white;
  border: 1px solid black;
  position: fixed;
  left: 45%;
  height: 250px;
  width: 300px;
  transition: all 1s;

  ${props => (props.visible ?
        'bottom: 0px;'
        :
        'bottom: -250px;'
    )}
`;

const LoadingGif = styled.img`
    width: 32px;
    height: 32px;
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px;
`;

export default Feed;