import React, { useEffect, useMemo, useState } from 'react'
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import { toast } from 'react-toastify';
import { usePagination, useTable } from 'react-table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const EditModal = ({ show, onClose, onSave, data }) => {
    const [amountAdded, setAmountAdded] = useState(data?.couponsAdded || '');
    const [amountConsumed, setAmountConsumed] = useState(data?.couponsConsumed || '');
    const [consumedBy, setConsumedBy] = useState(data?.consumedBy || '');
    const [remarks, setRemarks] = useState(data?.remarks || '');

    useEffect(() => {
        if (data) {
            setAmountAdded(data.couponsAdded || '');
            setAmountConsumed(data.couponsConsumed || '');
            setConsumedBy(data.consumedBy || '');
            setRemarks(data.remarks || '');
        }
    }, [data]);

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Coupon Transaction Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Added</label>
                            <input
                                type="number"
                                className="form-control"
                                value={amountAdded}
                                onChange={(e) => setAmountAdded(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Consumed</label>
                            <input
                                type="number"
                                className="form-control"
                                value={amountConsumed}
                                onChange={(e) => setAmountConsumed(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Consumed By</label>
                            <select
                                className="form-control"
                                value={consumedBy}
                                onChange={(e) => setConsumedBy(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Police">Police</option>
                                <option value="Family">Family</option>
                                <option value="Office Staff">Office Staff</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Remarks</label>
                            <textarea
                                className="form-control"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => onSave({
                                ...data,
                                couponsAdded: amountAdded,
                                couponsConsumed: amountConsumed,
                                consumedBy,
                                remarks
                            })}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AddViewCoupons = () => {

    const [selectedLesseeId, setSelectedLesseeId] = useState('');
    const [lesseeDetails, setLesseeDetails] = useState([]);
    const [couponsTableData, setCouponsTableData] = useState([]);
    const [couponBalance, setCouponBalance] = useState('');
    const [balanceMonth, setBalanceMonth] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [lesseeId, setLesseeId] = useState('');
    const [lesseeName, setLesseeName] = useState('');
    const [date, setDate] = useState('');
    const [couponsConsumed, setCouponsConsumed] = useState('');
    const [couponsAdded, setCouponsAdded] = useState('');
    const [consumedBy, setConsumedBy] = useState('');
    const [remarks, setRemarks] = useState('');

    const [totalCouponBalanceData, setTotalCouponBalanceData] = useState({
        couponBalance: 0,
        couponAdded: 0
    });

    const staticLesseeDetails = [
        { id: '1', name: 'Gopal Sweets' },
        { id: '2', name: 'Pro Saloon' }
    ];

    const handleGetCouponsTableData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
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

    const handleTransactionChange = (e) => {
        setTransactionType(e.target.value);
    };

    const handleLesseeChange = (e) => {
        const selectedId = e.target.value;
        setLesseeId(selectedId);

        const staticLesseeMap = {
            '1': 'Gopal Sweets',
            '2': 'Pro Saloon'
        };

        setLesseeName(staticLesseeMap[selectedId] || '');
    };

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const balanceMonthNow = `${date} ${currentTime}`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');

        const payload = {
            couponBalanceLog: {
                lesseeName: lesseeName,
                lesseeId: lesseeId,
                couponsBalance: 0,
                couponsConsumed: transactionType === '1' ? Number(couponsConsumed) : 0,
                couponsAdded: transactionType === '0' ? Number(couponsAdded) : 0,
                consumedBy: transactionType === '1' ? consumedBy : '',
                balanceMonth: balanceMonthNow,
                transactionType: Number(transactionType),
                remarks: remarks
            }
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/coupon/save-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId
                },
                body: JSON.stringify(payload)
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
        setTransactionType('');
        setLesseeId('');
        setLesseeName('');
        setDate('');
        setCouponsConsumed('');
        setCouponsAdded('');
        setConsumedBy('');
        setRemarks('');
    };

    const handleGetTotalCouponBalance = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/dashboard/coupon-log-summary?period=-1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userId: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const { statusCode, description } = data.statusDescription;

                if (statusCode === 200) {
                    const summary = data.totalData;

                    if (summary) {
                        setTotalCouponBalanceData(summary);
                    } else {
                        toast.success(description || 'Coupons summary data is missing.');
                    }
                } else {
                    toast.error(description || 'Failed to fetch Coupons summary.');
                }
            } else {
                toast.error('Request failed with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error fetching data: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetCouponsTableData();
        handleGetTotalCouponBalance();
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
        {
            Header: 'Added',
            accessor: 'couponsAdded',
            Cell: ({ value }) =>
                new Intl.NumberFormat('en-IN').format(value ?? 0),
        },
        {
            Header: 'Consumed',
            accessor: 'couponsConsumed',
            Cell: ({ value }) =>
                new Intl.NumberFormat('en-IN').format(value ?? 0),
        },
        {
            Header: 'Balance',
            accessor: 'couponsBalance',
            Cell: ({ value }) =>
                new Intl.NumberFormat('en-IN').format(value ?? 0),
        },
        { Header: 'Consumed By', accessor: 'consumedBy' },
        {
            Header: 'Date',
            accessor: 'balanceMonth',
            Cell: ({ value }) => {
                const date = new Date(value);
                const pad = (n) => n.toString().padStart(2, '0');
                const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
                return formattedDate;
            }
        },
        {
            Header: 'Transaction',
            accessor: 'transactionType',
            Cell: ({ value }) => (value === 0 ? 'Credit' : 'Debit')
        },
        {
            Header: 'Remarks',
            accessor: 'remarks',
            Cell: ({ value }) => (
                <span title={value}>
                    {value.length > 20 ? `${value.slice(0, 20)}...` : value}
                </span>
            )
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        pageOptions,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize },
        setPageSize,
    } = useTable(
        {
            columns,
            data: couponsTableData,
            initialState: { pageIndex: 0, pageSize: 7 },
        },
        usePagination
    );

    const handleRowClick = (row) => {
        setSelectedRowData(row.original);
        setShowModal(true);
    };
    const handleDownloadExcel = () => {
        if (!couponsTableData.length) {
            toast.warn('No data to download');
            return;
        }

        const formattedData = couponsTableData.map(row => {
            const date = new Date(row.balanceMonth);
            const pad = (n) => n.toString().padStart(2, '0');
            const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

            return {
                'Lessee Name': row.lesseeName?.length > 25 ? `${row.lesseeName.slice(0, 25)}...` : row.lesseeName,
                'Added': row.couponsAdded,
                'Consumed': row.couponsConsumed,
                'Balance': row.couponsBalance,
                'Consumed By': row.consumedBy,
                'Date': formattedDate,
                'Transaction': row.transactionType === 0 ? 'Credit' : 'Debit',
                'Remarks': row.remarks || ''
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Coupon Balance Report');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'CouponBalanceReport.xlsx');
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const handleOpenModal = (rowData) => {
        setSelectedRowData(rowData);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRowData(null);
    };

    const handleSaveModal = async (updatedData) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error('User ID missing in localStorage');
            return;
        }

        const payload = {
            toBeUpdated: updatedData.rentId,
            updatedLogAmount: Number(updatedData.rentPaidAmount),
            updateRemarks: updatedData.remarks
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/coupon/update-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.statusDescription?.statusCode === 200) {
                toast.success(result?.statusDescription?.description || 'Update successful!');

                // setLesseeTableData(prev =>
                //     prev.map(item => item.rentId === updatedData.rentId ? updatedData : item)
                // );

                handleCloseModal();
            } else {
                toast.error(result.statusDescription?.description || 'Failed to update');
            }
        } catch (error) {
            toast.error('API error: ' + error.message);
        }
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                {/* <h5 className="card-title">Add Coupon Transaction</h5> */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Add Coupon Transaction</h5>
                                    <div className="d-flex gap-4">
                                        <div>
                                            <strong className="text-primary">
                                                Current Balance: ₹{totalCouponBalanceData.couponBalance.toLocaleString('en-IN')}
                                            </strong>
                                        </div>
                                        <div>
                                            <strong
                                                className="text-secondary">Added Balance: ₹{totalCouponBalanceData.couponAdded.toLocaleString('en-IN')}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Select Transaction Type</label>
                                            <select
                                                className="form-select"
                                                value={transactionType}
                                                onChange={handleTransactionChange}
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                <option value="1">Coupon Used</option>
                                                <option value="0">Add Coupon</option>
                                            </select>
                                        </div>
                                    </div>

                                    {transactionType === '1' && (
                                        <div className="row mb-3">
                                            <div className="col-md-3">
                                                <label className="form-label">Lessee Name</label>
                                                <select
                                                    className="form-select"
                                                    value={lesseeId}
                                                    onChange={handleLesseeChange}
                                                    required
                                                >
                                                    <option value="">Select Lessee</option>
                                                    {staticLesseeDetails.map((lessee) => (
                                                        <option key={lessee.id} value={lessee.id}>
                                                            {lessee.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Date</label>
                                                <input type="date" className="form-control" required value={date} onChange={(e) => setDate(e.target.value)} />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Coupons Consumed</label>
                                                <input type="number" className="form-control" required value={couponsConsumed} onChange={(e) => setCouponsConsumed(e.target.value)} />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Coupon Consumed By</label>
                                                <select className="form-select" required value={consumedBy} onChange={(e) => setConsumedBy(e.target.value)}>
                                                    <option value="">Select</option>
                                                    <option value="Police">Police</option>
                                                    <option value="Family">Family</option>
                                                    <option value="Office Staff">Office Staff</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Remarks</label>
                                                <input type="text" className="form-control" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                                            </div>
                                        </div>
                                    )}

                                    {transactionType === '0' && (
                                        <div className="row mb-3">
                                            <div className="col-md-3">
                                                <label className="form-label">Lessee Name</label>
                                                <select
                                                    className="form-select"
                                                    value={lesseeId}
                                                    onChange={handleLesseeChange}
                                                    required
                                                >
                                                    <option value="">Select Lessee</option>
                                                    {staticLesseeDetails.map((lessee) => (
                                                        <option key={lessee.id} value={lessee.id}>
                                                            {lessee.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Date</label>
                                                <input type="date" className="form-control" required value={date} onChange={(e) => setDate(e.target.value)} />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Coupons Amount</label>
                                                <input type="number" className="form-control" required value={couponsAdded} onChange={(e) => setCouponsAdded(e.target.value)} />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Remarks</label>
                                                <input type="text" className="form-control" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary" onClick={handlereset}>Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* view table code  */}
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Coupon Transaction Details</h5>
                                    <i
                                        className="fa-solid fa-circle-down"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleDownloadExcel}
                                    >
                                        <span className="ms-2">download</span>
                                    </i>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <h6 className="mb-0 me-2">Show rows:</h6>
                                    <select
                                        className="form-select w-auto"
                                        value={pageSize}
                                        onChange={(e) => setPageSize(Number(e.target.value))}
                                    >
                                        {[10, 30, 50, 100].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
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
            <EditModal
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveModal}
                data={selectedRowData}
            />
        </main>
    );
};

export default AddViewCoupons