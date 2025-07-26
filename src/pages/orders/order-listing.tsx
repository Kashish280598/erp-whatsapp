import { OrdersListingContainer } from "@/components/orders";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const OrderListing = () => {
    const navigate = useNavigate()


    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold text-neutral-800 dark:text-primary-400'>Orders</h1>
                    <p className='text-sm text-gray-500'>Here are the list of orders in the system.</p>
                </div>
                <Button onClick={() => navigate('/orders/create')}>
                    <IconPlus />
                    Add Order
                </Button>
            </div>
            <OrdersListingContainer />
        </div>
    )
}

export default OrderListing