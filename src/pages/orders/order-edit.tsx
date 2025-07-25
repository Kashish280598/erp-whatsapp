import { OrderForm } from "@/components/orders";
import { useLazyGetOrderQuery } from "@/lib/api/orders-api";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import NotFoundError from "../errors/not-found-error";

const OrderEdit = () => {
    const { id } = useParams()
    const [getOrder, { data, isUninitialized, isFetching }] = useLazyGetOrderQuery()

    useEffect(() => {
        getOrder(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const order = useMemo(() => data?.data, [data])

    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Edit Order</h1>
                    <p className='text-sm text-gray-500'>Edit the order in the system.</p>
                </div>
            </div>

            {isUninitialized || isFetching ? <div className="flex justify-center items-center h-full">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div> : order ? <OrderForm order={order} /> : <NotFoundError />}
        </div>
    )
}

export default OrderEdit