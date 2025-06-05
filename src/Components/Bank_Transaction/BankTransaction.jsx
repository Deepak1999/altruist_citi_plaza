import React, { useMemo } from 'react'
import { usePagination, useTable } from 'react-table';

const BankTransaction = () => {


    const openingBalance = 5000;
    const closingBalance = 4000;

    const bankTxnsTableData = useMemo(() => [
        {
            date: '2025-05-02',
            rentAmount: 'Salary paid to DBD Staff',
            amountReceived: 11000,
            paymentMode: 5000,
            txnId: 'TXN123456',
            closingBalance: 6000,
        },
        {
            date: '2025-05-02',
            rentAmount: 'Salary paid to DBD Staff',
            amountReceived: 11000,
            paymentMode: 5000,
            txnId: 'TXN123456',
            closingBalance: 6000,
        },

    ], []);

    const columns = useMemo(() => [
        {
            Header: 'Date',
            accessor: 'date',
        },
        {
            Header: 'Narration',
            accessor: 'rentAmount',
        },
        {
            Header: 'Amount Received (Debit)',
            accessor: 'amountReceived',
        },
        {
            Header: 'Receipt Amount (Credit)',
            accessor: 'paymentMode',
        },
        {
            Header: 'Reference No.(Txn. ID)',
            accessor: 'txnId',
        },
        {
            Header: 'Closing Balance',
            accessor: 'closingBalance',
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
        { columns, data: bankTxnsTableData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Bank Transaction Details</h5>
                                <form onSubmit={''}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Date</label>
                                            <input type="date" className="form-control"
                                                value={''}
                                                required />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Narration</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={''}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Payment Amount (Debit)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={''}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Receipt Amount (Credit)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={''}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Reference No.(Txn. ID)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={''}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Closing Balance</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={''}
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
                                    <h5 className="card-title mb-0">View Bank Transaction Deatils</h5>
                                    <i
                                        className="fa-solid fa-circle-down"
                                        style={{ cursor: 'pointer' }}

                                    >
                                        <span className="ms-2">download</span>
                                    </i>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="card-title mb-0">
                                        <span style={{ color: 'green' }}>Opening Balance: ₹{openingBalance}</span>
                                        <span style={{ marginLeft: '1rem', color: 'blue' }}>Closing Balance: ₹{closingBalance}</span>
                                    </h6>
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

export default BankTransaction