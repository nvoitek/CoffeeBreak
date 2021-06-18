import { useState } from 'react';
import axios from 'axios';
import Button from './styled-components/Button';
import styled from 'styled-components';

function Signup() {

    const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [validationData, setValidationData] = useState({ hasErrors: false, isSubmitted: false, isUsernameEmpty: false, isEmailEmpty: false, isPasswordEmpty: false, isConfirmPasswordEmpty: false, doPasswordMatch: false });

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const updateFormFields = e => {
        setSignupData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSignup = (e) => {
        e.preventDefault();

        setValidationData(prevState => ({
            ...prevState,
            isUsernameEmpty: !signupData.username
        }));

        setValidationData(prevState => ({
            ...prevState,
            isEmailEmpty: !signupData.email
        }));

        setValidationData(prevState => ({
            ...prevState,
            isPasswordEmpty: !signupData.password
        }));

        setValidationData(prevState => ({
            ...prevState,
            isConfirmPasswordEmpty: !signupData.confirmPassword
        }));

        setValidationData(prevState => ({
            ...prevState,
            doPasswordMatch: signupData.password !== signupData.confirmPassword
        }));

        if (signupData.username
            && signupData.email
            && signupData.password
            && signupData.confirmPassword
            && signupData.password === signupData.confirmPassword) {
            signup(signupData);
        }
    };

    const signup = (signupData) => {
        let postData = {
            username: signupData.username,
            email: signupData.email,
            password: signupData.password
        };

        axios.post(
            'https://akademia108.pl/api/social-app/user/signup',
            postData,
            axiosConfig)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);

                if (res.data.signedup) {
                    setValidationData(prevState => ({
                        ...prevState,
                        submitMsg: `${signupData.username} created`,
                        isSubmitted: true
                    }));
                    setSignupData({ username: '', email: '', password: '', confirmPassword: '' });
                } else {

                    setValidationData(prevState => ({
                        ...prevState,
                        submitMsg: `${signupData.username} or ${signupData.email} already has an account`,
                        hasErrors: true
                    }));
                }
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
    };

    return (
        <FormContainer>
            <SignupForm className="Signup-form" onSubmit={onSignup}>
                <InfoParagraph visible={validationData.isSubmitted}>{validationData.submitMsg}</InfoParagraph>
                <ErrorParagraph visible={validationData.hasErrors}>{validationData.submitMsg}</ErrorParagraph>
                <ErrorParagraph visible={validationData.isUsernameEmpty}>Username can't be empty</ErrorParagraph>
                <Input type="text" name="username" placeholder="username" value={signupData.username} onChange={updateFormFields} />

                <ErrorParagraph visible={validationData.isEmailEmpty}>Email can't be empty</ErrorParagraph>
                <Input type="email" name="email" placeholder="email" value={signupData.email} onChange={updateFormFields} />

                <ErrorParagraph visible={validationData.isPasswordEmpty}>Password can't be empty</ErrorParagraph>
                <Input type="password" name="password" placeholder="password" value={signupData.password} onChange={updateFormFields} />

                <ErrorParagraph visible={validationData.isConfirmPasswordEmpty}>Password can't be empty</ErrorParagraph>
                <ErrorParagraph visible={validationData.doPasswordMatch}>Passwords don't match</ErrorParagraph>
                <Input type="password" name="confirmPassword" placeholder="confirm password" value={signupData.confirmPassword} onChange={updateFormFields} />

                <Button>Submit</Button>
            </SignupForm>
        </FormContainer>
    );
}

const FormContainer = styled.div`
    margin: 15px;
    padding: 15px;
`;

const SignupForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
`;

const InfoParagraph = styled.p`
    color: green;
    display: ${props => (props.visible ? 'block' : 'none')};
`;

const ErrorParagraph = styled.p`
    color: red;
    display: ${props => (props.visible ? 'block' : 'none')};
`;

const Input = styled.input`
    margin: 10px;
`;

export default Signup;