import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

function Recommendation(props) {

    const [recommendation, setRecommendation] = useState(props.recommendation);

    return (
        <RecommendationContainer>
            <Row className="Row">
                <Image src={recommendation.avatar_url} alt={"avatar of " + recommendation.username}></Image>
                <RecommendationHeader className="User">{recommendation.username}</RecommendationHeader>
            </Row>
            <Row className="Row">
                <FontAwesomeIcon className="Icon" icon={faUserPlus} />
            </Row>
        </RecommendationContainer>
    );
}

const RecommendationContainer = styled.div`
    border: 1px solid grey;
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

const RecommendationHeader = styled.p`
    font-weight: 600;
    margin: 15px;
`;

export default Recommendation;