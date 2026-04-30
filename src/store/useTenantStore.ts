import {create} from "zustand";
import {persist} from "zustand/middleware";

interface Tenant{
    id: string;
    name: string;
    slug:string;
}
interface TenantState {
    activeTenant: Tenant | null;
    setActiveTenant: (tenant: Tenant) => void;
}
export const useTenantStore = create<TenantState>()(
    persist(
        (set) => ({
            activeTenant: null,
            setActiveTenant: (tenant) => set({activeTenant: tenant}),
        }),
        {name: "active-tenant-storage"},
    )
);

