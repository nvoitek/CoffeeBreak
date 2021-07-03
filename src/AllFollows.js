import axios from 'axios';
import { useState, useEffect } from 'react';
import Follow from './Follow';
import { axiosConfig } from './helpers/config'

function AllFollows() {
    const [follows, setFollows] = useState([]);

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