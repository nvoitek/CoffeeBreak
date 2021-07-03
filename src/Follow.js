import axios from 'axios';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import { axiosConfig } from './helpers/config'

function Follow(props) {

    const [follow, setFollow] = useState(props.follow);

    const onDelete = () => {
        axios.post(
            'https://akademia108.pl/api/social-app/follows/disfollow',
            { leader_id : props.follow.id },
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);

                props.onDelete(props.follow.username);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    }

    return (
        <FollowContainer>
            <Row className="Row">
                <Image src={follow.avatar_url} alt={"avatar of " + follow.username}></Image>
                <FollowHeader className="User">{follow.username}</FollowHeader>
            </Row>
            <Row className="Row">
                <FontAwesomeIcon className="Icon" icon={faTimes} onClick={onDelete}/>
            </Row>
        </FollowContainer>
    );
}

const FollowContainer = styled.div`
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

const FollowHeader = styled.p`
    font-weight: 600;
    margin: 15px;
`;

export default Follow;