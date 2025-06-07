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
        { Header: 'Rent Amount', accessor: 'rentAmount' },
        {
            Header: 'Month & Year',
            accessor: 'monthYear',
            Cell: ({ value }) => {
                const date = new Date(value);
                return date.toLocaleString('default', { month: 'long', year: 'numeric' });
            }
        },
        { Header: 'Mode', accessor: 'paymentMode' },
        { Header: 'Amount Paid', accessor: 'rentPaidAmount' },
        { Header: 'Pending Amount', accessor: 'rentPendingAmount' },
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
        { columns, data: lesseeTableData, initialState: { pageIndex: 0, pageSize: 7 } },
        usePagination
    );

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

export default ViewRent;
