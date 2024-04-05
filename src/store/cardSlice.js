import { createSlice } from '@reduxjs/toolkit'

const defaultCards = [
  {
    id: 1,
    text: '1',
    index: 0
  },
  {
    id: 2,
    text: '2',
    index: 1
  },
  {
    id: 3,
    text: '3',
    index: 2
  },
  {
    id: 4,
    text: '4',
    index: 3
  },
  {
    id: 5,
    text: '5',
    index: 4
  }
];

export const cardSlice = createSlice({
  name: 'card',
  initialState: {
    cards: [...defaultCards],
    slidesToShow: 3, // by default 3 for desktop
  },
  reducers: {
    addCard: (state, action) => {
      const cards = [...state.cards];
      cards.push({
        id: Number(action.payload) + 1,
        index: action.payload,
        text: '',
      })
      state.cards = cards;
    },
    cardUpdate: (state, action) => {
      const { value, index } = action.payload;
      const updatedCards = [...state.cards];
      updatedCards[index].text = value;
      state.cards = updatedCards;
    },
    cardDelete: (state, action) => {
      const updatedCards = [...state.cards];
      updatedCards.splice(action.payload, 1);
      state.cards = updatedCards;
    },
    updateSlidesToShow: (state, action) => {
      state.slidesToShow = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  addCard,
  cardUpdate,
  cardDelete,
  updateSlidesToShow
} = cardSlice.actions

export const selectCards = (state) => state.card.cards
export const selectSlidesToShow = (state) => state.card.slidesToShow

export default cardSlice.reducer