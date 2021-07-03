import { useState } from 'react';
import axios from 'axios';
import Button from './styled-components/Button';
import styled from 'styled-components';
import { axiosConfig } from './helpers/config'

function Signup() {

    const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [validationData, setValidationData] = useState({ hasErrors: false, isSubmitted: false, isUsernameEmpty: false, isEmailEmpty: false, isPasswordEmpty: false, isConfirmPasswordEmpty: false, doPasswordMatch: false });

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
            isUsernameEmpty: !signupData.username,
            isEmailEmpty: !signupData.email,
            isPasswordEmpty: !signupData.password,
            isConfirmPasswordEmpty: !signupData.confirmPassword,
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
                {(validationData.isSubmitted) ? <InfoParagraph>{validationData.submitMsg}</InfoParagraph> : ''}
                {(validationData.hasErrors) ? <ErrorParagraph>{validationData.submitMsg}</ErrorParagraph> : ''}
                {(validationData.isUsernameEmpty) ? <ErrorParagraph>Username can't be empty</ErrorParagraph> : ''}
                
                <Input type="text" name="username" placeholder="username" value={signupData.username} onChange={updateFormFields} />

                {(validationData.isEmailEmpty) ? <ErrorParagraph>Email can't be empty</ErrorParagraph> : ''}
                <Input type="email" name="email" placeholder="email" value={signupData.email} onChange={updateFormFields} />

                {(validationData.isPasswordEmpty) ? <ErrorParagraph>Password can't be empty</ErrorParagraph> : ''}
                <Input type="password" name="password" placeholder="password" value={signupData.password} onChange={updateFormFields} />

                {(validationData.isConfirmPasswordEmpty) ? <ErrorParagraph>Password can't be empty</ErrorParagraph> : ''}
                {(validationData.doPasswordMatch) ? <ErrorParagraph>Passwords don't match</ErrorParagraph> : ''}
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
`;

const ErrorParagraph = styled.p`
    color: red;
`;

const Input = styled.input`
    margin: 10px;
`;

export default Signup;