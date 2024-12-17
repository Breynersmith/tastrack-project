import {
    useState,
    useEffect
} from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    fetchCards,
    addCard,
    updateCard,
    deleteCard
} from '../store/cardSlice';

export default function Cards( {
    listId
}) {
    const dispatch = useDispatch();
    const {
        items = {},
        loading,
        error
    } = useSelector((state) => state.cards);
    const cards = items[listId] || []
    const [title,
        setTitle] = useState('');
    const [description,
        setDescription] = useState('');
    const [showInput,
        setShowInput] = useState(false);
    const [showMenuCard,
        setShowMenuCard] = useState(null);

    // Agregar una tarjeta
    const handleAddCard = (e) => {
        e.preventDefault();
        if (title.trim()) {
            dispatch(addCard( {
                title: title.trim(), description: description.trim(), list: listId
            }));
            setTitle('');
            setDescription('');
            setShowInput(false);
        }
    };

    // Eliminar una tarjeta
    const handleDeleteCard = (cardId) => {
        dispatch(deleteCard(cardId));
        dispatch(fetchCards(listId))
    };

    // Actualizar una targeta
    const [activeInput,
        setActiveInput] = useState(null)

    const [titleChanged,
        setTitleChanged] = useState("")
    const [changeDescription,
        setChangeDescription] = useState("")
    const [changeStatus,
        setChangeStatus] = useState("")

    const handleDispatchFunction = (e, cardId) => {
        if (e.key === 'Enter') {
            console.log("funciona")
        }

    }

    const handleUpdateCard = (cardId) => {
        let updateField = {}

        if (changeTitle) {
            updateField.title = titleChanged
        }
        if (changeDescription) {
            updateField.description = changeDescription
        }
        if (changeStatus) {
            updateField.status = changeStatus
        }

        if (Object.keys(updateField).length > 0) {
            dispatch(updateCard( {
                cardId, updateField
            }));
        } else {
            console.log("No fields to update");
        }
    }

    const handleStateCard = (cardId) => {
        dispatch(updateCard( {
            cardId, updateField: {
                status: "in_progress"
            }}))
    }


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
                cards.filter((card) => card.status === "not_started").map((card, index) => (

                    card.list === listId && (
                        <div key={card.id} className="p-2 mt-2 rounded-md bg-gray-200 shadow-lg flex justify-between">
                    <input
                    className="text-xs"
                    value={ activeInput === index ? titleChanged: card.title }
                    onChange={(e) => {
                        if (activeInput === index) {
                                    setTitleChanged(e.target.value)
                                }
                            }}
                    onFocus={() => { if (activeInput === index && titleChanged === "") {
                                setTitleChanged(card.name)
                            }
                            }
                            }
                    onKeyUp={(e) => {
                        if (e.key === 'Enter' && activeInput === index) {           handleUpdateCard(cardId, updateField)
                                }
                            }}
                            
                    disabled= {activeInput !== index}/>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenuCard(showMenuCard === index ? null: index);
                                    }}
                                    type="button"
                                    aria-label="shoe main card"
                                    >
                                    <i className="fa-solid fa-ellipsis"></i>
                                </button>
                                {showMenuCard === index && (
                                    <ul className="absolute right-6 top-2 bg-gray-100 rounded-lg p-2 w-max z-10 text-center flex flex-col text-xs gap-4 shadow-xl">
                                        <li className="py-1"><button
                                            onClick={() => handleStateCard(card.id)}>Start Task</button></li>
                                        <li>
                                            <button
                                                onClick={() => setActiveInput(activeInput === index ? null: index)}>
                                                Rename
                                            </button>
                                        </li>
                                        <li className="py-1">
                                            <button type="button" onClick={() => handleDeleteCard(card.id)}>
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    )
                ))
            ): (
                <div className="text-center text-gray-500">
                    No hay tareas disponibles
                </div>
            )}

            <div className="rounded-lg mt-4">
                <form onSubmit={handleAddCard} className="flex flex-col gap-2">
                    {showInput && (
                        <>
                            <input
                            type="text"
                            value={title}
                            placeholder="Enter Name"
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md p-2"

                            />
                        <input
                        type="text"
                        value={description}
                        placeholder="Enter Description"
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-md p-2"
                        />
                </>
            )}
            <div className="flex gap-2 mt-2">
                <button
                    type="submit"
                    onClick={() => setShowInput(!showInput)}
                    className={`bg-blue-600 text-xs text-gray-200 font-bold p-2 rounded-lg  `}

                    >
                    {showInput ? 'Add Task': 'New Task'}
                </button>
                {showInput && (
                    <button
                        type="button"
                        onClick={() => setShowInput(false)}
                        className="bg-red-600 text-gray-200 font-bold px-2 rounded-lg"
                        >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    </div>
</div>
    );
    }