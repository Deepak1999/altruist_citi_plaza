import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const BankTransaction = () => {

    const [transactionData, setTransactionData] = useState([]);
    const [balanceData_1, setBalanceData] = useState([]);

    const [openingBalance, setOpeningBalance] = useState(0);
    const [closingBal, setClosingBal] = useState(0);

    const [transactionDate, setTransactionDate] = useState('');
    const [note, setNote] = useState('');
    const [debitAmount, setDebitAmount] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [closingBalance, setClosingBalance] = useState('');


    const handleGetBankTransactionData = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/transaction/transactions/all`, {
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
                    const transactions = data.transactionDetails || [];

                    setTransactionData(transactions);

                    if (transactions.length > 0) {
                        const firstTransaction = transactions[0];
                        const lastTransaction = transactions[transactions.length - 1];

                        setOpeningBalance(firstTransaction.openingBalance || 0);
                        setClosingBal(lastTransaction.closingBalance || 0);
                    } else {
                        setOpeningBalance(0);
                        setClosingBal(0);
                    }
                } else {
                    toast.error(description || 'Failed to fetch data');
                }
            } else {
                toast.error('Failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetch data: ' + error.message);
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

    useEffect(() => {
        handleGetBankTransactionData();
        // handleGetCompanyWiseBalanceData();
    }, []);

    const transactionColumns = useMemo(() => [
        { Header: 'Date', accessor: 'transactionDate' },
        { Header: 'Narration', accessor: 'note' },
        { Header: 'Amount Received (Debit)', accessor: 'debitAmount' },
        { Header: 'Receipt Amount (Credit)', accessor: 'creditAmount' },
        { Header: 'Reference No.(Txn. ID)', accessor: 'transactionId' },
        { Header: 'Closing Balance', accessor: 'closingBalance' },
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

    const formatDateTime = () => {
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error('User ID is missing in localStorage.');
            return;
        }

        const payload = {
            transaction: {
                creditAmount: parseFloat(creditAmount) || 0,
                debitAmount: parseFloat(debitAmount) || 0,
                closingBalance: parseFloat(closingBalance) || 0,
                note,
                transactionDate: formatDateTime(),
                transactionId
            },
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/transaction/transactions/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.statusDescription.statusCode === 200) {
                toast.success(data?.statusDescription?.description || 'Transaction saved successfully!');
                handleReset();
                handleGetBankTransactionData();
            } else {
                toast.warning(data?.statusDescription?.description || 'Failed to save transaction');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        }
    };

    const handleReset = () => {
        setTransactionDate('');
        setNote('');
        setDebitAmount('');
        setCreditAmount('');
        setTransactionId('');
        setClosingBalance('');
    }

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        {/* --- Transaction Form --- */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Bank Transaction Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={transactionDate}
                                                onChange={(e) => setTransactionDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Narration</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Payment Amount (Debit)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={debitAmount}
                                                onChange={(e) => setDebitAmount(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Receipt Amount (Credit)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={creditAmount}
                                                onChange={(e) => setCreditAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Reference No.(Txn. ID)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Closing Balance</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={closingBalance}
                                                onChange={(e) => setClosingBalance(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary me-3">Submit</button>
                                        <button type="reset" className="btn btn-secondary" onClick={handleReset}>Reset</button>
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
                                        <span style={{ color: 'green' }}>
                                            Opening Balance: ₹{openingBalance}
                                        </span>
                                        <span style={{ marginLeft: '1rem', color: 'blue' }}>
                                            Closing Balance: ₹{closingBal}
                                        </span>
                                    </h6>
                                </div>

                                <div className="table-responsive mb-3">
                                    <table {...getTxnTableProps()} className="table table-striped m-0">
                                        <thead>
                                            {txnHeaderGroups.map(headerGroup => {
                                                const { key, ...groupProps } = headerGroup.getHeaderGroupProps();
                                                return (
                                                    <tr key={key} {...groupProps}>
                                                        {headerGroup.headers.map(column => {
                                                            const { key, ...colProps } = column.getHeaderProps();
                                                            return (
                                                                <th key={key} {...colProps}>
                                                                    {column.render('Header')}
                                                                </th>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </thead>
                                        <tbody {...getTxnBodyProps()}>
                                            {txnPage.map(row => {
                                                prepareTxnRow(row);
                                                const { key, ...rowProps } = row.getRowProps();
                                                return (
                                                    <tr key={key} {...rowProps}>
                                                        {row.cells.map(cell => {
                                                            const { key, ...cellProps } = cell.getCellProps();
                                                            return (
                                                                <td key={key} {...cellProps}>
                                                                    {cell.render('Cell')}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span>
                                        Page <strong>{txnPageIndex + 1} of {txnPageOptions.length}</strong>
                                    </span>
                                    <div>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => prevTxnPage()}
                                            disabled={!canPrevTxnPage}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => nextTxnPage()}
                                            disabled={!canNextTxnPage}
                                        >
                                            Next
                                        </button>
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

                                <div className="table-responsive mb-3">
                                    <table {...getBalanceTableProps()} className="table table-striped m-0">
                                        <thead>
                                            {balanceHeaderGroups.map(headerGroup => {
                                                const { key, ...groupProps } = headerGroup.getHeaderGroupProps();
                                                return (
                                                    <tr key={key} {...groupProps}>
                                                        {headerGroup.headers.map(column => {
                                                            const { key, ...colProps } = column.getHeaderProps();
                                                            return (
                                                                <th key={key} {...colProps}>
                                                                    {column.render('Header')}
                                                                </th>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </thead>
                                        <tbody {...getBalanceBodyProps()}>
                                            {balancePage.map(row => {
                                                prepareBalanceRow(row);
                                                const { key, ...rowProps } = row.getRowProps();
                                                return (
                                                    <tr key={key} {...rowProps}>
                                                        {row.cells.map(cell => {
                                                            const { key, ...cellProps } = cell.getCellProps();
                                                            return (
                                                                <td key={key} {...cellProps}>
                                                                    {cell.render('Cell')}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span>
                                        Page <strong>{balancePageIndex + 1} of {balancePageOptions.length}</strong>
                                    </span>
                                    <div>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => prevBalancePage()}
                                            disabled={!canPrevBalancePage}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => nextBalancePage()}
                                            disabled={!canNextBalancePage}
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
            <ToastContainer />
        </main>
    );
};

export default BankTransaction;