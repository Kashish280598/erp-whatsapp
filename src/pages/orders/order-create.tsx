import { OrderForm } from "@/components/orders"

const OrderCreate = () => {

    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Create Order</h1>
                    <p className='text-sm text-gray-500'>Create a new order in the system.</p>
                </div>
            </div>
            <OrderForm />
        </div>
    )
}

export default OrderCreate