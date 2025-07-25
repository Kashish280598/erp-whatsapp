import Loader from "@/components/Loader";
import { OrderForm } from "@/components/orders";
import { useLazyGetOrderQuery } from "@/lib/api/orders-api";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import NotFoundError from "../errors/not-found-error";

const OrderEdit = () => {
    const { id } = useParams()
    const [getOrder, { data, isUninitialized, isFetching }] = useLazyGetOrderQuery()

    useEffect(() => {
        if (id) {
            getOrder(id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const order = useMemo(() => data?.data?.order, [data])

    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Edit Order #{id}</h1>
                    <p className='text-sm text-gray-500'>Edit the order details and status.</p>
                </div>
            </div>

            {isUninitialized || isFetching ? (
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            ) : order ? (
                <OrderForm order={order} />
            ) : (
                <NotFoundError />
            )}
        </div>
    )
}

export default OrderEdit