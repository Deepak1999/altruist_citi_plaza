import React, { useEffect, useMemo, useState } from 'react'
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast } from 'react-toastify';
import { usePagination, useTable } from 'react-table';

const AddViewCoupons = () => {

    const [selectedLesseeId, setSelectedLesseeId] = useState('');
    const [lesseeDetails, setLesseeDetails] = useState([]);
    const [couponsTableData, setCouponsTableData] = useState([]);
    const [couponBalance, setCouponBalance] = useState('');
    const [balanceMonth, setBalanceMonth] = useState('');

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


    const handleGetCouponsTableData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data for logout');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/coupon/get-details`, {
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
                    setCouponsTableData(data.couponBalanceLog || []);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error('User ID not found');
            return;
        }

        const selectedLessee = lesseeDetails.find(l => l.id === parseInt(selectedLesseeId));
        if (!selectedLessee) {
            toast.error('Please select a valid lessee');
            return;
        }

        const payload = {
            lesseeId: selectedLessee.id,
            lesseeName: selectedLessee.name,
            couponBalance: parseFloat(couponBalance),
            balanceMonth: balanceMonth,
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/coupon/save-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok && data.statusDescription.statusCode === 200) {
                toast.success(data?.statusDescription?.description || 'Coupon details saved successfully!');
                handlereset();
                handleGetCouponsTableData();
            } else {
                toast.error(data.statusDescription?.description || 'Failed to save data');
            }
        } catch (error) {
            toast.error('API error: ' + error.message);
        }
    };

    const handlereset = () => {
        setCouponBalance('');
        setBalanceMonth('');
        setSelectedLesseeId('');
    };

    useEffect(() => {
        handleGetLesseeDetails();
        handleGetCouponsTableData();
    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Lessee Name',
            accessor: 'lesseeName',
            Cell: ({ value }) => (
                <span title={value}>
                    {value.length > 20 ? `${value.slice(0, 25)}...` : value}
                </span>
            )
        },
        { Header: 'Coupon Balance', accessor: 'couponBalance' },
        {
            Header: 'Month & Year',
            accessor: 'balanceMonth',
            Cell: ({ value }) => {
                const date = new Date(value);
                return date.toLocaleString('default', { month: 'long', year: 'numeric' });
            }
        }

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
        { columns, data: couponsTableData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Coupons Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Lessee Name</label>
                                            <select
                                                className="form-select"
                                                value={selectedLesseeId}
                                                onChange={(e) => setSelectedLesseeId(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Lessee</option>
                                                {lesseeDetails.map((lessee) => (
                                                    <option key={lessee.id} value={lessee.id}>
                                                        {lessee.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Coupon Balance</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={couponBalance}
                                                onChange={(e) => setCouponBalance(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Month & Year</label>
                                            <input
                                                type="month"
                                                className="form-control"
                                                value={balanceMonth}
                                                onChange={(e) => setBalanceMonth(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary" onClick={handlereset} >Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                        {/* view table code  */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">View Coupons Details</h5>
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

export default AddViewCoupons