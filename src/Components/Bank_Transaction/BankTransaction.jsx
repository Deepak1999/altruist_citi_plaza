import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { toast } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const BankTransaction = () => {

    const [transactionData_1, setTransactionData] = useState([]);
    const [balanceData_1, setBalanceData] = useState([]);

    const openingBalance = 5000000;
    const closingBalance = 400000;

    const handleGetBankTransactionData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/rent/monthly-rent-log/all`, {
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
                    setTransactionData(data.monthlyRentLogs || []);
                } else {
                    toast.error(description || 'failed to fetch data');
                }
            } else {
                toast.error('failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetch data : ' + error.message);
        }
    };

    const handleGetCompanyWiseBalanceData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/rent/monthly-rent-log/all`, {
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
                    setBalanceData(data.monthlyRentLogs || []);
                } else {
                    toast.error(description || 'failed to fetch data');
                }
            } else {
                toast.error('failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetch data : ' + error.message);
        }
    };

    // useEffect(() => {
    //     handleGetBankTransactionData();
    //     handleGetCompanyWiseBalanceData();
    // }, []);

    const transactionColumns = useMemo(() => [
        { Header: 'Date', accessor: 'date' },
        { Header: 'Narration', accessor: 'rentAmount' },
        { Header: 'Amount Received (Debit)', accessor: 'amountReceived' },
        { Header: 'Receipt Amount (Credit)', accessor: 'paymentMode' },
        { Header: 'Reference No.(Txn. ID)', accessor: 'txnId' },
        { Header: 'Closing Balance', accessor: 'closingBalance' },
    ], []);

    const transactionData = useMemo(() => [
        {
            date: '2025-05-02',
            rentAmount: 'Salary paid to DBD Staff',
            amountReceived: 11000,
            paymentMode: 5000,
            txnId: 'TXN123456',
            closingBalance: 6000,
        },
        {
            date: '2025-05-03',
            rentAmount: 'Salary paid to DBD Staff',
            amountReceived: 11000,
            paymentMode: 5000,
            txnId: 'TXN123456',
            closingBalance: 6000,
        },
    ], []);

    const balanceColumns = useMemo(() => [
        { Header: 'Bank Balance', accessor: 'bankBalance' },
        { Header: 'Mobisoft', accessor: 'mobisoft' },
        { Header: 'ATPL', accessor: 'atpl' },
        { Header: 'R S Hospitality', accessor: 'rshospitality' },
        { Header: 'Net Balance', accessor: 'netBalance' },
    ], []);

    const balanceData = useMemo(() => [
        {
            bankBalance: '₹12,000',
            mobisoft: '₹3,000',
            atpl: '₹4,000',
            rshospitality: '₹5,000',
            netBalance: '₹24,000',
        },
        {
            bankBalance: '₹12,000',
            mobisoft: '₹3,000',
            atpl: '₹4,000',
            rshospitality: '₹5,000',
            netBalance: '₹24,000',
        },

    ], []);

    const {
        getTableProps: getTxnTableProps,
        getTableBodyProps: getTxnBodyProps,
        headerGroups: txnHeaderGroups,
        page: txnPage,
        nextPage: nextTxnPage,
        previousPage: prevTxnPage,
        canNextPage: canNextTxnPage,
        canPreviousPage: canPrevTxnPage,
        prepareRow: prepareTxnRow,
        pageOptions: txnPageOptions,
        state: { pageIndex: txnPageIndex },
    } = useTable(
        { columns: transactionColumns, data: transactionData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    const {
        getTableProps: getBalanceTableProps,
        getTableBodyProps: getBalanceBodyProps,
        headerGroups: balanceHeaderGroups,
        page: balancePage,
        nextPage: nextBalancePage,
        previousPage: prevBalancePage,
        canNextPage: canNextBalancePage,
        canPreviousPage: canPrevBalancePage,
        prepareRow: prepareBalanceRow,
        pageOptions: balancePageOptions,
        state: { pageIndex: balancePageIndex },
    } = useTable(
        { columns: balanceColumns, data: balanceData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        {/* --- Transaction Form --- */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Bank Transaction Details</h5>
                                <form onSubmit={''}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Date</label>
                                            <input type="date" className="form-control" value={''} required />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Narration</label>
                                            <input type="text" className="form-control" value={''} required />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Payment Amount (Debit)</label>
                                            <input type="text" className="form-control" value={''} required />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Receipt Amount (Credit)</label>
                                            <input type="text" className="form-control" value={''} required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Reference No.(Txn. ID)</label>
                                            <input type="text" className="form-control" value={''} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Closing Balance</label>
                                            <input type="text" className="form-control" value={''} />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary">Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* --- Transaction Table --- */}
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">View Bank Transaction Details</h5>
                                    <i className="fa-solid fa-circle-down" style={{ cursor: 'pointer' }}>
                                        <span className="ms-2">Download</span>
                                    </i>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="card-title mb-0">
                                        <span style={{ color: 'green' }}>Opening Balance: ₹{openingBalance}</span>
                                        <span style={{ marginLeft: '1rem', color: 'blue' }}>Closing Balance: ₹{closingBalance}</span>
                                    </h6>
                                </div>
                                <div className='table-responsive mb-3'>
                                    <table {...getTxnTableProps()} className="table table-striped m-0">
                                        <thead>
                                            {txnHeaderGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...getTxnBodyProps()}>
                                            {txnPage.map(row => {
                                                prepareTxnRow(row);
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
                                    <span>Page <strong>{txnPageIndex + 1} of {txnPageOptions.length}</strong></span>
                                    <div>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => prevTxnPage()} disabled={!canPrevTxnPage}>Previous</button>
                                        <button className="btn btn-sm btn-primary" onClick={() => nextTxnPage()} disabled={!canNextTxnPage}>Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* --- Bank Balance Table --- */}
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">View Bank Balance Details</h5>
                                    <i className="fa-solid fa-circle-down" style={{ cursor: 'pointer' }}>
                                        <span className="ms-2">Download</span>
                                    </i>
                                </div>
                                <div className='table-responsive mb-3'>
                                    <table {...getBalanceTableProps()} className="table table-striped m-0">
                                        <thead>
                                            {balanceHeaderGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...getBalanceBodyProps()}>
                                            {balancePage.map(row => {
                                                prepareBalanceRow(row);
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
                                    <span>Page <strong>{balancePageIndex + 1} of {balancePageOptions.length}</strong></span>
                                    <div>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => prevBalancePage()} disabled={!canPrevBalancePage}>Previous</button>
                                        <button className="btn btn-sm btn-primary" onClick={() => nextBalancePage()} disabled={!canNextBalancePage}>Next</button>
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

export default BankTransaction;