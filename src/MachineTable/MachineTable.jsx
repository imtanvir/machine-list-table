import { useEffect, useState } from 'react';
import { FaFilter } from "react-icons/fa";
import { RiResetRightLine } from "react-icons/ri";

import FilterSection from './FilterSection/FilterSection';
import './MachineTable.css';
const MachineTable = () => {
    const [machinesData, setMachinesData] = useState([]);
    const [resetData, setResetData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filterCategory, setFilterCategory] = useState([]);
    const [filterBrand, setFilterBrand] = useState([]);
    const [filterType, setFilterType] = useState([]);
    const [filterLine, setFilterLine] = useState([]);
    const [filterSupplier, setFilterSupplier] = useState([]);

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

                const categoriesData = await fetch(`https://machine-maintenance.ddns.net/api/maintenance/category/`).then((res) => res.json());
                const typesData = await fetch(`https://machine-maintenance.ddns.net/api/maintenance/type/`).then((res) => res.json());
                const brandsData = await fetch(`https://machine-maintenance.ddns.net/api/maintenance/brand/`).then((res) => res.json());
                const linesData = await fetch(`https://machine-maintenance.ddns.net/api/production/lines/`).then((res) => res.json());
                const suppliersData = await fetch(`https://machine-maintenance.ddns.net/api/maintenance/supplier/`).then((res) => res.json());

                await Promise.all([categoriesData, typesData, brandsData, linesData, suppliersData]).then(([categoriesData, typesData, brandsData, linesData, suppliersData]) => {
                    setFilterCategory(categoriesData);
                    setFilterBrand(brandsData);
                    setFilterType(typesData);
                    setFilterLine(linesData);
                    setFilterSupplier(suppliersData);
                    // update machine data with fetched category, type, brand, supplier, line identifiers
                    const updateMachineData = machinesData.map((machine) => {
                        const updateMachineData = { ...machine };
                        for (let i = 0; i < categoriesData.length; i++) {
                            if (updateMachineData.category === categoriesData[i].id) {
                                updateMachineData.category = categoriesData[i].name;
                            }
                        }
                        for (let i = 0; i < typesData.length; i++) {
                            if (updateMachineData.type === typesData[i].id) {
                                updateMachineData.type = typesData[i].name;
                            }
                        }

                        for (let i = 0; i < brandsData.length; i++) {
                            if (updateMachineData.brand === brandsData[i].id) {
                                updateMachineData.brand = brandsData[i].name;
                            }
                        }

                        for (let i = 0; i < linesData.length; i++) {
                            if (updateMachineData.line === linesData[i].id) {
                                updateMachineData.line = linesData[i].name;
                            }
                        }

                        for (let i = 0; i < suppliersData.length; i++) {
                            if (updateMachineData.supplier === suppliersData[i].id) {
                                updateMachineData.supplier = suppliersData[i].name;
                            }
                        }
                        return updateMachineData;
                    }
                    );

                    // set the updated machines data to the state variable
                    setMachinesData(updateMachineData);
                    // console.log({ updateMachineData });
                    setResetData(updateMachineData);
                    setLoading(false);
                });
            } catch (error) {
                console.error('Error fetching machines:', error);
            }
        }
        fetchMachines();
    }, []);

    // console.log({ machinesData });
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
                            <th>Sequence</th>
                            <th>Machine ID</th>
                            <th>Model Number</th>
                            <th>Serial No</th>
                            <th>Purchase Date</th>
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
                                    <td>{machine.sequence}</td>
                                    <td>{machine.machine_id}</td>
                                    <td>{machine.model_number}</td>
                                    <td>{machine.serial_no}</td>
                                    <td>{machine.purchase_date}</td>
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
                <FilterSection filterCategory={filterCategory} filterBrand={filterBrand} filterType={filterType} filterLine={filterLine} filterSupplier={filterSupplier} filterOpen={filterOpen} setFilterOpen={setFilterOpen} setMachinesData={setMachinesData} />
            </section>
        </>
    )
}

export default MachineTable