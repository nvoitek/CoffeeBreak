import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Feed from './Feed';
import Signup from './Signup';
import Login from './Login';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('user_data') !== null);

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('user_data') !== null ? JSON.parse(localStorage.getItem('user_data')).jwt_token : '')
    }
  };

  const onLogout = () => {
    if (isLoggedIn) {
      axios.post(
        'https://akademia108.pl/api/social-app/user/logout',
        '',
        axiosConfig)
        .then((res) => {
          console.log("RESPONSE RECEIVED: ", res);
          setIsLoggedIn(false);
          localStorage.clear();
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
        })
    }
  };

  const onLogin = () => {
    setIsLoggedIn(true);
  }



  return (
    <Router>
      <AppContainer>
        <NavMenu>
          <NavList>
            <NavListItem>
              <Link to="/"><FontAwesomeIcon className="Icon" icon={faMugHot} /></Link>
            </NavListItem>
            <NavListItem>
              <Link to="/">Home</Link>
            </NavListItem>
            {
              (isLoggedIn ?
                <>
                  <NavListItem>
                    <Link to="/login" onClick={onLogout}>Logout</Link>
                  </NavListItem>
                </>
                :
                <>
                  <NavListItem>
                    <Link to="/signup">SignUp</Link>
                  </NavListItem>
                  <NavListItem>
                    <Link to="/login">Login</Link>
                  </NavListItem>
                </>)
            }
          </NavList>
        </NavMenu>

        <ContentContainer>
          <HeaderContainer>
            <Heading1>Coffee Break</Heading1>
          </HeaderContainer>

          <Switch>
            <Route exact path="/">
              <Feed isLoggedIn={isLoggedIn} onLogin={onLogin}/>
            </Route>
            <Route path="/login">
              <Login onLogin={onLogin} />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
          </Switch>
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

const AppContainer = styled.div`

`;

const ContentContainer = styled.div`
  margin-left: 200px;
`;

const HeaderContainer = styled.header`
  background-color: black;
`;

const Heading1 = styled.h1`
  margin: 0 15px 0 15px;
  padding: 20px;
  color: white;
  font-size: 3.5em;
`;

const NavMenu = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  min-height: 100vh;
  min-width: 200px;
  border-right: solid 1px grey;
`;

const NavList = styled.ul`
  list-style-type: none;
  text-align: center;
  padding: 0;
  margin: 0;

  .Icon {
    cursor: pointer;
    transition: all 0.3s;
    font-size: 2.25em;
  }

  .Icon:hover {
    color: orange;
  }
`;

const NavListItem = styled.li`
  margin: 15px;

  a {
    text-decoration: none;
    color: black;
    font-size: 2em;
    font-weight: 800;
    transition: all 0.3s;s
  }

  a:hover {
    color: orange;
  }
`;

export default App;
