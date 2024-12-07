import {
    useState,
    useEffect,
    useRef
} from 'react'
import {
    useDispatch,
    useSelector
} from 'react-redux'
import {
    addList,
    deleteList,
    fetchLists,
    updateList
} from '../store/listsSlice'
import Cards from './Cards'
import Cards_inprogress from './Cards_inprogress'
import Cards_completed from './Cards_completed'
import {
    fetchCards
} from '../store/cardSlice'


export default function Lists( {
    boardId
}) {
    const dispatch = useDispatch()
    const {
        items,
        loading,
        error
    } = useSelector((state) => state.lists)

    const [name,
        setName] = useState("")
    const [showInput,
        setShowInput] = useState(false)
    const [nameList,
        setNameList] =
    useState("")
    const inputsRef = useRef(null)

    "estado para activar el menu de la lista"
    const [showMainList,
        setshowMainList] = useState(null)

    "estado para activar el input del nombre de la lista"
    const [activeInput,
        setActiveInput] = useState(null)


    const handleAddList = async (e) => {
        e.preventDefault()
        if (name === '') {
            return
        } else {
            try {
                await dispatch(addList( {
                    name, board: boardId
                }))
                setName("")
                setShowInput(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleDeleteList = async (listId) => {
        await dispatch(deleteList(listId))
    }

    const handleDispatchFunction = (e, listId) => {
        if (e.key === 'Enter') {
            handleUpdatedList(listId, nameList)
        }
    }
    const handleUpdatedList = async (listId, nameList) => {
        if (listId && nameList) {
            await dispatch(updateList( {
                listId, name: nameList
            }))
            console.log('funcionando')
            if (error) {
                console.log(error)
            }
        }
    }



    useEffect(() => {
        dispatch(fetchLists(boardId))
    }, [dispatch, boardId])

    useEffect(() => {
        if (activeInput !== null && inputsRef.current) {
            setshowMainList(null)
            inputsRef.current.focus()

        }
    },
        [activeInput])


    return (
        <div className="ml-8 mt-4 p-2 w-full h-full  min-h-[74vh]">

            <div className="h-full">
                {items && items.length > 0 ? (
                    items.map((element, index) => (
                        <div key={index} className="flex gap-2  flex-nowrap w-max p-2 pr-12">
                            <div className="p-2 rounded-lg bg-gray-300 w-[250px] h-auto">
                                <div className="">
                                    <input
                                    className="uppercase text-sm font-medium border-b-2 border-black mb-4"
                                    value={activeInput === index ? nameList: element.name}
                                    onChange={(e) => {
                                        if (activeInput === index) { setNameList(e.target.value)
                                        }}}				 onFocus={() => { if (activeInput === index && nameList === "") {
                                            setNameList(element.name)}}}			 onKeyUp={(e) => {
                                        if (e.key === 'Enter' && activeInput === index) {     handleUpdatedList(element.id, nameList);
                   setActiveInput(null);
                    }}}
                   ref={inputsRef}
                                    disabled={activeInput !== index}
                                    />

                                <div className="relative">
                                    <button
                                        className='absolute right-2 -top-10'
                                        type="button" onClick={() => setshowMainList(showMainList === index ? null: index)}>
                                        <i className="fa-solid fa-sliders"></i>
                                    </button>
                                    <div className={`${showMainList === index && !activeInput ? '': 'hidden'} absolute w-[120px] right-2 bg-gray-200 rounded-lg shadow-xl text-center font-medium p-2 z-10 -top-2`}>
                                        <ul className="text-sm grid gap-2">
                                            <li>
                                                <button type="button" onClick={() => setActiveInput(activeInput === index ? null: index)}>
                                                    Rename
                                                </button>
                                            </li>
                                            <li>
                                                <button type="button" onClick={() => handleDeleteList(element.id)}>
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <Cards listId={element.id} />
                        </div>

                        <div className="p-2 rounded-lg bg-gray-300 h-auto w-[250px]">
                            <h2 className="uppercase text-sm font-medium border-b-2 border-black mb-4">En Proceso</h2>
                            <div>
                                <Cards_inprogress listId={element.id} />
                            </div>
                        </div>

                        <div className="p-2 rounded-lg bg-gray-300 h-auto w-[250px]">
                            <h2 className="uppercase text-sm font-medium border-b-2 border-black mb-4">Tareas Finalizadas</h2>
                            <div>
                                <Cards_completed listId={element.id} />
                            </div>
                        </div>

                    </div>
                    ))
            ): (
                <div>
                    No hay listas disponibles
                </div>
            )}
        </div>

        <div className="fixed bottom-10 right-6">
            <form onSubmit={handleAddList} className="flex flex-col">
                <input
                type="text"
                value={name}
                placeholder="Enter Name"
                onChange={(e) => setName(e.target.value)}
                className={`${showInput ? 'showInput': 'hidden'} w-full rounded-md bg-gray-100 border-4 border-blue-600 p-2`} />
            <div className="flex gap-2 mt-2">
                <button type="button" onClick={(e) => setShowInput(true)} className="bg-blue-600 text-gray-200 font-bold p-2 rounded-lg text-xs">{!showInput ? 'Nueva Lista': 'Añadir'}</button>
                <button className={`${showInput ? '': 'hidden'} bg-blue-600 text-gray-200 font-bold px-2 rounded-lg`} onClick={(e) => setShowInput(false)}>
                    X
                </button>
            </div>
        </form>
    </div>
</div>
)
}