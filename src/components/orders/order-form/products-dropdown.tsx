import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLazyGetProductsQuery } from "@/lib/api/orders-api";
import { useEffect, useMemo, useRef } from "react";

interface ProductsDropdownProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    touched?: boolean;
    selectedProductIds?: string[];
    onProductsLoaded?: (products: any[]) => void;
}

const ProductsDropdown = ({ value, onChange, error, touched, selectedProductIds = [], onProductsLoaded }: ProductsDropdownProps) => {
    const [trigger, { data, isFetching, isLoading }] = useLazyGetProductsQuery();
    const onProductsLoadedRef = useRef(onProductsLoaded);

    useEffect(() => {
        onProductsLoadedRef.current = onProductsLoaded;
    }, [onProductsLoaded]);

    useEffect(() => {
        const params = { page: 1, limit: 20 }
        trigger(params);
    }, [trigger]);

    const products = useMemo(() => Array.isArray(data?.data?.products) ? data.data.products : [], [data?.data?.products])
    const loading = isFetching || isLoading;

    useEffect(() => {
        if (onProductsLoadedRef.current && products.length > 0) {
            onProductsLoadedRef.current(products);
        }
    }, [products]);

    return (
        <Select
            value={value}
            onValueChange={onChange}
            disabled={loading}
        >
            <SelectTrigger aria-label="Product" className="w-full text-left">
                <SelectValue placeholder={loading ? "Loading..." : "Select product"}>
                    {value && (() => {
                        const selected = products.find((p: any) => p.id.toString() === value.toString());
                        return selected?.name || "Unknown Product";
                    })()}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {loading ? (
                    // @ts-ignore
                    <SelectItem value={null} disabled>
                        <div className="flex items-center justify-center">Loading...</div>
                    </SelectItem>
                ) : (
                    products.map((product: any) => {
                        const isSelectedElsewhere = selectedProductIds.includes(product?.id) && product?.id !== value;
                        return (
                            <SelectItem key={product?.id} value={product?.id} disabled={isSelectedElsewhere}>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{product?.name}</span>
                                    <span className="text-xs text-gray-500">₹{Number(product?.unitPrice || 0).toFixed(2)}</span>
                                    {isSelectedElsewhere && <span className="text-xs text-red-500">Already selected</span>}
                                </div>
                            </SelectItem>
                        );
                    })
                )}
            </SelectContent>
            {touched && error && (
                <div className="text-red-500 text-xs mt-1">{error}</div>
            )}
        </Select>
    );
};

export default ProductsDropdown; 