import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, addCard, updateCard, deleteCard} from '../store/cardSlice';

export default function Cards({ listId }) {
  const dispatch = useDispatch();
  const { items = {}, loading, error } = useSelector((state) => state.cards);
  const cards = items[listId] || []
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showMenuCard, setShowMenuCard] = useState(null);

 
  
  const handleDeleteCard = (cardId) => {
      dispatch(deleteCard(cardId));
      dispatch(fetchCards(listId))
  };

  useEffect(() => {
    dispatch(fetchCards(listId)); 
  }, [dispatch, listId]);

  useEffect(() => {
    const closeMenu = () => setShowMenuCard(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);


  return (
    <div className="p-1">
      {cards.length > 0 ? (
        cards.filter((card) => card.status === "completed").map((card, index) => (

          card.list === listId && (
            <div key={card.id} className="p-2 mt-2 rounded-md bg-gray-200 shadow-lg flex justify-between">
              <h3 className="text-xs">{card.title}</h3>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenuCard(showMenuCard === index ? null : index);
                  }}
                  type="button"
                  aria-label="Mostrar menú de tarjeta"
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
                {showMenuCard === index && (
                  <ul className="absolute right-6 -top-2 bg-gray-200 rounded-lg p-2 w-max z-10 text-center flex flex-col text-xs gap-4">
                     <li className="py-1">
                      <button type="button" onClick={() => handleDeleteCard(card.id)}>
                        Eliminar Tarea
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )
        ))
      ) : (
        <div className="text-center text-gray-500">No hay tareas disponibles</div>
      )}
    </div>
  );
}
