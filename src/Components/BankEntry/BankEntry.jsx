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

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');

    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const entryDateTime = `${formData.date} ${currentTime}`;

    const handleGetBankBalanceData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/bank-summary/all`, {
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
                    setBankBalanceTableData(data.dailyBankSummary || []);
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

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };

        // Parse numeric values or fallback to 0
        const bank = parseFloat(name === 'bankBalance' ? value : updatedFormData.bankBalance) || 0;
        const mobi = parseFloat(name === 'mobisoft' ? value : updatedFormData.mobisoft) || 0;
        const atpl = parseFloat(name === 'atpl' ? value : updatedFormData.atpl) || 0;
        const rs = parseFloat(name === 'rsHospitality' ? value : updatedFormData.rsHospitality) || 0;

        // Recalculate net balance
        updatedFormData.netBalance = (bank + mobi + atpl + rs).toFixed(2);

        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert('User ID not found in localStorage.');
            return;
        }

        const payload = {
            dailyBankSummary: {
                entryDate: entryDateTime,
                bankBalance: formData.bankBalance,
                mobisoft: formData.mobisoft,
                atpl: formData.atpl,
                rsHospitality: formData.rsHospitality,
                netBalance: formData.netBalance
            },
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/bank-summary/save`, {
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

    const columns = useMemo(() => [
        {
            Header: 'Date & Time',
            accessor: 'entryDate',
        },
        {
            Header: 'Bank Balance',
            accessor: 'bankBalance',
            Cell: ({ value }) => value != null ? value : 'N/A'
        },
        {
            Header: 'Mobisoft Balance',
            accessor: 'mobisoft',
            Cell: ({ value }) => value != null ? value : 'N/A'
        },
        {
            Header: 'Atpl Balance',
            accessor: 'atpl',
            Cell: ({ value }) => value != null ? value : 'N/A'
        },
        {
            Header: 'R S Hospitality Balance',
            accessor: 'rsHospitality',
            Cell: ({ value }) => value != null ? value : 'N/A'
        },
        {
            Header: 'Net Balance',
            accessor: 'netBalance',
            Cell: ({ value }) => value != null ? value : 'N/A'
        },
        // {
        //     Header: 'Opening Balance',
        //     accessor: 'openingbalance',
        //     Cell: ({ value }) => value != null ? value : 'N/A'
        // },
        // {
        //     Header: 'Closing Balance',
        //     accessor: 'closingbalance',
        //     Cell: ({ value }) => value != null ? value : 'N/A'
        // },

    ], []);

    // const {
    //     getTableProps,
    //     getTableBodyProps,
    //     headerGroups,
    //     page,
    //     nextPage,
    //     previousPage,
    //     canNextPage,
    //     canPreviousPage,
    //     prepareRow,
    //     pageOptions,
    //     state: { pageIndex },
    // } = useTable(
    //     { columns, data: bankBalanceTableData, initialState: { pageIndex: 0, pageSize: 5 } },
    //     usePagination
    // );

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
            data: bankBalanceTableData,
            initialState: { pageIndex: 0, pageSize: 7 },
        },
        usePagination
    );

    const handleDownloadExcel = () => {
        if (!bankBalanceTableData.length) {
            toast.warn('No data to download');
            return;
        }

        const formattedData = bankBalanceTableData.map(row => {
            const date = new Date(row.entryDate);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            return {
                'Date & Time': formattedDateTime,
                'Bank Balance': row.bankBalance ?? 'N/A',
                'Mobisoft Balance': row.mobisoft ?? 'N/A',
                'Atpl Balance': row.atpl ?? 'N/A',
                'R S Hospitality Balance': row.rsHospitality ?? 'N/A',
                'Net Balance': row.netBalance ?? 'N/A',
                // Uncomment if you want these too:
                // 'Opening Balance': row.openingbalance ?? 'N/A',
                // 'Closing Balance': row.closingbalance ?? 'N/A',
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
                                    <div className="row mb-4">
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
                                                readOnly
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