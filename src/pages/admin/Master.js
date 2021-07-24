import React, { useState } from 'react'
import './style.scss'
import { Switch, Route } from 'react-router-dom'

import Navbar from '../../components/navbar/Index'
import Drawer from '../../components/drawer/Index'

// --- Dashboard ---
import DashboardIndex from '../dashboard/Index'

// --- Banner ---
import BannerIndex from '../banner/Index'
import BannerStore from '../banner/Create'

// --- Brand ---
import BrandIndex from '../brand/Index'
import BrandStore from '../brand/Create'
import BrandEdit from '../brand/Edit'

// --- Vendor ---
import VendorIndex from '../vendor/Index'
import VendorStore from '../vendor/Create'
import VendorEdit from '../vendor/Edit'
import VendorShow from '../vendor/Show'

// --- Category ---
import CategoryIndex from '../category/Index'
import CategoryStore from '../category/Create'
import CategoryEdit from '../category/Edit'

// --- Product ---
import ProductIndex from '../product/Index'

// --- Order ---
import OrderIndex from '../order/Index'

import FourOFour from '../fourOfour/Index'

const Master = () => {
    const [open, setOpen] = useState(false)

    return (
        <div className="master">
            <Navbar menu={true} drawer={() => setOpen(true)} />
            <Drawer show={open} onHide={() => setOpen(false)} />

            <div className="main">
                <Switch>

                    {/* --- Dashboard --- */}
                    <Route exact path="/dashboard/" component={DashboardIndex} />

                    {/* --- Banner --- */}
                    <Route exact path="/dashboard/banner" component={BannerIndex} />
                    <Route exact path="/dashboard/banner/store" component={BannerStore} />

                    {/* --- Brand --- */}
                    <Route exact path="/dashboard/brand" component={BrandIndex} />
                    <Route exact path="/dashboard/brand/store" component={BrandStore} />
                    <Route exact path="/dashboard/brand/edit/:id" component={BrandEdit} />

                    {/* --- Vendor --- */}
                    <Route exact path="/dashboard/vendor" component={VendorIndex} />
                    <Route exact path="/dashboard/vendor/store" component={VendorStore} />
                    <Route exact path="/dashboard/vendor/edit/:id" component={VendorEdit} />
                    <Route exact path="/dashboard/vendor/show/:id" component={VendorShow} />

                    {/* --- Category --- */}
                    <Route exact path="/dashboard/category" component={CategoryIndex} />
                    <Route exact path="/dashboard/category/store" component={CategoryStore} />
                    <Route exact path="/dashboard/category/edit/:id" component={CategoryEdit} />

                    {/* --- Product --- */}
                    <Route exact path="/dashboard/product" component={ProductIndex} />

                    {/* --- Order --- */}
                    <Route exact path="/dashboard/order" component={OrderIndex} />


                    <Route path="*">
                        <FourOFour mt={"-70px"} />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default Master;