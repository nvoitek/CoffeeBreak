import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
import Feed from '../Feed';
import { Popup } from '../Feed';
import { setupIntersectionObserverMock } from '../helpers/mockIntersectionObserver'
  
  beforeEach(() => {
      jest.useFakeTimers();
      setupIntersectionObserverMock(); 
    });
    
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('shows Login popup after 10s', () => {
    render(<Feed />);

    act(() => {
        jest.advanceTimersByTime(10000);
      });

      const popup = screen.getByTestId("popup");

      expect(popup).toHaveStyle('bottom: 0px');
});