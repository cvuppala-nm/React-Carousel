import React, { useRef, useState, useCallback } from 'react';
import '../styles/carousel.scss';
import { MAX_SLIDES, SLIDE_WIDTH } from '../constants/appConstants';
import useResizeListener from '../hooks/useResizeListener';
import useMirrorNodes from '../hooks/useMirrorNodes';

const Carousel = ({ cards, slidesToShow, onAddCard, onCardDelete, onCardUpdate, onUpdateSlidesToShow }) => {
  // slides parent component
  const slidesContainerRef = useRef(null);

  const [slideIndex, setSlideIndex] = useState(2); // 2 - to handle offset for mirror nodes
  const [nodesCount, setNodesCount] = useState(cards.length);

  // Utility function to animate slide movement
  const animateSlide = useCallback((startIndex, endIndex, cb) => {
    const startTime = Date.now();
    const duration = 500; // Duration of the animation in milliseconds
    const startValue = startIndex * SLIDE_WIDTH * -1;
    const endValue = endIndex * SLIDE_WIDTH * -1;
    const changeInValue = endValue - startValue;

    const animate = () => {
      const currentTime = Date.now() - startTime;
      const timeFraction = Math.min(currentTime / duration, 1);
      const easing = timeFraction < 0.5 ? 4 * timeFraction ** 3 : 1 - Math.pow(-2 * timeFraction + 2, 3) / 2; // Ease in-out cubic
      const currentValue = startValue + changeInValue * easing;

      if (slidesContainerRef.current) {
        slidesContainerRef.current.style.transform = `translate3d(${currentValue}px, 0, 0)`;
      }

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        // optional callback when animation is completed
        cb?.();
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Update nodes count based on the actual children in the DOM
  const updateNodesCount = useCallback(() => {
    if (slidesContainerRef.current) {
      setNodesCount(slidesContainerRef.current.children.length);
    } else {
      setNodesCount(cards.length);
    }
  }, [cards.length]);

  // Custom hook to manage mirror nodes
  useMirrorNodes(slidesContainerRef, cards, updateNodesCount); 

  // Handle window resize with a custom hook to handle responsive view
  useResizeListener(() => {
    const n = Math.floor(window.innerWidth / (SLIDE_WIDTH + 100)); // 100 - some random offset
    const slides = Math.min(MAX_SLIDES, n);
    onUpdateSlidesToShow(slides);
  });

  const listStyles = {
    width: `calc(${Math.min(nodesCount, slidesToShow) * SLIDE_WIDTH}px - 2px)`,
  };

  const trackStyles = {
    transform: `translate3d(${(SLIDE_WIDTH * slideIndex) * -1}px, 0, 0)`,
    width: `calc(${nodesCount * SLIDE_WIDTH}px)`,
  };

  // callback for moving forward to next slide
  const handleNextClick = useCallback(() => {
    // new index for slides
    const newIndex = (slideIndex + 1) % cards.length;
    // request forward animation for navigating beteen slides
    animateSlide(slideIndex, newIndex === 0 ? cards.length : newIndex);
    // set current slide index
    setSlideIndex(newIndex);
  }, [animateSlide, cards.length, slideIndex]);

  // callback for moving back to previous slide
  const handlePrevClick = useCallback(() => {
    // new index for slides
    const newIndex = slideIndex === 0 ? cards.length - 1 : slideIndex - 1;
    // request backward animation for navigating beteen slides
    animateSlide(slideIndex, newIndex);
    // set current slide index
    setSlideIndex(newIndex === 0 ? cards.length : newIndex); // for infinite loop, making index --> cards.length, when newIndex is 0
  }, [animateSlide, cards.length, slideIndex]);

  /** handle on add button click */
  const handleOnAddCard = () => {
    const i = cards?.length
      ? cards[cards.length - 1].index
      : -1;
    
    onAddCard(i + 1);
  };

  /** handle on card update */
  const handleOnCardUpdate = (e, index) => {
    const el = slidesContainerRef.current;

    if (index === 0) {
      el.children[el.children.length - 2].querySelector('h3').textContent = e.target.value;
    }

    if (index === (cards.length - 1)) {
      el.children[1].querySelector('h3').textContent = e.target.value;
    }
    
    onCardUpdate(e, index);
  };

  /** handle on card delete */
  const handleOnCardDelete = (index) => {
    onCardDelete(index);
  };

  return (
    <>
      <div className="carousel-wrapper" role="toolbar">
        <button type="button" className="carousel-nav-btn" aria-label="Previous" onClick={handlePrevClick} disabled={cards.length < slidesToShow}>
          <i className="arrow left"></i>
        </button>
        <div className="carousel-list" style={listStyles}>
          <div className="carousel-track" role="listbox" ref={slidesContainerRef} style={trackStyles}>
            {cards.map((card) => (
              <div key={card.id} className="slide" data-index={card.index} tabIndex="-1">
                <h3>{card.text}</h3>
              </div>
            ))}
          </div>
          <input type="hidden" data-testid="slideIndex" value={slideIndex} />
        </div>
        <button type="button" className="carousel-nav-btn" aria-label="Next" onClick={handleNextClick} disabled={cards.length < slidesToShow}>
          <i className="arrow right"></i>
        </button>
      </div>
      <hr />
      <div className="slides-heading">
        <h3>Slides - ({cards.length})</h3>
        <button type="button" onClick={handleOnAddCard}>Add Slide</button>
      </div>
      <div className="slides-inputs">
        {cards.map((card, index) => (
          <div key={card.id}>
            <input type="text" value={card.text} onChange={(e) => handleOnCardUpdate(e, index)} />
            {cards.length > 1 && (
              <button type="button" onClick={() => handleOnCardDelete(index)}>delete</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Carousel;