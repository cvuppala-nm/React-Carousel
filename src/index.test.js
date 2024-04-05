import mockCardReducer from './store/cardSlice';

// Mock ReactDOM.createRoot and root.render
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

jest.mock('./store/store', () => ({
  reducer: {
    card: mockCardReducer,
  },
  preloadedState: {
    card: {
      cards: [
        { id: 1, text: '1', index: 0 },
        { id: 2, text: '2', index: 1 },
        { id: 3, text: '3', index: 2 },
      ],
      slidesToShow: 3,
    },
  },
}));

jest.mock('./App', () => () => <div>Mocked App</div>);

describe('Application entry point', () => {
  it('renders without crashing', () => {
    require('./index');
    
    const ReactDOM = require('react-dom/client');
    expect(ReactDOM.createRoot).toHaveBeenCalled();
  });
});