
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
            setStatus(e.target.value);
        }
    }

    const handleFilterSubmit = async (e) => {
        e.preventDefault();

        try {
            const getFilteredMachines = await fetch(`https://machine-maintenance.ddns.net/api/maintenance/machines/?machine_id=${machineId}&model_number=${modelNumber}&serial=${serialNo}&status=${status}`);
            const data = await getFilteredMachines.json();
            console.log(`https://machine-maintenance.ddns.net/api/maintenance/machines/?machine_id=${machineId}&model_number=${modelNumber}&serial=${serialNo}&status=${status}`);
            setMachinesData(data);
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