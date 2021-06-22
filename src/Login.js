import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import Button from './styled-components/Button';
import styled from 'styled-components';

function Login(props) {

    const [loginData, setLoginData] = useState({username : '', password : ''});
    const [validationData, setValidationData] = useState({hasErrors : false, isSubmitted : false, isUsernameEmpty : false, isPasswordEmpty : false});
    
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const history = useHistory();

    const updateFormFields = e => {
        setLoginData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onLogin = (e) => {
        e.preventDefault();

        setValidationData(prevState => ({
            ...prevState,
            isUsernameEmpty : !loginData.username
        }));

        setValidationData(prevState => ({
            ...prevState,
            isPasswordEmpty : !loginData.password
        }));

        if (loginData.username
            && loginData.password) {
                login(loginData);
            }
    };

    const login = (loginData) => {
        let postData = {
            username: loginData.username,
            password: loginData.password,
            ttl: 3600
        };

        axios.post(
            'https://akademia108.pl/api/social-app/user/login', 
            postData, 
            axiosConfig)
        .then((res) => {
            console.log("RESPONSE RECEIVED: ", res);

            if (!res.data.error) {
                setValidationData(prevState => ({
                    ...prevState,
                    submitMsg : `${loginData.username} logged in`,
                    isSubmitted : true
                }));
                setLoginData({username : '', password : ''});
    
                localStorage.setItem('user_data', JSON.stringify(res.data));

                props.onLogin();
    
                history.push("/");
            } else {
                setValidationData(prevState => ({
                    ...prevState,
                    submitMsg : 'Unable to login',
                    hasErrors : true
                }));
            }
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            setValidationData(prevState => ({
                ...prevState,
                submitMsg : 'Unable to login',
                hasErrors : true
            }));
        });
    };
    
    return (
        <FormContainer>
            <LoginForm className="Signup-form" onSubmit={onLogin}>
                {(validationData.isSubmitted) ? <InfoParagraph>{validationData.submitMsg}</InfoParagraph> : ''}
                {(validationData.hasErrors) ? <ErrorParagraph>{validationData.submitMsg}</ErrorParagraph> : ''}
                {(validationData.isUsernameEmpty) ? <ErrorParagraph>Username can't be empty</ErrorParagraph> : ''}
                <Input type="text" name="username" placeholder="username" value={loginData.username} onChange={updateFormFields}/>

                {(validationData.isPasswordEmpty) ? <ErrorParagraph>Password can't be empty</ErrorParagraph> : ''}
                <Input type="password" name="password" placeholder="password" value={loginData.password} onChange={updateFormFields}/>

                <Button>Submit</Button>
            </LoginForm>
        </FormContainer>
    );
}

const FormContainer = styled.div`
    margin: 15px;
    padding: 15px;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
`;

const InfoParagraph = styled.p`
    color: green;
`;

const ErrorParagraph = styled.p`
    color: red;
`;

const Input = styled.input`
    margin: 10px;
`;

export default Login;