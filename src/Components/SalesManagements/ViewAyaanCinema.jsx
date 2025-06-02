import React, { useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table';
import { toast, ToastContainer } from 'react-toastify';
import ApiBaseUrl from '../Api_base_Url/ApiBaseUrl';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
                const { statusCode, statusMessage } = data.statusDescription;

                if (statusCode === 200) {
                    setboxOfficeConcessionSales(data.boxOfficeConcessionSales || []);
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
        handleGetAyaanCinemaData();
    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Date',
            accessor: 'reportDate',
        },
        { Header: 'Box Off. Admits', accessor: 'boxOfficeAdmits' },
        { Header: 'Net Box Off. Sales ', accessor: 'netBoxOfficeSales' },
        { Header: 'Gross Box Off. Sales', accessor: 'grossBoxOfficeSales' },
        { Header: 'Net Concs. Sales', accessor: 'netConcessionsSales' },
        { Header: 'Gross Concs. Sales', accessor: 'grossConcessionsSales' },
        { Header: 'DSR Net Box Off. Sales(A)', accessor: 'dsrShareNetBoxOffice' },
        { Header: 'DSR net Concs.(B)', accessor: 'dsrShareNetConcessions' },
        { Header: 'Total(A+B)', accessor: 'totalDsrShare' },

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
        { columns, data: boxOfficeConcessionSales, initialState: { pageIndex: 0, pageSize: 7 } },
        usePagination
    );

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
            'Total (A+B)': row.totalDsrShare,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'DSR Sales Report');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'DSRSalesReport.xlsx');
    };

    return (
        <main id="main" className="main">
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                {/* <h5 className="card-title">View Ayaan Cinema Sales Details</h5> */}
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
                                <div className='table-responsive mb-3'>
                                    <table {...getTableProps()} className="table table-striped m-0">
                                        <thead style={{ fontSize: '12px' }}>
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
            <ToastContainer />
        </main>
    );
};

export default ViewAyaanCinema