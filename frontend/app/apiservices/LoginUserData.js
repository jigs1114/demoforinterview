'use client'
import { apiCall } from "./ApiServices";
export async function LoginUserData() {
    try {
        let token = localStorage.getItem('userToken');
        const res = await apiCall('/loginuserdatabytoken', token);
        if (res.data) {
            return res.data;
        } else {
            return res.error;
        }
    } catch (error) {
        console.log(error);
    }
}