import { useState, useRef } from 'react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

export const InputWithSearch = ({ handleChange, title, name, value, disabled, array, filter, setFilter }) => {

    const [search, setSearch] = useState(false);
    const ref = useRef();

    useOnClickOutside(ref, () => setSearch(false));

    return (
        <label className="flex flex-col gap-[5px] w-full relative" ref={ref}>
        <span className="font-bold">{title}</span>
       
            <input
                name={name}
                onChange={(e) => {
                    setSearch(true);
                    handleChange(e, name);
                }}
                value={value}
                className="w-full h-[36px] rounded border-[#E9E9E9] border pl-3"
                disabled={disabled}
            />

            {search && (
                <div className='h-max bg-[#fff] absolute top-[70px] max-h-[120px] overflow-y-scroll w-[95%] pl-3 rounded border-[#E9E9E9] border z-50'>
                    {array.map((el, i) => {
                        return (
                            <div 
                                key={i}
                                className='py-[2px]'
                                onClick={() => {
                                    setFilter({
                                    ...filter,
                                    [name]: el,
                                });
                                setSearch(false);
                            }}
                            >
                                {el}
                            </div>
                        )
                    })}
                </div>
            )}
    </label>
    )
}