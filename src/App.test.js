import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';

import App from './App';
import cardReducer from './store/cardSlice';

const mockInitialState = {
  card: {
    cards: [
      { id: 1, text: '1', index: 0 },
      { id: 2, text: '2', index: 1 },
      { id: 3, text: '3', index: 2 },
    ],
    slidesToShow: 3,
  },
};

// Utility function to create a mock Redux store
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      card: cardReducer,
    },
    preloadedState: initialState,
  });
};

test('snapshot test for App.tsx', () => {
  const store = createMockStore({ ...mockInitialState });

  const { asFragment } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(asFragment()).toMatchSnapshot();
});


test('renders Carousel component with data from Redux store', () => {
  const store = createMockStore({ ...mockInitialState });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByRole('toolbar')).toBeInTheDocument();
});

test('handle add card callback', () => {
  const store = createMockStore({ ...mockInitialState });
  
  store.dispatch = jest.fn();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const addCardButton = screen.getByText(/Add Slide/i);
  fireEvent.click(addCardButton);

  expect(store.dispatch).toHaveBeenCalled();
});

test('handle delete card callback', () => {
  const store = createMockStore({ ...mockInitialState });
  
  store.dispatch = jest.fn();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const addCardButton = screen.getAllByText(/delete/i)[0];
  fireEvent.click(addCardButton);

  expect(store.dispatch).toHaveBeenCalled();
});

test('handle update card callback', () => {
  const store = createMockStore({ ...mockInitialState });
  
  store.dispatch = jest.fn();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const input = screen.getByTestId('slideIndex');
  expect(input).toBeInTheDocument();

  fireEvent.change(input, {target: {value: '22'}})
  expect(store.dispatch).toHaveBeenCalled();
});