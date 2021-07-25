
import React, { useState, useEffect, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Edit2, Eye, Plus } from 'react-feather'
import { GrayButton, SuccessButton } from '../../components/button/Index'
import { Layout, Main } from '../../components/layout/Index'
import DataTable from '../../components/table/Index'
import Requests from '../../utils/Requests/Index'

const Index = () => {
    const history = useHistory()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.Vendor.Index(page, perPage, header)

        setData(response.data)
        setTotalRows(response.data.length)
        setLoading(false)
    }, [perPage, header])

    const handlePageChange = page => fetchData(page)

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true)
        const response = await Requests.Vendor.Index(page, newPerPage, header)

        setData(response.data)
        setPerPage(newPerPage)
        setLoading(false)
    }

    useEffect(() => {
        fetchData(1)
    }, [fetchData])

    const columns = [
        {
            name: 'SL',
            selector: row => row.id,
            sortable: true,
            grow: 0,
        },
        {
            name: 'Name',
            selector: row => row.username,
            sortable: true,
        },
        {
            name: 'E-mail',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Gender',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: "120px",
            cell: row =>
                <div>
                    <SuccessButton
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => history.push(`/dashboard/customer/show/${row.id}`)}
                    ><Eye size={16} />
                    </SuccessButton>

                    <SuccessButton
                        style={{ borderRadius: "50%", padding: "6px 9px", marginRight: 5 }}
                        onClick={() => history.push(`/dashboard/customer/edit/${row.id}`)}
                    ><Edit2 size={16} />
                    </SuccessButton>
                </div>
        },
    ]

    return (
        <div>
            <Layout
                page="dashboard / customer list"
                message="All Customer."
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/customer/store">
                            <GrayButton type="button">
                                <Plus size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>ADD NEW</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                <div className="col-12">
                    <DataTable
                        columns={columns}
                        data={data}
                        loading={loading}
                        totalRows={totalRows}
                        handlePerRowsChange={handlePerRowsChange}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </Main>
        </div>
    );
}

export default Index;