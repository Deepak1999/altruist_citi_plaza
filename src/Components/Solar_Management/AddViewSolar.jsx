import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ApiBaseUrl from "../Api_base_Url/ApiBaseUrl";
import { usePagination, useTable } from "react-table";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AddViewSolar = () => {

    const [selectedLesseeId, setSelectedLesseeId] = useState('');
    const [rentAmounts, setRentAmounts] = useState([]);
    const [lesseeDetails, setLesseeDetails] = useState([]);
    const [solarTableData, setSolarTableData] = useState([]);
    const [solarPlantData, SetSolarPlantData] = useState([]);
    const [selectedRentAmount, setSelectedRentAmount] = useState('');

    const [productionDate, setProductionDate] = useState('');
    const [plantId, setPlantId] = useState('');
    const [unitProduced, setUnitProduced] = useState('');
    const [plantName, setPlantName] = useState('');

    const handleGetLesseeDetails = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data for logout');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/rent/lessee-details-all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();
            if (response.ok) {
                const { statusCode, statusMessage } = data.statusDescription;
                if (statusCode === 200) {
                    const lesseeDetails = data.lesseeDetails.map((mode) => ({
                        id: mode.id,
                        name: mode.name,
                        rentAgreements: mode.rentAgreements || [],
                    }));
                    setLesseeDetails(lesseeDetails);
                } else {
                    toast.error(statusMessage || 'Failed to fetch lessee details');
                }
            } else {
                toast.error('Failed to fetch lessee details with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetching lessee details: ' + error.message);
        }
    };


    const handleGetSolarData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data for logout');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/solar/get-details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const { statusCode, statusMessage } = data.statusDescription;

                if (statusCode === 200) {
                    setSolarTableData(data.solarProductionLog || []);
                } else {
                    toast.error(statusMessage || 'Logout failed');
                }
            } else {
                toast.error('Logout failed with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during logout: ' + error.message);
        }
    };

    const handleGetPlantData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data for logout');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/solar/get-plant-details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const { statusCode, statusMessage } = data.statusDescription;

                if (statusCode === 200) {
                    SetSolarPlantData(data.solarPlantMaster || []);
                } else {
                    toast.error(statusMessage || 'Logout failed');
                }
            } else {
                toast.error('Logout failed with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during logout: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetLesseeDetails();
        handleGetSolarData();
        handleGetPlantData();
    }, []);

    const formatSaleDateWithTime = (dateStr) => {
        const date = new Date();
        const timePart = date.toTimeString().split(' ')[0];
        return `${dateStr} ${timePart}`;
    };

    const formattedDateTime = formatSaleDateWithTime(productionDate);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error('Missing user ID');
            return;
        }

        const selectedPlant = solarPlantData.find(p => p.id === parseInt(plantId));
        if (!selectedPlant) {
            toast.error('Please select a valid plant');
            return;
        }

        const payload = {
            productionDate: formattedDateTime,
            plantId: parseInt(plantId),
            plantName: selectedPlant.name,
            unitProduced: parseFloat(unitProduced)
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/solar/save-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok && data.statusDescription?.statusCode === 200) {
                toast.success(data?.statusDescription?.description || 'Solar production details saved successfully');
                handleGetSolarData();
            } else {
                toast.error(data.statusDescription?.description || 'Save failed');
            }
        } catch (error) {
            toast.error('Error saving data: ' + error.message);
        }
    };

    const handleLesseeChange = (e) => {
        const lesseeId = e.target.value;
        setSelectedLesseeId(lesseeId);

        const selectedLessee = lesseeDetails.find(l => l.id === parseInt(lesseeId));

        if (selectedLessee) {
            const activeAgreements = selectedLessee.rentAgreements.filter(ra => ra.isActive);
            const amounts = activeAgreements.map(ra => ra.fixedRentAmount);
            setRentAmounts(amounts);
        } else {
            setRentAmounts([]);
        }
    };

    const handleRentAmountChange = (e) => {
        setSelectedRentAmount(e.target.value);
    };

    const columns = useMemo(() => [
        {
            Header: 'Date & Time',
            accessor: 'productionDate',
            Cell: ({ value }) => {
                const date = new Date(value);

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');

                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }
        },
        { Header: 'Plant Name', accessor: 'plantName' },
        { Header: 'Units Produced', accessor: 'unitProduced' },

    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        prepareRow,
        pageOptions,
        state: { pageIndex },
    } = useTable(
        { columns, data: solarTableData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    const handleDownloadExcel = () => {
        if (!solarTableData.length) {
            toast.warn('No data to download');
            return;
        }

        const formattedData = solarTableData.map(row => {
            const date = new Date(row.productionDate);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            return {
                'Date & Time': formattedDateTime,
                'Plant Name': row.plantName,
                'Units Produced': row.unitProduced,
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Production Report');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'ProductionReport.xlsx');
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Solar Production Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={productionDate}
                                                onChange={(e) => setProductionDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Plant</label>
                                            <select
                                                className="form-select"
                                                value={plantId}
                                                onChange={(e) => setPlantId(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Plant</option>
                                                {solarPlantData.map((plant) => (
                                                    <option key={plant.id} value={plant.id}>
                                                        {plant.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Units Produced</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={unitProduced}
                                                onChange={(e) => setUnitProduced(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary">Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                        {/* view table code  */}
                        <div className="card">
                            <div className="card-body">
                                {/* <h5 className="card-title">View Solar Production Details</h5> */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Solar Production Details</h5>
                                    <i
                                        className="fa-solid fa-circle-down"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleDownloadExcel}
                                    >
                                        <span className="ms-2">download</span>
                                    </i>
                                </div>
                                <div className='table-responsive mb-3'>
                                    <table {...getTableProps()} className="table table-striped m-0">
                                        <thead>
                                            {headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>

                                        <tbody {...getTableBodyProps()}>
                                            {page.map(row => {
                                                prepareRow(row);
                                                return (
                                                    <tr {...row.getRowProps()}>
                                                        {row.cells.map(cell => (
                                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span>
                                        Page{' '}
                                        <strong>
                                            {pageIndex + 1} of {pageOptions.length}
                                        </strong>
                                    </span>
                                    <div>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => previousPage()}
                                            disabled={!canPreviousPage}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => nextPage()}
                                            disabled={!canNextPage}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* view table code end */}

                    </div>
                </div>
            </section>
        </main>
    );
};

export default AddViewSolar