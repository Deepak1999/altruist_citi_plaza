import React, { useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const EditModal = ({ show, onClose, onSave, data }) => {
    const [boxOfficeAdmits, setBoxOfficeAdmits] = useState(data?.boxOfficeAdmits || '');
    const [netBoxOfficeSales, setNetBoxOfficeSales] = useState(data?.netBoxOfficeSales || '');
    const [grossBoxOfficeSales, setGrossBoxOfficeSales] = useState(data?.grossBoxOfficeSales || '');
    const [netConcessionsSales, setNetConcessionsSales] = useState(data?.netConcessionsSales || '');
    const [grossConcessionsSales, setGrossConcessionsSales] = useState(data?.grossConcessionsSales || '');
    const [dsrShareNetBoxOffice, setDsrShareNetBoxOffice] = useState(data?.dsrShareNetBoxOffice || '');
    const [dsrShareNetConcessions, setDsrShareNetConcessions] = useState(data?.dsrShareNetConcessions || '');
    const [totalDsrShare, setTotalDsrShare] = useState(data?.totalDsrShare || '');
    const [remarks, setRemarks] = useState(data?.remarks || 'N/A');

    useEffect(() => {
        if (data) {
            setBoxOfficeAdmits(data.boxOfficeAdmits || '');
            setNetBoxOfficeSales(data.netBoxOfficeSales || '');
            setGrossBoxOfficeSales(data.grossBoxOfficeSales || '');
            setNetConcessionsSales(data.netConcessionsSales || '');
            setGrossConcessionsSales(data.grossConcessionsSales || '');
            setDsrShareNetBoxOffice(data.dsrShareNetBoxOffice || '');
            setDsrShareNetConcessions(data.dsrShareNetConcessions || '');
            setTotalDsrShare(data.totalDsrShare || '');
            setRemarks(data.remarks || 'N/A');
        }
    }, [data]);

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Ayaan Cinema Sales Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Box Off. Admits</label>
                                <input className="form-control" value={boxOfficeAdmits} onChange={(e) => setBoxOfficeAdmits(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Net Box Off. Sales</label>
                                <input className="form-control" value={netBoxOfficeSales} onChange={(e) => setNetBoxOfficeSales(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Gross Box Off. Sales</label>
                                <input className="form-control" value={grossBoxOfficeSales} onChange={(e) => setGrossBoxOfficeSales(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Net Concs. Sales</label>
                                <input className="form-control" value={netConcessionsSales} onChange={(e) => setNetConcessionsSales(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Gross Concs. Sales</label>
                                <input className="form-control" value={grossConcessionsSales} onChange={(e) => setGrossConcessionsSales(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">DSR Net Box Off. Sales (A)</label>
                                <input className="form-control" value={dsrShareNetBoxOffice} onChange={(e) => setDsrShareNetBoxOffice(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">DSR Net Concs. (B)</label>
                                <input className="form-control" value={dsrShareNetConcessions} onChange={(e) => setDsrShareNetConcessions(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Total (A+B)</label>
                                <input className="form-control" value={totalDsrShare} onChange={(e) => setTotalDsrShare(e.target.value)} />
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
                                    boxOfficeAdmits,
                                    netBoxOfficeSales: Number(netBoxOfficeSales),
                                    grossBoxOfficeSales: Number(grossBoxOfficeSales),
                                    netConcessionsSales: Number(netConcessionsSales),
                                    grossConcessionsSales: Number(grossConcessionsSales),
                                    dsrShareNetBoxOffice: Number(dsrShareNetBoxOffice),
                                    dsrShareNetConcessions: Number(dsrShareNetConcessions),
                                    totalDsrShare: Number(totalDsrShare),
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


const ViewAyaanCinema = () => {

    const [boxOfficeConcessionSales, setboxOfficeConcessionSales] = useState([]);

    const handleGetAyaanCinemaData = async () => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error('Missing necessary data in localStorage');
            return;
        }

        try {
            const response = await fetch(`${ApiBaseUrl}/sale-logs/box-office-concession/all`, {
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
                    setboxOfficeConcessionSales(data.boxOfficeConcessionSales || []);
                } else {
                    toast.warning(description || 'failed to fetch data');
                }
            } else {
                toast.error('failed to fetch data with status: ' + response.status);
            }
        } catch (error) {
            toast.error('Error during fetch data: ' + error.message);
        }
    };

    useEffect(() => {
        handleGetAyaanCinemaData();
    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Date',
            accessor: 'reportDate',
            Cell: ({ value }) => value ? value.split(' ')[0] : '',
        },
        { Header: 'Box Off. Admits', accessor: 'boxOfficeAdmits' },
        { Header: 'Net Box Off. Sales ', accessor: 'netBoxOfficeSales' },
        { Header: 'Gross Box Off. Sales', accessor: 'grossBoxOfficeSales' },
        { Header: 'Net Concs. Sales', accessor: 'netConcessionsSales' },
        { Header: 'Gross Concs. Sales', accessor: 'grossConcessionsSales' },
        { Header: 'DSR Net Box Off. Sales(A)', accessor: 'dsrShareNetBoxOffice' },
        { Header: 'DSR net Concs.(B)', accessor: 'dsrShareNetConcessions' },
        { Header: 'Total(A+B)', accessor: 'totalDsrShare' },
        {
            Header: 'Remarks',
            accessor: 'remarks',
            Cell: ({ value }) => {
                if (!value || !value.trim()) return 'N/A';

                const words = value.trim().split(/\s+/);
                const shortText = words.slice(0, 10).join(' ');
                const isTruncated = words.length > 10;

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
    //     { columns, data: boxOfficeConcessionSales, initialState: { pageIndex: 0, pageSize: 7 } },
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
            data: boxOfficeConcessionSales,
            initialState: { pageIndex: 0, pageSize: 7 },
        },
        usePagination
    );

    const handleRowClick = (row) => {
        setSelectedRowData(row.original);
        setShowModal(true);
    };

    const handleDownloadExcel = () => {
        if (!boxOfficeConcessionSales.length) {
            toast.warn('No data to download');
            return;
        }

        const formattedData = boxOfficeConcessionSales.map(row => ({
            'Date': row.reportDate,
            'Box Office Admits': row.boxOfficeAdmits,
            'Net Box Office Sales': row.netBoxOfficeSales,
            'Gross Box Office Sales': row.grossBoxOfficeSales,
            'Net Concs. Sales': row.netConcessionsSales,
            'Gross Concs. Sales': row.grossConcessionsSales,
            'DSR Net Box Off. Sales(A)': row.dsrShareNetBoxOffice,
            'DSR net Concs.(B)': row.dsrShareNetConcessions,
            'Remarks': row.remarks || 'N/A',
            'Total (A+B)': row.totalDsrShare,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'DSR Sales Report');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'DSRSalesReport.xlsx');
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
            netBoxOfficeSales: updatedData.netBoxOfficeSales,
            grossBoxOfficeSales: updatedData.grossBoxOfficeSales,
            netConcessionsSales: updatedData.netConcessionsSales,
            grossConcessionsSales: updatedData.grossConcessionsSales,
            dsrShareNetBoxOffice: updatedData.dsrShareNetBoxOffice,
            dsrShareNetConcessions: updatedData.dsrShareNetConcessions,
            totalDsrShare: updatedData.totalDsrShare,
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/sale-logs/box-office-concession/update`, {
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

                setboxOfficeConcessionSales(prev =>
                    prev.map(item => item.id === updatedData.id ? updatedData : item)
                );

                handleCloseModal();
                handleGetAyaanCinemaData();
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
                                    <h5 className="card-title mb-0">Ayaan Cinema Sales Details</h5>
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
                                </div>
                                <div className="table-responsive mb-3">
                                    <table {...getTableProps()} className="table table-striped m-0">
                                        <thead style={{ fontSize: '12px' }}>
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

export default ViewAyaanCinema