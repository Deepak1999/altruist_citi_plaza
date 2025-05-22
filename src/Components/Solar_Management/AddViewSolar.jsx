import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ApiBaseUrl from "../Api_base_Url/ApiBaseUrl";
import { usePagination, useTable } from "react-table";

const AddViewSolar = () => {

    const [selectedLesseeId, setSelectedLesseeId] = useState('');
    const [rentAmounts, setRentAmounts] = useState([]);
    const [lesseeDetails, setLesseeDetails] = useState([]);
    const [selectedRentAmount, setSelectedRentAmount] = useState('');

    const [lesseeTableData, setLesseeTableData] = useState([
        {
            plant: 25000,
            rentAmount: 25000,
            monthYear: '2025-05-01'
        },
        {
            plant: 25000,
            rentAmount: 18000,
            monthYear: '2025-04-01'
        },
        {
            plant: 25000,
            rentAmount: 32000,
            monthYear: '2025-03-01'
        }
    ]);

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


    useEffect(() => {
        handleGetLesseeDetails();
    }, []);


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
            Header: 'Month & Year',
            accessor: 'monthYear',
            Cell: ({ value }) => {
                const date = new Date(value);
                return date.toLocaleString('default', { month: 'long', year: 'numeric' });
            }
        },
        { Header: 'Plant 1 units generate ', accessor: 'rentAmount' },
        { Header: 'Plant 2 units generate  ', accessor: 'plant' },

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
        { columns, data: lesseeTableData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Solar Production Details</h5>
                                <form onSubmit={''}>
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="saleDate"
                                                value={''}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Plant 1 Units Generate</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={''}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Plant 2 Units Generate</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={''}
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
                                <h5 className="card-title">View Solar Production Details</h5>
                                <table {...getTableProps()} className="table table-striped">
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