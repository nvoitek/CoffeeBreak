import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'
// import { act } from 'react-dom/test-utils';
import Login from '../Login';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

// declare which API requests to mock
const server = setupServer(
    // capture "GET /greeting" requests
    rest.post('https://akademia108.pl/api/social-app/user/login', (req, res, ctx) => {
      // respond using a mocked JSON body
      return res(ctx.json(
            {
                username: "adam",
                ttl: 600,
                jwt_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvdXNlclwvbG9naW4iLCJpYXQiOjE1OTU5MjcwMTksImV4cCI6MTU5NTk2MzAxOSwibmJmIjoxNTk1OTI3MDE5LCJqdGkiOiI1SnBTVWNoU1htQ0lkWnZnIiwic3ViIjoxLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.AZ24dPJrCkjhEkle9U78wS_hM5GdCCbmTFJwc9t5wok",
                error: false
            })
        )
    })
  )
  
  // establish API mocking before all tests
  beforeAll(() => server.listen())
  // reset any request handlers that are declared as a part of our tests
  // (i.e. for testing one-time error scenarios)
  afterEach(() => server.resetHandlers())
  // clean up once the tests are done
  afterAll(() => server.close())

test('renders username and password', () => {
    render(<Login />);

    const username = screen.getByPlaceholderText('username');
    const password = screen.getByPlaceholderText('password');
    const submit = screen.getByRole('button');

    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
});
  
test('renders warning if username is empty', () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button'));

    const warning = screen.getByText("Username can't be empty");

    expect(warning).toBeInTheDocument();
});

test('renders warning if password is empty', () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button'));

    const warning = screen.getByText("Password can't be empty");

    expect(warning).toBeInTheDocument();
});

test("calls login if username and password aren't empty", async () => {
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'adam' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: '1234' } });

    // await userEvent.type(screen.getByPlaceholderText('username'), 'adam');
    // await userEvent.type(screen.getByPlaceholderText('password'), '1234');

    fireEvent.click(screen.getByRole('button'));

    expect(await screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(await screen.getByPlaceholderText('password')).toBeInTheDocument();
});