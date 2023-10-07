import { ReactNode, createContext, useEffect, useState } from "react";
import userInfo from "./UserInfo";
import webSocket from "../../components/socketManager";

export const backendUrl = import.meta.env['VITE_APP_API_URL'];
type SignOut = () => Promise<{} | void | null>;
type FetchData = (url: string, header?: any) => Promise<any>;
export type currentUserType = {
    currentUser: any;
    signOut: SignOut
    fetchData: FetchData
}
export const UserContext = createContext<currentUserType | null>(null);

export function UserContextProvider(props: { children: ReactNode }) {

    const [currentUser, setCurrentUser] = useState<any>(null);

    // ---------------- fetch data ----------------- //
    const fetchData = async (endPoint: string, header?: any) => {
        return await fetch(`http://${backendUrl}${endPoint}`,
            header ? header :
                {
                    credentials: 'include'
                })
            .then(ress => {
                return ress.json();
            }).then(ress => {
                //   console.log(ress);
                if (ress.message === "Unauthorized") {
                    setCurrentUser({ message: 'Unauthorized', statusCode: 401 });
                    // console.log('log-Out');
                    userInfo.disconnect();  
                    window.location.href = '/login';
                    return null;
                }
                return ress
            }).catch(err => {
                console.log("blcok error = ", err);
            })
    }
    // ---------------- sign Out ----------------- //

    const signOut: SignOut = async () => {
        userInfo.disconnect();
        webSocket.disconnect();
        await fetchData('/auth-user/signout/');
        setCurrentUser({ message: 'Unauthorized', statusCode: 401 });
        return null;
    }

    useEffect(() => {
        // console.log('auth use context');
        async function CheckUserIsLogin() {
            userInfo.connect();
            await fetch(`http://${backendUrl}/auth-user/user`,
                {
                    credentials: 'include'
                }
            )
                .then(ress => {
                    return ress.json();
                }).then(ress => {
                    // console.log("user auth", ress);
                    if (ress === false)
                        setCurrentUser({ message: 'twoFactor' });
                    else if (ress.statusCode === 401) {
                        setCurrentUser({ message: 'Unauthorized', statusCode: 401 });
                    }
                    else if (ress.id !== undefined) {
                        setCurrentUser(ress);
                    }
                    else
                        setCurrentUser(null);
                })
                .catch(err => {
                    setCurrentUser(null);
                    console.log("Error", err);
                });
        }
        CheckUserIsLogin();
        return () => { };
    }, []);
    return (
        <UserContext.Provider value={{ currentUser, signOut, fetchData }} >
            {props.children}
        </UserContext.Provider>
    );
}