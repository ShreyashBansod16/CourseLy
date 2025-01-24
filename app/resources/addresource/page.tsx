import React from 'react'

export default function page() {
  return (
    <div>
        <h1>Add Resource</h1>
        <form className='flex flex-col gap-4 w-1/2 mx-auto m-8 p-4 border border-gray-300 rounded-lg'>
            <label className='flex flex-col'>
            <span>Resource Name:</span>
            <input type="text" name="name" className='' />
            </label>
            <label>
            Resource Description:
            <input type="text" name="description" />
            </label>
            <label>
            Resource URL:
            <input type="text" name="url" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    </div>
  )
}