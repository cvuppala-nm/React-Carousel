import { useEffect, useRef } from 'react';

function useMirrorNodes(ref, items, updateNodesCount) {
  const mirrorNodes = useRef({ first: null, second: null, secondLast: null, last: null });

  useEffect(() => {
    const addMirrorNodes = () => {
      if (!ref.current || items.length < 2) return; // Ensure there are enough items for mirroring

      const slides = ref.current.children;
      if (slides.length < 2) return; // Check again due to async nature of updates

      // Remove existing mirrors
      removeMirrorNodes();

      // Clone and add mirror nodes
      const firstClone = slides[0].cloneNode(true);
      const secondClone = slides[1].cloneNode(true);
      const secondLastClone = slides[slides.length - 2].cloneNode(true);
      const lastClone = slides[slides.length - 1].cloneNode(true);
      firstClone.classList.add('clone-slide');
      secondClone.classList.add('clone-slide');
      secondLastClone.classList.add('clone-slide');
      lastClone.classList.add('clone-slide');

      ref.current.insertBefore(lastClone, ref.current.firstChild);
      ref.current.insertBefore(secondLastClone, ref.current.firstChild);

      ref.current.appendChild(firstClone);
      ref.current.appendChild(secondClone);

      // Update ref with new clones
      mirrorNodes.current.first = lastClone;
      mirrorNodes.current.second = secondClone;
      mirrorNodes.current.secondLast = secondLastClone;
      mirrorNodes.current.last = firstClone;

      updateNodesCount();
    };

    const removeMirrorNodes = () => {
      // Ensure both the container and the nodes to be removed exist
      if (
        ref.current
        && mirrorNodes.current.first
        && mirrorNodes.current.second
        && mirrorNodes.current.secondLast
        && mirrorNodes.current.last
      ) {
        // Safely attempt to remove the first and last mirror nodes
        ref.current.removeChild(mirrorNodes.current.first);
        ref.current.removeChild(mirrorNodes.current.second);
        ref.current.removeChild(mirrorNodes.current.secondLast);
        ref.current.removeChild(mirrorNodes.current.last);
      }
    };

    addMirrorNodes();
  }, [items.length]);

}

export default useMirrorNodes;