import { motion } from "framer-motion";
import { Trash, Star, Edit, X, Upload, Loader2 } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";

const categories = ["burgers", "desserts", "drinks", "pastas", "pizzas", "healthy", "soups"];

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, updateProduct, products } = useProductStore();
	const [editingProduct, setEditingProduct] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleEditClick = (product) => {
		setEditingProduct({
			...product,
			price: product.price.toString(),
		});
	};

	const handleUpdateSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await updateProduct(editingProduct._id, editingProduct);
			setEditingProduct(null);
		} catch (error) {
			console.error("Error updating product:", error);
		}
		setLoading(false);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditingProduct({ ...editingProduct, image: reader.result });
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Product
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Price
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Category
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Featured
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{products?.map((product) => (
							<tr key={product._id} className='hover:bg-gray-700'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<img
												className='h-10 w-10 rounded-full object-cover'
												src={product.image}
												alt={product.name}
											/>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-white'>{product.name}</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{product.category}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<button
										onClick={() => toggleFeaturedProduct(product._id)}
										className={`p-1 rounded-full ${
											product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
										} hover:bg-yellow-500 transition-colors duration-200`}
									>
										<Star className='h-5 w-5' />
									</button>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
									<button
										onClick={() => handleEditClick(product)}
										className='text-blue-400 hover:text-blue-300 inline-block'
									>
										<Edit className='h-5 w-5' />
									</button>
									<button
										onClick={() => deleteProduct(product._id)}
										className='text-red-400 hover:text-red-300 inline-block'
									>
										<Trash className='h-5 w-5' />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</motion.div>

			{/* Edit Product Modal */}
			{editingProduct && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='bg-gray-800 rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto'
					>
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-2xl font-semibold text-emerald-300'>Edit Product</h2>
							<button
								onClick={() => setEditingProduct(null)}
								className='text-gray-400 hover:text-gray-300'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<form onSubmit={handleUpdateSubmit} className='space-y-4'>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
									Product Name
								</label>
								<input
									type='text'
									id='name'
									value={editingProduct.name}
									onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>

							<div>
								<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
									Description
								</label>
								<textarea
									id='description'
									value={editingProduct.description}
									onChange={(e) =>
										setEditingProduct({ ...editingProduct, description: e.target.value })
									}
									rows='3'
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>

							<div>
								<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
									Price
								</label>
								<input
									type='number'
									id='price'
									value={editingProduct.price}
									onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
									step='0.01'
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>

							<div>
								<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
									Category
								</label>
								<select
									id='category'
									value={editingProduct.category}
									onChange={(e) =>
										setEditingProduct({ ...editingProduct, category: e.target.value })
									}
									className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								>
									<option value=''>Select a category</option>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							<div className='mt-1 flex items-center'>
								<input
									type='file'
									id='image'
									className='sr-only'
									accept='image/*'
									onChange={handleImageChange}
								/>
								<label
									htmlFor='image'
									className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
								>
									<Upload className='h-5 w-5 inline-block mr-2' />
									Change Image
								</label>
								{editingProduct.image && (
									<span className='ml-3 text-sm text-gray-400'>Image uploaded</span>
								)}
							</div>

							<div className='flex justify-end space-x-3 mt-6'>
								<button
									type='button'
									onClick={() => setEditingProduct(null)}
									className='px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700'
								>
									Cancel
								</button>
								<button
									type='submit'
									className='px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center disabled:opacity-50'
									disabled={loading}
								>
									{loading ? (
										<>
											<Loader2 className='animate-spin h-5 w-5 mr-2' />
											Updating...
										</>
									) : (
										'Update Product'
									)}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</>
	);
};

export default ProductsList;