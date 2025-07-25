import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLazyGetProductsQuery } from "@/lib/api/orders-api";
import { useEffect, useMemo } from "react";

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

    useEffect(() => {
        const params = { page: 1, limit: 20 }
        trigger(params);
    }, [trigger]);

    const products = useMemo(() => Array.isArray(data?.data?.products) ? data.data.products : [], [data?.data?.products])
    const loading = isFetching || isLoading;

    useEffect(() => {
        if (onProductsLoaded) {
            onProductsLoaded(products);
        }
    }, [products, onProductsLoaded]);

    return (
        <Select
            value={value}
            onValueChange={onChange}
            disabled={loading}
        >
            <SelectTrigger aria-label="Product" className="w-full text-left">
                {(() => {
                    if (!value) {
                        return <SelectValue placeholder={loading ? "Loading..." : "Select product"} />;
                    }
                    const selected = products.find((p: any) => p.id === value);
                    return <span>{selected?.name || "No Name"}</span>;
                })()}
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
                                    <span className="text-xs text-gray-500">{product?.unitPrice}</span>
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