import Post from './Post';
import Recommendation from "./Recommendation";
import NewPost from './NewPost';
import Login from './Login';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { InView } from 'react-intersection-observer'
import coffee from './img/coffee.gif';
import { axiosConfig } from './helpers/config'

function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [follows, setFollows] = useState([]);
    const [newestPostDate, setNewestPostDate] = useState({});
    const [latestPostDate, setLatestPostDate] = useState({});
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isRightPaneVisible, setIsRightPaneVisible] = useState(false);

    useEffect(() => {
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

    const getRecommendations = () => {
        axios.post(
            'https://akademia108.pl/api/social-app/follows/recommendations',
            '',
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                setRecommendations([...res.data]);
                setIsRightPaneVisible(true);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    };

    const getFollows = () => {
        axios.post(
            'https://akademia108.pl/api/social-app/follows/allfollows',
            '',
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                setFollows([...res.data]);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    }

    const getPosts = () => {
        axios.post(
            'https://akademia108.pl/api/social-app/post/latest',
            '',
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                setPosts([...res.data]);

                let firstPost = res.data[0];
                setNewestPostDate(firstPost.created_at);

                let lastPost = res.data[res.data.length - 1];
                setLatestPostDate(lastPost.created_at);
                
                if(props.isLoggedIn){
                    getRecommendations();
                    getFollows();
                }
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    };

    const getMorePosts = (e) => {
        if (e) {
            if (posts.length === 0) {
                getPosts();
            } else {
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
    }

    const getNewPosts = () => {
        axios.post(
            'https://akademia108.pl/api/social-app/post/newer-then',
            { date: newestPostDate },
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                setPosts(prevState => [...res.data, ...prevState]);

                let firstPost = res.data[0];
                setNewestPostDate(firstPost.created_at);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    }

    const onLogin = (user) => {
        setIsPopupVisible(false);
        props.onLogin(user);
        getRecommendations();
    }

    const onAddPost = () => {
        getNewPosts();
    }

    const onDeletePost = (postId) => {
        let newPosts = posts.filter(x => x.id !== postId);
        setPosts(newPosts);
    }

    const onFollow = (username) => {
        setFollows([...follows, { username : username }]);
        
        let newRecommendations = recommendations.filter(x => x.username !== username);
        setRecommendations(newRecommendations);
    }

    return (
        <div>
            {(props.isLoggedIn ? <NewPost onAddPost={onAddPost} /> : '')}
            {
                posts.map((item) => {
                    return <Post key={item.id} post={item} follows={follows} onDeletePost={onDeletePost} />
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
            <RightPane visible={props.isLoggedIn && isRightPaneVisible}>
                {
                    recommendations.map((item) => {
                        return <Recommendation key={item.id} recommendation={item} onFollow={onFollow}/>
                    })
                }
            </RightPane>
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
        'bottom: -260px;'
    )}
`;

const RightPane = styled.div`
  background-color: white;
  border: 1px solid grey;
  position: fixed;
  top: 45%;
  width: 250px;
  transition: all 1s;

  ${props => (props.visible ?
        'right: 0px;'
        :
        'right: -260px;'
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