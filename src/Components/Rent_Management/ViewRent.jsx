import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EditModal = ({ show, onClose, onSave, data }) => {
    const [amountPaid, setAmountPaid] = useState(data?.rentPaidAmount || '');
    const [remarks, setRemarks] = useState(data?.remarks || '');

    useEffect(() => {
        if (data) {
            setAmountPaid(data.rentPaidAmount);
            setRemarks(data.remarks);
        }
    }, [data]);

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Rent Details</h5>
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
                            onClick={() => onSave({ ...data, rentPaidAmount: amountPaid, remarks })}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ViewRent = () => {

    const [lesseeTableData, setLesseeTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleGetMonthlyData = async () => {

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
                    setLesseeTableData(data.monthlyRentLogs || []);
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
            Header: 'Rent Amount',
            accessor: 'rentAmount',
            Cell: ({ value }) =>
                new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value ?? 0),
        },
        {
            Header: 'Month & Year',
            accessor: 'monthYear',
            Cell: ({ value }) => {
                const date = new Date(value);
                return date.toLocaleString('default', { month: 'long', year: 'numeric' });
            }
        },
        { Header: 'Mode', accessor: 'paymentMode' },
        {
            Header: 'Amount Received',
            accessor: 'rentPaidAmount',
            Cell: ({ value }) =>
                new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value ?? 0),
        },
        {
            Header: 'Pending Amount',
            accessor: 'rentPendingAmount',
            Cell: ({ value }) =>
                new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value ?? 0),
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
        if (!searchQuery) return lesseeTableData;

        return lesseeTableData.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [lesseeTableData, searchQuery]);

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
    //         data: lesseeTableData,
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
        if (!lesseeTableData.length) {
            toast.warn('No data to download');
            return;
        }

        const formattedData = lesseeTableData.map(row => ({
            'Lessee': row.lesseeName?.length > 20 ? `${row.lesseeName.slice(0, 20)}...` : row.lesseeName,
            'Rent Amount': row.rentAmount,
            'Month & Year': new Date(row.monthYear).toLocaleString('default', { month: 'long', year: 'numeric' }),
            'Mode': row.paymentMode,
            'Amount Paid': row.rentPaidAmount,
            'Pending Amount': row.rentPendingAmount,
            'Remarks': row.remarks?.length > 20 ? `${row.remarks.slice(0, 20)}...` : row.remarks,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Rent Details');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'RentDetails.xlsx');
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
            const response = await fetch(`${ApiBaseUrl}/rent/update/rent-log`, {
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

                setLesseeTableData(prev =>
                    prev.map(item => item.rentId === updatedData.rentId ? updatedData : item)
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
                                {/* Header and download */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Rent Details</h5>
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
                                            {headerGroups.map((headerGroup) => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map((column) => (
                                                        <th {...column.getHeaderProps()}>
                                                            {column.render('Header')}
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...getTableBodyProps()}>
                                            {page.map((row) => {
                                                prepareRow(row);
                                                return (
                                                    <tr
                                                        {...row.getRowProps()}
                                                        onClick={() => handleRowClick(row)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {row.cells.map((cell) => (
                                                            <td {...cell.getCellProps()}>
                                                                {cell.render('Cell')}
                                                            </td>
                                                        ))}
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
                                            onClick={previousPage}
                                            disabled={!canPreviousPage}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={nextPage}
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
                onClose={() => setShowModal(false)}
                onSave={() => setShowModal(false)}
                data={selectedRowData}
            />
            <ToastContainer />
        </main>
    );
};

export default ViewRent;