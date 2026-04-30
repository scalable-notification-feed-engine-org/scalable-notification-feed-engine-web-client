import axios from "axios";
import Cookies from "js-cookie";
import {useTenantStore} from "@/store/useTenantStore";

const apiClient = axios.create({
    baseURL: "http://localhost:9090/api/v1",
    headers: {
        "Content-Type": "application/json",
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth_token');
        const status = useTenantStore.getState();
        const tenantId = status.activeTenant?.id;

        if(token){
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (tenantId) {
            config.headers['X-Tenant-ID'] = tenantId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
        (error) => {
            if(error.response?.status === 401){
                Cookies.remove('auth_token');
                window.location.href='/login'
            }
            return Promise.reject(error)
    }
);


export default apiClient;