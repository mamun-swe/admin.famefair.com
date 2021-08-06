
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ChevronLeft, X } from 'react-feather'
import JoditEditor from 'jodit-react'
import {
    GrayButton,
    PrimaryButton
} from '../../components/button/Index'
import {
    SingleSelect,
    Creatable
} from '../../components/select/Index'
import { Loader } from '../../components/loader/Index'
import { Layout, Main } from '../../components/layout/Index'
import { FileUploader } from '../../components/fileUploader/Single'
import { AdditionalInfo } from '../../components/product/AdditionalInfo'
import Requests from '../../utils/Requests/Index'


const Edit = () => {
    const { id } = useParams()
    const editor = useRef(null)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState(false)

    const [data, setData] = useState(null)
    const [vendor, setVendor] = useState({ options: [], value: null, error: null })
    const [brand, setBrand] = useState({ options: [], value: null })
    const [category, setCategory] = useState({ options: [], value: null, error: null })
    const [tags, setTags] = useState({ value: [], error: null })

    const [additional, setAdditional] = useState(null)
    const [content, setContent] = useState('')
    const [image, setImage] = useState({ preview: null, loading: false })
    const [images, setImages] = useState({ previews: [], loading: false, error: null })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Text editor config
    const config = {
        readonly: false,
        minHeight: 350,
        uploader: {
            "insertImageAsBase64URI": true
        }
    }

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Product.Show(id, header)
        const optionsRes = await Requests.Options.Index(header)
        if (response && optionsRes) {
            setData(response.data)
            setImage(exImage => ({ ...exImage, preview: response.data.images.small }))
            setImages(exImages => ({ ...exImages, previews: response.data.images.additional }))

            setCategory(exCategory => ({ ...exCategory, options: optionsRes.categories, value: response.data.category._id || null }))
            setVendor(exVendor => ({ ...exVendor, options: optionsRes.vendors, value: response.data.vendor._id || null }))
            setBrand(exBrand => ({ ...exBrand, options: optionsRes.brands, value: response.data.brand && response.data.brand._id ? response.data.brand._id : null }))
            setTags(exTags => ({ ...exTags, value: response.data.tags || null }))

            setAdditional(response.data.additionalInfo)
            setContent(response.data.description)
        }
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Handle form submission
    const onSubmit = async data => {

        if (!vendor.value) return setVendor({ ...vendor, error: "Vendor is required." })
        if (!category.value) return setCategory({ ...category, error: "Category is required." })
        if (!tags.value.length) return setTags({ ...tags, error: "Tags is required." })

        const formData = {
            ...data,
            vendor: vendor.value,
            brand: brand.value,
            category: category.value,
            tags: tags.value,
            additionalInfo: additional,
            description: content
        }

        setUpdate(true)
        await Requests.Product.Update(id, formData, header)
        setUpdate(false)
    }

    // Handle Small Image
    const smImageHandeller = async (event) => {
        let file = event.image
        if (file) {
            setImage({ preview: URL.createObjectURL(file), loading: true })

            let formData = new FormData()
            formData.append('image', file)

            await Requests.Product.UpdateSMImage(id, formData, header)
            setImage({ preview: URL.createObjectURL(file), loading: false })
        }
    }

    // Handle to add additional images
    const fileAdditionHandeller = async (event) => {
        const file = event.image
        const fileURl = URL.createObjectURL(file)
        if (file) {

            setImages(exImages => ({
                ...exImages,
                previews: [...exImages.previews, fileURl],
                loading: true
            }))

            let formData = new FormData()
            formData.append('image', file)

            await Requests.Product.AddAdditional(id, formData, header)
            setImages(exImages => ({ ...exImages, loading: false }))
        }
    }


    if (loading) return <Loader />

    return (
        <div>
            <Layout
                page="dashboard / product edit"
                message={`Edit ${data.name}`}
                container="container-fluid"
                button={
                    <div>
                        <Link to="/dashboard/product">
                            <GrayButton type="button">
                                <ChevronLeft size={15} style={{ marginRight: 5 }} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                <div className="col-12">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Name */}
                        <div className="form-group mb-4">
                            {errors.name && errors.name.message ?
                                <p className="text-danger">{errors.name && errors.name.message}</p>
                                : <p>Product name</p>}

                            <input
                                type="text"
                                placeholder="Enter product name"
                                defaultValue={data.name || null}
                                className={errors.name ? "form-control shadow-none error" : "form-control shadow-none"}
                                {...register("name", { required: "Product name is required" })}
                            />
                        </div>

                        <div className="row">

                            {/* Vendor */}
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                    {vendor.error ?
                                        <p className="text-danger">{vendor.error}</p>
                                        : <p>Vendor</p>}

                                    <SingleSelect
                                        placeholder="vendor"
                                        error={vendor.error}
                                        options={vendor.options}
                                        deafult={data.vendor ? { label: data.vendor.name, value: data.vendor._id } : null}
                                        value={event => setVendor({ ...vendor, value: event.value, error: null })}
                                    />
                                </div>
                            </div>

                            {/* Brand */}
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                    <p>Brand</p>

                                    <SingleSelect
                                        placeholder="brand"
                                        options={brand.options}
                                        deafult={data.brand ? { label: data.brand.name, value: data.brand._id } : null}
                                        value={event => setBrand({ ...brand, value: event.value })}
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="col-12 col-lg-4">
                                <div className="form-group mb-4">
                                    {category.error ?
                                        <p className="text-danger">{category.error}</p>
                                        : <p>Category</p>}

                                    <SingleSelect
                                        placeholder="category"
                                        error={category.error}
                                        options={category.options}
                                        deafult={data.category ? { label: data.category.name, value: data.category._id } : null}
                                        value={event => setCategory({ ...category, value: event.value, error: null })}
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="col-12 col-lg-8">
                                <div className="form-group mb-4">
                                    {tags.error ?
                                        <p className="text-danger">{tags.error}</p>
                                        : <p>Tags</p>}

                                    <Creatable
                                        placeholder="Enter tags"
                                        error={tags.error}
                                        deafult={data.tags ? data.tags.map(item => ({ value: item, label: item })) : null}
                                        value={event => setTags({ value: event, error: null })}
                                    />
                                </div>
                            </div>

                            {/* SKU */}
                            <div className="col-12 col-lg-6 col-xl-3">
                                <div className="form-group mb-4">
                                    {errors.sku && errors.sku.message ?
                                        <p className="text-danger">{errors.sku && errors.sku.message}</p>
                                        : <p>Product SKU</p>}

                                    <input
                                        type="text"
                                        placeholder="Enter product SKU"
                                        defaultValue={data.sku || null}
                                        className={errors.sku ? "form-control shadow-none error" : "form-control shadow-none"}
                                        {...register("sku", { required: "Product SKU is required" })}
                                    />
                                </div>
                            </div>

                            {/* Stock amount */}
                            <div className="col-12 col-lg-6 col-xl-3">
                                <div className="form-group mb-4">
                                    {errors.stockAmount && errors.stockAmount.message ?
                                        <p className="text-danger">{errors.stockAmount && errors.stockAmount.message}</p>
                                        : <p>Stock amount</p>}

                                    <input
                                        type="number"
                                        placeholder="Enter stock amount"
                                        defaultValue={data.stockAmount || null}
                                        className={errors.stockAmount ? "form-control shadow-none error" : "form-control shadow-none"}
                                        {...register("stockAmount", { required: "Stock amount is required" })}
                                    />
                                </div>
                            </div>

                            {/* Purchase price */}
                            <div className="col-12 col-lg-6 col-xl-3">
                                <div className="form-group mb-4">
                                    {errors.purchasePrice && errors.purchasePrice.message ?
                                        <p className="text-danger">{errors.purchasePrice && errors.purchasePrice.message}</p>
                                        : <p>Purchase price</p>}

                                    <input
                                        type="number"
                                        placeholder="Enter stock amount"
                                        defaultValue={data.stockAmount || null}
                                        className={errors.purchasePrice ? "form-control shadow-none error" : "form-control shadow-none"}
                                        {...register("purchasePrice", { required: "Purchase price is required" })}
                                    />
                                </div>
                            </div>

                            {/* Sale price */}
                            <div className="col-12 col-lg-6 col-xl-3">
                                <div className="form-group mb-4">
                                    {errors.salePrice && errors.salePrice.message ?
                                        <p className="text-danger">{errors.salePrice && errors.salePrice.message}</p>
                                        : <p>Sale price</p>}

                                    <input
                                        type="number"
                                        placeholder="Enter stock amount"
                                        defaultValue={data.salePrice || null}
                                        className={errors.salePrice ? "form-control shadow-none error" : "form-control shadow-none"}
                                        {...register("salePrice", { required: "Sale price is required" })}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Additional information */}
                        <AdditionalInfo
                            default={data.additionalInfo && data.additionalInfo.length ? data.additionalInfo : null}
                            data={value => setAdditional(value)}
                        />

                        {/* Description */}
                        <div className="form-group mb-4">
                            <p>Description</p>

                            <JoditEditor
                                ref={editor}
                                value={data.description || content}
                                config={config}
                                tabIndex={8}
                                onBlur={newContent => setContent(newContent)}
                            />
                        </div>

                        {/* Youtube embed link */}
                        <div className="form-group mb-4">
                            <p>Youtube embed link</p>

                            <input
                                type="text"
                                placeholder="Enter youtube embed link"
                                className="form-control shadow-none"
                                defaultValue={data.video || null}
                                {...register("video")}
                            />
                        </div>

                        <div className="text-end mt-3">
                            <PrimaryButton
                                type="submit"
                                disabled={update}
                                className="px-4"
                            >
                                {update ? "Updating ..." : "Update"}
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Single File uploader */}
                    <FileUploader
                        width={100}
                        height={100}
                        limit={100}
                        loading={image.loading}
                        title="Product image"
                        error={image.error}
                        default={image.preview}
                        dataHandeller={smImageHandeller}
                    />

                    {/* Additional images */}
                    <p className="mb-1 ms-1">Additional Images</p>
                    <div className="d-flex flex-wrap">

                        {images.previews && images.previews.map((item, i) =>
                            <div
                                className="border m-1"
                                style={{
                                    width: 100,
                                    height: 100,
                                    overflow: "hidden",
                                    position: "relative"
                                }}
                                key={i}
                            >
                                <img
                                    src={item}
                                    style={{ width: "100%", height: "100%" }}
                                    alt="..."
                                />

                                {/* Remove button */}
                                <GrayButton
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        borderRadius: "50%",
                                        padding: "5px 8px"
                                    }}
                                    onClick={() => console.log("log delete")}
                                >
                                    <X size={15} color="red" />
                                </GrayButton>
                            </div>
                        )}

                        {/* New file addition */}
                        <div className="m-1" style={{ width: 100, height: 100 }}>
                            <FileUploader
                                width={100}
                                height={100}
                                limit={100}
                                error={images.error}
                                loading={images.loading}
                                dataHandeller={fileAdditionHandeller}
                            />
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}

export default Edit;