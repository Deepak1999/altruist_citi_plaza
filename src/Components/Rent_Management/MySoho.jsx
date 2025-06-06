import React, { useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table';

const MySoho = () => {

    const [monthlyRent, setMonthlyRent] = useState('');
    const [monthYear, setMonthYear] = useState('');
    const [amountReceived, setAmountReceived] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [remarks, setRemarks] = useState('');

    const mySohoTableData = useMemo(() => [
        {
            date: '2025-05-01',
            rentAmount: 50000,
            amountReceived: 50000,
            paymentMode: 'Bank Transfer',
            remarks: 'Full rent received on time',
        },
        {
            date: '2025-05-02',
            rentAmount: 60000,
            amountReceived: 30000,
            paymentMode: 'Cheque',
            remarks: 'Partial payment received',
        },

    ], []);

    const columns = useMemo(() => [
        {
            Header: 'Date',
            accessor: 'date',
        },
        {
            Header: 'Rent Amount',
            accessor: 'rentAmount',
        },
        {
            Header: 'Amount Received',
            accessor: 'amountReceived',
        },
        {
            Header: 'Payment Mode',
            accessor: 'paymentMode',
        },
        {
            Header: 'Remarks',
            accessor: 'remarks',
        },

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
        { columns, data: mySohoTableData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Add My Soho Deatils</h5>
                                <form onSubmit={''}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Month & Year</label>
                                            <input type="month" className="form-control"
                                                value={monthYear}
                                                onChange={(e) => setMonthYear(e.target.value)}
                                                required />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Monthly Rent Amount</label>
                                            <select
                                                className="form-select"
                                                value={monthlyRent}
                                                onChange={(e) => setMonthlyRent(e.target.value)}
                                            >
                                                <option value="">Select Rent Amount</option>
                                                <option value="10000">₹10,000</option>
                                                <option value="15000">₹15,000</option>
                                                <option value="20000">₹20,000</option>
                                                <option value="25000">₹25,000</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Amount Received</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={amountReceived}
                                                onChange={(e) => setAmountReceived(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Payment Mode</label>
                                            <select
                                                className="form-select"
                                                value={paymentMode}
                                                onChange={(e) => setPaymentMode(e.target.value)}
                                            >
                                                <option value="">Select Mode</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Cheque">Cheque</option>
                                                <option value="Online">Online</option>
                                                <option value="UPI">UPI</option>
                                                <option value="Card">Card</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Remarks</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
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

                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">View My Soho Deatils</h5>
                                    <i
                                        className="fa-solid fa-circle-down"
                                        style={{ cursor: 'pointer' }}

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

                    </div>
                </div>
            </section>
        </main>
    );
};

export default MySoho