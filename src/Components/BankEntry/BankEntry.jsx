import React, { useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';

const BankEntry = () => {

    const [bankBalanceTableData, setBankBalanceTableData] = useState([]);
    const [formData, setFormData] = useState({
        date: '',
        bankBalance: '',
        mobisoft: '',
        atpl: '',
        rsHospitality: '',
        netBalance: ''
    });

    const handleGetBankBalanceData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/electricity/bill-logs/all`, {
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
                    setBankBalanceTableData(data.electricityBillLogs || []);
                } else {
                    toast.error(statusMessage || 'failed to fetch data');
                }
            } else {
                toast.error('failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetch data: ' + error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert('User ID not found in localStorage.');
            return;
        }

        const payload = {
            date: formData.date,
            bank_balance: formData.bankBalance,
            mobisoft_balance: formData.mobisoft,
            atpl_balance: formData.atpl,
            r_s_hospital_balance: formData.rsHospitality,
            net_balance: formData.netBalance
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/transaction/transactions/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.statusDescription?.statusCode === 200) {
                toast.success(result?.statusDescription?.description || 'Balance save successful!');
                handleReset();
                handleGetBankBalanceData();
            } else {
                toast.error(result.statusDescription?.description || 'Failed to save balance');
            }
        } catch (error) {
            toast.error('An error occurred while saving the transaction.');
        }
    };

    useEffect(() => {
        handleGetBankBalanceData();
    }, []);

    const handleReset = () => {
        setFormData({ date: '', bankBalance: '', mobisoft: '', atpl: '', rsHospitality: '', netBalance: '' })
    };

    const dummyData = useMemo(() => [
        {
            paymentDate: '2025-06-12',
            bankbal: '₹12,000',
            mobisoft: '₹3,000',
            atpl: '₹4,000',
            rshospitality: '₹5,000',
            netbal: '₹24,000',
            openingbalance: '₹10,000',
            closingbalance: '₹14,000',
        },
        {
            paymentDate: '2025-06-12',
            bankbal: '₹12,000',
            mobisoft: '₹3,000',
            atpl: '₹4,000',
            rshospitality: '₹5,000',
            netbal: '₹24,000',
            openingbalance: '₹10,000',
            closingbalance: '₹14,000',
        },

    ], []);

    const columns = useMemo(() => [
        {
            Header: 'Date & Time',
            accessor: 'paymentDate',
            // Cell: ({ value }) => {
            //     const date = new Date(value);

            //     const year = date.getFullYear();
            //     const month = String(date.getMonth() + 1).padStart(2, '0');
            //     const day = String(date.getDate()).padStart(2, '0');

            //     const hours = String(date.getHours()).padStart(2, '0');
            //     const minutes = String(date.getMinutes()).padStart(2, '0');
            //     const seconds = String(date.getSeconds()).padStart(2, '0');

            //     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            // }
        },
        { Header: 'Bank Balance', accessor: 'bankbal' },
        { Header: 'Mobisoft Balance', accessor: 'mobisoft' },
        { Header: 'Atpl Balance', accessor: 'atpl' },
        { Header: 'R S Hospitality Balance', accessor: 'rshospitality' },
        { Header: 'Net Balance', accessor: 'netbal' },
        { Header: 'Opening Balance', accessor: 'openingbalance' },
        { Header: 'Closing Balance', accessor: 'closingbalance' },

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
        { columns, data: dummyData, initialState: { pageIndex: 0, pageSize: 5 } },
        usePagination
    );

    const handleDownloadExcel = () => {
        if (!bankBalanceTableData.length) {
            toast.warn('No data to download');
            return;
        }

        const formattedData = bankBalanceTableData.map(row => {
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
                'Bank Balance': row.plantName,
                'Mobisoft Balance': row.unitProduced,
                'Atpl Balance': row.unitProduce,
                'R S Hospitality Balance': row.unitProduc,
                'Net Balance': row.unitProdu,
                'Opening Balance': row.unitProd,
                'Closing Balance': row.unitPro
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bank Balance Report');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'BankBalanceReport.xlsx');
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Bank Balance Details</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                className="form-control"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Bank Balance</label>
                                            <input
                                                type="number"
                                                name="bankBalance"
                                                className="form-control"
                                                value={formData.bankBalance}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Mobisoft Balance</label>
                                            <input
                                                type="number"
                                                name="mobisoft"
                                                className="form-control"
                                                value={formData.mobisoft}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">ATPL Balance</label>
                                            <input
                                                type="number"
                                                name="atpl"
                                                className="form-control"
                                                value={formData.atpl}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">R S Hospitallity Balance</label>
                                            <input
                                                type="number"
                                                name="rsHospitality"
                                                className="form-control"
                                                value={formData.rsHospitality}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Net Balance</label>
                                            <input
                                                type="number"
                                                name="netBalance"
                                                className="form-control"
                                                value={formData.netBalance}
                                                onChange={handleChange}
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
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">View Bank Balance Details</h5>
                                    <i
                                        className="fa-solid fa-circle-down"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleDownloadExcel}
                                    >
                                        <span className="ms-2">Download</span>
                                    </i>
                                </div>
                                <div className="table-responsive mb-3">
                                    <table {...getTableProps()} className="table table-striped m-0">
                                        <thead>
                                            {headerGroups.map(headerGroup => {
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
                                        <tbody {...getTableBodyProps()}>
                                            {page.map(row => {
                                                prepareRow(row);
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
                                        Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
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
            <ToastContainer />
        </main>
    );
};

export default BankEntry