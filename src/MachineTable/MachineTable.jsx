import { useEffect, useState } from 'react';
import { FaFilter } from "react-icons/fa";
import { RiResetRightLine } from "react-icons/ri";

import FilterSection from './FilterSection/FilterSection';
import './MachineTable.css';
const MachineTable = () => {
    const [machinesData, setMachinesData] = useState([]);
    const [resetData, setResetData] = useState([]);
    const [loading, setLoading] = useState(false);

    // filter open and close states
    const [filterOpen, setFilterOpen] = useState(false);
    const handleFilterClick = () => {
        setFilterOpen(!filterOpen);
    }
    const handleResetClick = () => {
        setMachinesData(resetData);
    }

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://machine-maintenance.ddns.net/api/maintenance/machines/');
                const data = await response.json();
                const machinesData = data;

                // all machine category id (not duplicated)
                const machinesCategoryId = [...new Set(machinesData.map((machine) => machine.category))];

                // all machine type id (not duplicated)
                const machinesTypeId = [...new Set(machinesData.map((machine) => machine.type))];

                // all machine brand id (not duplicated)
                const machinesBrandId = [...new Set(machinesData.map((machine) => machine.brand))];

                // all machine line id (not duplicated)
                const machinesLineId = [...new Set(machinesData.map((machine) => machine.line))];

                // all machine supply id (not duplicated)
                const machinesSupplierId = [...new Set(machinesData.map((machine) => machine.supplier))];



                // fetch machine category, type, brand, supplier, line data for each related id
                const categoriesDataFetchRequests = machinesCategoryId.map((categoryId) => fetch(`https://machine-maintenance.ddns.net/api/maintenance/category/${categoryId}/`).then((res) => res.json()));

                const typeDataFetchRequests = machinesTypeId.map((typeId) => fetch(`https://machine-maintenance.ddns.net/api/maintenance/type/${typeId}/`).then((res) => res.json()));

                const brandDataFetchRequests = machinesBrandId.map((brandId) => fetch(`https://machine-maintenance.ddns.net/api/maintenance/brand/${brandId}/`).then((res) => res.json()));


                const lineDataFetchRequests = machinesLineId.map((linesId) => fetch(`https://machine-maintenance.ddns.net/api/production/lines/${linesId}/`).then((res) => res.json()));

                const supplierDataFetchRequests = machinesSupplierId.map((supplierId) => fetch(`https://machine-maintenance.ddns.net/api/maintenance/supplier/${supplierId}/`).then((res) => res.json()));


                // wait for all promises to resolve
                const categoriesPromises = await Promise.all(categoriesDataFetchRequests);
                const typePromises = await Promise.all(typeDataFetchRequests);
                const brandPromises = await Promise.all(brandDataFetchRequests);
                const linePromises = await Promise.all(lineDataFetchRequests);
                const supplierPromises = await Promise.all(supplierDataFetchRequests);


                // update machine data with fetched category, type, brand, supplier, line identifiers
                const updateMachineData = machinesData.map((machine) => {
                    const updateMachineData = { ...machine };
                    for (let i = 0; i < categoriesPromises.length; i++) {
                        if (updateMachineData.category === categoriesPromises[i].id) {
                            updateMachineData.category = categoriesPromises[i].name;
                        }
                    }
                    for (let i = 0; i < typePromises.length; i++) {
                        if (updateMachineData.type === typePromises[i].id) {
                            updateMachineData.type = typePromises[i].name;
                        }
                    }

                    for (let i = 0; i < brandPromises.length; i++) {
                        if (updateMachineData.brand === brandPromises[i].id) {
                            updateMachineData.brand = brandPromises[i].name;
                        }
                    }

                    for (let i = 0; i < linePromises.length; i++) {
                        if (updateMachineData.line === linePromises[i].id) {
                            updateMachineData.line = linePromises[i].name;
                        }
                    }

                    for (let i = 0; i < supplierPromises.length; i++) {
                        if (updateMachineData.supplier === supplierPromises[i].id) {
                            updateMachineData.supplier = supplierPromises[i].name;
                        }
                    }
                    return updateMachineData;
                }
                );

                // set the updated machines data to the state variable
                setMachinesData(updateMachineData);
                setResetData(updateMachineData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching machines:', error);
            }
        }
        fetchMachines();
    }, []);

    console.log({ machinesData });
    return (
        <>
            <section className="machine-table-section">
                <h1>Machine List & Details Table</h1>
                <div className="filter-reset-button">
                    <div className="filter" onClick={() => handleFilterClick()} title="Filter">
                        <p className="filter-text">Filter</p>
                        <FaFilter />
                    </div>
                    <div className="reset" onClick={() => handleResetClick()}>
                        <p>Reset Filter</p>
                        <RiResetRightLine />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Machine ID</th>
                            <th>Model Number</th>
                            <th>Serial No</th>
                            <th>Sequence</th>
                            <th>Purchase Date</th>
                            {/* <th>Floor</th> */}
                            <th>Status</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Brand</th>
                            <th>Line</th>
                            <th>Supplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            machinesData?.map((machine) => (
                                <tr key={machine.id}>
                                    <td>{machine.machine_id}</td>
                                    <td>{machine.model_number}</td>
                                    <td>{machine.serial_no}</td>
                                    <td>{machine.sequence}</td>
                                    <td>{machine.purchase_date}</td>
                                    {/* <td>{machine.floor}</td> */}
                                    <td>{machine.status}</td>
                                    <td>{machine.category}</td>
                                    <td>{machine.type}</td>
                                    <td>{machine.brand}</td>
                                    <td>{machine.line}</td>
                                    <td>{machine.supplier}</td>
                                </tr>
                            ))
                        }{
                            machinesData.length === 0 && !loading && <tr><td className="loader" colSpan={10}>No machines data found!</td></tr>
                        }
                        {
                            loading && <tr><td className="loader" colSpan={10}>Loading...</td></tr>
                        }
                    </tbody>
                </table>
                {/* Filter popup menu */}
                <FilterSection filterOpen={filterOpen} setFilterOpen={setFilterOpen} setMachinesData={setMachinesData} />
            </section>
        </>
    )
}

export default MachineTable