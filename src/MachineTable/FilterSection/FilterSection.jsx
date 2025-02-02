
import { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";


const FilterSection = ({ setMachinesData, filterOpen, setFilterOpen }) => {
    const [machineId, setMachineId] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [status, setStatus] = useState('active');

    const handleChangeFilter = (e) => {
        if (e.target.name === 'machine_id') {
            setMachineId(e.target.value);
        } else if (e.target.name === 'model_number') {
            setModelNumber(e.target.value);
        } else if (e.target.name === 'serial_no') {
            setSerialNo(e.target.value);
        } else if (e.target.name === 'status') {
            if (e.target.value === 'all') {
                setStatus('');
            } else {
                setStatus(e.target.value);
            }
        }
    }

    const handleFilterSubmit = async (e) => {
        e.preventDefault();

        try {
            const getFilteredMachines = await fetch(`https://machine-maintenance.ddns.net/api/maintenance/machines/?machine_id=${machineId}&model_number=${modelNumber}&serial=${serialNo}&status=${status}`);
            const data = await getFilteredMachines.json();
            console.log(`https://machine-maintenance.ddns.net/api/maintenance/machines/?machine_id=${machineId}&model_number=${modelNumber}&serial=${serialNo}&status=${status}`);

            // this code will be an reusable function later
            // all machine category id (not duplicated)
            const machinesCategoryId = [...new Set(data.map((machine) => machine.category))];

            // all machine type id (not duplicated)
            const machinesTypeId = [...new Set(data.map((machine) => machine.type))];

            // all machine brand id (not duplicated)
            const machinesBrandId = [...new Set(data.map((machine) => machine.brand))];

            // all machine line id (not duplicated)
            const machinesLineId = [...new Set(data.map((machine) => machine.line))];

            // all machine supply id (not duplicated)
            const machinesSupplierId = [...new Set(data.map((machine) => machine.supplier))];



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
            const updateMachineData = data.map((machine) => {
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
            setFilterOpen(false);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="filter-menu" style={{ display: filterOpen ? 'flex' : 'none' }}>

                <div className="filter-options">
                    <IoMdCloseCircle className="close-icon" title="Close" onClick={() => setFilterOpen(false)} />
                    <h2>Filter Machines by:</h2>
                    <form onSubmit={handleFilterSubmit}>
                        <div>
                            <div className="filter-inputs">
                                <label htmlFor="machine_id">Machine Id</label>
                                <input type="text" id="machine_id" name="machine_id" onChange={handleChangeFilter} value={machineId} />
                                <label htmlFor="model_number">Model Number</label>
                                <input type="text" id="model_number" name="model_number" value={modelNumber} onChange={handleChangeFilter} />
                                {/* <label htmlFor="serial_no">Serial No</label>
                                <input type="number" id="serial_no" name="serial_no" value={serialNo} onChange={handleChangeFilter} /> */}
                            </div>
                            <br />
                            <label htmlFor="status">Status </label>
                            <select id="status" name="status" onChange={handleChangeFilter}>
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="broken">Broken</option>
                            </select>
                        </div>
                        <br />
                        <br />
                        <button type="submit">Apply</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FilterSection