import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>);
});

test('renders the contact form header', () => {
    //arrange
    render(<ContactForm/>);
    const header = screen.queryByText(/contact form/i);
    //ask

    //assert
    expect(header).toBeTruthy();
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    //arrange
    render(<ContactForm/>);
    const fNameInput = screen.getByLabelText(/first name*/i);
    //ask
    userEvent.type(fNameInput,'poop');
    //assert
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    //arrange
    render(<ContactForm/>);
    // const fNameInput = screen.getByLabelText(/first name*/i);
    // const lNameInput = screen.getByLabelText(/last name*/i);
    // const emailInput = screen.getByLabelText(/email*/i);


    //ask
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    //assert
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    //arrange
    render(<ContactForm/>);
    const fNameInput = screen.getByLabelText(/first name*/i);
    const lNameInput = screen.getByLabelText(/last name*/i);
    //ask
    userEvent.type(fNameInput,'joseph');
    userEvent.type(lNameInput,'cep');
    userEvent.click(screen.getByRole('button'));
    //assert
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    //arrange
    render(<ContactForm/>);
    const emailInput = screen.getByLabelText(/email*/i);
    //ask
    
    userEvent.type(emailInput,'invalid@gmail');
    
    //assert
    const emailError = await screen.findByText(/email must be a valid email address/i);
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    //arrange
    render(<ContactForm/>);

    //ask
    userEvent.click(screen.getByRole('button'));
    const lNameError = await screen.findByText(/lastName is a required field/i);
    
    //assert
    expect(lNameError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    //arrange
    render(<ContactForm/>);
    const fNameInput = screen.getByLabelText(/first name*/i);
    const lNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);

    //ask
    userEvent.type(fNameInput,'Joseph');
    userEvent.type(lNameInput,'cep');
    userEvent.type(emailInput,'Joseph@test.com');
    userEvent.click(screen.getByRole('button'));


    await waitFor(() =>{
        const fNameRender = screen.queryByTestId('firstnameDisplay');
        const lNameRender = screen.queryByTestId('lastnameDisplay');
        const emailRender = screen.queryByTestId('emailDisplay');
        const messageRender = screen.queryByTestId('messageDisplay');
 
        //assert
        expect(fNameRender).toBeInTheDocument();
        expect(lNameRender).toBeInTheDocument();
        expect(emailRender).toBeInTheDocument();
        expect(messageRender).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
    const fNameInput = screen.getByLabelText(/first name*/i);
    const lNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    const messageInput = screen.getByLabelText(/message/i);

    //ask
    userEvent.type(fNameInput,'Joseph');
    userEvent.type(lNameInput,'cep');
    userEvent.type(emailInput,'Joseph@test.com');
    userEvent.type(messageInput,'teehee');
    userEvent.click(screen.getByRole('button'));


    await waitFor(() =>{
        const fNameRender = screen.queryByTestId('firstnameDisplay');
        const lNameRender = screen.queryByTestId('lastnameDisplay');
        const emailRender = screen.queryByTestId('emailDisplay');
        const messageRender = screen.queryByTestId('messageDisplay');

        //assert
        expect(fNameRender).toBeInTheDocument();
        expect(lNameRender).toBeInTheDocument();
        expect(emailRender).toBeInTheDocument();
        expect(messageRender).toBeInTheDocument();
    });

});
