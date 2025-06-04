import React, { useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const EditModal = ({ show, onClose, onSave, data }) => {
    const [units, setUnits] = useState(data?.unit || '');
    const [solarUnits, setSolarUnits] = useState(data?.solarUnit || '');
    const [dsrBill, setDsrBill] = useState(data?.dsrBill || '');
    const [postpaid, setPostpaid] = useState(data?.postpaidBill || '');
    const [collectionDetails, setCollectionDetails] = useState(data?.collectionAmountPostpaid || '');
    const [prepaid, setPrepaid] = useState(data?.collectionAmountPrepaid || '');
    const [grandTotal, setGrandTotal] = useState(data?.totalAmount || '');
    const [remarks, setRemarks] = useState(data?.remarks || 'N/A');

    useEffect(() => {
        if (data) {
            setUnits(data.unit || '');
            setSolarUnits(data.solarUnit || '');
            setDsrBill(data.dsrBill || '');
            setPostpaid(data.postpaidBill || '');
            setCollectionDetails(data.collectionAmountPostpaid || '');
            setPrepaid(data.collectionAmountPrepaid || '');
            setGrandTotal(data.totalAmount || '');
            setRemarks(data.remarks || 'N/A');
        }
    }, [data]);

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Monthly Consumption Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Units</label>
                                <input className="form-control" value={units} onChange={(e) => setUnits(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Solar Units</label>
                                <input className="form-control" value={solarUnits} onChange={(e) => setSolarUnits(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">DSR Bill</label>
                                <input className="form-control" value={dsrBill} onChange={(e) => setDsrBill(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Postpaid</label>
                                <input className="form-control" value={postpaid} onChange={(e) => setPostpaid(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Collection Details(A)</label>
                                <input className="form-control" value={collectionDetails} onChange={(e) => setCollectionDetails(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Prepaid(B)</label>
                                <input className="form-control" value={prepaid} onChange={(e) => setPrepaid(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Grand Total(A + B)</label>
                                <input className="form-control" value={grandTotal} onChange={(e) => setGrandTotal(e.target.value)} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Remarks</label>
                            <textarea className="form-control" value={remarks} onChange={(e) => setRemarks(e.target.value)}></textarea>
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
                                    units,
                                    solarUnits,
                                    dsrBill,
                                    postpaid,
                                    collectionDetails,
                                    prepaid,
                                    grandTotal,
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


const ViewMonthlyCons = () => {

    const [monthlyConsData, setMonthlyConsData] = useState([]);

    const handleGetMonthlyConsData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/electricity/meter-log/all`, {
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
                    setMonthlyConsData(data.meterReadingLogs || []);
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
        handleGetMonthlyConsData();
    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Month',
            accessor: 'monthYear',
            Cell: ({ value }) => {
                const date = new Date(value);
                return date.toLocaleString('default', { month: 'long', year: 'numeric' });
            }
        },
        { Header: 'Units', accessor: 'unit' },
        { Header: 'Solar Units', accessor: 'solarUnit' },
        { Header: 'DSR Bill', accessor: 'dsrBill' },
        { Header: 'Postpaid', accessor: 'postpaidBill' },
        { Header: 'Collection Details(A)', accessor: 'collectionAmountPostpaid' },
        { Header: 'Prepaid(B)', accessor: 'collectionAmountPrepaid' },
        { Header: 'Grand Total(A+B)', accessor: 'totalAmount' },
        {
            Header: 'Remarks',
            accessor: 'remarks',
            Cell: ({ value }) => {
                if (!value || !value.trim()) return 'N/A';

                const words = value.trim().split(/\s+/);
                const shortText = words.slice(0, 5).join(' ');
                const isTruncated = words.length > 5;

                return (
                    <span title={value}>
                        {shortText}{isTruncated ? '...' : ''}
                    </span>
                );
            }
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
        { columns, data: monthlyConsData, initialState: { pageIndex: 0, pageSize: 7 } },
        usePagination
    );

    const handleDownloadExcel = () => {
        if (!monthlyConsData.length) {
            toast.warn('No data to download');
            return;
        }

        const formattedData = monthlyConsData.map(row => ({
            'Month': new Date(row.monthYear).toLocaleString('default', { month: 'long', year: 'numeric' }),
            'Units': row.unit,
            'Solar Units': row.solarUnit,
            'DSR Bill': row.dsrBill,
            'Postpaid': row.postpaidBill,
            'Collection Details(A)': row.collectionAmountPostpaid,
            'Prepaid(B)': row.collectionAmountPrepaid,
            'Grand Total(A+B)': row.totalAmount,
            'Remarks': row.remarks || 'N/A',
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Rent Summary');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'MonthlyConsumption.xlsx');
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
            unitsConsumed: updatedData.units,
            solarUnitsConsumed: updatedData.solarUnits,
            dsrBill: updatedData.dsrBill,
            postpaidBill: updatedData.postpaid,
            postpaidCA: updatedData.collectionDetails,
            prepaidCA: updatedData.prepaid,
            totalAmount: updatedData.grandTotal,
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/electricity/meter-log/update`, {
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

                setMonthlyConsData(prev =>
                    prev.map(item => item.id === updatedData.id ? updatedData : item)
                );

                handleCloseModal();
                handleGetMonthlyConsData();
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
                                {/* <h5 className="card-title">View Monthly Consumption Details</h5> */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Monthly Consumption Details</h5>
                                    <i
                                        className="fa-solid fa-circle-down"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleDownloadExcel}
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

export default ViewMonthlyCons