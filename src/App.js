import { useSelector, useDispatch } from 'react-redux';
import Carousel from './components/Carousel';
import './styles/index.scss';
import { addCard, cardDelete, cardUpdate, selectCards, selectSlidesToShow, updateSlidesToShow } from './store/cardSlice';

function App() {
  const cards = useSelector(selectCards);
  const slidesToShow = useSelector(selectSlidesToShow);

  const dispatch = useDispatch();

  const handleAddCard = (index) => {
    dispatch(addCard(index)); // calling redux action to add new card
  };

  const handleOnCardUpdate = (e, index) => {
    const { value } = e.target;
    dispatch(cardUpdate({ index, value }))
  };

  const handleOnCardDelete = (index) => {
    dispatch(cardDelete(index))
  };

  const handleOnUpdateSlidesToShow = (value) => {
    dispatch(updateSlidesToShow(value))
  };

  return (
    <div className="app-container">
      <Carousel
        cards={cards}
        slidesToShow={slidesToShow}
        onAddCard={handleAddCard}
        onCardDelete={handleOnCardDelete}
        onCardUpdate={handleOnCardUpdate}
        onUpdateSlidesToShow={handleOnUpdateSlidesToShow}
      />
    </div>
  );
}

export default App;
