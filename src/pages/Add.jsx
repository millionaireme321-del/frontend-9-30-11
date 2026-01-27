import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subcategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setCategory('Men')
    setSubCategory('Topwear')
    setBestSeller(false)
    setSizes([])
    setImage1(null)
    setImage2(null)
    setImage3(null)
    setImage4(null)
  }

  const onSubmitHandler = async (e) => {
  e.preventDefault()

  try {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("category", category)
    formData.append("subCategory", subcategory)
    formData.append("bestseller", bestseller)
    formData.append("sizes", JSON.stringify(sizes))

    if (image1) formData.append("image1", image1)
    if (image2) formData.append("image2", image2)
    if (image3) formData.append("image3", image3)
    if (image4) formData.append("image4", image4)

    const response = await axios.post(
      backendUrl + "/api/product/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" // important for file uploads
        }
      }
    )

    console.log("ADD PRODUCT RESPONSE:", response.data) // ✅ show full response

    if (response.data.success) {
      toast.success(response.data.message)
      resetForm()
    } else {
      toast.error(response.data.message)
    }

  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error.response?.data || error.message)
    toast.error(error.response?.data?.message || "Server error")
  }
}


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      {/* Image Upload */}
      <div>
        <p className='mb-2'>Upload Images</p>
        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((img, idx) => (
            <label key={idx} htmlFor={`image${idx + 1}`}>
              <img
                className='w-20'
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                alt={`Upload ${idx + 1}`}
              />
              <input
                type="file"
                id={`image${idx + 1}`}
                hidden
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    if (idx === 0) setImage1(file)
                    if (idx === 1) setImage2(file)
                    if (idx === 2) setImage3(file)
                    if (idx === 3) setImage4(file)
                  }
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder='Type here'
          required
          className='w-full max-w-[500px] px-3 py-2'
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Write content here'
          required
          className='w-full max-w-[500px] px-3 py-2'
        />
      </div>

      {/* Category / Subcategory / Price */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select value={subcategory} onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='25'
            className='w-full px-3 py-2 sm:w-[120px]'
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {["S", "M", "L", "XL", "XXL"].map(size => (
            <div key={size} onClick={() =>
              setSizes(prev =>
                prev.includes(size)
                  ? prev.filter(item => item !== size)
                  : [...prev, size]
              )
            }>
              <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className='flex gap-2 mt-2'>
        <input
          type="checkbox"
          id='bestseller'
          checked={bestseller}
          onChange={() => setBestSeller(prev => !prev)}
        />
        <label htmlFor="bestseller" className='cursor-pointer'>Add to Bestseller</label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add
