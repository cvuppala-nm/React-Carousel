import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import Carousel from './Carousel';
import cardReducer from '../store/cardSlice';

const mockProps = {
  cards: [
    { id: 1, text: '1', index: 0 },
    { id: 2, text: '2', index: 1 },
    { id: 3, text: '3', index: 2 },
  ],
  slidesToShow: 3,
  onAddCard: jest.fn(),
  onCardDelete: jest.fn(),
  onCardUpdate: jest.fn(),
  onUpdateSlidesToShow: jest.fn(),
};

const mockInitialState = {
  card: {
    cards: mockProps.cards,
    slidesToShow: mockProps.slidesToShow,
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

// Updated utility function to render the component with Redux Provider
function renderCarouselWithStore(props, overrideInitialState = {}) {
  const defaultInitialState = {
    card: {
      cards: [
        { id: 1, text: '1', index: 0 },
        { id: 2, text: '2', index: 1 },
        { id: 3, text: '3', index: 2 },
      ],
      slidesToShow: 3,
    },
  };

  const store = createMockStore({ ...defaultInitialState, ...overrideInitialState });

  return render(
    <Provider store={store}>
      <Carousel {...props} />
    </Provider>
  );
}

test('snapshot test for Carousel.tsx', () => {
  const store = createMockStore({ ...mockInitialState });

  const { asFragment } = renderCarouselWithStore(
    mockProps,
    mockInitialState
  );

  expect(asFragment()).toMatchSnapshot();
});

test('renders the carousel with cards from redux store and append mirror nodes', async () => {
  renderCarouselWithStore(mockProps, mockInitialState);
  
  expect(screen.getAllByText('1')).toHaveLength(2); // mirror node
  expect(screen.getAllByText('2')).toHaveLength(3); // mirror node
  expect(screen.getAllByText('3')).toHaveLength(2); // mirror node
});

test('navigates to the next and previous slide', () => {
  renderCarouselWithStore(mockProps, mockInitialState);

  const nextButton = screen.getByLabelText('Next');
  const prevButton = screen.getByLabelText('Previous');

  // Move to next slide
  fireEvent.click(nextButton);
  expect(screen.getByTestId('slideIndex')).toHaveValue('0');

  // Move to previous slide, now it should be enabled
  fireEvent.click(prevButton);
  expect(screen.getByTestId('slideIndex')).toHaveValue('2');
});

test('adds a new card', () => {
  renderCarouselWithStore(mockProps, mockInitialState);
  fireEvent.click(screen.getByText('Add Slide'));
  expect(mockProps.onAddCard).toHaveBeenCalledTimes(1);
});

test('updates a card text', () => {
  renderCarouselWithStore(mockProps, mockInitialState);
  const firstCardInput = screen.getAllByRole('textbox')[0];
  fireEvent.change(firstCardInput, { target: { value: 'Updated Card 1' } });
  expect(mockProps.onCardUpdate).toHaveBeenCalledWith(expect.anything(), 0);
});

test('deletes a card', () => {
  renderCarouselWithStore(mockProps, mockInitialState);
  const deleteButtons = screen.getAllByText('delete');
  fireEvent.click(deleteButtons[0]);
  expect(mockProps.onCardDelete).toHaveBeenCalledTimes(1);
});