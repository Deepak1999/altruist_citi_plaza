import React, { useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const EditModal = ({ show, onClose, onSave, data }) => {
    const [amountPaid, setAmountPaid] = useState(data?.amountPaid || '');
    const [remarks, setRemarks] = useState(data?.remarks || 'N/A');

    useEffect(() => {
        if (data) {
            setAmountPaid(data.amountPaid || '');
            setRemarks(data.remarks || 'N/A');
        }
    }, [data]);

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Recharge Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Amount Paid</label>
                            <input
                                type="number"
                                className="form-control"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                            />
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
                            onClick={() =>
                                onSave({
                                    ...data,
                                    amountPaid: Number(amountPaid),
                                    remarks: remarks.trim() || 'N/A',
                                })
                            }
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ViewMeterRecharge = () => {

    const [electricityTableData, SetEelectricityTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleGetMonthlyData = async () => {

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
                    SetEelectricityTableData(data.electricityBillLogs || []);
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
        handleGetMonthlyData();
    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Lessee',
            accessor: 'lesseeName',
            Cell: ({ value }) => (
                <span title={value}>
                    {value.length > 20 ? `${value.slice(0, 20)}...` : value}
                </span>
            )
        },
        {
            Header: 'Month & Year',
            accessor: 'monthYear',
            Cell: ({ value }) => {
                const date = new Date(value);
                return date.toLocaleString('default', { month: 'long', year: 'numeric' });
            }
        },
        {
            Header: 'Bill Type',
            accessor: 'billType',
            Cell: ({ value }) => (value === 1 ? 'Postpaid' : value === 2 ? 'Prepaid' : '')
        },
        {
            Header: 'Amount Received',
            accessor: 'amountPaid',
            Cell: ({ value }) =>
                new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value ?? 0),
        },
        { Header: 'Payment Date', accessor: 'paymentDate' },
        {
            Header: 'Remarks',
            accessor: 'remarks',
            Cell: ({ value }) => (
                <span title={value}>
                    {value.length > 20 ? `${value.slice(0, 20)}...` : value}
                </span>
            )
        },
        {
            Header: 'Action',
            Cell: ({ row }) => (
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenModal(row.original)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>
            )
        }

    ], []);

    const filteredData = useMemo(() => {
        if (!searchQuery) return electricityTableData;

        return electricityTableData.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [electricityTableData, searchQuery]);

    // const {
    //     getTableProps,
    //     getTableBodyProps,
    //     headerGroups,
    //     prepareRow,
    //     page,
    //     pageOptions,
    //     canPreviousPage,
    //     canNextPage,
    //     nextPage,
    //     previousPage,
    //     state: { pageIndex, pageSize },
    //     setPageSize,
    // } = useTable(
    //     {
    //         columns,
    //         data: electricityTableData,
    //         initialState: { pageIndex: 0, pageSize: 7 },
    //     },
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
            data: filteredData,
            initialState: { pageIndex: 0, pageSize: 7 },
        },
        usePagination
    );

    const handleRowClick = (row) => {
        setSelectedRowData(row.original);
        setShowModal(true);
    };

    const handleDownloadExcel = () => {
        if (!electricityTableData.length) {
            toast.warn('No data to download');
            return;
        }

        const formattedData = electricityTableData.map(row => ({
            'Lessee': row.lesseeName?.length > 20 ? `${row.lesseeName.slice(0, 20)}...` : row.lesseeName,
            'Month & Year': new Date(row.monthYear).toLocaleString('default', { month: 'long', year: 'numeric' }),
            'Bill Type': row.billType === 1 ? 'Postpaid' : row.billType === 2 ? 'Prepaid' : '',
            'Amount Paid': row.amountPaid,
            'Payment Date': row.paymentDate,
            'Remarks': row.remarks?.length > 20 ? `${row.remarks.slice(0, 20)}...` : row.remarks,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Rent Details');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'MeterRechargeDetails.xlsx');
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
            toBeUpdated: updatedData.id,
            updateRemarks: updatedData.remarks,
            updatedLogAmount: updatedData.amountPaid,
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/electricity/bill-logs/update`, {
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

                SetEelectricityTableData(prev =>
                    prev.map(item => item.id === updatedData.id ? updatedData : item)
                );

                handleCloseModal();
                handleGetMonthlyData();
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
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Meter Recharge Details</h5>
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
                                    <input
                                        type="text"
                                        className="form-control w-auto ms-3"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
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
            <EditModal
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveModal}
                data={selectedRowData}
            />
            <ToastContainer />
        </main>
    );
};

export default ViewMeterRecharge