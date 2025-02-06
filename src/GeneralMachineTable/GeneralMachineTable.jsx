import { useEffect, useRef, useState } from 'react';
// import { FaFilter } from "react-icons/fa";
// import { RiResetRightLine } from "react-icons/ri";

import '../MachineTable/MachineTable.css';
import formatTitle from '../utils/FormatTilte';
const MachineTable = () => {
    const [machinesData, setMachinesData] = useState([]);
    const [loading, setLoading] = useState(false);

    // const [resetData, setResetData] = useState([]);
    // // filter open and close states
    // const [filterOpen, setFilterOpen] = useState(false);
    // const handleFilterClick = () => {
    //     setFilterOpen(!filterOpen);
    // }
    // const handleResetClick = () => {
    //     setMachinesData(resetData);
    // }

    // table swapping handlers
    const tableRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - tableRef.current.offsetLeft);
        setScrollLeft(tableRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - tableRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scrolling speed
        tableRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://machine-maintenance.ddns.net/api/maintenance/machines/');
                const data = await response.json();
                const machinesData = data;

                // set the updated machines data to the state variable
                setMachinesData(machinesData);
                console.log({ machinesData });
                // setResetData(machinesData);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching machines:', error);
            }
        }
        fetchMachines();
    }, []);

    // console.log({ machinesData });
    return (
        <>
            <section className="machine-table-section pt-4">
                <h1 className="text-center">General Dynamic Machine Table</h1>
                <p className=" italic text-center">*note: Filter is dynamic yet. under development...*</p>

                {/* <div className="filter-reset-button">
                    <div className="filter" onClick={() => handleFilterClick()} title="Filter">
                        <p className="filter-text">Filter</p>
                        <FaFilter />
                    </div>
                    <div className="reset" onClick={() => handleResetClick()}>
                        <p>Reset Filter</p>
                        <RiResetRightLine />
                    </div>
                </div> */}


                <div
                    ref={tableRef}
                    className=" overflow-x-auto min-w-[70vw] cursor-grab active:cursor-grabbing p-4 border-2 rounded"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseUp}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <table className="">
                        <thead>
                            <tr>
                                {machinesData?.length > 0 &&
                                    Array.from(
                                        new Set(machinesData.flatMap(machine => Object.keys(machine)))
                                    ).map((title) => (
                                        <th key={title}>{formatTitle(title)}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {machinesData?.map((machine, index) => (
                                <tr key={index}>
                                    {Array.from(new Set(machinesData.flatMap(machine => Object.keys(machine))))
                                        .map((key) => (
                                            <td key={key}>{machine[key] ?? "N/A"}</td>
                                        ))}
                                </tr>
                            ))}
                            {
                                machinesData.length === 0 && !loading && <tr><td className="loader" colSpan={10}>No machines data found!</td></tr>
                            }
                            {
                                loading && <tr><td className="loader" colSpan={10}>Loading...</td></tr>
                            }
                        </tbody>
                    </table>
                </div>

            </section>
        </>
    )
}

export default MachineTable