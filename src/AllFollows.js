import axios from 'axios';
import { useState, useEffect } from 'react';
import Follow from './Follow';

function AllFollows() {
    const [follows, setFollows] = useState([]);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('user_data') !== null ? JSON.parse(localStorage.getItem('user_data')).jwt_token : '')
        }
    };

    useEffect(() => {
        getFollows();
    }, []);

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
    };

    const onDelete = (username) => {
        let newFollows = follows.filter(x => x.username !== username);
        setFollows(newFollows);
    }

    return (
        <div>
            {
                follows.map((item) => {
                    return <Follow key={item.id} follow={item} onDelete={onDelete} />
                })
            }
        </div>
    );
}

export default AllFollows;